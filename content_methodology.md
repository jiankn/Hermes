# 内容创作方法论：第一性原理

## 核心理念：从用户的「欲望」开始，而非从「功能列表」开始

### ❌ 传统做法（Feature-driven，大多数技术文档这么写）

```
标题：Hermes Agent Cron 任务配置指南
内容：Hermes 支持 Cron 调度功能。以下是 config.yaml 中的 cron 字段说明……
```

用户心理：「这和我有什么关系？」→ 跳出

### ✅ 第一性原理做法（Desire-driven）

```
标题：让 AI 每天早上 9 点自动给你发日报——10 分钟搞定
内容：你是不是每天早上都要手动整理昨天的工作进展？
     如果有一个 AI 助手自动帮你做这件事呢？
     这就是 Hermes Agent 的 Cron 功能……
```

用户心理：「这就是我想要的！」→ 继续读 → 完成全部操作 → 收藏 → 分享

---

## 写作框架：DESIRE → PROBLEM → SOLUTION → SKILL

```
┌─────────────────────────────────────────────────────────────────┐
│  DESIRE (欲望)     用户真正想要什么？                              │
│  ↓                                                              │
│  PROBLEM (阻碍)    为什么他现在做不到？                             │
│  ↓                                                              │
│  SOLUTION (方案)   Hermes Agent 怎么解决这个问题？                  │
│  ↓                                                              │
│  SKILL (技能)      一步步教会他，让他自己能重现                      │
│  ↓                                                              │
│  NEXT (下一步)     学会了这个，接下来可以做什么更厉害的？             │
└─────────────────────────────────────────────────────────────────┘
```

### 每篇文章的标题公式

| 类型 | 公式 | 示例 |
|------|------|------|
| How-to | 「如何 [动作] + [结果]」 | How to Make Hermes Send Daily Reports to Telegram |
| 问题驱动 | 「[痛点]？[方案]」 | Token 消耗太快？5 个立省 60% 的配置技巧 |
| 结果导向 | 「[时间] 搞定 [目标]」 | 10 Minutes to a 24/7 Telegram AI Assistant |
| 对比 | 「[A] vs [B]：[结论]」 | Hermes vs AutoGPT: Which One Actually Gets Work Done? |

---

## 中英文差异化策略（重中之重）

> **不是翻译，是重新创作。** 中文版和英文版面对不同用户群体、不同使用场景、不同生态环境。

| 维度 | EN 版 | ZH 版 |
|------|-------|-------|
| **目标用户** | 独立开发者、DevOps | 学生、AI 爱好者、技术产品经理 |
| **搜索习惯** | "hermes agent telegram setup" | "AI Agent 怎么连 Telegram" |
| **标题风格** | 简洁专业 | 加痛点、加数字、加情绪 |
| **开头** | 直接切入："In this guide..." | 先共鸣：「你是不是也遇到过这个问题？」|
| **代码示例** | curl + Linux 为主 | 补充 wget + Windows/WSL2 步骤 + 国内镜像 |
| **生态对比** | 提 AutoGPT、LangChain | 提 Dify、Coze、FastGPT |
| **常见问题** | SSL、权限、API key | 代理问题、npm 镜像、内网穿透 |
| **独有段落** | Enterprise considerations | 国内使用注意事项（代理、备案）|
| **字数** | 1500-2000 words | 2000-3000 字（中文读者期待更详细的手把手引导）|

---

## 单篇文章结构模板

```markdown
---
# Frontmatter (SEO + 内部管理)
---

## 这篇文章能帮你做什么？（30 秒钩子）
> 1 句话说清楚读完这篇你能获得什么。配一个终端截图/GIF。

## 前置条件
> 列出 3-5 个前提条件，每个链接到对应教程。不冗余解释。

## 核心步骤（文章 70% 的篇幅）

### Step 1: [动作] — [目的]
  代码块 + 预期输出 + 截图
  
### Step 2: ...

### Step 3: ...

## 出问题了？（Troubleshooting）
> 用 Q&A 格式：
> **Q: 报错 "xxx"？**
> A: 原因 + 解决方案。

## 进阶技巧（Optional）
> 省 token、加速、安全加固等高级用法。

## 下一步做什么？
> 3 条内部链接，描述性锚文本，引导到关联教程。

## 小结
> 3 句话总结这篇教程做了什么。
```

