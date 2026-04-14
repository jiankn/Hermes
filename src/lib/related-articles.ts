import { getArticles, type ArticleMeta, type ContentType } from '@/lib/content';

export function getRelatedArticles(
  type: ContentType,
  locale: string,
  currentUrlPath: string,
  category: string,
  limit = 2
): ArticleMeta[] {
  const all = getArticles(type, locale);
  const sameCategory = all.filter((entry) => entry.urlPath !== currentUrlPath && entry.category === category);
  const fallback = all.filter((entry) => entry.urlPath !== currentUrlPath && entry.category !== category);
  return [...sameCategory, ...fallback].slice(0, limit);
}
