import fs from 'node:fs';
import path from 'node:path';
import { CONTENT_PLAN, PLAN_LOCALES } from './lib/content-plan.mjs';

const root = process.cwd();

function contentFileExists(type, locale, slug) {
  const filePath = path.join(root, 'content', type, locale, `${slug}.mdx`);
  return fs.existsSync(filePath);
}

function buildStatusRow(item) {
  const localeStatus = Object.fromEntries(
    PLAN_LOCALES.map((locale) => [locale, contentFileExists(item.type, locale, item.slug)])
  );

  return {
    ...item,
    localeStatus,
    completed: PLAN_LOCALES.every((locale) => localeStatus[locale]),
  };
}

function printBatchReport(batchNumber, rows) {
  const completed = rows.filter((row) => row.completed).length;
  console.log(`\nBatch ${batchNumber}: ${completed}/${rows.length} complete`);

  for (const row of rows) {
    const checkbox = row.completed ? '[x]' : '[ ]';
    const locales = PLAN_LOCALES.map((locale) => `${locale}:${row.localeStatus[locale] ? 'ok' : 'missing'}`).join(', ');
    console.log(`${checkbox} #${row.id} ${row.type}/${row.slug} (${locales})`);
  }
}

const rows = CONTENT_PLAN.map(buildStatusRow);
const totalComplete = rows.filter((row) => row.completed).length;
const localizedComplete = rows.reduce(
  (count, row) => count + PLAN_LOCALES.filter((locale) => row.localeStatus[locale]).length,
  0
);

console.log(`Content plan completion: ${totalComplete}/${rows.length} topics`);
console.log(`Localized files present: ${localizedComplete}/${rows.length * PLAN_LOCALES.length}`);

for (let batch = 1; batch <= 7; batch += 1) {
  printBatchReport(batch, rows.filter((row) => row.batch === batch));
}

const missing = rows.filter((row) => !row.completed);
if (missing.length > 0) {
  console.log('\nMissing topics');
  for (const row of missing) {
    console.log(`- #${row.id} ${row.titleZh} / ${row.titleEn}`);
  }
  process.exitCode = 1;
}
