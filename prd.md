# PRD: hermesagent.sbs — Hermes Agent 学习社区

| 字段 | 值 |
|------|-----|
| **产品名称** | Hermes Agent Community |
| **域名** | hermesagent.sbs |
| **版本** | v1.1 |
| **作者** | Antigravity × Product Owner |
| **日期** | 2026-04-13 |
| **状态** | Approved |

---

## 1. 产品愿景

### 1.1 一句话定位

> **"The definitive learning hub for Hermes Agent — from first install to multi-agent orchestration."**
>
> Hermes Agent 一站式学习社区 — 从安装到多 Agent 协作的完整知识库。

### 1.2 为什么做这个产品？

Hermes Agent（NousResearch 出品）是 GitHub 上 74.9k ⭐ 的顶级 AI Agent 项目，但存在知识碎片化问题：

| 现状痛点 | hermesagent.sbs 解决方案 |
|---------|------------------------|
| 官方文档偏 Reference，缺少教学引导 | 提供结构化的入门-进阶学习路径 |
| 中文社区内容近乎空白 | 同步提供中英文高质量教程 |
| 实战案例分散在 Discord/GitHub Issues | 聚合整理为系统化的 Guides |
| 新用户不知道从哪开始 | 7 天学习路径 + 难度标签 |
| 技能生态信息不透明 | Skills 展示 + 使用评价 |

### 1.3 商业模式

```
高质量内容 → SEO 有机流量 → Google AdSense（后续接入）
                           → Newsletter 订阅
                           → 未来付费课程 / 技术咨询
```

**核心变现：Google AdSense 展示广告（后续阶段接入，MVP 不预埋广告位）**
- 门槛：20-30 篇原创高质量文章 + 隐私政策 + 运营 3 个月
- 预期：日均 UV 1000 时月收入 $100-300

---

## 2. 目标用户

### Persona A — "探索者" Alex（AI 初学者）

| 属性 | 详情 |
|------|------|
| 背景 | 计算机专业学生 / 非技术但对 AI 感兴趣 |
| 目标 | 5 分钟装好 Hermes，让 AI 帮我做事 |
| 痛点 | 官方 README 看不懂、命令太多不知道先学哪个 |
| 语言偏好 | 中文优先，英文次之 |

### Persona B — "构建者" Blake（开发者）

| 属性 | 详情 |
|------|------|
| 背景 | 全栈/后端开发者，有 CLI 和 Docker 经验 |
| 目标 | 深度定制：自定义技能、MCP 集成、Telegram Bot |
| 痛点 | 官方文档没有最佳实践，踩坑要看 Issue |
| 语言偏好 | 英文优先 |

### Persona C — "运营者" Casey（DevOps）

| 属性 | 详情 |
|------|------|
| 背景 | 运维工程师或技术经理 |
| 目标 | 多 Agent 编排、Cron 自动化、安全加固 |
| 痛点 | 缺少企业级部署架构方案 |
| 语言偏好 | 英文为主 |

---

## 3. 信息架构

### 3.1 站点地图

```
hermesagent.sbs
├── /[locale]/                          # 首页 Landing
│
├── /[locale]/tutorials/                # 教程中心
│   ├── /getting-started/               # 入门系列 (6篇)
│   │   ├── /installation/
│   │   ├── /first-conversation/
│   │   ├── /choosing-a-model/
│   │   ├── /cli-essentials/
│   │   ├── /configuration-guide/
│   │   └── /openclaw-migration/
│   │
│   ├── /messaging/                     # 消息平台系列 (4篇)
│   │   ├── /telegram-bot-setup/
│   │   ├── /discord-integration/
│   │   ├── /multi-platform-connect/
│   │   └── /multi-platform-gateway/
│   │
│   ├── /skills/                        # 技能系统系列 (4篇)
│   │   ├── /install-community-skills/
│   │   ├── /create-custom-skills/
│   │   ├── /skills-best-practices/
│   │   └── /self-learning-loop/
│   │
│   ├── /automation/                    # 自动化系列 (4篇)
│   │   ├── /cron-scheduling/
│   │   ├── /daily-reports/
│   │   ├── /monitoring-alerts/
│   │   └── /automation-recipes/
│   │
│   └── /advanced/                      # 进阶系列 (5篇)
│       ├── /multi-agent-orchestration/
│       ├── /mcp-integration/
│       ├── /memory-system-deep-dive/
│       ├── /subagent-patterns/
│       └── /architecture-walkthrough/
│
├── /[locale]/guides/                   # 深度指南
│   ├── /deployment/                    # 部署 (3篇)
│   ├── /security/                      # 安全 (2篇)
│   └── /comparisons/                   # 对比 (2篇)
│
├── /[locale]/blog/                     # 博客 (3篇)
├── /[locale]/learning-path/            # 7天学习路径
├── /[locale]/faq/                      # FAQ
├── /[locale]/about/                    # 关于
├── /[locale]/privacy/                  # 隐私政策
├── /[locale]/terms/                    # 使用条款
└── /[locale]/contact/                  # 联系我们
```

