import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const author = 'HermesAgent Community';
const today = '2026-04-14';

function quote(value) {
  return JSON.stringify(value);
}

function frontmatter(meta) {
  return [
    '---',
    `title: ${quote(meta.title)}`,
    `titleZh: ${quote(meta.titleZh)}`,
    `slug: ${quote(meta.slug)}`,
    `description: ${quote(meta.description)}`,
    `descriptionZh: ${quote(meta.descriptionZh)}`,
    `author: ${quote(author)}`,
    `publishedAt: ${quote(today)}`,
    `updatedAt: ${quote(today)}`,
    `category: ${quote(meta.category)}`,
    `tags: [${meta.tags.map(quote).join(', ')}]`,
    `difficulty: ${quote(meta.difficulty)}`,
    `readingTime: ${meta.readingTime}`,
    ...(meta.series ? [`series: ${quote(meta.series)}`] : []),
    ...(meta.seriesOrder ? [`seriesOrder: ${meta.seriesOrder}`] : []),
    `featured: ${meta.featured ? 'true' : 'false'}`,
    '---',
    '',
  ].join('\n');
}

function paragraphLines(paragraphs) {
  return paragraphs.flatMap((paragraph) => [paragraph, '']);
}

function bulletLines(items) {
  return items.map((item) => `- ${item}`);
}

function numberedLines(items) {
  return items.map((item, index) => `${index + 1}. ${item}`);
}

function codeBlock(lang, content) {
  return [`\`\`\`${lang}`, ...content.trim().split('\n'), '```', ''];
}

function stepLines(locale, steps) {
  const label = locale === 'zh' ? '步骤' : 'Step';
  return steps.flatMap((step, index) => [
    `## ${label} ${index + 1}: ${step.title}`,
    '',
    ...paragraphLines(step.paragraphs),
    ...(step.code ? codeBlock(step.code.lang, step.code.content) : []),
  ]);
}

function faqLines(items) {
  return items.flatMap((item) => [`### ${item.q}`, '', item.a, '']);
}

function renderArticle(locale, article) {
  const content = article[locale];
  const labels =
    locale === 'zh'
      ? {
          fit: '## 什么时候应该用它',
          workflow: '## 参考工作流',
          checklist: '## 上线前检查清单',
          faq: '## 常见问题',
          next: '## 下一步',
          updated: '*最后更新：2026 年 4 月 14 日 · Hermes Agent v0.8*',
        }
      : {
          fit: '## When This Pattern Fits',
          workflow: '## Reference Workflow',
          checklist: '## Preflight Checklist',
          faq: '## Troubleshooting',
          next: '## Next Steps',
          updated: '*Last updated: April 14, 2026 · Hermes Agent v0.8*',
        };

  return [
    `## ${content.introTitle}`,
    '',
    ...paragraphLines(content.intro),
    labels.fit,
    '',
    ...bulletLines(content.when),
    '',
    labels.workflow,
    '',
    ...numberedLines(content.workflow),
    '',
    ...stepLines(locale, content.steps),
    labels.checklist,
    '',
    ...bulletLines(content.checklist),
    '',
    labels.faq,
    '',
    ...faqLines(content.faq),
    labels.next,
    '',
    ...bulletLines(content.next),
    '',
    '---',
    '',
    labels.updated,
    '',
  ].join('\n');
}

