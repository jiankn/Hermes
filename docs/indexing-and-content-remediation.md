# 索引与内容整改清单

更新日期：2026-04-14

## P0：先修索引，再谈收录

- [x] 增加 `npm run check:indexing`，统一检查 DNS、首页可达性、`robots.txt`、`sitemap.xml` 和 GSC URL Inspection API。
- [x] 增加 `npm run audit:content`，按批次审计 30 篇计划的真实完成度。
- [x] `sitemap` 改为从 `content/` 动态生成，避免继续漏掉已存在教程。
- [x] 教程列表改为从 `content/tutorials` 动态读取，避免手写清单和正文漂移。
- [x] 教程详情页加入 JSON-LD（`BreadcrumbList` + `TechArticle`），补足结构化数据基础。
- [x] `guides` 和 `blog` 页面改成明确的待发布状态，移除对不存在正文的假承诺。

## 当前最大阻塞

- [ ] `hermesagent.sbs` 需要补齐公开 DNS 记录。
  - 审计时 `Resolve-DnsName` 只能拿到 Cloudflare SOA。
  - `A/AAAA` 记录缺失，`443` 无法解析。
  - 在此状态下，Google 无法稳定抓取，更不可能正常索引。
- [ ] 需要实际 GSC 凭证做 URL Inspection。
  - 脚本已支持 `GSC_SERVICE_ACCOUNT_JSON` 或 `GOOGLE_APPLICATION_CREDENTIALS`。
  - 还需要把服务账号加入 Search Console 属性权限。

## 运行方式

```bash
npm run audit:content
npm run check:indexing
```

如需启用 GSC 检查：

```bash
$env:GSC_SERVICE_ACCOUNT_JSON="C:\path\to\service-account.json"
$env:GSC_SITE_URL="https://hermesagent.sbs/"
npm run check:indexing
```

如果你使用的是域属性：

```bash
$env:GSC_SITE_URL="sc-domain:hermesagent.sbs"
```

## 批次整改优先级

### 批次 0：立即处理

- [ ] 在 DNS 提供商补 `A` 或 `CNAME`，保证 `https://hermesagent.sbs` 可访问。
- [ ] 上线后立即复跑 `npm run check:indexing`。
- [ ] 把 GSC 服务账号加入属性，然后复跑 URL Inspection。
- [ ] 确认线上 `robots.txt` 和 `sitemap.xml` 与本地生成结果一致。

### 批次 1-3：已完成但需复查

- [ ] 复查已发布教程的 `publishedAt`、`updatedAt`、canonical 和结构化数据。
- [ ] GSC 里抽查首页、教程列表页、3 篇核心教程页的抓取与索引状态。

### 批次 4-7：仍需生产

- [ ] 补齐缺失内容：
  - 批次 4：`#13`、`#14`
  - 批次 5：`#16`、`#17`、`#18`
  - 批次 6：`#20`、`#21`、`#22`、`#23`
  - 批次 7：`#24` 到 `#30`
- [ ] 每一批发布后 48 小时内复跑 `npm run check:indexing`。
- [ ] 若 GSC 出现“已抓取，未编入索引”，优先补强正文长度、截图/GIF、差异化段落和内链。
