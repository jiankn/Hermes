import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllSlugs } from '@/lib/content';
import { routing } from '@/i18n/routing';
import DifficultyBadge from '@/components/ui/DifficultyBadge/DifficultyBadge';
import styles from './page.module.css';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

export function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of routing.locales) {
    const slugs = getAllSlugs('tutorials', locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticleBySlug('tutorials', slug, locale);
  if (!article) return {};

  const isZh = locale === 'zh';
  const title = isZh ? article.meta.titleZh : article.meta.title;
  const description = isZh ? article.meta.descriptionZh : article.meta.description;
  const canonicalUrl = `https://hermesagent.sbs/${locale}/tutorials/${slug.join('/')}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://hermesagent.sbs/en/tutorials/${slug.join('/')}`,
        zh: `https://hermesagent.sbs/zh/tutorials/${slug.join('/')}`,
        'x-default': `https://hermesagent.sbs/en/tutorials/${slug.join('/')}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.meta.publishedAt,
      modifiedTime: article.meta.updatedAt,
      locale: isZh ? 'zh_CN' : 'en_US',
    },
  };
}

// Simple MDX-to-HTML renderer for headings extraction
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}

// Simple markdown to HTML (basic)
function renderMarkdown(content: string): string {
  let html = content;

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

  // Blockquotes
  html = html.replace(/^>\s?\*\*(.+?)\*\*:\s*(.+)$/gm, '<blockquote><p><strong>$1:</strong> $2</p></blockquote>');
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote><p>$1</p></blockquote>');

  // Headings with IDs
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h2 id="${id}">${text}</h2>`;
  });

  // Bold / Italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Paragraphs
  html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>');

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');

  return html;
}

export default async function TutorialArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticleBySlug('tutorials', slug, locale);

  if (!article) notFound();

  const isZh = locale === 'zh';
  const title = isZh ? article.meta.titleZh : article.meta.title;
  const headings = extractHeadings(article.content);
  const htmlContent = renderMarkdown(article.content);

  const difficultyLabels = { beginner: isZh ? '入门' : 'Beginner', intermediate: isZh ? '中级' : 'Intermediate', advanced: isZh ? '高级' : 'Advanced' };

  return (
    <div className={styles.articlePage}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href={`/${locale}`}>{isZh ? '首页' : 'Home'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href={`/${locale}/tutorials`}>{isZh ? '教程' : 'Tutorials'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{title}</span>
      </nav>

      <div className={styles.layout}>
        {/* Article */}
        <article className={styles.article}>
          <header className={styles.articleHeader}>
            <h1 className={styles.articleTitle}>{title}</h1>
            <div className={styles.articleMeta}>
              <DifficultyBadge level={article.meta.difficulty} label={difficultyLabels[article.meta.difficulty]} />
              <span>⏱ {article.meta.readingTime} {isZh ? '分钟阅读' : 'min read'}</span>
              <span>📅 {article.meta.publishedAt}</span>
              <span>👤 {article.meta.author}</span>
            </div>
          </header>

          <div
            className={styles.articleContent}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Series Navigation */}
          <div className={styles.seriesNav}>
            <Link href={`/${locale}/tutorials`} className={styles.seriesLink}>
              <span className={styles.seriesLinkLabel}>← {isZh ? '返回教程' : 'Back to Tutorials'}</span>
              {isZh ? '教程列表' : 'Tutorial Index'}
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h4 className={styles.tocTitle}>{isZh ? '页面目录' : 'On this page'}</h4>
          <ul className={styles.tocList}>
            {headings.filter(h => h.level === 2).map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className={styles.tocItem}>{h.text}</a>
              </li>
            ))}
          </ul>

          <div className={styles.sidebarSection}>
            <h4 className={styles.tocTitle}>{isZh ? '相关推荐' : 'Related'}</h4>
            <ul className={styles.relatedList}>
              <li><Link href={`/${locale}/tutorials/getting-started/first-conversation`} className={styles.relatedLink}>{isZh ? '第一次对话' : 'First Conversation'}</Link></li>
              <li><Link href={`/${locale}/tutorials/getting-started/choosing-a-model`} className={styles.relatedLink}>{isZh ? '选择模型' : 'Choosing a Model'}</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
