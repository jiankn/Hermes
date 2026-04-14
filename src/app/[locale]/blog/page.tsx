import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

const posts = [
  { slug: '2026/hermes-v08-changelog', titleEn: "What's New in Hermes Agent v0.8", titleZh: 'Hermes Agent v0.8 更新日志', dateEn: 'April 15, 2026', dateZh: '2026 年 4 月 15 日', descEn: 'Complete changelog analysis for the latest Hermes Agent release.', descZh: 'Hermes Agent 最新版本完整更新日志分析。' },
  { slug: '2026/ai-agents-2026', titleEn: 'The State of AI Agents in 2026', titleZh: '2026 年 AI Agent 现状', dateEn: 'April 10, 2026', dateZh: '2026 年 4 月 10 日', descEn: 'An overview of the evolving AI agent landscape and where Hermes fits.', descZh: 'AI Agent 生态概览以及 Hermes 的定位。' },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '博客' : 'Blog'}</h1>
      <p className={styles.pageDesc}>
        {isZh ? '行业洞察、版本更新、社区故事。' : 'Industry insights, release updates, and community stories.'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        {posts.map((post) => (
          <article key={post.slug} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', transition: 'all 0.3s ease' }}>
            <time style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{isZh ? post.dateZh : post.dateEn}</time>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.5rem 0' }}>{isZh ? post.titleZh : post.titleEn}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 0 }}>{isZh ? post.descZh : post.descEn}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
