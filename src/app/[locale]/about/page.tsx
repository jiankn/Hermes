import styles from '../static.module.css';

type Props = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{isZh ? '关于我们' : 'About'}</h1>
      <div className={styles.content}>
        <p>
          {isZh
            ? 'Hermes Agent Community 是一个独立的学习社区，致力于为 Hermes Agent 用户提供高质量的中英文教程、指南和最佳实践。'
            : 'Hermes Agent Community is an independent learning hub dedicated to providing high-quality bilingual tutorials, guides, and best practices for Hermes Agent users.'}
        </p>

        <h2>{isZh ? '我们的使命' : 'Our Mission'}</h2>
        <p>
          {isZh
            ? '降低 AI Agent 的使用门槛，让每个人都能利用 Hermes Agent 提升工作效率和自动化水平。'
            : 'Lower the barrier to AI Agent adoption, enabling everyone to leverage Hermes Agent for improved productivity and automation.'}
        </p>

        <h2>{isZh ? '内容原则' : 'Content Principles'}</h2>
        <ul>
          <li>{isZh ? '用户视角：从实际使用场景出发，而非功能列表' : 'User-centric: Start from real use cases, not feature lists'}</li>
          <li>{isZh ? '可复现：所有命令和代码可直接执行' : 'Reproducible: All commands and code are copy-paste ready'}</li>
          <li>{isZh ? '时效性：标注适用版本，过时内容及时更新' : 'Up-to-date: Version-tagged, stale content updated promptly'}</li>
          <li>{isZh ? '双语质量：不是机翻，而是本地化的技术写作' : 'Bilingual quality: Not machine translated, but localized tech writing'}</li>
        </ul>

        <h2>{isZh ? '联系方式' : 'Contact'}</h2>
        <p>
          {isZh ? '有任何建议或合作意向？请通过 ' : 'Have suggestions or partnership ideas? Reach us via '}
          <a href="mailto:hello@hermesagent.sbs">hello@hermesagent.sbs</a>
        </p>
      </div>
    </div>
  );
}
