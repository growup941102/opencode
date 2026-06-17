# self-opencode 集成方案

## 改造完成情况

### 1. 品牌改造 ✅

**改动规模**: 1,027 个文件，3,546 处修改

- **包名**: `opencode` → `self-opencode`
- **Scope**: `@opencode-ai/*` → `@self-opencode/*`（所有 workspace 包）
- **品牌显示名**: `OpenCode` → `SelfOpencode`（所有文档）
- **仓库地址**: `anomalyco/opencode` → `growup941102/opencode`
- **npm 包名**: `opencode-ai` → `self-opencode`

### 2. 集成 oh-my-opencode-slim ✅

**位置**: `packages/oh-my-opencode-slim/`

**已完成**:
- 复制源码到 packages 目录
- 修改 package.json 依赖：`@opencode-ai/*` → `@self-opencode/*`
- 批量替换源码中的 import 语句
- 自动纳入 workspace（`packages/*` 通配符）

**功能**:
- **多 Agent 编排**: 7 个专业 agent（Orchestrator、Explorer、Fixer、Architect、UI Specialist 等）
- **自动任务委派**: 根据任务类型自动分配给合适的 agent
- **混合模型**: 可为不同 agent 配置不同 LLM
- **后台并行**: 多 agent 同时工作
- **Tmux/Zellij 集成**: 可视化监控

### 3. CodeStable 集成 ⏸️

**状态**: 待处理（克隆失败，网络超时）

**计划**:
- 添加 CodeStable Skills 到 `.opencode/skills/`
- 创建 `codestable/` 目录结构用于需求/架构/特性管理
- 设计 omo-slim 和 CodeStable 的协同工作流

---

## 下一步：安装依赖并构建

### 步骤 1: 安装依赖

```bash
cd /Users/zyc/self/opencode/opencode
bun install
```

### 步骤 2: 构建 oh-my-opencode-slim

```bash
cd packages/oh-my-opencode-slim
bun run build
```

### 步骤 3: 配置 oh-my-opencode-slim

创建配置文件 `~/.config/opencode/oh-my-opencode-slim.json`：

```json
{
  "preset": "custom",
  "presets": {
    "custom": {
      "orchestrator": {
        "model": "claude-opus-4",
        "temperature": 0.0
      },
      "explorer": {
        "model": "claude-sonnet-4",
        "temperature": 0.0
      },
      "fixer": {
        "model": "claude-sonnet-4",
        "temperature": 0.0
      },
      "architect": {
        "model": "claude-opus-4",
        "temperature": 0.0
      }
    }
  }
}
```

### 步骤 4: 测试运行

```bash
# 开发模式运行
bun run dev

# 或者构建整个项目
bun run typecheck
```

---

## 使用工作流

### oh-my-opencode-slim 基本用法

1. **自动编排模式**（推荐）
   ```
   # Orchestrator 会自动分配任务给合适的 agent
   用户：实现一个用户登录功能
   ```

2. **手动指定 agent**
   ```
   @explorer 扫描这个代码库的认证相关代码
   @architect 审查这个架构设计
   @fixer 修复这个 bug
   ```

3. **查看可用 agent**
   ```
   列出所有可用的 agent
   ```

### CodeStable 工作流（待集成）

**典型场景**：开发新功能

1. **需求阶段**
   ```
   /cs-requirement
   ```
   → 记录需求到 `codestable/requirements/`

2. **架构设计**
   ```
   /cs-architecture
   ```
   → 设计方案记录到 `codestable/architecture/`

3. **实现阶段**
   - Orchestrator 读取 CodeStable 的文档
   - 自动派发给 omo-slim agents 执行

4. **决策记录**
   ```
   /cs-decision
   ```
   → 记录重要技术决策

---

## 工作流协同架构

```
┌─────────────────────────────────────────────┐
│          self-opencode (你的品牌)            │
├─────────────────────────────────────────────┤
│  管理层: CodeStable (待集成)                 │
│  - 需求管理 (codestable/requirements/)      │
│  - 架构设计 (codestable/architecture/)      │
│  - 特性追踪 (codestable/features/)          │
│  - 决策记录 (codestable/decisions/)         │
├─────────────────────────────────────────────┤
│  执行层: oh-my-opencode-slim ✅              │
│  - Orchestrator (任务调度)                  │
│  - Explorer (代码探索)                       │
│  - Fixer (实现修复)                          │
│  - Architect (架构审查)                      │
│  - UI Specialist (前端)                      │
│  - 其他专业 agents                           │
└─────────────────────────────────────────────┘
```

---

## 待办事项

- [ ] 运行 `bun install` 安装所有依赖
- [ ] 构建 oh-my-opencode-slim
- [ ] 配置 agent 模型
- [ ] 测试运行
- [ ] 重试克隆 CodeStable（网络稳定后）
- [ ] 集成 CodeStable Skills
- [ ] 创建 `codestable/` 目录结构
- [ ] 编写协同工作流文档
- [ ] 提交所有改动到 git

---

## 文件变更统计

- **品牌改造**: 1,027 个文件
- **oh-my-opencode-slim**: 新增 1 个 workspace 包
- **总计**: ~1,028 个文件改动

## Git 分支建议

建议创建新分支进行测试：

```bash
git checkout -b feature/self-opencode-integration
git add .
git commit -m "feat: 品牌改造 + 集成 oh-my-opencode-slim

- 重命名品牌：opencode → self-opencode
- 修改所有包 scope：@opencode-ai → @self-opencode
- 集成 oh-my-opencode-slim 作为 workspace 包
- 更新仓库地址：anomalyco → growup941102

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
