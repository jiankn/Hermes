import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import crypto from 'node:crypto';

const siteUrl = new URL(process.env.SITE_URL ?? 'https://hermesagent.sbs');
const searchConsoleProperty = process.env.GSC_SITE_URL ?? `${siteUrl.origin}/`;
const timeoutMs = Number(process.env.INDEX_CHECK_TIMEOUT_MS ?? 10000);
const maxInspectionUrls = Number(process.env.GSC_MAX_URLS ?? 5);

function logSection(title) {
  console.log(`\n== ${title} ==`);
}

function ok(message) {
  console.log(`OK   ${message}`);
}

function warn(message) {
  console.log(`WARN ${message}`);
}

function fail(message) {
  console.log(`FAIL ${message}`);
}

function walk(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getExpectedUrls() {
  const baseUrl = siteUrl.origin;
  const locales = ['en', 'zh'];
  const staticPages = ['', '/tutorials', '/guides', '/blog', '/learning-path', '/faq', '/about', '/contact', '/privacy', '/terms'];
  const urls = new Set();

  for (const locale of locales) {
    for (const page of staticPages) {
      urls.add(`${baseUrl}/${locale}${page}`);
    }

    for (const type of ['tutorials', 'guides', 'blog']) {
      const dir = path.join(process.cwd(), 'content', type, locale);
      for (const filePath of walk(dir)) {
        const relative = path.relative(dir, filePath).replace(/\.mdx$/, '').split(path.sep).join('/');
        urls.add(`${baseUrl}/${locale}/${type}/${relative}`);
      }
    }
  }

  return [...urls].sort();
}

async function resolveDns(hostname) {
  const result = { a: [], aaaa: [], cname: [] };

  try {
    result.a = await dns.resolve4(hostname);
  } catch {}

  try {
    result.aaaa = await dns.resolve6(hostname);
  } catch {}

  try {
    result.cname = await dns.resolveCname(hostname);
  } catch {}

  return result;
}

async function fetchUrl(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'HermesAgentIndexAudit/1.0' },
      signal: controller.signal,
      ...options,
    });

    const text = options.method === 'HEAD' ? '' : await response.text();
    return {
      ok: response.ok,
      status: response.status,
      text,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

function parseSitemapUrls(xml) {
  const urls = [];
  const pattern = /<loc>(.*?)<\/loc>/g;
  let match = pattern.exec(xml);

  while (match !== null) {
    urls.push(match[1].trim());
    match = pattern.exec(xml);
  }

  return urls;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function loadServiceAccount() {
  const rawJson = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (rawJson) {
    if (rawJson.trim().startsWith('{')) {
      return JSON.parse(rawJson);
    }

    const jsonPath = path.resolve(process.cwd(), rawJson);
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  }

  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath) {
    const jsonPath = path.resolve(process.cwd(), credentialsPath);
    if (fs.existsSync(jsonPath)) {
      return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    }
  }

  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
      private_key_id: process.env.GSC_PRIVATE_KEY_ID,
    };
  }

  return null;
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  if (serviceAccount.private_key_id) {
    header.kid = serviceAccount.private_key_id;
  }

  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedJwt = `${encodedHeader}.${encodedPayload}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedJwt);
  signer.end();

  const signature = signer.sign(serviceAccount.private_key);
  const assertion = `${unsignedJwt}.${base64UrlEncode(signature)}`;

  const response = await fetchUrl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    throw new Error(response.error ?? `token request failed with status ${response.status}`);
  }

  const payloadJson = JSON.parse(response.text);
  if (!payloadJson.access_token) {
    throw new Error('token response did not include access_token');
  }

  return payloadJson.access_token;
}

async function inspectUrlsWithGsc(urls) {
  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    warn('GSC credentials missing. Set GSC_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS to run URL Inspection API checks.');
    return { skipped: true, results: [] };
  }

  const accessToken = await getAccessToken(serviceAccount);
  const results = [];

  for (const inspectionUrl of urls.slice(0, maxInspectionUrls)) {
    const response = await fetchUrl('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl,
        siteUrl: searchConsoleProperty,
        languageCode: 'zh-CN',
      }),
    });

    if (!response.ok) {
      results.push({
        inspectionUrl,
        error: response.error ?? `inspection failed with status ${response.status}`,
      });
      continue;
    }

    const payload = JSON.parse(response.text);
    const inspection = payload.inspectionResult?.indexStatusResult ?? {};
    results.push({
      inspectionUrl,
      verdict: payload.inspectionResult?.verdict,
      coverageState: inspection.coverageState,
      indexingState: inspection.indexingState,
      pageFetchState: inspection.pageFetchState,
      robotsTxtState: inspection.robotsTxtState,
      googleCanonical: inspection.googleCanonical,
      userCanonical: inspection.userCanonical,
      lastCrawlTime: inspection.lastCrawlTime,
    });
  }

  return { skipped: false, results };
}

async function main() {
  const expectedUrls = getExpectedUrls();
  let hasCriticalFailure = false;

  logSection('DNS');
  const dnsResult = await resolveDns(siteUrl.hostname);
  if (dnsResult.a.length === 0 && dnsResult.aaaa.length === 0 && dnsResult.cname.length === 0) {
    fail(`${siteUrl.hostname} has no public A/AAAA/CNAME records. Search engines cannot crawl a hostname that does not resolve.`);
    hasCriticalFailure = true;
  } else {
    ok(`A=${dnsResult.a.join(', ') || '-'} AAAA=${dnsResult.aaaa.join(', ') || '-'} CNAME=${dnsResult.cname.join(', ') || '-'}`);
  }

  logSection('HTTP Reachability');
  const homepage = await fetchUrl(siteUrl.origin, { method: 'HEAD' });
  if (!homepage.ok) {
    fail(`Homepage request failed: ${homepage.error ?? homepage.status}`);
    hasCriticalFailure = true;
  } else {
    ok(`Homepage responded with ${homepage.status}`);
  }

  const robots = await fetchUrl(`${siteUrl.origin}/robots.txt`);
  if (!robots.ok) {
    fail(`robots.txt request failed: ${robots.error ?? robots.status}`);
    hasCriticalFailure = true;
  } else {
    ok(`robots.txt responded with ${robots.status}`);
    if (!robots.text.includes('Sitemap:')) {
      warn('robots.txt does not advertise a Sitemap URL.');
    }
  }

  const sitemap = await fetchUrl(`${siteUrl.origin}/sitemap.xml`);
  let liveSitemapUrls = [];
  if (!sitemap.ok) {
    fail(`sitemap.xml request failed: ${sitemap.error ?? sitemap.status}`);
    hasCriticalFailure = true;
  } else {
    liveSitemapUrls = parseSitemapUrls(sitemap.text);
    ok(`sitemap.xml responded with ${sitemap.status} and contains ${liveSitemapUrls.length} URLs`);
  }

  logSection('Local vs Live Sitemap');
  console.log(`Expected local URLs: ${expectedUrls.length}`);
  if (liveSitemapUrls.length > 0) {
    const missingLiveUrls = expectedUrls.filter((url) => !liveSitemapUrls.includes(url));
    if (missingLiveUrls.length > 0) {
      fail(`Live sitemap is missing ${missingLiveUrls.length} locally expected URLs.`);
      for (const url of missingLiveUrls.slice(0, 10)) {
        console.log(`  - ${url}`);
      }
    } else {
      ok('Live sitemap covers all locally expected URLs.');
    }
  } else {
    warn('Skipped sitemap coverage comparison because the live sitemap could not be read.');
  }

  logSection('Google Search Console URL Inspection');
  const inspectionTargets = process.env.GSC_URLS
    ? process.env.GSC_URLS.split(',').map((value) => value.trim()).filter(Boolean)
    : [siteUrl.origin, ...expectedUrls.filter((url) => url.includes('/tutorials/')).slice(0, maxInspectionUrls - 1)];

  try {
    const inspection = await inspectUrlsWithGsc(inspectionTargets);
    if (!inspection.skipped) {
      for (const result of inspection.results) {
        if (result.error) {
          fail(`${result.inspectionUrl}: ${result.error}`);
          continue;
        }

        const summary = [
          `verdict=${result.verdict ?? '-'}`,
          `coverage=${result.coverageState ?? '-'}`,
          `indexing=${result.indexingState ?? '-'}`,
          `fetch=${result.pageFetchState ?? '-'}`,
          `robots=${result.robotsTxtState ?? '-'}`,
        ].join(' | ');
        ok(`${result.inspectionUrl}: ${summary}`);
      }
    }
  } catch (error) {
    fail(`GSC inspection failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  logSection('Summary');
  if (hasCriticalFailure) {
    fail('Critical indexing blockers remain. Fix DNS and HTTPS reachability before expecting GSC to index pages.');
    process.exitCode = 1;
    return;
  }

  ok('Site is reachable from this audit context. Continue with GSC property checks and content production.');
}

await main();
