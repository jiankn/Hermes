import Link from 'next/link';
import { getArticles } from '@/lib/content';
import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';
  const posts = getArticles('blog', locale);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '博客' : 'Blog'}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '发布版本解读、架构观察和内容运营复盘。'
          : 'Release notes, architecture observations, and editorial analysis for Hermes Agent.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '760px' }}>
        {posts.map((post) => (
          <article
            key={post.urlPath}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem' }}
          >
            <time style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{post.publishedAt}</time>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.5rem 0' }}>
              <Link href={`/${locale}/blog/${post.urlPath}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {isZh ? post.titleZh : post.title}
              </Link>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 0 }}>
              {isZh ? post.descriptionZh : post.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
