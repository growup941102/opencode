# 协同工作流：CodeStable × oh-my-opencode-slim

本文档定义 self-opencode 里两套工作流的协同方式。核心思路一句话：

> **CodeStable 管"做什么、为什么、记下来"（软件生命周期），omo-slim 管"具体谁来干、怎么干得快"（Agent 编排）。**

二者不冲突、不重叠，是上下两层的关系。

---

## 一、各自定位

### 管理层：CodeStable

围绕**软件要素**建模，所有产物落盘到 `.codestable/`（人和 AI 都能读、可跨会话召回）。

| 实体 | 目录 | 作用 |
|------|------|------|
| 需求 | `requirements/` | 为什么要有这个能力，只记现状 |
| 架构 | `architecture/` | 系统现在长什么样，给人读的 |
| 路线图 | `roadmap/` | 大需求拆模块 + 定接口契约 |
| 特性 | `features/` | 新能力 spec（design/impl/accept） |
| 问题 | `issues/` | bug 单（report/analyze/fix） |
| 重构 | `refactors/` | 重构 spec（beta） |
| 知识 | `compound/` | 沉淀 learning/trick/decision/explore |

三条主流程：

- **新增能力**：`cs-feat-design` → `cs-feat-impl` → `cs-feat-accept`
- **修 bug**：`cs-issue-report` → `cs-issue-analyze` → `cs-issue-fix`
- **重构**：`cs-refactor` / `cs-refactor-ff`

### 执行层：oh-my-opencode-slim

围绕 **Agent** 编排，由 Orchestrator 把任务路由给最合适的专家。

| Agent | 车道 | 何时用 |
|-------|------|--------|
| `@explorer` | 代码侦察 | 规划前摸清代码现状，返回压缩后的上下文 |
| `@librarian` | 外部知识 | 查库文档、API、最新用法、web 检索 |
| `@oracle` | 架构 / 风险 / 审查 | 高风险决策、卡了 2 次以上的问题、代码审查 |
| `@designer` | UI/UX | 用户可见界面的设计与实现 |
| `@fixer` | 快速实现 | 上下文充分、边界清晰的编码执行 |
| `@observer` | 观察 | 监控、状态跟踪 |
| Orchestrator | 调度 | 读诉求，自动派发任务给上面的专家 |
| Council | 议会评审 | 多视角独立评审后再下结论 |

---

## 二、协同映射：CodeStable 流程的每一步交给谁执行

这是协同的核心。CodeStable 的 skill 负责**编排软件生命周期**（写 spec、记决策），当某一步需要**实际动代码或调研**时，委派给 omo-slim 的 agent。

| CodeStable 阶段 | 该阶段要干的事 | 委派给 omo-slim |
|----------------|---------------|----------------|
| `cs-explore` | 定向摸代码、回答"X 怎么实现的" | `@explorer`（并行搜索）+ 必要时 `@librarian` |
| `cs-req` / `cs-brainstorm` | 梳理需求、想法分诊 | 主要靠人在环对话，调研部分给 `@explorer` |
| `cs-arch` | 起草 / 体检架构文档 | `@explorer` 摸现状 + `@oracle` 做架构评审 |
| `cs-roadmap` | 大需求拆模块、定接口契约 | `@explorer` 摸边界 + `@oracle` 评审拆分合理性 |
| `cs-feat-design` | 写 `{slug}-design.md` | `@explorer` 补上下文 + `@librarian` 查库 + `@oracle` 审设计 |
| `cs-feat-impl` | 按 design 写代码 | `@fixer` 执行编码；UI 部分给 `@designer` |
| `cs-feat-accept` | 对照 design 验收 | `@oracle` 做审查 + `@fixer` 补测试 / 修问题 |
| `cs-issue-analyze` | 找根因、评估风险 | `@explorer` 定位 + `@oracle` 根因分析（尤其反复修不好时） |
| `cs-issue-fix` | 定点修复 + 验证 | `@fixer` 修复并跑验证 |
| `cs-refactor` | AI 辅助重构 | `@oracle` 定策略 + `@fixer` 执行 |
| `cs-libdoc` | 库 API 参考文档 | `@librarian` 查权威文档 |
| `cs-learn`/`cs-trick`/`cs-decide` | 沉淀知识 | 人在环主导，落盘到 `compound/` |