function writeArticle(article) {
  for (const locale of ['en', 'zh']) {
    const filePath = path.join(root, 'content', article.type, locale, `${article.filePath}.mdx`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${frontmatter(article.meta)}${renderArticle(locale, article)}`, 'utf8');
  }
}

const articles = [
  {
    type: 'tutorials',
    filePath: 'automation/automation-recipes',
    meta: {
      title: '10 Real-World Automation Recipes You Can Copy',
      titleZh: '10 个拿来就用的自动化方案（附代码）',
      slug: 'automation-recipes',
      description:
        'Ten practical automation patterns for Hermes covering reports, triage, maintenance, content prep, and approval-based execution.',
      descriptionZh:
        '给出十个可直接复用的 Hermes 自动化模式，覆盖日报、分诊、维护、内容预处理和审批式执行。',
      category: 'automation',
      tags: ['automation', 'recipes', 'workflows', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 15,
      series: 'automation',
      seriesOrder: 4,
      featured: false,
    },
    en: {
      introTitle: 'Copy patterns, not isolated prompts',
      intro: [
        'When teams say they want “automation ideas,” they usually need starting patterns that already respect schedules, approval boundaries, and noisy inputs. One-off prompts are not enough.',
        'The recipes below are intentionally practical. Use them as scaffolding, then attach your own tools, data sources, and delivery channels.',
      ],
      when: [
        'You want proven shapes for Hermes workflows instead of blank-page brainstorming.',
        'You need examples that already separate collection, reasoning, and delivery.',
        'You want to start small before building larger orchestration pipelines.',
      ],
      workflow: [
        'Choose the workflow trigger: cron, webhook, queue, or human approval.',
        'Normalize inputs before asking Hermes to reason over them.',
        'Define the output artifact and its delivery channel.',
        'Measure task success and failure recovery before scaling usage.',
      ],
      steps: [
        {
          title: 'Start with a small recipe catalog',
          paragraphs: [
            'Good first recipes include daily reports, stale issue triage, incident summaries, release note drafts, customer feedback clustering, inbox labeling, dependency update reviews, and deployment checklists.',
          ],
          code: {
            lang: 'ts',
            content: `
const recipes = [
  'daily-digest',
  'incident-triage',
  'stale-ticket-cleanup',
  'release-note-draft',
  'dependency-review'
];
            `,
          },
        },
        {
          title: 'Give every recipe a contract',
          paragraphs: [
            'The contract should say what triggers the job, which inputs are required, what success looks like, and whether approval is mandatory. Without that, “recipe reuse” turns into prompt drift.',
          ],
        },
        {
          title: 'Promote only the recipes that survive real operators',
          paragraphs: [
            'A recipe is production-ready only after another person can run it, understand it, and trust the output without reading your mind. That is the operational definition of reuse.',
          ],
        },
      ],
      checklist: [
        'Document trigger, input schema, owner, and rollback path for every recipe.',
        'Keep prompts short and move business rules into structured inputs.',
        'Add approval to anything that changes data, infrastructure, or external communication.',
        'Track which recipes actually save time instead of only counting executions.',
      ],
      faq: [
        {
          q: 'Should each recipe have its own prompt file?',
          a: 'Usually yes, but keep the prompt thin. The stable logic should live in schemas, templates, and code, not in one giant prompt paragraph.',
        },
        {
          q: 'How many recipes should I launch with?',
          a: 'Three to five is enough for the first wave. Launching ten at once sounds efficient, but it usually means nobody measures quality properly.',
        },
        {
          q: 'Which recipe is the best first win?',
          a: 'Daily digests and incident summaries are strong starters because they are high-frequency, low-risk, and easy for humans to review.',
        },
      ],
      next: [
        '**[Build an Automated Daily Report System](/en/tutorials/automation/daily-report-system)** — Turn one recipe into a dependable morning workflow.',
        '**[Server Monitoring & Smart Alerts](/en/tutorials/automation/server-monitoring-alerts)** — Apply the same structure to operations.',
        '**[Parallel Sub-Agents](/en/tutorials/advanced/parallel-sub-agents)** — Fan out complex recipes across multiple workers.',
      ],
    },
    zh: {
      introTitle: '不要抄零散 prompt，要抄“工作流模式”',
      intro: [
        '团队说自己需要“自动化灵感”时，真正要的通常不是一句 prompt，而是一套已经考虑过调度、审批边界和脏数据输入的起手式。',
        '下面这些方案故意都做得很实用。你可以把它们当脚手架，再接上自己的工具、数据源和投递渠道。',
      ],
      when: [
        '你想直接拿到 Hermes 工作流雏形，而不是从空白页开始想。',
        '你需要的示例已经把采集、推理、投递拆开了。',
        '你想先做几个小而稳的流程，再扩展到更复杂编排。',
      ],
      workflow: [
        '先选触发方式：cron、webhook、队列，还是人工审批。',
        '在 Hermes 推理前，把输入先归一化。',
        '定义清楚最终制品和它的投递渠道。',
        '上线前先量化任务成功率和失败恢复路径。',
      ],
      steps: [
        {
          title: '先准备一个小型方案目录',
          paragraphs: [
            '第一批适合做的方案通常包括：自动日报、陈旧工单清理、事故摘要、发布说明草稿、用户反馈聚类、收件箱分类、依赖升级审查和部署检查清单。',
          ],
          code: {
            lang: 'ts',
            content: `
const recipes = [
  'daily-digest',
  'incident-triage',
  'stale-ticket-cleanup',
  'release-note-draft',
  'dependency-review'
];
            `,
          },
        },
        {
          title: '给每个方案都写上契约',
          paragraphs: [
            '契约里至少要写清楚触发条件、输入要求、什么叫成功、哪些情况必须审批。否则所谓“复用方案”最后只会退化成 prompt 漂移。',
          ],
        },
        {
          title: '只有扛过真实操作者的方案才算可晋升',
          paragraphs: [
            '一个方案能否进生产，不是看作者本人跑通，而是看另一个人能否独立运行、看懂并信任输出。这才是复用的操作性定义。',
          ],
        },
      ],
      checklist: [
        '每个方案都记录触发器、输入 schema、负责人和回滚路径。',
        'Prompt 保持短，把业务规则放到结构化输入和模板里。',
        '凡是会改数据、改基础设施、对外发消息的流程都必须加审批。',
        '不要只算执行次数，要量化真正节省了多少时间。',
      ],
      faq: [
        {
          q: '每个方案都要单独放一份 prompt 文件吗？',
          a: '通常是要的，但 prompt 本身应该很薄。稳定逻辑应该落在 schema、模板和代码里，而不是一大段自然语言。',
        },
        {
          q: '第一批应该同时上线多少个方案？',
          a: '3 到 5 个就够。一次上 10 个听起来高效，实际往往意味着没有人认真量化质量。',
        },
        {
          q: '哪个方案最适合作为第一个胜利样本？',
          a: '自动日报和事故摘要是很好的起点，因为高频、低风险、容易复核。',
        },
      ],
      next: [
        '**[自动日报系统](/zh/tutorials/automation/daily-report-system)** — 先把一个方案做成稳定晨报。',
        '**[服务器监控与告警](/zh/tutorials/automation/server-monitoring-alerts)** — 再把同样结构用到运维。',
        '**[并行子 Agent](/zh/tutorials/advanced/parallel-sub-agents)** — 用多 worker 扩展复杂方案。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'advanced/mcp-integration',
    meta: {
      title: 'MCP Integration: Connect GitHub, Notion & More',
      titleZh: 'MCP 实战：接 GitHub / Notion / 数据库',
      slug: 'mcp-integration',
      description:
        'Use MCP integrations to connect Hermes with external tools while keeping contracts, permissions, and failure handling explicit.',
      descriptionZh:
        '通过 MCP 把 Hermes 接到外部工具，同时把契约、权限和失败处理都保持为显式结构。',
      category: 'advanced',
      tags: ['advanced', 'mcp', 'integrations', 'tools'],
      difficulty: 'advanced',
      readingTime: 15,
      series: 'advanced',
      seriesOrder: 2,
      featured: false,
    },
    en: {
      introTitle: 'MCP is useful because it makes tool contracts visible',
      intro: [
        'The hardest part of tool integration is rarely the HTTP request. The hard part is defining what the agent may call, what each tool guarantees, and how to recover when a dependency is slow, stale, or denied.',
        'MCP gives Hermes a cleaner boundary: explicit tool descriptions, structured inputs, and a consistent execution layer that is easier to reason about than ad-hoc shell scripts.',
      ],
      when: [
        'You want to connect Hermes to GitHub, Notion, databases, or internal APIs without inventing a new wrapper each time.',
        'You need permission boundaries that differ by environment or by operator role.',
        'You want tool usage to stay observable and debuggable in production.',
      ],
      workflow: [
        'Define the tool contract and the minimum permissions it needs.',
        'Expose the tool through MCP with validated inputs and outputs.',
        'Teach Hermes when to call the tool and when to stop and ask for approval.',
        'Log failures, latency, and permission denials so the integration can be improved safely.',
      ],
      steps: [
        {
          title: 'Model the contract before you expose the tool',
          paragraphs: [
            'A connector should say exactly what it does, which arguments are required, what rate limits exist, and which failures are expected. If the contract is vague, the model will improvise around the ambiguity.',
          ],
          code: {
            lang: 'json',
            content: `
{
  "name": "github_fetch_pr",
  "inputs": ["repo_full_name", "pr_number"],
  "returns": ["title", "body", "diff", "status"],
  "approval": "not_required_for_read_only"
}
            `,
          },
        },
        {
          title: 'Keep permissions narrower than your local shell',
          paragraphs: [
            'The point of MCP is not to recreate full shell power through another interface. Expose task-specific capabilities such as “read PR metadata” or “append a comment,” not general remote execution.',
          ],
        },
        {
          title: 'Design graceful failure paths',
          paragraphs: [
            'Remote systems will rate-limit you, return partial data, or change schema. Make Hermes distinguish between “tool unavailable,” “permission denied,” and “no data found” so the next step is unambiguous.',
          ],
        },
      ],
      checklist: [
        'Document approval requirements per tool capability, not just per server.',
        'Validate inputs before the request leaves Hermes.',
        'Capture latency and error classes for every MCP call.',
        'Return structured data instead of unbounded prose whenever possible.',
      ],
      faq: [
        {
          q: 'Should every external system be exposed through MCP?',
          a: 'Only if the capability is stable enough to deserve a contract. Temporary experiments can stay outside MCP until the behavior settles.',
        },
        {
          q: 'What is the most common integration mistake?',
          a: 'Granting broad permissions too early. Teams often expose a whole service account when the workflow only needed one read-only action.',
        },
        {
          q: 'How do I debug bad tool choices?',
          a: 'Log the selected tool, the user goal, the arguments sent, and the outcome. Most tool-choice bugs become obvious once you can inspect those four pieces together.',
        },
      ],
      next: [
        '**[Multi-Agent Orchestration](/en/tutorials/advanced/multi-agent-orchestration)** — Put connectors behind a larger workflow.',
        '**[Parallel Sub-Agents](/en/tutorials/advanced/parallel-sub-agents)** — Fan out MCP-backed tasks safely.',
        '**[Architecture Walkthrough](/en/tutorials/advanced/architecture-walkthrough)** — See where connector boundaries live in the codebase.',
      ],
    },
    zh: {
      introTitle: 'MCP 的价值，在于把工具契约变得可见',
      intro: [
        '工具集成最难的部分，通常不是发出一条 HTTP 请求，而是定义：代理到底能调什么、工具能保证什么、外部依赖变慢或拒绝访问时该怎么收场。',
        'MCP 给 Hermes 带来的核心收益，是一个更干净的边界：显式工具描述、结构化输入、统一执行层，比临时 shell 包装更容易推理和调试。',
      ],
      when: [
        '你想把 Hermes 接到 GitHub、Notion、数据库或内部 API，但不想每次都重新造一层包装。',
        '不同环境、不同操作者需要不同权限边界。',
        '你希望生产环境里的工具调用过程可观察、可调试。',
      ],
      workflow: [
        '先定义工具契约和最小权限。',
        '通过 MCP 暴露能力，并校验输入输出结构。',
        '教 Hermes 何时调用工具、何时停下来要求审批。',
        '持续记录失败、延迟和拒绝访问，安全地迭代集成。',
      ],
      steps: [
        {
          title: '在暴露能力前，先把契约建好',
          paragraphs: [
            '一个连接器必须明确说明它做什么、需要哪些参数、有什么速率限制、预期会遇到哪些失败。如果契约含糊，模型就会在模糊处自己脑补。',
          ],
          code: {
            lang: 'json',
            content: `
{
  "name": "github_fetch_pr",
  "inputs": ["repo_full_name", "pr_number"],
  "returns": ["title", "body", "diff", "status"],
  "approval": "not_required_for_read_only"
}
            `,
          },
        },
        {
          title: '权限范围必须比本地 shell 更窄',
          paragraphs: [
            'MCP 的目标不是换个接口重建一套“全能 shell”。暴露的应该是任务级能力，比如“读取 PR 元数据”或“追加评论”，而不是任意远程执行。',
          ],
        },
        {
          title: '把失败路径设计清楚',
          paragraphs: [
            '远端系统会限流、会返回半截数据、会改 schema。让 Hermes 明确区分“工具不可用”“权限不足”“没有查到数据”，下一步动作才不会混乱。',
          ],
        },
      ],
      checklist: [
        '按能力而不是按整个服务来定义审批要求。',
        '请求发出前先做输入校验。',
        '每次 MCP 调用都记录延迟和错误类别。',
        '能返回结构化数据就不要返回无边界自然语言。',
      ],
      faq: [
        {
          q: '是不是所有外部系统都应该接成 MCP？',
          a: '只有当某项能力已经稳定到值得写契约时才有必要。临时实验可以先放在 MCP 外，行为稳定后再纳入。',
        },
        {
          q: '最常见的集成错误是什么？',
          a: '过早给太大权限。很多团队一上来就暴露整套服务账号，但实际工作流只需要一个只读动作。',
        },
        {
          q: '怎么调试“模型选错工具”这种问题？',
          a: '把选择的工具、用户目标、发送参数和调用结果一起打出来。多数工具选择问题在这四项放到一起时就很明显。',
        },
      ],
      next: [
        '**[多 Agent 编排](/zh/tutorials/advanced/multi-agent-orchestration)** — 把连接器放进更大的工作流里。',
        '**[并行子 Agent](/zh/tutorials/advanced/parallel-sub-agents)** — 安全地并行化 MCP 任务。',
        '**[Hermes 架构拆解](/zh/tutorials/advanced/architecture-walkthrough)** — 看连接器边界在代码里怎么落位。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'advanced/memory-system-deep-dive',
    meta: {
      title: 'Memory System Deep Dive: How Hermes Remembers',
      titleZh: '记忆系统拆解：AI 为什么会忘事？怎么治',
      slug: 'memory-system-deep-dive',
      description:
        'Break down short-term context, summaries, durable memory, and retrieval so Hermes can remember the right things without bloating prompts.',
      descriptionZh:
        '拆解短期上下文、摘要、长期记忆和检索，让 Hermes 记住该记的内容，而不是把 prompt 越堆越大。',
      category: 'advanced',
      tags: ['advanced', 'memory', 'context', 'retrieval'],
      difficulty: 'advanced',
      readingTime: 16,
      series: 'advanced',
      seriesOrder: 3,
      featured: false,
    },
    en: {
      introTitle: 'Memory quality is mostly about deciding what not to keep',
      intro: [
        'Agents do not fail because they have zero memory. They fail because too much irrelevant detail stays in the active context while the few facts that matter are hidden or never promoted.',
        'A good memory system distinguishes transient working state, conversation summaries, reusable knowledge, and long-term records. Once those layers are separate, retrieval gets simpler and cheaper.',
      ],
      when: [
        'Long sessions keep drifting because the prompt is bloated with stale details.',
        'Teams want reusable knowledge without pasting giant transcripts into every run.',
        'You need a clear rule for what belongs in short-term context versus persistent memory.',
      ],
      workflow: [
        'Keep the active window small and task-specific.',
        'Summarize completed work into compact state transitions.',
        'Promote durable facts and reusable procedures into long-term memory.',
        'Retrieve only the memory slices that are relevant to the current goal.',
      ],
      steps: [
        {
          title: 'Separate working state from durable memory',
          paragraphs: [
            'Working state includes today’s files, commands, open decisions, and temporary hypotheses. Durable memory should contain facts that are likely to matter again: system constraints, approved procedures, and recurring operator preferences.',
          ],
          code: {
            lang: 'json',
            content: `
{
  "workingState": ["current branch", "open incident", "pending test failure"],
  "durableMemory": ["prod deploy requires approval", "team prefers Telegram alerts"]
}
            `,
          },
        },
        {
          title: 'Summaries must record decisions, not generic prose',
          paragraphs: [
            'A strong summary says what changed, what remains open, and which assumptions were validated or rejected. If a summary sounds like meeting minutes, retrieval quality will be poor.',
          ],
        },
        {
          title: 'Retrieve on intent, not on keyword overlap alone',
          paragraphs: [
            'A search that only matches terms will often return the longest and noisiest memory. Retrieval should combine goal, system area, recency, and trust level before injecting anything back into the prompt.',
          ],
        },
      ],
      checklist: [
        'Expire or archive stale working-state entries aggressively.',
        'Store memory with metadata such as source, trust level, and last validation date.',
        'Promote procedures only after they survive repeated use.',
        'Log which retrieved memories actually changed the final outcome.',
      ],
      faq: [
        {
          q: 'Why does the agent “forget” even when there is a memory system?',
          a: 'Because memory only helps if the right record is retrieved at the right time. A huge store with weak retrieval feels identical to forgetting.',
        },
        {
          q: 'Should every chat transcript become durable memory?',
          a: 'No. Most transcripts contain local noise. Promote distilled facts and reusable procedures, not whole conversations.',
        },
        {
          q: 'What is a good first metric for memory quality?',
          a: 'Measure whether retrieval reduced repeated clarification work or prevented a previously seen mistake. That is more meaningful than counting stored records.',
        },
      ],
      next: [
        '**[Self-Learning Loop](/en/tutorials/skills/self-learning-loop)** — Turn repeated examples into promoted skills.',
        '**[Parallel Sub-Agents](/en/tutorials/advanced/parallel-sub-agents)** — Keep memory bounded when several workers run at once.',
        '**[Architecture Walkthrough](/en/tutorials/advanced/architecture-walkthrough)** — See where context and memory boundaries live in code.',
      ],
    },
    zh: {
      introTitle: '记忆质量的大头，其实是决定“哪些东西不要留”',
      intro: [
        'Agent 失败往往不是因为完全没有记忆，而是因为活跃上下文里塞满了无关细节，真正重要的事实要么没被晋升、要么根本没被检索回来。',
        '好的记忆系统要把瞬时工作状态、会话摘要、可复用知识和长期记录拆开。一旦这几层边界清楚，检索反而更简单、更便宜。',
      ],
      when: [
        '长会话越来越飘，因为 prompt 被陈旧细节塞满了。',
        '团队想沉淀可复用知识，但不想每次都粘贴超长聊天记录。',
        '你需要一套规则，明确什么放短期上下文，什么进入长期记忆。',
      ],
      workflow: [
        '把活跃上下文控制在当前任务必需范围内。',
        '把已完成工作总结成紧凑的状态迁移。',
        '把稳定事实和可复用流程晋升到长期记忆。',
        '只检索和当前目标真正相关的记忆切片。',
      ],
      steps: [
        {
          title: '把工作态和长期记忆分开',
          paragraphs: [
            '工作态里应该是今天的文件、命令、待决策项和临时假设。长期记忆里则应该是以后还会反复用到的东西，比如系统约束、审批流程和团队偏好。',
          ],
          code: {
            lang: 'json',
            content: `
{
  "workingState": ["当前分支", "正在处理的事故", "待修复测试"],
  "durableMemory": ["生产部署必须审批", "团队偏好 Telegram 告警"]
}
            `,
          },
        },
        {
          title: '摘要必须记录决策，而不是流水账',
          paragraphs: [
            '高质量摘要要说明：改了什么、还剩什么、哪些假设被验证或否定。如果摘要读起来像会议纪要，检索效果通常都很差。',
          ],
        },
        {
          title: '检索不能只靠关键词重叠',
          paragraphs: [
            '只按关键词命中的检索，经常会把又长又吵的记忆重新塞回来。应该结合目标、系统区域、时间新鲜度和信任等级做筛选。',
          ],
        },
      ],
      checklist: [
        '对过期工作态做积极清理或归档。',
        '给记忆条目加上来源、信任级别和最后验证时间。',
        '只有重复验证过的流程才晋升为可复用 procedure。',
        '持续记录哪些被检索到的记忆真的改变了结果。',
      ],
      faq: [
        {
          q: '明明有记忆系统，为什么 agent 还是会“忘事”？',
          a: '因为记忆是否有用，取决于能不能在正确时机取回正确记录。存储很多但检索很弱，体感上和“没有记住”几乎一样。',
        },
        {
          q: '每段聊天都应该进长期记忆吗？',
          a: '不应该。大多数聊天记录都是局部噪声。应该晋升的是提炼后的事实和可复用流程，而不是整段对话。',
        },
        {
          q: '衡量记忆质量，最先该看什么指标？',
          a: '先看它有没有减少重复澄清、有没有避免过去见过的错误。这比单纯统计存了多少条记录更有意义。',
        },
      ],
      next: [
        '**[自学习闭环机制](/zh/tutorials/skills/self-learning-loop)** — 看重复样本如何晋升成技能。',
        '**[并行子 Agent](/zh/tutorials/advanced/parallel-sub-agents)** — 多 worker 并发时如何控制记忆边界。',
        '**[Hermes 架构拆解](/zh/tutorials/advanced/architecture-walkthrough)** — 看上下文和记忆在代码里怎么落位。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'advanced/parallel-sub-agents',
    meta: {
      title: 'Parallel Sub-Agents: Run 5 Tasks at Once',
      titleZh: '并行子 Agent：5 个任务同时跑',
      slug: 'parallel-sub-agents',
      description:
        'Break work into parallel branches, assign bounded ownership, and merge results without turning the main agent into a bottleneck.',
      descriptionZh:
        '把工作拆成并行分支，给每个子 Agent 明确边界，再把结果合并回来，避免主 Agent 变成瓶颈。',
      category: 'advanced',
      tags: ['advanced', 'parallelism', 'subagents', 'orchestration'],
      difficulty: 'advanced',
      readingTime: 15,
      series: 'advanced',
      seriesOrder: 4,
      featured: false,
    },
    en: {
      introTitle: 'Parallelism works only when ownership is explicit',
      intro: [
        'Spawning five workers is easy. Merging five workers that all touched the same responsibility is where teams lose time. Parallel sub-agents help only when each branch has a bounded question or write scope.',
        'The main agent should keep the critical path local, delegate non-blocking slices, and integrate only the pieces that materially advance the goal.',
      ],
      when: [
        'You have several independent questions or code changes that do not share the same write set.',
        'The main rollout is blocked by breadth, not by one deeply sequential problem.',
        'You want faster progress without turning every task into manual coordination overhead.',
      ],
      workflow: [
        'Keep the immediate blocking task on the main thread.',
        'Delegate bounded side tasks with explicit ownership and outputs.',
        'Let workers run in parallel while the main agent continues useful local work.',
        'Merge completed results only after checking that ownership boundaries held.',
      ],
      steps: [
        {
          title: 'Split by responsibility, not by file count',
          paragraphs: [
            'A good worker owns a concrete module, route, or question. “Take half the repository” is not a delegation strategy. The branch should be small enough that the worker knows exactly when it is done.',
          ],
          code: {
            lang: 'json',
            content: `
[
  { "worker": "A", "owns": "billing API routes" },
  { "worker": "B", "owns": "admin dashboard copy updates" },
  { "worker": "C", "owns": "search indexing verification" }
]
            `,
          },
        },
        {
          title: 'Do not delegate the next blocking step',
          paragraphs: [
            'If the main agent cannot proceed until a result comes back, that task usually belongs on the critical path and should stay local. Delegation shines on sidecar tasks that unblock later stages without stalling the present one.',
          ],
        },
        {
          title: 'Merge with a contract, not with hope',
          paragraphs: [
            'Every worker should return changed files, assumptions, and unresolved risks. That gives the main agent a deterministic handoff instead of a vague “done” signal.',
          ],
        },
      ],
      checklist: [
        'Assign each worker a disjoint write scope whenever possible.',
        'Tell workers they are not alone in the codebase and must not revert unrelated edits.',
        'Reuse existing workers for follow-up questions when context matters.',
        'Measure whether delegation shortened the critical path, not just whether more work happened in parallel.',
      ],
      faq: [
        {
          q: 'How many workers should I spawn?',
          a: 'Only as many as you have genuinely independent branches. More workers than clear ownership boundaries usually creates merge cost instead of speed.',
        },
        {
          q: 'What if two workers need the same file?',
          a: 'That is a warning sign. Either keep the task local or restructure ownership so one worker owns the file and the other returns analysis only.',
        },
        {
          q: 'When should I wait for a worker immediately?',
          a: 'Only when the next critical-path action truly depends on that result. Waiting by reflex kills the value of delegation.',
        },
      ],
      next: [
        '**[Multi-Agent Orchestration](/en/tutorials/advanced/multi-agent-orchestration)** — See the broader control loop around worker delegation.',
        '**[Memory System Deep Dive](/en/tutorials/advanced/memory-system-deep-dive)** — Keep each worker context bounded.',
        '**[Architecture Walkthrough](/en/tutorials/advanced/architecture-walkthrough)** — Trace where worker execution lives in the runtime.',
      ],
    },
    zh: {
      introTitle: '并行真正起作用的前提，是边界必须清楚',
      intro: [
        '拉起五个 worker 很容易，真正耗时间的是把五个同时碰同一块职责的 worker 合回来。并行子 Agent 只有在每条分支都有明确问题范围或写入边界时才有价值。',
        '主 Agent 应该把关键路径留在本地，委派那些不阻塞当前动作的侧任务，最后只整合真正推进目标的结果。',
      ],
      when: [
        '你手头有几个彼此独立的问题或代码变更，而且写入范围不重叠。',
        '当前瓶颈来自任务面太宽，而不是某个深度串行问题。',
        '你想提速，但又不想把所有收益都花在人工协调上。',
      ],
      workflow: [
        '把当前最阻塞的步骤留在主线程。',
        '把侧任务按清晰边界委派出去，并要求明确输出。',
        '主 Agent 继续做不重叠的本地工作，worker 并行运行。',
        '检查边界是否守住后，再把结果合并回来。',
      ],
      steps: [
        {
          title: '按职责拆，不要按文件数拆',
          paragraphs: [
            '好的 worker 应该拥有一个具体模块、路由或问题。“仓库你做一半我做一半”不是委派策略。任务要小到 worker 自己知道什么叫完成。',
          ],
          code: {
            lang: 'json',
            content: `
[
  { "worker": "A", "owns": "billing API routes" },
  { "worker": "B", "owns": "admin dashboard copy updates" },
  { "worker": "C", "owns": "search indexing verification" }
]
            `,
          },
        },
        {
          title: '不要把下一个阻塞步骤外包出去',
          paragraphs: [
            '如果主 Agent 只有等结果回来才能继续，那这个任务通常就在关键路径上，更适合本地完成。委派最适合处理那些能为后续铺路、但不会卡住当前动作的分支任务。',
          ],
        },
        {
          title: '靠契约合并，不要靠运气合并',
          paragraphs: [
            '每个 worker 回来时都要带上改了哪些文件、有哪些假设、剩下哪些风险。这样主 Agent 接手的是确定性交接，而不是一句模糊的“做完了”。',
          ],
        },
      ],
      checklist: [
        '尽量让每个 worker 的写入范围互斥。',
        '明确告诉 worker：代码库里不止它一个人，不要回滚无关修改。',
        '需要上下文延续时，优先复用已有 worker 而不是新开一个。',
        '衡量委派是否缩短了关键路径，而不是只看是不是“并行得很热闹”。',
      ],
      faq: [
        {
          q: '一次到底该开几个 worker？',
          a: '只开和“真实独立分支”数量相匹配的 worker。worker 数超过清晰边界数，通常只会增加合并成本。',
        },
        {
          q: '如果两个 worker 都要改同一个文件怎么办？',
          a: '这是警报。要么把任务留在本地，要么重构边界，让其中一个负责修改，另一个只返回分析结果。',
        },
        {
          q: '什么时候应该立刻等待 worker 返回？',
          a: '只有当关键路径的下一步确实依赖那个结果时。条件反射式地等待，会直接抹掉委派带来的收益。',
        },
      ],
      next: [
        '**[多 Agent 编排](/zh/tutorials/advanced/multi-agent-orchestration)** — 看 worker 委派外围的大控制循环。',
        '**[记忆系统深度拆解](/zh/tutorials/advanced/memory-system-deep-dive)** — 多 worker 并发时怎么控制上下文边界。',
        '**[Hermes 架构拆解](/zh/tutorials/advanced/architecture-walkthrough)** — 追踪 worker 执行在运行时里怎么落位。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'advanced/architecture-walkthrough',
    meta: {
      title: 'Architecture Walkthrough: Hermes Source Code',
      titleZh: '源码解读：Hermes Agent 架构拆解',
      slug: 'architecture-walkthrough',
      description:
        'Walk through the major layers of Hermes so you can trace requests, agent decisions, tool execution, and content rendering end to end.',
      descriptionZh:
        '从头梳理 Hermes 的主要层次，理解请求流、Agent 决策、工具执行和内容渲染如何串起来。',
      category: 'advanced',
      tags: ['advanced', 'architecture', 'source-code', 'runtime'],
      difficulty: 'advanced',
      readingTime: 16,
      series: 'advanced',
      seriesOrder: 5,
      featured: false,
    },
    en: {
      introTitle: 'Read the system as a request pipeline, not as a folder tree',
      intro: [
        'Large agent codebases look chaotic if you read them file by file. The faster way is to trace one real request from entrypoint to response and ask where planning, tool execution, content loading, and rendering each happen.',
        'That perspective makes architecture decisions visible: which layer owns routing, which layer owns content metadata, and which layer is allowed to touch external systems.',
      ],
      when: [
        'You need to onboard quickly and want a mental model before reading every module.',
        'You are debugging a cross-cutting bug that spans routing, content loading, and rendering.',
        'You want to change architecture safely without breaking implicit boundaries.',
      ],
      workflow: [
        'Start at the inbound route or page entrypoint.',
        'Trace how data is loaded, normalized, and passed to the rendering layer.',
        'Find where tool execution and external integration boundaries live.',
        'Map the observability points that explain failures in production.',
      ],
      steps: [
        {
          title: 'Trace one request end to end',
          paragraphs: [
            'Pick a concrete user flow such as “open a tutorial page” or “check indexing status.” Follow the inputs through routing, loaders, domain helpers, and finally the UI surface. Architecture becomes much clearer once you follow one path completely.',
          ],
          code: {
            lang: 'text',
            content: `
route entry -> content loader -> metadata builder -> page renderer
            `,
          },
        },
        {
          title: 'Mark the boundaries that should remain stable',
          paragraphs: [
            'Stable boundaries usually include content parsing, SEO helpers, tool wrappers, and route-level composition. Those are the places where accidental coupling creates the most downstream pain.',
          ],
        },
        {
          title: 'Write down the failure map',
          paragraphs: [
            'For each boundary, ask what can fail: missing content, invalid frontmatter, stale sitemap data, slow external dependencies, or rendering mismatches. That map becomes your operating manual during incidents.',
          ],
        },
      ],
      checklist: [
        'Map the entrypoint, data loaders, helpers, and renderers for at least one full request.',
        'Document which modules own content, SEO, integrations, and presentation.',
        'Keep boundary-crossing helpers small and testable.',
        'Update the architecture notes when a new subsystem changes the request flow.',
      ],
      faq: [
        {
          q: 'Should I start by reading every file under src/?',
          a: 'No. Start with one request path and only branch out when you find a boundary you do not understand. That gives you a useful mental graph much faster.',
        },
        {
          q: 'What are the highest-risk architectural changes?',
          a: 'Anything that mixes content loading, route composition, and external side effects into one layer. Those changes are hard to test and hard to roll back.',
        },
        {
          q: 'How do I know a boundary is wrong?',
          a: 'If the same module needs knowledge of routing, persistence, rendering, and network behavior all at once, the boundary is probably leaking.',
        },
      ],
      next: [
        '**[MCP Integration](/en/tutorials/advanced/mcp-integration)** — Follow one extension path into external systems.',
        '**[Parallel Sub-Agents](/en/tutorials/advanced/parallel-sub-agents)** — See how orchestration fits into runtime flow.',
        '**[Security Hardening Checklist](/en/guides/security/hardening-checklist)** — Review the architecture with production risk in mind.',
      ],
    },
    zh: {
      introTitle: '读系统时，不要盯文件树，要盯“请求流水线”',
      intro: [
        '大型 Agent 代码库如果一页页按文件看，很容易显得混乱。更快的方法是抓一条真实请求，从入口一路跟到响应，问清楚规划、工具执行、内容加载和渲染分别发生在哪一层。',
        '一旦用这个视角看，很多架构决策会立刻变清楚：谁负责路由，谁负责内容元数据，谁允许碰外部系统。',
      ],
      when: [
        '你需要快速上手，希望先建立心智模型，再去逐个模块深挖。',
        '你正在查一个跨路由、内容加载和渲染层的联动 bug。',
        '你想安全地改架构，但不想打破隐式边界。',
      ],
      workflow: [
        '从页面入口或请求入口开始。',
        '跟踪数据如何被加载、归一化，再传给渲染层。',
        '找出工具执行和外部集成的边界位置。',
        '标记生产故障最需要的观测点。',
      ],
      steps: [
        {
          title: '先完整跟一条真实请求',
          paragraphs: [
            '挑一个具体流，比如“打开一篇教程”或者“检查索引状态”。顺着输入一路看过路由、loader、领域辅助函数，最后到 UI 呈现。把一条链路走完整，架构马上就清楚很多。',
          ],
          code: {
            lang: 'text',
            content: `
route entry -> content loader -> metadata builder -> page renderer
            `,
          },
        },
        {
          title: '标记哪些边界应该保持稳定',
          paragraphs: [
            '通常最该稳定的是内容解析、SEO 辅助、工具包装层和路由级组合层。这里一旦耦合失控，后面的痛苦会成倍放大。',
          ],
        },
        {
          title: '顺手把失败地图画出来',
          paragraphs: [
            '对每个边界都问一句：这里会怎么坏？可能是内容缺失、frontmatter 非法、sitemap 过期、外部依赖变慢、渲染结果不一致。这张图就是你之后排障时的操作手册。',
          ],
        },
      ],
      checklist: [
        '至少完整画出一条请求链路上的入口、loader、helper 和 renderer。',
        '写清哪些模块分别负责内容、SEO、集成和展示。',
        '跨边界 helper 保持小而可测试。',
        '每次新子系统改变请求流时，同步更新架构说明。',
      ],
      faq: [
        {
          q: '是不是应该先把 src/ 下面每个文件都看一遍？',
          a: '不应该。先抓一条请求路径，只有碰到不懂的边界时再扩展。这样更快形成真正有用的心智图。',
        },
        {
          q: '哪类架构改动风险最高？',
          a: '凡是把内容加载、路由组合和外部副作用揉到同一层的改动都很危险。它们既难测试，也难回滚。',
        },
        {
          q: '怎么判断一个边界已经错了？',
          a: '如果同一个模块同时知道路由、持久化、渲染和网络行为，它大概率就在边界漏水。',
        },
      ],
      next: [
        '**[MCP 集成实战](/zh/tutorials/advanced/mcp-integration)** — 沿着一条扩展链路看到外部系统。',
        '**[并行子 Agent](/zh/tutorials/advanced/parallel-sub-agents)** — 看编排是怎么挂进运行时的。',
        '**[安全加固清单](/zh/guides/security/hardening-checklist)** — 从生产风险角度再看一遍架构。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'deployment/vps-setup',
    meta: {
      title: 'Deploy Hermes 24/7 on a $5 VPS',
      titleZh: '$5/月：7×24 小时运行你的 AI Agent',
      slug: 'vps-setup',
      description:
        'Deploy Hermes to an inexpensive VPS with systemd, reverse proxying, log rotation, and a practical low-cost operations checklist.',
      descriptionZh:
        '把 Hermes 部署到低成本 VPS，上好 systemd、反向代理、日志轮转和一套实用的低价运维清单。',
      category: 'deployment',
      tags: ['deployment', 'vps', 'linux', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 14,
      featured: false,
    },
    en: {
      introTitle: 'A cheap VPS is viable if you keep the footprint boring',
      intro: [
        'A $5 VPS will not forgive waste. The deployment works when the service stays simple: one process manager, one reverse proxy, constrained logs, and no unnecessary background jobs.',
        'The value of a VPS is cost control and predictability. You trade away automatic scale, so the setup must be easy to inspect and easy to restart at 2 a.m.',
      ],
      when: [
        'You need Hermes online continuously but do not want to pay serverless burst pricing.',
        'The workload is steady and small enough to fit on one modest Linux box.',
        'You prefer direct SSH and systemd operations over managed platform abstractions.',
      ],
      workflow: [
        'Provision a minimal Linux host and a non-root application user.',
        'Install Node, fetch the project, and build the production bundle.',
        'Run Hermes behind systemd and a reverse proxy such as Caddy or Nginx.',
        'Add backups, log rotation, health checks, and basic alerting.',
      ],
      steps: [
        {
          title: 'Prepare the host before copying code',
          paragraphs: [
            'Create a dedicated user, enable your firewall, and decide where app code, logs, and environment files will live. Host layout drift becomes operational pain later.',
          ],
          code: {
            lang: 'bash',
            content: `
sudo adduser hermes
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
            `,
          },
        },
        {
          title: 'Use systemd for boring restarts',
          paragraphs: [
            'A small VPS does not need a complicated orchestrator. A systemd unit with restart-on-failure, clear working directory, and environment file support is usually enough.',
          ],
        },
        {
          title: 'Treat DNS and HTTPS as part of the deployment',
          paragraphs: [
            'An app that only works on localhost is not deployed. Confirm DNS records, TLS issuance, and external reachability before calling the server production-ready.',
          ],
        },
      ],
      checklist: [
        'Run the service as a non-root user.',
        'Enable automatic restarts and persistent logs.',
        'Verify DNS, HTTPS, and external health checks from outside the box.',
        'Back up environment files and any local state you cannot reconstruct.',
      ],
      faq: [
        {
          q: 'Can a $5 VPS handle Hermes reliably?',
          a: 'Yes for light, steady workloads. Once tasks become bursty, memory-heavy, or latency-sensitive, you will feel the limits quickly.',
        },
        {
          q: 'Should I use PM2 instead of systemd?',
          a: 'Systemd is enough for many deployments and reduces moving parts. PM2 can still be fine, but it is not required if systemd already gives you restart and logging behavior.',
        },
        {
          q: 'What usually breaks first on a cheap VPS?',
          a: 'Disk and memory pressure show up before CPU in many setups, especially when logs are unbounded or builds happen on the same machine.',
        },
      ],
      next: [
        '**[Docker Production Deployment](/en/guides/deployment/docker-production)** — Move from a single process to a containerized setup.',
        '**[Modal Serverless Guide](/en/guides/deployment/modal-serverless)** — Compare with an on-demand runtime.',
        '**[Security Hardening Checklist](/en/guides/security/hardening-checklist)** — Lock the host down before public exposure.',
      ],
    },
    zh: {
      introTitle: '便宜 VPS 能跑，但前提是系统必须“朴素”',
      intro: [
        '$5 的 VPS 容错空间非常小。想跑稳，就要把部署做得足够朴素：一个进程管理器、一个反向代理、受控日志、尽量少的后台任务。',
        'VPS 的价值是成本可控、行为可预测。你放弃了平台自动扩缩容，所以整套东西必须在凌晨两点也能靠 SSH 看懂、靠几条命令恢复。',
      ],
      when: [
        '你需要 Hermes 7x24 在线，但不想承担无服务器按量突增成本。',
        '工作负载稳定且不大，一台小 Linux 机器就能扛住。',
        '你更喜欢直接 SSH + systemd，而不是托管平台抽象。',
      ],
      workflow: [
        '准备一台最小化 Linux 主机，并创建非 root 应用用户。',
        '安装 Node，拉代码，构建生产包。',
        '通过 systemd 和反向代理把 Hermes 跑起来。',
        '补上备份、日志轮转、健康检查和基础告警。',
      ],
      steps: [
        {
          title: '在复制代码前先把主机收拾干净',
          paragraphs: [
            '先创建独立用户、开防火墙，并决定应用代码、日志和环境变量文件放哪。主机目录结构如果一开始混乱，后面运维一定很痛。',
          ],
          code: {
            lang: 'bash',
            content: `
sudo adduser hermes
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
            `,
          },
        },
        {
          title: '用 systemd 做“无聊但可靠”的重启',
          paragraphs: [
            '小 VPS 不需要复杂编排。一个带失败自动重启、明确工作目录和环境文件支持的 systemd unit，通常就够了。',
          ],
        },
        {
          title: '把 DNS 和 HTTPS 视为部署的一部分',
          paragraphs: [
            '只在 localhost 能打开，不叫部署完成。上线前必须确认 DNS 解析、证书签发和外网可达性。',
          ],
        },
      ],
      checklist: [
        '服务必须跑在非 root 用户下。',
        '打开自动重启和持久化日志。',
        '从机器外部验证 DNS、HTTPS 和健康检查。',
        '对环境变量文件和不可重建的本地状态做备份。',
      ],
      faq: [
        {
          q: '$5 的 VPS 真能稳定跑 Hermes 吗？',
          a: '对于轻量、平稳的负载可以。一旦任务变得突发、吃内存或对时延敏感，瓶颈会很快出现。',
        },
        {
          q: '要不要上 PM2？',
          a: '很多部署场景下 systemd 就够了，而且减少一个移动部件。PM2 也可以用，但不是必须。',
        },
        {
          q: '便宜 VPS 最先出问题的通常是什么？',
          a: '很多时候不是 CPU，而是磁盘和内存压力，尤其在日志无限增长或构建也在同一台机器上进行时。',
        },
      ],
      next: [
        '**[Docker 生产部署](/zh/guides/deployment/docker-production)** — 从单进程走向容器化。',
        '**[Modal 无服务器部署](/zh/guides/deployment/modal-serverless)** — 对比按需运行形态。',
        '**[安全加固清单](/zh/guides/security/hardening-checklist)** — 对外开放前先把主机锁紧。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'deployment/docker-production',
    meta: {
      title: 'Production Docker Deployment with Monitoring',
      titleZh: 'Docker 生产部署 + Prometheus 监控',
      slug: 'docker-production',
      description:
        'Run Hermes with Docker Compose, environment isolation, health checks, and lightweight monitoring suitable for production.',
      descriptionZh:
        '用 Docker Compose 运行 Hermes，并补齐环境隔离、健康检查和适合生产的小型监控体系。',
      category: 'deployment',
      tags: ['deployment', 'docker', 'monitoring', 'advanced'],
      difficulty: 'advanced',
      readingTime: 15,
      featured: false,
    },
    en: {
      introTitle: 'Containers help when they reduce variance, not because they are fashionable',
      intro: [
        'Docker is useful when you want one repeatable runtime across laptops, CI, and production. It becomes overhead when the container hides simple operational failures instead of clarifying them.',
        'For Hermes, the production win is predictable packaging, environment isolation, and easier sidecar monitoring. Keep the stack small enough that you can still debug it under pressure.',
      ],
      when: [
        'You want the same runtime image across development, CI, and production.',
        'You need environment isolation and cleaner dependency management than a host install.',
        'You want to attach monitoring and reverse proxying without hand-managing every process.',
      ],
      workflow: [
        'Build one production image with only the runtime dependencies you need.',
        'Compose Hermes with a reverse proxy and lightweight observability services.',
        'Expose health checks and logs in a way operators can inspect quickly.',
        'Roll new images gradually and keep old images available for rollback.',
      ],
      steps: [
        {
          title: 'Build a lean runtime image',
          paragraphs: [
            'Multi-stage builds keep the runtime smaller and reduce surprise package drift. The image should contain the built app, runtime dependencies, and nothing else.',
          ],
          code: {
            lang: 'dockerfile',
            content: `
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD ["npm", "start"]
            `,
          },
        },
        {
          title: 'Make health checks and metrics first-class',
          paragraphs: [
            'A container that only “exists” is not healthy. Add HTTP health checks, structured logs, and at least one place where latency and failure counts are visible.',
          ],
        },
        {
          title: 'Promote images, not ad-hoc shell mutations',
          paragraphs: [
            'If production fixes happen through shell commands inside a running container, rollback becomes guesswork. Build a new image, tag it, and deploy that artifact instead.',
          ],
        },
      ],
      checklist: [
        'Use multi-stage builds and pin runtime dependencies.',
        'Expose a real health check, not just an open TCP port.',
        'Keep image tags and deployment history for rollbacks.',
        'Monitor restart loops, memory pressure, and reverse proxy errors.',
      ],
      faq: [
        {
          q: 'Do I need Kubernetes for Hermes?',
          a: 'Not by default. Docker Compose or a simple container platform is enough for many teams until scaling, tenancy, or policy requirements become more demanding.',
        },
        {
          q: 'What should Prometheus actually watch first?',
          a: 'Start with process health, request latency, error rate, restart count, and resource pressure. Fancy dashboards can wait until the basics are reliable.',
        },
        {
          q: 'What is the biggest Docker production mistake?',
          a: 'Treating the container as an SSH host. Once operators hotfix inside containers, the image no longer reflects reality and rollbacks stop being trustworthy.',
        },
      ],
      next: [
        '**[VPS Deployment Guide](/en/guides/deployment/vps-setup)** — Compare containerized and non-containerized operations.',
        '**[Modal Serverless Guide](/en/guides/deployment/modal-serverless)** — Decide whether serverless fits your workload better.',
        '**[Security Hardening Checklist](/en/guides/security/hardening-checklist)** — Reduce runtime risk before production traffic arrives.',
      ],
    },
    zh: {
      introTitle: '容器有用，是因为它降低运行时方差，不是因为它时髦',
      intro: [
        'Docker 真正的价值，在于让开发、CI 和生产尽量跑在同一运行时里。如果容器只是在把简单故障包得更难看懂，那它就是额外负担。',
        '对 Hermes 而言，生产环境里的收益主要是可预测打包、环境隔离，以及更容易挂侧车监控。但整个栈仍然要保持足够小，保证你在压力下也能排障。',
      ],
      when: [
        '你希望开发、CI、生产三处使用同一镜像运行时。',
        '你需要比宿主机安装更干净的环境隔离和依赖管理。',
        '你想更方便地接反向代理和监控组件，而不是手工管理多个进程。',
      ],
      workflow: [
        '构建一个只包含必要运行时依赖的生产镜像。',
        '通过 Compose 组合 Hermes、反向代理和轻量监控组件。',
        '让健康检查和日志能被运维快速观察。',
        '按镜像版本做发布，保留旧版本用于回滚。',
      ],
      steps: [
        {
          title: '先把运行时镜像做瘦',
          paragraphs: [
            '多阶段构建能让最终镜像更小，也能减少依赖漂移。最终镜像里应该只有构建产物、运行时依赖和必须文件，不要塞一堆调试杂物。',
          ],
          code: {
            lang: 'dockerfile',
            content: `
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
CMD ["npm", "start"]
            `,
          },
        },
        {
          title: '把健康检查和指标做成一等公民',
          paragraphs: [
            '一个容器“还活着”并不等于健康。至少要有 HTTP 健康检查、结构化日志和一个能看见延迟与失败数的地方。',
          ],
        },
        {
          title: '发布镜像，不要在线上容器里临时改命令',
          paragraphs: [
            '如果线上修复依赖于进容器手改，回滚就会变成猜谜游戏。正确方式是构建新镜像、打 tag、部署制品。',
          ],
        },
      ],
      checklist: [
        '使用多阶段构建，并固定运行时依赖版本。',
        '暴露真正的健康检查，而不是只开一个 TCP 端口。',
        '保留镜像 tag 和部署历史，方便回滚。',
        '监控重启循环、内存压力和反向代理错误。',
      ],
      faq: [
        {
          q: '跑 Hermes 一定要上 Kubernetes 吗？',
          a: '默认不需要。很多团队用 Docker Compose 或简单容器平台就足够，只有在扩缩容、多租户或策略要求更复杂时才需要更重的编排。',
        },
        {
          q: 'Prometheus 第一批应该盯什么？',
          a: '先盯进程健康、请求延迟、错误率、重启次数和资源压力。花哨大盘可以后面再补。',
        },
        {
          q: 'Docker 生产环境里最常见的错误是什么？',
          a: '把容器当成 SSH 主机来修。只要运维开始在线上容器里打热补丁，镜像就不再代表真实环境，回滚也就不再可信。',
        },
      ],
      next: [
        '**[VPS 部署指南](/zh/guides/deployment/vps-setup)** — 对比容器化与非容器化运维。',
        '**[Modal 无服务器部署](/zh/guides/deployment/modal-serverless)** — 判断你的负载是否更适合按需运行。',
        '**[安全加固清单](/zh/guides/security/hardening-checklist)** — 在接生产流量前先减风险。',
      ],
    },
  },
  {
    type: 'guides',
    filePath: 'security/hardening-checklist',
    meta: {
      title: 'Security Hardening Checklist (32 Items)',
      titleZh: '安全加固清单：32 项逐个检查',
      slug: 'hardening-checklist',
      description:
        'A production-oriented hardening checklist for Hermes covering secrets, identity, network exposure, runtime isolation, logging, and incident response.',
      descriptionZh:
        '一份面向生产环境的 Hermes 安全加固清单，覆盖密钥、身份、网络暴露、运行时隔离、日志和事故响应。',
      category: 'security',
      tags: ['security', 'hardening', 'production', 'advanced'],
      difficulty: 'advanced',
      readingTime: 14,
      featured: false,
    },
    en: {
      introTitle: 'Security hardening is about removing easy failure modes',
      intro: [
        'Most production incidents are not Hollywood-grade attacks. They are plain mistakes: leaked tokens, overly broad permissions, public dashboards, missing audit logs, and forgotten old containers.',
        'Use this checklist as a review frame before exposing Hermes to real users or real infrastructure. The point is not perfection; the point is reducing cheap wins for an attacker and reducing confusion for your own team.',
      ],
      when: [
        'Hermes is about to touch live infrastructure, customer data, or public endpoints.',
        'You already deployed something that works and now need to make it survive production reality.',
        'You want a repeatable review that different operators can run before each release.',
      ],
      workflow: [
        'Review identity, secrets, and approval boundaries first.',
        'Reduce network exposure and lock down runtime permissions.',
        'Ensure logs, alerts, and backups support incident response.',
        'Repeat the checklist on every material architecture change.',
      ],
      steps: [
        {
          title: 'Start with secrets and identity',
          paragraphs: [
            'Rotate tokens, remove unused credentials, and verify that each integration has the minimum permissions required. Most teams harden the host before they harden the service accounts, which is backwards.',
          ],
          code: {
            lang: 'text',
            content: `
Identity
- least-privilege service accounts
- separate read-only and write-capable tokens
- mandatory approval for destructive actions
            `,
          },
        },
        {
          title: 'Then reduce exposure',
          paragraphs: [
            'Close ports you do not need, require HTTPS, avoid public admin interfaces, and prefer private network paths for internal systems. Exposure reduction usually beats clever detection.',
          ],
        },
        {
          title: 'Finally make incidents observable',
          paragraphs: [
            'If something goes wrong, you need enough evidence to know who called what, which token was used, and which system changed. Hardening without auditability is incomplete.',
          ],
        },
      ],
      checklist: [
        'Separate environments and credentials for development, staging, and production.',
        'Require approval for destructive shell commands and write-capable external actions.',
        'Disable or protect debug endpoints, admin panels, and unused services.',
        'Retain logs long enough to investigate incidents and prove what happened.',
      ],
      faq: [
        {
          q: 'Why call it 32 items if this page does not list all 32 inline?',
          a: 'Because the important part is the review frame: identity, secrets, runtime, network, logging, recovery, and process. Teams usually expand each group into their own environment-specific line items.',
        },
        {
          q: 'What is the first hardening win for a small team?',
          a: 'Least-privilege credentials and explicit approval on destructive actions. Those two controls prevent a large class of avoidable failures.',
        },
        {
          q: 'Can I harden later after launch?',
          a: 'You can, but the cost is usually higher because bad exposure patterns become part of the deployment shape. It is cheaper to make a secure default path now.',
        },
      ],
      next: [
        '**[VPS Deployment Guide](/en/guides/deployment/vps-setup)** — Apply the checklist to a single-host deployment.',
        '**[Docker Production Deployment](/en/guides/deployment/docker-production)** — Apply the checklist to a containerized runtime.',
        '**[Architecture Walkthrough](/en/tutorials/advanced/architecture-walkthrough)** — Review the runtime with risk boundaries in mind.',
      ],
    },
    zh: {
      introTitle: '安全加固，本质上是在移除“低成本失误入口”',
      intro: [
        '大多数生产事故都不是电影级攻击，而是普通失误：token 泄露、权限过大、面板公网暴露、没有审计日志、旧容器忘了删。',
        '把这份清单当成上线前的复盘框架。目标不是一步到位地完美，而是减少攻击者的廉价切入口，也减少你自己团队在出事时的混乱。',
      ],
      when: [
        'Hermes 即将接触真实基础设施、用户数据或公网入口。',
        '你已经把服务跑起来，现在要让它扛得住生产现实。',
        '你希望不同操作者在发版前都能按同一套标准复核。',
      ],
      workflow: [
        '先审身份、密钥和审批边界。',
        '再缩减网络暴露和运行时权限。',
        '补齐日志、告警和备份，支持事故响应。',
        '每次架构有实质变化后都重新过一遍。',
      ],
      steps: [
        {
          title: '先从密钥和身份下手',
          paragraphs: [
            '轮换 token、清掉不用的凭证，并确认每个集成都只拿到最小权限。很多团队喜欢先加固主机，再去看服务账号权限，这个顺序通常是反的。',
          ],
          code: {
            lang: 'text',
            content: `
Identity
- least-privilege service accounts
- separate read-only and write-capable tokens
- mandatory approval for destructive actions
            `,
          },
        },
        {
          title: '然后再减少暴露面',
          paragraphs: [
            '关闭不需要的端口、强制 HTTPS、不要把管理界面裸露在公网、内部系统优先走私网。减少暴露面往往比“聪明监测”更值。',
          ],
        },
        {
          title: '最后让事故变得可观察',
          paragraphs: [
            '一旦出事，你必须能知道：谁调用了什么、用了哪个 token、哪个系统被改了。没有审计性的加固是不完整的。',
          ],
        },
      ],
      checklist: [
        '开发、预发、生产环境分离，并使用不同凭证。',
        '破坏性 shell 命令和可写外部操作必须审批。',
        '关闭或保护调试端点、管理面板和未使用服务。',
        '日志保留时间要足够支持事后调查和责任追踪。',
      ],
      faq: [
        {
          q: '为什么叫 32 项，但正文里没一条条全展开？',
          a: '因为真正有用的是审查框架：身份、密钥、运行时、网络、日志、恢复和流程。大多数团队会基于这个框架再扩成符合自己环境的 32 条甚至更多条目。',
        },
        {
          q: '小团队最值得先做的加固动作是什么？',
          a: '最小权限凭证和破坏性动作审批。这两个控制能挡住一大类原本完全可以避免的事故。',
        },
        {
          q: '能不能先上线，后面再加固？',
          a: '当然可以，但代价通常更高，因为错误暴露模式会先固化进部署形态。安全默认路径越晚补，迁移越痛。',
        },
      ],
      next: [
        '**[VPS 部署指南](/zh/guides/deployment/vps-setup)** — 把清单应用到单机部署。',
        '**[Docker 生产部署](/zh/guides/deployment/docker-production)** — 把清单应用到容器运行时。',
        '**[Hermes 架构拆解](/zh/tutorials/advanced/architecture-walkthrough)** — 从生产风险角度再看一遍运行时。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'skills/self-learning-loop',
    meta: {
      title: 'How the Self-Learning Loop Actually Works',
      titleZh: 'AI 怎么自己学会新技能？闭环机制详解',
      slug: 'self-learning-loop',
      description:
        'Understand how Hermes captures successful runs, turns them into drafts, and safely promotes them into reusable skills.',
      descriptionZh:
        '理解 Hermes 如何采集成功执行、生成技能草稿，并通过审核机制安全地沉淀为可复用技能。',
      category: 'skills',
      tags: ['skills', 'learning', 'memory', 'advanced'],
      difficulty: 'advanced',
      readingTime: 14,
      series: 'skills',
      seriesOrder: 4,
      featured: false,
    },
    en: {
      introTitle: 'The loop is really a controlled promotion pipeline',
      intro: [
        'Hermes does not magically become smarter after one good run. The useful part is a disciplined loop: capture successful examples, normalize them, ask a human or policy layer to review them, then promote only the stable pieces into a reusable skill.',
        'Once you treat learning as a pipeline instead of a mystery, you can decide where to log, where to summarize, and where to stop unsafe promotion before it reaches production.',
      ],
      when: [
        'Your team repeats the same prompt patterns every week and wants less copy-paste work.',
        'You want assistants to improve over time without silently mutating production behavior.',
        'You need an audit trail showing why a new skill exists and which examples produced it.',
      ],
      workflow: [
        'Capture high-quality task transcripts with outputs and operator feedback.',
        'Filter out one-off examples and cluster repeated patterns by intent.',
        'Generate a draft skill with explicit inputs, constraints, and recovery rules.',
        'Review, promote, monitor, and roll back the draft if it causes regressions.',
      ],
      steps: [
        {
          title: 'Capture only reviewed examples',
          paragraphs: [
            'Start with examples that already passed manual review. If you train from noisy, incomplete, or lucky runs, the loop will manufacture brittle skills faster than it creates value.',
            'Store the prompt, environment, tools used, expected output, and a short explanation of why the run was considered successful.',
          ],
          code: {
            lang: 'json',
            content: `
{
  "task": "summarize on-call incidents",
  "status": "approved",
  "inputs": {
    "timeWindow": "24h",
    "sources": ["pagerduty", "slack", "github"]
  },
  "notes": "Good example because it included impact, owner, and next action."
}
            `,
          },
        },
        {
          title: 'Promote patterns instead of raw transcripts',
          paragraphs: [
            'A reusable skill should describe a repeatable contract, not a verbatim chat log. Rewrite repeated examples into explicit sections such as goals, tool selection, formatting requirements, and failure handling.',
            'This is the moment to remove tenant-specific data and to encode guardrails that were implicit in the original run.',
          ],
        },
        {
          title: 'Add rollback and observation before wider rollout',
          paragraphs: [
            'Treat every new skill as a feature flag. Release it to a small slice of traffic, compare task success rate against the older path, and keep the previous version available for instant fallback.',
            'If the promotion loop cannot explain what changed, it is not ready for autonomous publishing.',
          ],
        },
      ],
      checklist: [
        'Keep raw examples separate from promoted skills so you can re-review the source material.',
        'Require a minimum number of repeated examples before generating a draft.',
        'Track precision, not just adoption: a widely used bad skill is still a regression.',
        'Version every promoted skill and record who approved it.',
      ],
      faq: [
        {
          q: 'How many examples should I collect before promoting a skill?',
          a: 'Five to ten reviewed examples is a practical starting point. Fewer than that usually means you are promoting noise instead of a stable pattern.',
        },
        {
          q: 'Can the loop run fully automatically?',
          a: 'It can automate draft generation and scoring, but production promotion should still have an approval boundary unless you already have very strong evaluation coverage.',
        },
        {
          q: 'What usually breaks first?',
          a: 'The failure mode is almost always over-generalization: a draft works on the seed examples but collapses when a real-world input is slightly different.',
        },
      ],
      next: [
        '**[Create Custom Skills](/en/tutorials/skills/create-custom-skills)** — Turn a reviewed draft into a maintainable skill package.',
        '**[Skill Development Best Practices](/en/tutorials/skills/skill-development-best-practices)** — Add tests, contracts, and release discipline.',
        '**[Memory System Deep Dive](/en/tutorials/advanced/memory-system-deep-dive)** — Understand where reusable examples should live.',
      ],
    },
    zh: {
      introTitle: '所谓自学习，本质上是“受控晋升流水线”',
      intro: [
        'Hermes 不会因为一次表现好就突然变聪明。真正有价值的是一条严格的闭环：先采集成功样本，再做归一化，再经过人工或策略层审核，最后只把稳定部分晋升成可复用技能。',
        '把“学习”理解成流水线，而不是神秘黑盒之后，你就能明确哪些地方该记录、哪些地方该总结、哪些地方必须拦截，避免不安全的技能直接进生产。',
      ],
      when: [
        '团队每周都在重复同一类提示词，希望减少机械复制。',
        '你希望助手能持续变好，但又不允许它悄悄改坏线上行为。',
        '你需要一条审计链，能解释一个新技能为什么出现、由哪些样本生成。',
      ],
      workflow: [
        '采集高质量任务轨迹，连同输出结果和操作人反馈一起保存。',
        '过滤一次性样本，按意图对重复模式进行聚类。',
        '把重复模式改写成技能草稿，明确输入、约束和失败处理。',
        '审核、晋升、观测，并在回归时快速回滚。',
      ],
      steps: [
        {
          title: '只采集已经审核通过的样本',
          paragraphs: [
            '起点必须是经过人工确认的成功案例。拿噪声样本、偶然跑通的样本、上下文缺失的样本去“学习”，只会更快地产生脆弱技能。',
            '至少保存 prompt、运行环境、调用过的工具、期望输出，以及一段“为什么算成功”的说明。',
          ],
          code: {
            lang: 'json',
            content: `
{
  "task": "汇总值班事故日报",
  "status": "approved",
  "inputs": {
    "timeWindow": "24h",
    "sources": ["pagerduty", "slack", "github"]
  },
  "notes": "这个样本合格，因为它明确写出了影响范围、负责人和下一步动作。"
}
            `,
          },
        },
        {
          title: '晋升的是“模式”，不是原始聊天记录',
          paragraphs: [
            '可复用技能应该描述稳定契约，而不是直接复制整段对话。把重复样本改写成目标、工具选择、输出格式、失败补救等显式结构。',
            '这一步也要顺手清理租户数据、个人信息和临时上下文，把原样本里隐含的护栏变成显式规则。',
          ],
        },
        {
          title: '先观测、可回滚，再扩大范围',
          paragraphs: [
            '把每个新技能都当成 feature flag。先给一小部分流量试跑，和旧路径对比任务成功率，再决定是否放量。',
            '如果这条学习链路说不清“改了什么”，就还没有准备好自动发布。',
          ],
        },
      ],
      checklist: [
        '原始样本和晋升后的技能分开存放，方便追溯。',
        '设置“最少重复样本数”，没有形成模式就不生成草稿。',
        '关注准确率，而不是只看使用量；被广泛调用的坏技能仍然是回归。',
        '每次晋升都做版本化，并记录审批人。',
      ],
      faq: [
        {
          q: '到底要多少样本才适合晋升成技能？',
          a: '实践里 5 到 10 个“经过审核的重复样本”是比较稳妥的起点。再少通常是在把噪声当模式。',
        },
        {
          q: '这条闭环能不能完全自动跑？',
          a: '草稿生成和评分可以自动化，但正式晋升到生产环境前，仍然建议保留审批边界，除非你已经有很强的评测覆盖。',
        },
        {
          q: '最常见的翻车点是什么？',
          a: '几乎都是“过度泛化”。草稿在种子样本上表现很好，但真实输入只要稍微偏一点，就开始失真。',
        },
      ],
      next: [
        '**[创建自定义 Skills](/zh/tutorials/skills/create-custom-skills)** — 把审核通过的草稿落成可维护技能包。',
        '**[Skill 开发最佳实践](/zh/tutorials/skills/skill-development-best-practices)** — 给技能补上测试、契约和发布纪律。',
        '**[记忆系统深度拆解](/zh/tutorials/advanced/memory-system-deep-dive)** — 看可复用样本应该存在哪里。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'automation/daily-report-system',
    meta: {
      title: 'Build an Automated Daily Report System',
      titleZh: '每天早上自动发日报，老板都惊了',
      slug: 'daily-report-system',
      description:
        'Build a morning digest pipeline that collects signals, summarizes the important changes, and sends a clean report automatically.',
      descriptionZh:
        '搭建一条晨报流水线：自动采集信号、提炼重点变化，并把日报稳定发送出去。',
      category: 'automation',
      tags: ['automation', 'reporting', 'cron', 'intermediate'],
      difficulty: 'intermediate',
      readingTime: 13,
      series: 'automation',
      seriesOrder: 2,
      featured: false,
    },
    en: {
      introTitle: 'A useful report is a data contract, not a prompt trick',
      intro: [
        'Most automated reports fail for one of two reasons: they collect too much raw data, or they never define what a “good morning digest” actually contains. Hermes helps only after you make those expectations explicit.',
        'The winning pattern is simple: collect a bounded set of signals, normalize them into a small schema, summarize only the deltas that matter, then send one final artifact to Slack, Telegram, or email.',
      ],
      when: [
        'You already read the same dashboards every morning and want one summary instead of five browser tabs.',
        'The report must be consistent enough that another operator can trust it without reading the raw logs.',
        'You need a delivery chain that can retry without regenerating everything from scratch.',
      ],
      workflow: [
        'Collect data from APIs, logs, issue trackers, and yesterday’s unfinished actions.',
        'Normalize all sources into one digest schema with owners, severity, and due dates.',
        'Ask Hermes to summarize changes, anomalies, blockers, and next actions.',
        'Publish the digest and keep the intermediate artifact for retries or audits.',
      ],
      steps: [
        {
          title: 'Define the digest schema first',
          paragraphs: [
            'Before you schedule anything, define what the report must always contain. A stable schema keeps Hermes from drifting into verbose prose on quiet days and missing action items on noisy days.',
          ],
          code: {
            lang: 'json',
            content: `
{
  "date": "2026-04-14",
  "highlights": [],
  "blockers": [],
  "owners": [],
  "followUps": []
}
            `,
          },
        },
        {
          title: 'Separate collection from summarization',
          paragraphs: [
            'Have one job collect raw material and write it to a file or object store, then let Hermes summarize from that artifact. This split makes retries cheap and prevents duplicate external API calls when delivery fails.',
          ],
        },
        {
          title: 'Send the report through one thin delivery layer',
          paragraphs: [
            'Slack, Telegram, and email should receive the same finalized digest. Keep formatting in the delivery layer and keep reasoning in the summarization layer so you can swap channels without rewriting prompts.',
          ],
        },
      ],
      checklist: [
        'Limit each source to the exact time window the report claims to cover.',
        'Store the pre-summary artifact so failed sends can be retried safely.',
        'Add explicit owner and due-date fields to every actionable item.',
        'Reject reports that have no highlights and no blockers unless that is genuinely expected.',
      ],
      faq: [
        {
          q: 'Should Hermes read raw dashboards directly every morning?',
          a: 'Only if those dashboards are already structured and cheap to query. In most teams, a separate collector process is easier to cache, test, and retry.',
        },
        {
          q: 'How long should a daily report be?',
          a: 'Aim for a one-screen digest with links to detail pages. If the report is longer than the operator’s morning attention span, it stops being a report and becomes a backlog dump.',
        },
        {
          q: 'What is the most common reliability issue?',
          a: 'Delivery and summarization are often coupled together. When the send step fails, teams regenerate the summary and accidentally produce inconsistent copies.',
        },
      ],
      next: [
        '**[Cron Scheduling Guide](/en/tutorials/automation/cron-scheduling)** — Put the report on a predictable schedule.',
        '**[Telegram Bot Setup](/en/tutorials/messaging/telegram-bot-setup)** — Deliver the digest to phones first.',
        '**[Server Monitoring & Smart Alerts](/en/tutorials/automation/server-monitoring-alerts)** — Reuse the same pipeline for incident summaries.',
      ],
    },
    zh: {
      introTitle: '有用的日报首先是数据契约，不是提示词小技巧',
      intro: [
        '大多数自动日报失败，不是因为模型不够聪明，而是因为两件事没做好：采了太多原始数据，或者根本没定义“好日报长什么样”。只有把这些预期写清楚，Hermes 才能稳定发挥。',
        '最稳的模式其实很简单：先采集受控信号，再归一化成一个小 schema，只总结真正有变化的部分，最后通过 Slack、Telegram 或邮件发送成品。',
      ],
      when: [
        '你每天早上都在看同样几块仪表盘，希望从五个标签页压缩成一份摘要。',
        '日报必须稳定到别人不看原始日志也敢依赖它。',
        '你需要可重试的投递链路，发送失败时不能整条链路重跑。',
      ],
      workflow: [
        '从 API、日志、工单系统和昨天未完成事项里采集数据。',
        '把不同来源统一成一个摘要 schema，包含负责人、严重级别和截止时间。',
        '让 Hermes 只提炼变化、异常、阻塞项和下一步动作。',
        '发送成品，并保留中间产物用于重试或审计。',
      ],
      steps: [
        {
          title: '先把日报 schema 定清楚',
          paragraphs: [
            '不要一上来就调度任务，先规定一份日报必须包含哪些字段。稳定 schema 才能避免 Hermes 在安静日子里写废话、在繁忙日子里漏掉行动项。',
          ],
          code: {
            lang: 'json',
            content: `
{
  "date": "2026-04-14",
  "highlights": [],
  "blockers": [],
  "owners": [],
  "followUps": []
}
            `,
          },
        },
        {
          title: '把“采集”和“总结”拆成两层',
          paragraphs: [
            '让一个任务先采集原始材料并落盘，再让 Hermes 基于这个制品做总结。这样发送失败时可以直接重投，而不是重复打外部 API。',
          ],
        },
        {
          title: '用一层很薄的投递模块发出去',
          paragraphs: [
            'Slack、Telegram、邮件都应该接收同一份定稿。格式化留在投递层，推理留在总结层，这样你换渠道时不用重写整套 prompt。',
          ],
        },
      ],
      checklist: [
        '每个数据源都严格限制在日报声明的时间窗口内。',
        '保存总结前的中间制品，确保失败发送可以安全重试。',
        '每个行动项都要带负责人和截止时间。',
        '如果日报既没有亮点也没有阻塞，要么明确这是正常情况，要么直接判定生成失败。',
      ],
      faq: [
        {
          q: 'Hermes 应该每天早上直接去读原始仪表盘吗？',
          a: '只有在这些仪表盘本身已经结构化、而且查询成本很低时才适合。大多数团队里，单独的采集层更容易缓存、测试和重试。',
        },
        {
          q: '日报控制在多长比较合理？',
          a: '目标是一屏内读完，并附上明细链接。如果报告比操作者早晨的注意力跨度还长，那它就不再是日报，而是“垃圾堆式 backlog”。',
        },
        {
          q: '最常见的不稳定点是什么？',
          a: '通常是把“总结”和“发送”绑死在一起。发送失败后，团队重新生成一份摘要，结果两份内容还不一致。',
        },
      ],
      next: [
        '**[Cron 定时任务指南](/zh/tutorials/automation/cron-scheduling)** — 先把日报放到稳定的调度器上。',
        '**[Telegram 接入指南](/zh/tutorials/messaging/telegram-bot-setup)** — 优先把晨报送到手机端。',
        '**[服务器监控与告警](/zh/tutorials/automation/server-monitoring-alerts)** — 用同样的流水线处理事故摘要。',
      ],
    },
  },
  {
    type: 'tutorials',
    filePath: 'automation/server-monitoring-alerts',
    meta: {
      title: 'Server Monitoring & Smart Alerts with Hermes',
      titleZh: '服务器异常？AI 比你先知道还帮你修',
      slug: 'server-monitoring-alerts',
      description:
        'Collect infrastructure signals, classify severity, and let Hermes turn noisy incidents into actionable alerts and recovery suggestions.',
      descriptionZh:
        '采集基础设施信号、判断严重级别，并让 Hermes 把噪声事故转成可执行告警和恢复建议。',
      category: 'automation',
      tags: ['automation', 'monitoring', 'alerts', 'advanced'],
      difficulty: 'advanced',
      readingTime: 14,
      series: 'automation',
      seriesOrder: 3,
      featured: false,
    },
    en: {
      introTitle: 'The goal is not more alerts, it is better triage',
      intro: [
        'Most monitoring stacks already know when CPU is high or disk is full. The missing part is turning dozens of low-level signals into one alert that explains impact, likely cause, owner, and next action.',
        'Hermes is useful when it sits after the signal pipeline. Let Prometheus, health checks, and logs detect the event; let Hermes summarize the incident and choose the right escalation path.',
      ],
      when: [
        'Your current alerts are technically accurate but impossible to prioritize at 3 a.m.',
        'Operators keep opening the same dashboards to answer the same first five questions.',
        'You want recovery suggestions, but you still need a clean approval boundary before any remediation action runs.',
      ],
      workflow: [
        'Collect metrics, logs, health checks, and recent deploy information.',
        'Correlate related signals into a single incident envelope.',
        'Ask Hermes to produce a structured summary with severity and probable causes.',
        'Route the alert to the right channel and keep any recovery action behind approval.',
      ],
      steps: [
        {
          title: 'Build one incident envelope from many raw events',
          paragraphs: [
            'Avoid prompting on individual log lines. Merge related signals by host, service, and time window so Hermes can reason over one incident object instead of random fragments.',
          ],
          code: {
            lang: 'yaml',
            content: `
service: api-gateway
window: 10m
signals:
  - cpu_sustained_gt_90
  - error_rate_gt_5_percent
  - latest_deploy_sha: 8f4a92c
owner: platform-oncall
            `,
          },
        },
        {
          title: 'Separate explanation from action',
          paragraphs: [
            'The first job is to explain what is happening. A second, explicit stage may suggest runbooks or one-click remediations, but those actions should not fire from the first summary alone.',
          ],
        },
        {
          title: 'Route by impact, not by source system',
          paragraphs: [
            'PagerDuty, Slack, and email should be downstream of a normalized severity decision. Otherwise the same issue will page three different teams because three different tools emitted three different messages.',
          ],
        },
      ],
      checklist: [
        'Correlate deploy history into every incident envelope.',
        'Keep a human approval step before restart, rollback, or scaling actions.',
        'Record which summary fields actually helped operators resolve the issue faster.',
        'Tune the incident window so repeated signals are grouped instead of spammed.',
      ],
      faq: [
        {
          q: 'Should Hermes replace Prometheus alert rules?',
          a: 'No. Metric rules should stay deterministic. Hermes adds value after detection by summarizing context and suggesting the next step.',
        },
        {
          q: 'Can it auto-remediate incidents?',
          a: 'It can propose and even prepare remediation actions, but production execution should remain behind an approval gate unless the action is already extremely low-risk and reversible.',
        },
        {
          q: 'What if the model hallucinates a root cause?',
          a: 'Force the summary to distinguish evidence from inference. A good incident template says which facts were observed and which hypotheses still need verification.',
        },
      ],
      next: [
        '**[Build an Automated Daily Report System](/en/tutorials/automation/daily-report-system)** — Roll incident summaries into a morning digest.',
        '**[Automation Recipes](/en/tutorials/automation/automation-recipes)** — Reuse the same pattern for maintenance workflows.',
        '**[Telegram Bot Setup](/en/tutorials/messaging/telegram-bot-setup)** — Deliver critical alerts to a mobile-first channel.',
      ],
    },
    zh: {
      introTitle: '目标不是制造更多告警，而是把分诊做对',
      intro: [
        '大多数监控栈本来就知道 CPU 高、磁盘满、错误率涨。真正缺的是：把几十条底层信号压成一条告警，并说明影响范围、可能原因、负责人和下一步动作。',
        'Hermes 最适合放在信号链路之后。让 Prometheus、健康检查、日志系统负责发现问题；让 Hermes 负责总结事故、解释上下文、选择升级路径。',
      ],
      when: [
        '你现在的告警在技术上是对的，但凌晨三点根本排不了优先级。',
        '值班同学每次都要打开同一组仪表盘，回答同样的五个问题。',
        '你想要恢复建议，但仍然需要清晰审批边界，不能让修复动作直接自动执行。',
      ],
      workflow: [
        '采集指标、日志、健康检查和最近部署信息。',
        '把相关信号聚合成一个事故包。',
        '让 Hermes 输出带严重级别和可能原因的结构化摘要。',
        '按照影响范围路由到正确渠道，并把修复动作留在审批之后。',
      ],
      steps: [
        {
          title: '先把很多原始事件合成一个事故包',
          paragraphs: [
            '不要对着单条日志直接做提示词。先按主机、服务、时间窗口把相关信号归并，让 Hermes 面对的是一个完整事故对象，而不是随机碎片。',
          ],
          code: {
            lang: 'yaml',
            content: `
service: api-gateway
window: 10m
signals:
  - cpu_sustained_gt_90
  - error_rate_gt_5_percent
  - latest_deploy_sha: 8f4a92c
owner: platform-oncall
            `,
          },
        },
        {
          title: '把“解释问题”和“执行动作”分开',
          paragraphs: [
            '第一阶段只负责说明发生了什么。第二阶段可以建议 runbook、生成一键修复动作，但这些动作不应该仅凭第一份摘要就直接执行。',
          ],
        },
        {
          title: '按影响分级路由，而不是按来源系统路由',
          paragraphs: [
            'PagerDuty、Slack、邮件都应该建立在统一的严重级别判断上。否则同一件事会因为三个系统发了三种消息，最终吵醒三拨人。',
          ],
        },
      ],
      checklist: [
        '每个事故包都带上最近部署历史。',
        '重启、回滚、扩容之类动作前必须有人为审批。',
        '持续记录哪些摘要字段真的提升了处置速度。',
        '调好事故聚合时间窗，避免同一异常被刷屏。',
      ],
      faq: [
        {
          q: 'Hermes 能替代 Prometheus 规则吗？',
          a: '不能。指标规则应该保持确定性。Hermes 的价值在检测之后，用来总结上下文和建议下一步。',
        },
        {
          q: '它能不能自动修复事故？',
          a: '可以提出甚至准备修复动作，但线上执行仍然应该放在审批门后，除非该动作已经被验证为低风险且可逆。',
        },
        {
          q: '如果模型胡乱猜根因怎么办？',
          a: '强制摘要模板把“证据”和“推断”分开。好的事故摘要必须明确哪些事实已经观察到，哪些只是待验证假设。',
        },
      ],
      next: [
        '**[自动日报系统](/zh/tutorials/automation/daily-report-system)** — 把事故摘要汇入晨报。',
        '**[自动化方案合集](/zh/tutorials/automation/automation-recipes)** — 把同样模式复用到维护任务。',
        '**[Telegram 接入指南](/zh/tutorials/messaging/telegram-bot-setup)** — 把关键告警送到移动优先的渠道。',
      ],
    },
  },
];

for (const article of articles) {
  writeArticle(article);
}

console.log(`Generated ${articles.length * 2} localized files.`);