### 3.2 URL 与 i18n 路由

- **URL slug 统一使用英文**（SEO 最佳实践）
- 通过 `[locale]` 前缀区分语言：`/en/tutorials/...` / `/zh/tutorials/...`
- `hreflang` 标签互相指向，`x-default` → `en`
- 未来新增语言只需添加 locale 和翻译文件

---

## 4. 页面详细规格

### 4.1 首页 Landing Page

**目标：** 30 秒内让访客明白"这里是什么 + 对我有什么用 + 下一步做什么"

| 顺序 | 模块 | 内容 | 设计要点 |
|:---:|------|------|----------|
| 1 | **Navbar** | Logo · Tutorials · Guides · Blog · Learning Path · 🔍 · 🌐 | 固定顶部，毛玻璃背景 |
| 2 | **Hero** | 大标题 + 副标题 + 2 CTA + 终端动画 | 径向渐变光晕，打字机效果 |
| 3 | **Social Proof** | ⭐ 74.9k Stars · 10k Forks · 200+ Models | 数字计数动画 |
| 4 | **核心能力** | Feature Cards (3×3 网格) | 悬浮光效，图标动画 |
| 5 | **最新教程** | 4 张 TutorialCard | 横向滚动（移动端） |
| 6 | **7天学习路径** | 时间轴 | 点击展开详情 |
| 7 | **FAQ** | 5-8 个手风琴 | FAQ Schema |
| 8 | **Newsletter** | 邮箱订阅 + 社交链接 | |
| 9 | **Footer** | 站点链接 · 社交 · 版权 | 4 列 |

#### Hero 文案

**English:**
```
# Master Hermes Agent
## From Zero to AI Automation Expert
The definitive learning community for Hermes Agent —
the self-improving AI agent with 74.9k+ GitHub stars.
[⚡ Start Learning]  [📚 Browse Tutorials]
```

**中文：**
```
# 掌握 Hermes Agent
## 从零基础到 AI 自动化专家
Hermes Agent 一站式学习社区 —
GitHub 74.9k+ ⭐ 的自进化 AI Agent 完整知识库
[⚡ 开始学习]  [📚 浏览教程]
```

---

### 4.2 教程文章页

**布局：** 主内容区 65% + 侧边栏 35%，文章正文最大宽度 780px

| 元素 | 规格 |
|------|------|
| 面包屑 | Home > Tutorials > Category > Article |
| 文章头 | H1标题 · 作者 · 日期 · 难度徽章 · 阅读时间 |
| 正文 | MDX 渲染，代码块带一键复制 |
| 侧边栏 | 粘性 TOC + 相关文章 + 同系列导航 |
| 底部 | 系列导航(上/下一篇) + 分享栏 + 推荐阅读 |

#### MDX Frontmatter 元数据

```yaml
---
title: "How to Install Hermes Agent on Any Platform"
titleZh: "如何在任意平台安装 Hermes Agent"
slug: "installation"
description: "Step-by-step guide for Linux, macOS, WSL2, and Termux."
descriptionZh: "Hermes Agent 全平台安装教程。"
author: "HermesAgent Community"
publishedAt: "2026-04-15"
updatedAt: "2026-04-15"
category: "getting-started"
tags: ["installation", "beginner", "setup"]
difficulty: "beginner"        # beginner | intermediate | advanced
readingTime: 8                # minutes
series: "getting-started"
seriesOrder: 1
featured: true
---
```

---

### 4.3 7 天学习路径页

| Day | 主题 | 链接到 |
|:---:|------|-------|
| 1 | Meet Hermes | 安装 + 选模型 + 第一次对话 |
| 2 | Efficient Dialogues | CLI 命令 + 上下文管理 |
| 3 | Files & Code | 文件读写 + 代码生成 |
| 4 | Go Mobile | Telegram 配置 |
| 5 | Skills Mastery | 安装 + 创建技能 |
| 6 | Automation | Cron + 日报 + 监控 |
| 7 | Multi-Agent | 多 Agent 协作 |

