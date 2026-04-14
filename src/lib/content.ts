import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
export type ContentType = 'tutorials' | 'guides' | 'blog';

export interface ArticleMeta {
  title: string;
  titleZh: string;
  slug: string;
  description: string;
  descriptionZh: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: number;
  series?: string;
  seriesOrder?: number;
  featured?: boolean;
  urlPath?: string;
  slugSegments?: string[];
  locale?: string;
  type?: ContentType;
}

export interface Article {
  meta: ArticleMeta;
  content: string;
}

function getAllMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getArticles(
  type: ContentType,
  locale: string
): ArticleMeta[] {
  const dir = path.join(CONTENT_DIR, type, locale);
  const files = getAllMdxFiles(dir);

  return files
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      const urlPath = path.relative(dir, filePath).replace(/\.mdx$/, '').split(path.sep).join('/');
      return {
        ...(data as ArticleMeta),
        urlPath,
        slugSegments: urlPath.split('/'),
        locale,
        type,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(
  type: string,
  slugParts: string[],
  locale: string
): Article | null {
  const slugPath = slugParts.join('/');
  const filePath = path.join(CONTENT_DIR, type, locale, `${slugPath}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    meta: data as ArticleMeta,
    content,
  };
}

export function getAllSlugs(
  type: ContentType,
  locale: string
): string[][] {
  const dir = path.join(CONTENT_DIR, type, locale);
  const files = getAllMdxFiles(dir);

  return files.map((filePath) => {
    const relative = path.relative(dir, filePath).replace(/\.mdx$/, '');
    return relative.split(path.sep);
  });
}
