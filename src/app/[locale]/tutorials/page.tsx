import { getTranslations } from 'next-intl/server';
import TutorialCard from '@/components/cards/TutorialCard/TutorialCard';
import styles from './page.module.css';

type Props = { params: Promise<{ locale: string }> };

const tutorials = [
  // 🟢 Getting Started Series
  { slug: 'getting-started/installation', icon: '🚀', titleEn: 'How to Install Hermes Agent', titleZh: 'Hermes Agent 完整安装指南', descEn: 'Step-by-step installation guide for all platforms.', descZh: '全平台安装教程。', difficulty: 'beginner' as const, readingTime: 8, tags: ['installation', 'setup'] },
  { slug: 'getting-started/first-conversation', icon: '💬', titleEn: 'Your First Conversation', titleZh: '与 Hermes 的第一次对话', descEn: 'Learn to chat effectively with your AI Agent.', descZh: '学会和 AI Agent 有效对话。', difficulty: 'beginner' as const, readingTime: 6, tags: ['beginner', 'chat'] },
  { slug: 'getting-started/choosing-a-model', icon: '🤖', titleEn: 'How to Choose the Right AI Model', titleZh: '如何选择合适的 AI 模型', descEn: 'Compare models and pick the best one for your needs.', descZh: '对比模型并选择最适合你的。', difficulty: 'beginner' as const, readingTime: 10, tags: ['models', 'openrouter'] },
  { slug: 'getting-started/cli-essentials', icon: '⌨️', titleEn: 'CLI Essential Commands', titleZh: 'CLI 必知命令', descEn: 'Master the essential CLI commands every user should know.', descZh: '掌握每个用户必须知道的基础命令。', difficulty: 'beginner' as const, readingTime: 9, tags: ['cli', 'commands'] },
  { slug: 'getting-started/configuration-guide', icon: '⚙️', titleEn: 'Configuration: A Beginner\'s Guide', titleZh: '配置完全指南', descEn: 'Master config files, environment variables, and security best practices.', descZh: '配置文件、环境变量、安全最佳实践。', difficulty: 'beginner' as const, readingTime: 11, tags: ['configuration', 'setup'] },
  { slug: 'getting-started/openclaw-migration', icon: '🔄', titleEn: 'Migrate from OpenClaw', titleZh: '从 OpenClaw 迁移', descEn: 'Zero-downtime migration guide from OpenClaw to Hermes Agent.', descZh: '从 OpenClaw 零停机迁移到 Hermes Agent。', difficulty: 'beginner' as const, readingTime: 7, tags: ['migration', 'openclaw'] },
  // 🔵 Messaging Series
  { slug: 'messaging/telegram-bot-setup', icon: '📱', titleEn: 'Set Up Hermes on Telegram', titleZh: '在 Telegram 上配置 Hermes', descEn: 'Deploy your AI Agent to Telegram for 24/7 access.', descZh: '把 AI Agent 部署到 Telegram。', difficulty: 'intermediate' as const, readingTime: 12, tags: ['telegram', 'messaging'] },
  { slug: 'messaging/discord-integration', icon: '🎮', titleEn: 'Hermes + Discord Bot', titleZh: 'Hermes + Discord 机器人', descEn: 'Build a community AI bot for your Discord server.', descZh: '为 Discord 服务器搭建 AI 机器人。', difficulty: 'intermediate' as const, readingTime: 11, tags: ['discord', 'bot'] },
  { slug: 'messaging/multi-platform-connect', icon: '🔌', titleEn: 'Connect to Slack, WhatsApp & Signal', titleZh: '连接 Slack、WhatsApp 和 Signal', descEn: 'Connect Hermes to Slack, WhatsApp, Signal and more.', descZh: '将 Hermes 接入 Slack、WhatsApp、Signal 等平台。', difficulty: 'intermediate' as const, readingTime: 10, tags: ['slack', 'whatsapp'] },
  { slug: 'messaging/multi-platform-gateway', icon: '🌐', titleEn: 'Multi-Platform Gateway Architecture', titleZh: '多平台网关架构详解', descEn: 'Design a unified gateway routing all platforms through one Hermes instance.', descZh: '统一消息网关——多平台通过单一实例路由。', difficulty: 'advanced' as const, readingTime: 14, tags: ['architecture', 'gateway'] },
  // 🟣 Skills Series (coming soon - content files not yet created)
  { slug: 'skills/install-community-skills', icon: '🧩', titleEn: 'Browse & Install Community Skills', titleZh: '浏览并安装社区技能', descEn: 'Extend Hermes with community-built skills.', descZh: '用社区技能扩展 Hermes 能力。', difficulty: 'beginner' as const, readingTime: 5, tags: ['skills', 'community'] },
  { slug: 'skills/create-custom-skills', icon: '🛠️', titleEn: 'Create Your First Custom Skill', titleZh: '创建你的第一个自定义技能', descEn: 'Build a custom skill from scratch.', descZh: '从零构建一个自定义技能。', difficulty: 'intermediate' as const, readingTime: 15, tags: ['skills', 'custom'] },
  // 🟠 Automation Series (coming soon)
  { slug: 'automation/cron-scheduling', icon: '⏰', titleEn: 'Automate with Cron Scheduling', titleZh: '用 Cron 自动化一切', descEn: 'Set up automated tasks with Hermes cron system.', descZh: '用 Hermes cron 系统设置自动化任务。', difficulty: 'intermediate' as const, readingTime: 10, tags: ['cron', 'automation'] },
  // 🔴 Advanced Series (coming soon)
  { slug: 'advanced/multi-agent-orchestration', icon: '🔗', titleEn: 'Multi-Agent Orchestration', titleZh: '多 Agent 编排', descEn: 'Design patterns for multi-agent workflows.', descZh: '多 Agent 工作流设计模式。', difficulty: 'advanced' as const, readingTime: 20, tags: ['multi-agent', 'advanced'] },
];

export default async function TutorialsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isZh = locale === 'zh';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{t('nav.tutorials')}</h1>
      <p className={styles.pageDesc}>
        {isZh
          ? '从入门到进阶，系统化学习 Hermes Agent 的每一个功能。'
          : 'From beginner to advanced, systematically learn every feature of Hermes Agent.'}
      </p>

      <div className={styles.grid}>
        {tutorials.map((tut) => (
          <TutorialCard
            key={tut.slug}
            href={`/${locale}/tutorials/${tut.slug}`}
            icon={tut.icon}
            title={isZh ? tut.titleZh : tut.titleEn}
            description={isZh ? tut.descZh : tut.descEn}
            difficulty={tut.difficulty}
            difficultyLabel={t(`common.${tut.difficulty}`)}
            readingTime={tut.readingTime}
            readingTimeUnit={t('common.minutes')}
            tags={tut.tags}
          />
        ))}
      </div>
    </div>
  );
}