---

## 30 篇文章的生产计划

### 🔴 批次 1（第 1 周）：安装入门 3 篇 → 确认索引 → 发第 2 批

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 1 | 我想装上 Hermes 试试 | How to Install Hermes Agent on Any Platform | 全平台安装 Hermes Agent：5 分钟搞定 | 🟢 |
| 2 | 装好了，怎么用？ | Your First Conversation: What to Say and How | 第一次对话：怎么和 AI Agent 聊出效率 | 🟢 |
| 3 | 用哪个模型好？ | How to Choose the Right AI Model for Your Workflow | 模型选择指南：省钱、快速、聪明，选哪个？ | 🟢 |

### 🟡 批次 2（第 2 周）：日常使用 3 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 4 | CLI 太多命令记不住 | 15 CLI Commands You'll Use Every Day | 每天都在用的 15 个 CLI 命令（含速查表）| 🟢 |
| 5 | 怎么调参数配置？ | The Complete Configuration Guide: config.yaml Explained | 配置文件完全指南：每个参数都讲清楚 | 🟢 |
| 6 | 之前用 OpenClaw | Migrating from OpenClaw Without Losing Anything | 从 OpenClaw 迁移：数据、技能、记忆一个不丢 | 🟢 |

### 🔵 批次 3（第 3 周）：手机/社交接入 4 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 7 | 手机上也能用就好了 | Set Up Hermes on Telegram in 10 Minutes | 10 分钟搞定 Telegram 上的 AI 管家 | 🟡 |
| 8 | 给 Discord 社区加 AI | Build an AI Bot for Your Discord Community | 给 Discord 社区加一个 AI 助手 | 🟡 |
| 9 | 多个平台都想连 | Connect Hermes to Slack, WhatsApp & Signal | 一个 Agent 连全部：Slack/WhatsApp/Signal | 🟡 |
| 10 | 平台太多怎么管？ | Multi-Platform Gateway: Architecture Deep Dive | 多平台网关架构：一张图讲清楚 | 🔴 |

### 🟣 批次 4（第 4 周）：技能系统 4 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 11 | Hermes 能做更多事吗？ | Browse & Install Skills: Give Hermes Superpowers | 给 Hermes 装技能：3 分钟扩展 AI 能力 | 🟢 |
| 12 | 我想自己写个功能 | Create Your First Skill from Scratch | 手搓一个自定义技能（含完整代码）| 🟡 |
| 13 | 怎么写好不写烂？ | Skill Development: Patterns, Tests, and Best Practices | 技能开发最佳实践：代码模式 + 测试 | 🟡 |
| 14 | AI 能自己学会新技能？ | How the Self-Learning Loop Actually Works | AI 怎么自己学会新技能？闭环机制详解 | 🟢 |

### 🟠 批次 5（第 5 周）：自动化 4 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 15 | 能不能自动帮我干活？ | Automate Anything with Cron: A Practical Guide | 定时任务终极指南：让 AI 自动帮你干活 | 🟡 |
| 16 | 每天自动发日报 | Build an Automated Daily Report System | 每天早上自动发日报——老板都惊了 | 🟡 |
| 17 | 服务器出问题要第一时间知道 | Server Monitoring & Smart Alerts with Hermes | 服务器异常？AI 比你先知道还帮你修 | 🟡 |
| 18 | 给我更多自动化灵感 | 10 Real-World Automation Recipes You Can Copy | 10 个拿来就用的自动化方案（附代码）| 🟡 |

