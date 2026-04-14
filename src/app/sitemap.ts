import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://hermesagent.sbs';
  const locales = ['en', 'zh'];
  const now = new Date();

  const staticPages = ['', '/tutorials', '/guides', '/blog', '/learning-path', '/faq', '/about'];

  const tutorialSlugs = [
    'getting-started/installation',
    'getting-started/first-conversation',
    'getting-started/choosing-a-model',
    'getting-started/cli-essentials',
    'messaging/telegram-bot-setup',
    'messaging/discord-integration',
    'skills/install-community-skills',
    'skills/create-custom-skills',
    'automation/cron-scheduling',
    'advanced/multi-agent-orchestration',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${page}`,
            zh: `${baseUrl}/zh${page}`,
          },
        },
      });
    }
  }

  // Tutorial pages
  for (const locale of locales) {
    for (const slug of tutorialSlugs) {
      entries.push({
        url: `${baseUrl}/${locale}/tutorials/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            en: `${baseUrl}/en/tutorials/${slug}`,
            zh: `${baseUrl}/zh/tutorials/${slug}`,
          },
        },
      });
    }
  }

  return entries;
}