**关键原则**：
- CodeStable 决定**做什么 + 落盘**，omo-slim 决定**谁干 + 干得快**
- spec/决策永远写进 `.codestable/`（持久），agent 的 session 是临时的执行过程
- 高风险或反复失败的环节，强制过一遍 `@oracle` 或 Council

---

## 三、典型场景串联

### 场景 A：开发一个新功能（标准流程）

```
1. 用户："我想加一个权限校验系统"
   → cs（根入口）判断这是大需求，路由到 cs-roadmap

2. cs-roadmap 拆模块 + 定接口
   → 委派 @explorer 摸清现有 auth 相关代码
   → 委派 @oracle 评审模块拆分是否合理
   → 落盘 .codestable/roadmap/

3. 逐个子 feature 走 cs-feat-design
   → @explorer 补上下文，@librarian 查鉴权库用法，@oracle 审设计
   → 落盘 .codestable/features/{slug}/{slug}-design.md

4. cs-feat-impl 按 design 写代码
   → Orchestrator 派 @fixer 执行编码（前端部分派 @designer）
   → 落盘实现 + 更新 impl 进度

5. cs-feat-accept 验收
   → @oracle 对照 design 审查，@fixer 补测试
   → 通过后落盘验收记录

6. 期间踩的坑 → cs-learn / cs-decide 沉淀到 compound/
```

### 场景 B：修一个 bug

```
1. 用户："登录后偶尔跳转到错误页面"
   → cs 路由到 cs-issue

2. cs-issue-report 落成可复现的 report
   → 落盘 .codestable/issues/{slug}/report.md

3. cs-issue-analyze 找根因
   → @explorer 定位相关代码路径
   → 反复修不好 → @oracle 深度根因分析
   → 落盘 analyze.md

4. cs-issue-fix 定点修复
   → @fixer 修复 + 跑验证
   → 落盘 fix-note.md
```

### 场景 C：纯调研（不改代码）

```
用户："这个项目的会话状态是怎么管理的？"
→ cs-explore 主导
→ 委派 @explorer 并行扫描相关模块
→ 把"提问 → 读代码 → 结论"沉淀到 compound/explore/
```

---

## 四、使用约定

1. **新项目第一步永远是 `/cs-onboard`**——它创建标准的 `.codestable/` 骨架（不要手工建目录）
2. **不知道用哪个 skill 就喊 `/cs`**——根入口会路由
3. **手动委派 agent**：`@explorer <任务>`、`@oracle <问题>` 等（agent 定义在 `packages/oh-my-opencode-slim/src/agents/`）
4. **让 Orchestrator 自动派发**：直接描述任务，它读诉求自动调度
5. **持久 vs 临时**：要长期留存的写进 `.codestable/`；agent 的执行过程是临时的

---

## 五、目录现状

```
self-opencode/
├── packages/oh-my-opencode-slim/      # 执行层插件（已集成，依赖改为 @self-opencode/*）
│   └── src/agents/                    # 各 agent 定义（explorer/oracle/fixer/…）
├── .claude/skills/cs*/                # CodeStable 的 25 个 skill（cs 根入口 + 24 个子 skill，已集成）
└── .codestable/                       # 由 /cs-onboard 在使用时创建（不手工建）
```

> 本文档是协同方法论。具体 skill 用法看各 `SKILL.md`，omo-slim agent 定义看 `packages/oh-my-opencode-slim/src/agents/`，插件配置看 `packages/oh-my-opencode-slim/oh-my-opencode-slim.schema.json`。