**UI：** 竖直时间线 + 进度环 + localStorage 存储进度

---

### 4.4 FAQ 页面

| # | EN | ZH |
|---|----|----|
| 1 | What is Hermes Agent? | Hermes Agent 是什么？ |
| 2 | What hardware do I need? | 需要什么硬件？ |
| 3 | Which AI models are supported? | 支持哪些模型？ |
| 4 | How does multi-agent work? | 多 Agent 怎么玩？ |
| 5 | Is my data safe? | 数据安全吗？ |
| 6 | What's the difference from OpenClaw? | 和 OpenClaw 什么关系？ |
| 7 | Does it work on Windows? | 支持 Windows 吗？ |
| 8 | How do I contribute skills? | 怎么贡献技能？ |

---

## 5. 内容策略

### 5.1 内容生产原则

> **第一性原理：从用户实际使用场景出发，而非从功能列表出发**
> - ❌ 错误："Hermes 支持 MCP 协议，配置方法如下..."
> - ✅ 正确："你想让 Hermes 连接 GitHub 自动 Review PR？这就需要 MCP——3 步搞定"

#### 内容质量标准

| 维度 | 要求 |
|------|------|
| **用户视角** | 标题是用户会搜索的句子 |
| **完整性** | 从"为什么"到"怎么做"到"出问题怎么办" |
| **可复现** | 所有命令可直接复制执行 |
| **视觉辅助** | 关键步骤有截图/终端输出 |
| **时效性** | 标注适用版本，过时内容及时更新 |
| **双语质量** | 不是机翻！符合目标语言技术写作习惯 |

### 5.2 MVP 30 篇内容规划

#### 🟢 入门系列 (6 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 1 | How to Install Hermes Agent: Complete Guide | Hermes Agent 完整安装指南 | 🟢 |
| 2 | Your First Conversation with Hermes Agent | 与 Hermes Agent 的第一次对话 | 🟢 |
| 3 | How to Choose the Right AI Model | 如何选择合适的 AI 模型 | 🟢 |
| 4 | CLI Essential Commands Every User Should Know | CLI 命令：每个用户必知的基础操作 | 🟢 |
| 5 | Understanding Configuration: A Beginner's Guide | 配置完全指南 | 🟢 |
| 6 | Migrating from OpenClaw: Zero-Downtime Guide | 从 OpenClaw 迁移：零停机指南 | 🟢 |

#### 🔵 消息平台系列 (4 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 7 | Set Up Hermes on Telegram: 24/7 AI Assistant | Telegram 配置：全天候 AI 助手 | 🟡 |
| 8 | Hermes + Discord: Community AI Bot | Discord 社区 AI 机器人 | 🟡 |
| 9 | Connect to Slack, WhatsApp & Signal | 连接 Slack、WhatsApp 和 Signal | 🟡 |
| 10 | Multi-Platform Gateway Architecture | 多平台网关架构详解 | 🔴 |

#### 🟣 技能系统系列 (4 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 11 | Browse & Install Community Skills | 浏览并安装社区技能 | 🟢 |
| 12 | Create Your First Custom Skill | 创建你的第一个自定义技能 | 🟡 |
| 13 | Skill Development Best Practices | 技能开发最佳实践 | 🟡 |
| 14 | The Self-Learning Loop Explained | 技能学习闭环详解 | 🟢 |

#### 🟠 自动化系列 (4 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 15 | Automate Everything with Cron Scheduling | 用 Cron 自动化一切 | 🟡 |
| 16 | Build Automated Daily Reports | 构建自动化日报 | 🟡 |
| 17 | Server Monitoring & Alerts | 服务器监控与告警 | 🟡 |
| 18 | 10 Real-World Automation Recipes | 10 个实战自动化方案 | 🟡 |

#### 🔴 进阶系列 (5 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 19 | Multi-Agent Orchestration Patterns | 多 Agent 编排设计模式 | 🔴 |
| 20 | MCP Integration: External Tools | MCP 集成外部工具 | 🔴 |
| 21 | Deep Dive into Memory System | 深入理解记忆系统 | 🔴 |
| 22 | Parallel Subagent Workflows | 并行子 Agent 高级模式 | 🔴 |
| 23 | Architecture: Source Code Walkthrough | 源码架构解析 | 🔴 |

#### 🏗️ 部署系列 (4 篇) + 📊 对比博客 (3 篇)

| # | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|:----:|
| 24 | Deploy on a $5 VPS | $5 VPS 部署 | 🟡 |
| 25 | Production Docker Deployment | 生产 Docker 部署 | 🟡 |
| 26 | Serverless with Modal | Modal 无服务器部署 | 🔴 |
| 27 | Security Hardening Checklist | 安全加固清单 | 🔴 |
| 28 | Hermes vs AutoGPT | Hermes vs AutoGPT 对比 | 🟢 |
| 29 | Hermes vs Open Interpreter | Hermes vs Open Interpreter 对比 | 🟢 |
| 30 | What's New in v0.8 | v0.8 新特性分析 | 🟢 |

---

## 6. SEO 架构

### 6.1 技术 SEO 清单

| 项 | 实现方式 | 级别 |
|----|---------|:----:|
| **SSG 静态生成** | `generateStaticParams` 预渲染全部页面 | P0 |
| **Sitemap** | 动态生成，含 `hreflang` 替代链接，真实 `lastmod` | P0 |
| **robots.txt** | 允许全站爬取，指向 sitemap | P0 |
| **Meta Tags** | 每页独立 title/description, OG, Twitter Card | P0 |
| **Canonical URL** | 每页 self-referencing canonical | P0 |
| **hreflang** | `en` ↔ `zh` 互相指向，`x-default` → `en` | P0 |
| **Schema.org** | TechArticle, FAQ, BreadcrumbList, HowTo | P0 |
| **Core Web Vitals** | LCP < 2.0s, FID < 100ms, CLS < 0.05 | P0 |
| **内部链接** | 每篇文章 3-5 个站内互链，零孤儿页 | P0 |
| **Heading** | 每页唯一 H1，结构化 H2/H3 | P0 |

### 6.2 Schema.org 结构化数据

```json
// 文章页
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "How to Install Hermes Agent",
  "author": { "@type": "Organization", "name": "HermesAgent Community" },
  "datePublished": "2026-04-15",
  "dateModified": "2026-04-15",
  "inLanguage": "en",
  "proficiencyLevel": "Beginner"
}

// FAQ 页
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{ "@type": "Question", "name": "...", "acceptedAnswer": { "@type": "Answer", "text": "..." } }]
}

// 面包屑
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://hermesagent.sbs" },
    { "position": 2, "name": "Tutorials", "item": "https://hermesagent.sbs/en/tutorials" }
  ]
}
```

---

## 7. SEO 索引策略（核心战役）

> **目标：hermesagent.sbs 的每一个内容页面都必须被 Google 编入索引。**

### 7.1 两个核心问题的根因

| 问题 | 本质 | 核心解法 |
|------|------|---------|
| **已发现-未索引** | 抓取优先级问题 | 密集内链 + IndexNow/Google API 主动推 + 精准 Sitemap |
| **已抓取-未索引** | 内容质量问题 | 每篇 1500+ words + 原创代码截图 + 中英差异化 + E-E-A-T |

### 7.2 渐进式发布策略（关键决策）

**不是"做完 30 篇一次性上线"，而是"每批 3-5 篇 → 确认索引 → 再发下一批"**

```
Week 1: 首页 + about + privacy + contact → 提交 GSC 验证域名
Week 2: 前 3 篇精品教程 (EN+ZH=6页) → Request Indexing
Week 3: 确认索引后发第二批 3 篇
Week 4: 确认索引后发第三批 4 篇
Week 5+: 每周 3-5 篇, 48H 内检查索引状态
```

### 7.3 内容质量底线（发布前必须通过）

- [ ] 字数 > 1500 words（中文 > 2000 字）
- [ ] 至少 3 个 H2 章节
- [ ] 至少 2 个原创代码示例（可复制执行）
- [ ] 至少 1 个终端输出截图
- [ ] 3-5 条站内互链 + 1-2 条权威外链
- [ ] Author 信息 + publishedAt/updatedAt 日期
- [ ] Meta Title < 60 字符, Description 120-155 字符
- [ ] 中英文版本有差异化内容（不是纯翻译）

### 7.4 中英文差异化策略

| 策略 | 做法 |
|------|------|
| 代码示例 | EN 用 `curl`, ZH 补充 `wget` + Windows 示例 |
| FAQ | 每个版本各增 2-3 个本地化 FAQ |
| 文化适配 | ZH 引用 Dify/Coze 对比, EN 引用 AutoGPT/LangChain |
| 补充段落 | ZH 增加"国内常见问题", EN 增加"Enterprise" |