### 🔴 批次 6（第 6 周）：高级功能 5 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 19 | 多个 AI 一起干活 | Multi-Agent Orchestration: Patterns That Work | 多 Agent 编排：3 种实战模式 | 🔴 |
| 20 | 接外部工具 | MCP Integration: Connect GitHub, Notion & More | MCP 实战：接 GitHub / Notion / 数据库 | 🔴 |
| 21 | 为什么 AI 会忘事？ | Memory System Deep Dive: How Hermes Remembers | 记忆系统拆解：AI 为什么会忘事？怎么治 | 🔴 |
| 22 | 并行加速 | Parallel Sub-Agents: Run 5 Tasks at Once | 并行子 Agent：5 个任务同时跑 | 🔴 |
| 23 | 想看源码了解原理 | Architecture Walkthrough: Hermes Source Code | 源码解读：Hermes Agent 架构拆解 | 🔴 |

### 🏗️ 批次 7（第 7-8 周）：部署 + 对比 + 博客 7 篇

| # | 用户欲望 | 英文标题 | 中文标题 | 难度 |
|---|---------|---------|---------|:----:|
| 24 | 便宜跑起来 | Deploy Hermes 24/7 on a $5 VPS | $5/月：7×24 小时运行你的 AI Agent | 🟡 |
| 25 | 生产级部署 | Production Docker Deployment with Monitoring | Docker 生产部署 + Prometheus 监控 | 🟡 |
| 26 | 无服务器 | Run Hermes Serverless with Modal | 无服务器部署：按用量付费不浪费 | 🔴 |
| 27 | 安全吗？ | Security Hardening Checklist (32 Items) | 安全加固清单：32 项逐个检查 | 🔴 |
| 28 | 和 AutoGPT 比谁好？ | Hermes vs AutoGPT: Honest Comparison | Hermes vs AutoGPT：到底选哪个？| 🟢 |
| 29 | 和 Open Interpreter 比 | Hermes vs Open Interpreter: Use Cases Compared | Hermes vs Open Interpreter：场景化对比 | 🟢 |
| 30 | 最新版更新了什么 | What's New in v0.8: Complete Changelog Analysis | v0.8 更新了什么？完整变更解读 | 🟢 |

---

## 质量关卡（发布前 Checklist）

每篇文章发布前必须通过以下检查：

### 内容质量
- [ ] 标题是用户会搜索的句子（而非功能名称）
- [ ] 开头 30 秒能回答「这篇文章能帮我做什么」
- [ ] 字数：EN ≥ 1500 words / ZH ≥ 2000 字
- [ ] 至少 3 个 H2 章节 + 合理的 H3 层级
- [ ] 至少 2 个原创代码示例（读者可以直接复制执行）
- [ ] 至少 1 个终端输出截图或 GIF
- [ ] Troubleshooting 部分至少 3 个 Q&A
- [ ] 中英文版本有差异化内容（不是纯翻译）

### SEO / 内链
- [ ] 正文内至少 3 条描述性锚文本站内链接
- [ ] 文章底部 3 条「推荐阅读」
- [ ] 面包屑结构正确
- [ ] Meta Title < 60 char / Description 120-155 char
- [ ] Canonical URL 正确
- [ ] publishedAt / updatedAt 准确

### 技术准确性
- [ ] 所有命令在对应 OS 上实测可执行
- [ ] 标注适用的 Hermes Agent 版本号
- [ ] 引用的 GitHub 文件路径 / API 端点存在
- [ ] 外部链接均有效

---

## 生产节奏

```
Week 1:  写批次 1（3篇 × 2语言 = 6 页）→ 发布 → GSC Request Indexing
Week 2:  确认批次1已索引 → 写+发批次 2（3篇）
Week 3:  确认批次2已索引 → 写+发批次 3（4篇）
Week 4:  批次 4（4篇）
Week 5:  批次 5（4篇）
Week 6:  批次 6（5篇）
Week 7-8: 批次 7（7篇） + 内容审查 + 内链优化
```

> 每批发布后 48H 内检查 GSC 索引状态。如果出现「已抓取-未索引」，立即改善该文章内容并重新提交。
