import Link from 'next/link';
import styles from '../tutorials/page.module.css';

type Props = { params: Promise<{ locale: string }> };

const guides = [
  { slug: 'deployment/vps-setup', icon: '🖥️', titleEn: 'Deploy on a $5 VPS', titleZh: '$5 VPS 部署指南', descEn: 'Run Hermes Agent 24/7 on an affordable VPS.', descZh: '在低成本 VPS 上 7×24 运行 Hermes。' },
  { slug: 'deployment/docker-production', icon: '🐳', titleEn: 'Production Docker Deployment', titleZh: '生产环境 Docker 部署', descEn: 'Docker Compose setup for production with monitoring.', descZh: 'Docker Compose 生产部署 + 监控方案。' },
  { slug: 'security/hardening-checklist', icon: '🔒', titleEn: 'Security Hardening Checklist', titleZh: '安全加固清单', descEn: 'Comprehensive security checklist for production deployments.', descZh: '生产部署完整安全清单。' },
  { slug: 'comparisons/hermes-vs-autogpt', icon: '⚖️', titleEn: 'Hermes Agent vs AutoGPT', titleZh: 'Hermes Agent vs AutoGPT 对比', descEn: 'In-depth comparison of two leading AI agent frameworks.', descZh: '两大 AI Agent 框架深度对比。' },
];

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '深度指南' : 'Guides'}</h1>
      <p className={styles.pageDesc}>
        {isZh ? '部署方案、安全加固、对比评测 — 面向生产环境的深度指南。' : 'Deployment, security, comparisons — in-depth guides for production environments.'}
      </p>
      <div className={styles.grid}>
        {guides.map((g) => (
          <Link key={g.slug} href={`/${locale}/guides/${g.slug}`} style={{ textDecoration: 'none', color: 'inherit', background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '2rem', display: 'block', transition: 'all 0.3s ease' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{g.icon}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{isZh ? g.titleZh : g.titleEn}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isZh ? g.descZh : g.descEn}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