### 7.5 内链架构 — Pillar-Cluster 拓扑

| 规则 | 要求 |
|------|------|
| 每篇正文内 | 至少 3 条描述性锚文本站内链接 |
| 文章底部 | 推荐阅读 3 篇 + 上/下一篇导航 |
| 侧边栏 | 同系列文章列表 |
| 面包屑 | 首页 > 教程 > 分类 > 文章 (Schema.org) |
| 首页 | 链接到所有 Pillar 页 + 最新教程 |
| Navbar + Footer | 所有主要页面链接 |
| **零孤儿页** | Sitemap ∩ 内链 = 完全重合 |

### 7.6 主动推送

| 方式 | 覆盖 | 实现 |
|------|------|------|
| **IndexNow** | Bing/Yandex | Cloudflare Crawler Hints 一键开启 |
| **Google Indexing API** | Google | CI/CD 构建后自动调用 |
| **Sitemap Ping** | Google | `curl google.com/ping?sitemap=...` |
| **GSC Request Indexing** | Google | 前期手动提交关键页面 |

### 7.7 页面数量控制

**应该存在 ✅** (~66 页)：首页×2 + 教程~40 + 指南~14 + 博客~6 + 学习路径×2 + FAQ×2

**不应该存在 ❌**：标签归档页、分页页、搜索结果页、空分类页

### 7.8 每周监控

- 自动检查所有页面索引状态
- "已抓取未索引" → 48 小时内改善内容
- "已发现未索引" → 增加内链 + 重新提交

---

## 8. 设计系统

> **确认方案：Option B — Warm Paper（护眼米光风）**
>
> 完整设计规范详见 [docs/ui-ux-design.md](docs/ui-ux-design.md)

### 8.1 色彩概要

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#fdfcf8` | 米白/象牙白 |
| 卡片背景 | `#f5f4ef` | 暖灰白 |
| 悬浮背景 | `#ebece8` | 浅灰 |
| 品牌主色 | `#d97706` | 深琥珀 |
| 标题文字 | `#1f2937` | 深灰 |
| 正文文字 | `#333333` | 中灰 |
| 辅助文字 | `#737373` | 浅灰 |
| 边框 | `#e5e5e5` | 柔和 |
| 链接 | `#2563eb` | 蓝色 |

### 8.2 排版

| 用途 | 字体 |
|------|------|
| 标题/正文 | Inter (400/500/600/700/800) |
| 代码 | JetBrains Mono (400/500) |
| 正文行高 | 1.75（长文阅读黄金比例） |

### 8.3 核心组件

| 组件 | 交互 |
|------|------|
| `Navbar` | 毛玻璃米白底, 滚动压缩, 汉堡菜单 |
| `Footer` | 4列链接, Newsletter, 社交图标 |
| `HeroSection` | 终端打字动效, CTA, 渐变光晕 |
| `FeatureCard` | 悬浮光效 + 金色光束 + 上浮 |
| `TutorialCard` | 封面 + 难度 + 阅读时间 |
| `CodeBlock` | 语法高亮 + 一键复制 |
| `TOCSidebar` | 粘性定位, 滚动高亮 |
| `SearchModal` | Cmd+K, Pagefind 驱动 |
| `FAQAccordion` | 手风琴, 平滑动画 |
| `Breadcrumb` | Schema.org 标记 |
| `SeriesNavigation` | 上/下一篇 + 系列进度 |
| `RelatedArticles` | 底部 3 张推荐卡 |

---

## 9. 技术架构

### 9.1 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 15 (App Router) + React 19 + TypeScript 5 |
| 样式 | CSS Modules + CSS Variables |
| 内容 | MDX 3.x + next-mdx-remote |
| 国际化 | next-intl (复用 zoxide 模式) |
| SEO | 动态 Sitemap + Schema.org JSON-LD + OG 图生成 |
| 搜索 | Pagefind (静态搜索索引) |
| 部署 | Cloudflare Pages + GitHub Actions CI/CD |

### 9.2 项目目录

```
hermesagent.sbs/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing
│   │   ├── tutorials/
│   │   │   ├── page.tsx                # Index
│   │   │   └── [...slug]/page.tsx      # Article
│   │   ├── guides/
│   │   ├── blog/
│   │   ├── learning-path/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── about/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── contact/page.tsx
│   ├── api/og/route.tsx                # OG 图生成
│   └── globals.css
│
├── components/
│   ├── layout/     (Navbar, Footer, Sidebar)
│   ├── landing/    (HeroSection, FeatureCard, SocialProof, Timeline)
│   ├── content/    (CodeBlock, TOCSidebar, Breadcrumb, ShareBar, RelatedArticles)
│   ├── cards/      (TutorialCard, GuideCard)
│   ├── search/     (SearchModal)
│   └── ui/         (DifficultyBadge, FAQAccordion, NewsletterForm)
│
├── content/
│   ├── tutorials/  (en/ + zh/ 按语言分目录)
│   ├── guides/
│   └── blog/
│
├── messages/       (en.json + zh.json — UI 翻译)
├── i18n/           (routing.ts + request.ts)
├── lib/            (content.ts, seo/schema.ts, seo/metadata.ts)
├── styles/         (design-tokens.css)
├── docs/           (ui-ux-design.md, mockup.html)
└── scripts/        (notify-google.ts, check-indexing.ts)
```

### 9.3 i18n 架构

```typescript
// i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});
```

| 内容类型 | i18n 方式 |
|---------|----------|
| UI 文本 | `messages/en.json` + `messages/zh.json` |
| MDX 文章 | `content/tutorials/en/` + `content/tutorials/zh/` |
| SEO 元数据 | Frontmatter 双语字段 (`title` + `titleZh`) |
| OG 图片 | 根据 locale 动态生成 |

---

## 10. 性能指标

| 指标 | 目标 | 测量 |
|------|------|------|
| LCP | < 2.0s | Lighthouse |
| FID | < 100ms | CrUX |
| CLS | < 0.05 | Lighthouse |
| TTFB | < 200ms | WebPageTest |
| Bundle | < 100KB JS | next build |
| Lighthouse | 95+ | All categories |

---

## 11. 开发里程碑

### Phase 1: MVP（Week 1-4）

| 周 | 任务 | 交付 |
|:--:|------|------|
| W1 | 项目初始化 + 设计系统 + Layout | 空框架, Navbar/Footer/全局样式 |
| W2 | 首页 Landing + 组件开发 | Hero/Features/Timeline/FAQ |
| W3 | 内容系统 + 文章模板 + 10 篇教程 | MDX 渲染 + 教程页 |
| W4 | SEO + 搜索 + 部署 | 上线 hermesagent.sbs |

### Phase 2: 内容增长（Week 5-8）

| 周 | 任务 |
|:--:|------|
| W5 | 完成剩余 20 篇教程 (EN+ZH) |
| W6 | 学习路径页 + 博客功能 |
| W7 | 搜索优化 + 评论系统 (Giscus) |
| W8 | 内容审查 + 索引监控 |

### Phase 3: 生态扩展（Week 9-16）

| 周 | 任务 |
|:--:|------|
| W9-10 | Skills Hub 展示页 |
| W11-12 | Newsletter + 社区集成 |
| W13-14 | 流量分析 + AdSense 申请 |
| W15-16 | 多语言扩展准备 (ja/ko) |

---

## 12. 成功标准

| 指标 | 1个月 | 3个月 | 6个月 |
|------|:-----:|:-----:|:-----:|
| 文章数量 | 15 篇 | 30 篇 | 60+ 篇 |
| 日均 UV | 50 | 300 | 1000+ |
| Google 索引率 | 100% | 100% | 100% |
| AdSense | ❌ | 申请 | ✅ |
| Newsletter | 50 | 200 | 500+ |

---

## 13. 风险与缓解

| 风险 | 概率 | 缓解 |
|------|:----:|------|
| AdSense 审核不通过 | 中 | 30+ 高质量文章 + 法律页面 |
| AI 内容被惩罚 | 低 | AI 生成 + 人工深度编辑 + 原创截图 |
| 项目停止维护 | 低 | 扩展为通用 AI Agent 社区 |
| 竞品抢关键词 | 中 | 先攻长尾词, 积累权重后抢中等竞争词 |
| 索引失败 | 低 | 渐进式发布 + 每周监控 + 48H 修复 |

---

## 附录

### A. 竞品参考

| 站点 | 可借鉴 |
|------|--------|
| hermes101.pages.dev | 设计语言 |
| docs.anthropic.com | 导航/搜索体验 |
| nextjs.org/learn | 结构化学习路径 |
| learnprompting.org | 社区贡献模式 |

### B. 关联文档

| 文档 | 路径 |
|------|------|
| UI/UX 设计规范 | [docs/ui-ux-design.md](docs/ui-ux-design.md) |
| UI 高保真原型 | [docs/mockup.html](docs/mockup.html) |
