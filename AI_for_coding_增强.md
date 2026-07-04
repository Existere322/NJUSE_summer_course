# AI for Coding 增强：从提示词到工程化 Agent 使用

## 0. 本节目标

这一节不是讲“怎么让 AI 写一段代码”，而是讲：

> 如何把 AI 当作一个能读项目、改文件、跑命令、做验证的 Coding Agent 来使用。

传统的提示词工程关注的是“怎么问得更清楚”，但 Coding Agent 的关键已经不只是“问问题”，而是：

* 如何给它项目上下文；
* 如何限制它的权限；
* 如何让它按流程工作；
* 如何让它复用 Skill；
* 如何让它自己检查、测试、提交；
* 如何在人类审查下完成工程任务。

Claude Code、Codex、OpenCode 都属于这一类工具：它们不是单纯的聊天机器人，而是可以进入项目目录、理解代码库、执行开发任务的 Agent 工具。Claude Code 官方说明它可以在终端、IDE 或 GitHub 中使用，并能理解代码库、执行 routine tasks、解释复杂代码和处理 Git 工作流；Codex CLI 官方说明它是本地运行在电脑上的 coding agent，也提供 CLI、IDE、桌面 App 和 Web 形态；OpenCode 官方也将自己定位为可在终端、桌面和 IDE 中使用的开源 AI coding agent。

---

# 1. AI for Coding 的三个阶段

AI for Coding 可以分成三个阶段。

## 1.1 第一阶段：代码补全

第一阶段是代码补全。

典型形式是：

```text
你写了一半代码，AI 自动补全下一行或下一段。
```

这个阶段的特点是：

* AI 主要看当前文件或当前光标附近的上下文；
* 人类仍然是主要驾驶员；
* AI 更像“高级自动补全工具”；
* 适合补模板代码、补 API 调用、补重复逻辑。

它的局限是：AI 通常不理解完整项目结构，也不会主动跑测试、查依赖、改多个文件。

## 1.2 第二阶段：对话式改代码

第二阶段是对话式改代码。

典型形式是：

```text
帮我写一个登录函数。
帮我解释这段代码。
帮我把这个函数改成异步版本。
```

这个阶段的特点是：

* 用户用自然语言描述需求；
* AI 生成一段代码或修改建议；
* 人类复制、粘贴、调整；
* AI 更像一个“代码问答助手”。

它比代码补全更强，但仍然存在一个问题：

> AI 经常只是在回答问题，而不是在真正操作项目。

它可以告诉你“应该怎么改”，但不一定真的读完整个项目、修改多个文件、运行测试并验证结果。

## 1.3 第三阶段：Agent 自主读写跑测

第三阶段是 Coding Agent。

典型形式是：

```text
请阅读这个项目，找到登录失败的原因，修复 bug，补充测试，并运行测试验证。
```

这个阶段的特点是：

* Agent 可以读文件；
* Agent 可以搜索代码；
* Agent 可以修改文件；
* Agent 可以运行命令；
* Agent 可以根据报错继续迭代；
* Agent 可以总结修改内容；
* Agent 可以配合 Git 完成提交。

这就是我们这节课真正要讲的 AI for Coding 增强。

Claude 官方对 agentic coding 的描述也强调：这类工具不只是分析编辑器里可见的代码，而是能阅读整个代码库、理解目录之间的文件关系、执行命令验证修改，并迭代直到测试通过和需求满足。

所以，学生需要完成一个认知转变：

```text
不是：AI 帮我写一段代码。
而是：Agent 帮我完成一个工程任务。
```

---

# 2. Coding Agent 的基本工作模式

Coding Agent 的基本模式可以概括为：

```text
理解任务 → 探索项目 → 制定计划 → 修改代码 → 运行验证 → 汇报结果
```

## 2.1 理解任务

首先，Agent 需要理解用户目标。

例如：

```text
请给 TODO 应用添加“按完成状态筛选”的功能。
```

一个好的 Agent 不应该立刻写代码，而应该先判断：

* 这是前端任务还是后端任务？
* 涉及哪些文件？
* 是否已有 TODO 数据结构？
* 是否已有筛选逻辑？
* 是否需要测试？
* 是否需要更新文档？

## 2.2 探索项目

接着，Agent 会读取项目文件。

它可能会执行：

```bash
ls
find .
grep -R "todo" .
cat README.md
```

或者使用工具读取文件、搜索关键字、查看目录结构。

这个阶段的目标是：

> 先理解项目，再修改项目。

这也是 Coding Agent 和普通 ChatGPT 的重要区别：普通 ChatGPT 主要依赖用户粘贴的上下文，而 Coding Agent 可以自己进入项目里找上下文。

## 2.3 制定计划

在正式修改之前，Agent 应该给出计划。

例如：

```text
计划：
1. 阅读 TodoList 组件，确认列表渲染逻辑；
2. 在状态层添加 filter 状态；
3. 添加筛选按钮；
4. 修改列表渲染逻辑；
5. 添加测试；
6. 运行测试。
```

计划的作用是让人类先判断方向是否正确。

没有计划就直接改代码，容易出现：

* 改错文件；
* 过度设计；
* 引入无关依赖；
* 做出和课程要求不一致的实现。

## 2.4 修改代码

计划确认后，Agent 才开始修改文件。

它可能会：

* 创建新文件；
* 修改已有文件；
* 添加测试；
* 修改配置；
* 更新 README；
* 修复 lint 或类型错误。

这时人类不需要盯着每一行代码，但需要在关键节点检查：

```bash
git status
git diff
```

## 2.5 运行验证

修改完成不代表任务完成。

一个可靠的 Coding Agent 必须运行验证命令，例如：

```bash
npm test
npm run build
pytest
mvn test
```

或者运行项目本身，检查页面是否正常。

Codex 官方安全文档也体现了这一点：Codex 在本地运行时可以读写工作区并运行命令，但通过 sandbox 和 approval policy 控制它能做什么、什么时候必须询问用户。

## 2.6 汇报结果

最后，Agent 应该汇报：

* 修改了哪些文件；
* 每个文件改了什么；
* 运行了什么验证命令；
* 验证是否通过；
* 是否还有遗留问题；
* 是否需要人工 review。

推荐汇报格式：

```text
完成情况：
- 修改文件：
- 实现内容：
- 验证命令：
- 验证结果：
- 需要人工确认：
```

这让人类可以快速接管，而不是被一大段自然语言淹没。

---

# 3. CLI 模式、桌面模式、IDE 模式的区别

Coding Agent 常见有三种使用形态：

```text
CLI 模式
桌面模式
IDE 模式
```

Claude Code、Codex 和 OpenCode 都在不同程度上支持多种形态。Claude Code 官方 README 说明它可以在 terminal、IDE 或 GitHub 中使用；Codex README 说明 Codex 可以作为 CLI、本地 App、IDE 扩展和云端 Agent 使用；OpenCode 官方文档说明它有终端界面、桌面 App 和 IDE 扩展。

## 3.1 CLI 模式

CLI 模式就是在终端中使用 Agent。

例如：

```bash
claude
codex
opencode
```

CLI 模式的特点是：

* 最接近真实工程环境；
* 适合运行命令、调试、测试、Git 操作；
* 适合服务器环境；
* 适合和脚本、CI/CD、命令行工具结合；
* 对初学者门槛稍高。

CLI 模式适合讲：

```text
Agent 是如何在真实项目目录里工作的。
```

因为所有操作都发生在终端和文件系统中，学生能看到 Agent 如何执行命令、读取文件、修改代码、跑测试。

## 3.2 桌面模式

桌面模式更像一个独立 App。

它的特点是：

* 可视化更强；
* 上手更容易；
* 适合非终端熟练用户；
* 适合多会话管理；
* 适合展示 Agent 工作过程；
* 但对工程命令细节的暴露可能不如 CLI 直接。

桌面模式适合初学者体验：

```text
我给 Agent 一个任务，它帮我完成一批操作。
```

但在教学中，不建议只用桌面模式，因为学生容易只看到“结果”，看不到“工程流程”。

## 3.3 IDE 模式

IDE 模式是把 Agent 集成到 VS Code、Cursor、JetBrains 等开发环境中。

它的特点是：

* 和代码编辑器结合紧密；
* 方便查看 diff；
* 方便局部修改；
* 方便人类 review；
* 适合日常开发；
* 但有时不如 CLI 适合展示完整命令链路。

IDE 模式适合讲：

```text
Agent 如何成为开发环境的一部分。
```

例如：让 Agent 修改代码后，学生直接在 IDE 里查看 changed files 和 diff。

## 3.4 三种模式对比

| 模式  | 优点               | 缺点        | 适合场景              |
| --- | ---------------- | --------- | ----------------- |
| CLI | 工程化强、命令透明、适合服务器  | 初学门槛较高    | 课程演示、Git、测试、CI/CD |
| 桌面  | 可视化强、上手简单        | 工程细节可能被隐藏 | 初学体验、多任务管理        |
| IDE | 方便 review、贴近日常开发 | 依赖编辑器生态   | 日常开发、代码审查、局部修改    |

教学建议：

> 课堂演示优先用 CLI，因为它最能展示 Coding Agent 的真实工程能力；学生日常使用可以选择 IDE 或桌面模式。

---

# 4. 项目上下文配置：CLAUDE.md / AGENTS.md / Skill

使用 Coding Agent 时，一个常见错误是：

> 每次都在聊天框里重新告诉 Agent 项目规则。

例如每次都要重复：

```text
这个项目用 Python 3.11。
测试用 pytest。
不要改 public API。
提交前必须运行 pytest。
commit message 使用 Conventional Commits。
```

这会导致三个问题：

1. 用户很累；
2. Agent 容易忘；
3. 不同同学给 Agent 的规则不一致。

所以，工程化使用 Agent 的关键是：

> 把项目规则写成文件，让 Agent 每次进入项目时都能读取。

## 4.1 CLAUDE.md：Claude Code 的项目记忆

在 Claude Code 中，常见做法是使用 `CLAUDE.md` 记录项目上下文。

它可以包含：

```markdown
# Project Guide

## Setup
- Install dependencies: npm install
- Run tests: npm test
- Start dev server: npm run dev

## Code Style
- Use TypeScript
- Use functional components
- Do not add new dependencies without asking

## Verification
- Before completion, run npm test
- If frontend changes are made, run npm run build
```

可以把 `CLAUDE.md` 理解为：

```text
给 Claude Code 看的 README。
```

它不主要面向人类用户，而是面向 Agent，告诉 Agent 如何在这个项目里工作。

Claude Code 的扩展功能文档也把 `CLAUDE.md`、Skills、subagents、hooks、MCP 和 plugins 作为不同层次的扩展机制来组织，用来定制 Claude 知道什么、连接什么外部服务、以及如何自动化工作流。

## 4.2 AGENTS.md：更通用的 Agent 项目说明

`AGENTS.md` 可以理解为跨工具的 Agent 项目说明文件。

它适合放：

```markdown
# AGENTS.md

## Setup commands
- Install deps: pnpm install
- Run dev server: pnpm dev
- Run tests: pnpm test

## Code style
- Use TypeScript
- Prefer small functions
- Keep components simple

## Git rules
- Do not push directly to main
- Use Conventional Commits
```

`AGENTS.md` 官方站点把它描述为“给 coding agents 看的 README”，用于提供项目上下文和操作指令。

这类文件的价值是：

> 把口头规则变成项目资产。

对于课程项目，可以给学生提供一个统一模板：

```text
AGENTS.md
├── 项目简介
├── 安装命令
├── 运行命令
├── 测试命令
├── 代码风格
├── Git 规则
└── Agent 禁止事项
```

## 4.3 Skill：把重复流程封装成可复用能力

`CLAUDE.md` 和 `AGENTS.md` 更适合放“长期规则”。

但如果某个流程很长、需要反复执行，就应该做成 Skill。

例如：

* Git 安全 push Skill；
* RAG 检索文档 Skill；
* Bug 定位 Skill；
* 代码审查 Skill；
* 课程作业检查 Skill；
* 前端页面验证 Skill。

Skill 的核心作用是：

```text
把一套操作流程封装成 Agent 可调用的能力。
```

Claude Code 官方文档说明，Skill 通过 `SKILL.md` 文件扩展 Claude 的能力，适合把反复粘贴的说明、检查清单、多步骤流程从聊天中抽出来；Codex 官方文档也说明 Skill 可以把 instructions、resources 和 optional scripts 打包起来，让 Codex 更可靠地执行工作流。

例如我们前面设计的 Git Safe Push Skill，本质上就是把这套流程固定下来：

```text
检查 Git 仓库
→ 检查 origin
→ 检查分支
→ 查看 status 和 diff
→ 检查敏感文件
→ commit
→ push
```

这样学生不用每次手写一大段 Prompt，只需要说：

```text
Use the git-safe-push skill.
请一键检查并 push 当前项目。
```

## 4.4 三者分工

| 配置形式        | 适合放什么            | 例子                           |
| ----------- | ---------------- | ---------------------------- |
| `CLAUDE.md` | Claude Code 项目记忆 | 项目结构、运行命令、代码规范               |
| `AGENTS.md` | 跨 Agent 项目说明     | Setup、测试、提交规范                |
| Skill       | 可复用操作流程          | Git push、debug、review、RAG 检索 |

一句话总结：

> `CLAUDE.md / AGENTS.md` 负责告诉 Agent“这个项目是什么”；Skill 负责告诉 Agent“遇到某类任务应该怎么做”。

---

# 5. Prompt Engineering 只讲最小必要集

在 Coding Agent 时代，Prompt Engineering 不应该讲得太玄。

对学生来说，只需要掌握四个要素：

```text
目标 → 上下文 → 约束 → 验收标准
```

## 5.1 目标：你要 Agent 做什么

目标要具体，避免只说：

```text
帮我优化一下。
```

更好的写法是：

```text
请优化 TodoList 组件的渲染逻辑，减少重复代码，但不要改变页面行为。
```

## 5.2 上下文：Agent 需要知道什么

上下文可以包括：

* 项目背景；
* 相关文件；
* 报错信息；
* 课程要求；
* 已经尝试过的方法；
* 不希望改变的部分。

例如：

```text
这个项目是课程 demo，使用 React + TypeScript。
相关文件可能在 src/components/TodoList.tsx 和 src/store/todo.ts。
```

## 5.3 约束：Agent 不能做什么

约束非常重要。

例如：

```text
不要新增第三方依赖。
不要修改测试接口。
不要直接 push。
不要改 main 分支。
不要删除已有功能。
```

Agent 有工具能力之后，约束比以前更重要，因为它不只是说话，而是真的能改文件、跑命令。

## 5.4 验收标准：怎样算完成

没有验收标准，Agent 容易说“完成了”，但人类不知道是不是真的完成。

可以写：

```text
完成标准：
1. 页面可以按全部 / 已完成 / 未完成筛选；
2. 原有添加和删除 TODO 功能不受影响；
3. npm test 通过；
4. npm run build 通过；
5. 最后汇报修改文件和验证结果。
```

## 5.5 推荐 Prompt 模板

```text
请完成以下任务：

目标：
- ...

上下文：
- ...

约束：
- ...

完成标准：
- ...

执行要求：
1. 先阅读项目结构；
2. 先给出计划，不要立刻修改；
3. 修改后运行测试；
4. 最后总结修改文件、验证命令和结果。
```

这个模板足够学生完成大多数 Agent 编程任务。

## 5.6 不推荐的 Prompt

不要这样写：

```text
帮我把项目做好。
```

问题是：

* 目标不清楚；
* 范围太大；
* 没有约束；
* 没有验收标准；
* Agent 很容易跑偏。

应该改成：

```text
请为当前 TODO 项目添加“按完成状态筛选”的功能。
先阅读项目结构，给出实现计划。
不要新增依赖。
实现后运行 npm test 和 npm run build。
最后总结修改内容。
```

一句话总结：

> Prompt Engineering 不需要玄学化。只要说清楚目标、上下文、约束和验收标准，就已经足够好。

---

# 6. Claude Code、Codex 与 OpenCode 的区别，以及如何增强 OpenCode

这一部分不是为了做工具排名，而是帮助学生理解：

> 不同 Coding Agent 的核心思想相似，但生态、配置方式、权限机制和扩展方式不同。

## 6.1 Claude Code：成熟的 Agentic Coding 工具

Claude Code 的特点是：

* 以终端为核心；
* 能理解代码库；
* 能执行任务、解释代码、处理 Git 工作流；
* 官方文档体系较完整；
* 工程化能力丰富，包括 memory、permissions、hooks、skills、MCP、subagents 等。

Claude Code 官方 README 明确说它 lives in your terminal，能理解代码库，并通过自然语言命令帮助执行 routine tasks、解释复杂代码和处理 Git 工作流。

### 可以搬到课程里的 Claude Code 内容

#### 1. CLI Reference

可以讲：

```text
如何启动 Claude Code；
如何在项目目录中使用；
如何用 slash command 控制会话；
如何切换模式、清理上下文、管理权限。
```

Claude Code commands 文档说明，命令可以在会话中控制 Claude Code，例如切换模型、管理权限、清理上下文、运行 workflow 等。

#### 2. Memory / CLAUDE.md

可以讲：

```text
项目规则不要每次口头重复，而是写入 CLAUDE.md。
```

课程可以提供一个 `CLAUDE.md` 模板。

#### 3. Permissions

可以讲：

```text
Agent 有工具能力，所以必须有权限控制。
```

Claude Code 官方权限文档说明，它用分层权限系统平衡能力和安全：只读文件读取不需要批准，Bash 命令和文件修改通常需要批准，并且可通过 `/permissions` 管理 allow、ask、deny 规则。

#### 4. Hooks

可以讲：

```text
Hooks 是在 Agent 生命周期特定时刻自动执行的检查或动作。
```

例如：

* 每次改文件后自动 format；
* 每次任务结束前自动运行测试；
* 每次执行危险命令前拦截；
* 每次输出完成前检查是否真的验证过。

Claude Code hooks 文档说明，hooks 可以是 shell 命令、HTTP endpoint 或 LLM prompt，并能在 session、turn、tool call 等生命周期事件中自动执行。

#### 5. Skills

可以讲：

```text
Skill 是把重复流程封装成可复用工作流。
```

Claude Code 官方说明 Skill 适合把经常重复粘贴的说明、检查清单、多步骤流程从聊天里抽出来，写成 `SKILL.md` 后按需调用。

#### 6. MCP

可以讲：

```text
MCP 是让 Agent 连接外部工具和数据源的协议。
```

MCP 官方介绍将它描述为连接 AI 应用和外部系统的开放标准，可以连接数据源、工具和工作流。

教学中不建议展开 MCP 配置细节，只要让学生知道：

> Agent 不只能读本地文件，还可以通过 MCP 连接数据库、浏览器、搜索、文档系统等外部能力。

---

## 6.2 Codex：OpenAI 的多形态 Coding Agent

Codex 的特点是：

* 有 CLI；
* 有 IDE extension；
* 有本地 Codex App；
* 有 Codex Web；
* 支持 Skills；
* 强调 sandbox、approval、network control 等安全机制。

Codex 官方 README 说明 Codex CLI 是本地运行在电脑上的 coding agent，并区分了 CLI、IDE、桌面 App 和云端 Codex Web；Codex 安全文档说明其默认关闭网络访问，本地使用 OS-enforced sandbox 限制可触达范围，并用 approval policy 控制何时必须向用户确认。

### 可以搬到课程里的 Codex 内容

#### 1. CLI / App / IDE / Web 多形态

可以讲：

```text
同一个 Agent 思想可以出现在不同入口：终端、IDE、桌面和云端。
```

#### 2. AGENTS.md

可以讲：

```text
Codex / OpenAI 生态更强调 AGENTS.md 这种跨工具项目说明。
```

`AGENTS.md` 官方站点把它描述为给 coding agents 看的 README，用来提供上下文和指令。

#### 3. Skills

可以讲：

```text
Codex Skill 是可复用工作流，能包含说明、资源和可选脚本。
```

Codex 官方 Skills 文档说明，Skill 可以扩展 Codex 的任务能力，打包 instructions、resources 和 optional scripts，让 Codex 更可靠地执行工作流，并且可用于 CLI、IDE extension 和 Codex app。

#### 4. Sandbox 与 Approval

可以讲：

```text
Agent 不是权限越大越好，而是要在合适的 sandbox 中工作。
```

Codex 安全文档把安全控制分为两层：sandbox mode 决定技术上能做什么，approval policy 决定什么时候必须问用户。

这部分非常适合放进课程，因为学生容易觉得：

```text
让 Agent 自动做越多越好。
```

但实际工程中更正确的观念是：

```text
Agent 自动做低风险操作，高风险操作必须询问人类。
```

---

## 6.3 OpenCode：开源、可配置、适合教学和本地部署

OpenCode 的特点是：

* 开源；
* 支持多模型；
* 可在终端、桌面、IDE 中使用；
* 支持 project config 和 global config；
* 支持 agents、subagents、skills、plugins、permissions；
* 适合教学场景，因为配置透明、可改、可展示。

OpenCode 官网说明它是开源 AI coding agent，可以连接 Claude、GPT、Gemini 等模型，并支持 terminal、IDE 和 desktop；OpenCode 文档还说明可以通过配置目录加载 agents、commands、modes 和 plugins。

### OpenCode 相比 Claude Code / Codex 的特点

| 工具          | 主要特点                                         | 适合课程中的角色          |
| ----------- | -------------------------------------------- | ----------------- |
| Claude Code | 官方生态成熟，文档完整，Hooks / Skills / Permissions 体系强 | 作为工程化 Agent 能力参考  |
| Codex       | OpenAI 生态，多形态，强调 sandbox / approval / skills | 作为安全和多入口 Agent 参考 |
| OpenCode    | 开源、多模型、配置透明、适合自定义                            | 作为课程实际 demo 工具    |

这节课可以采用策略：

```text
用 Claude Code / Codex 官方文档讲“标准工程能力”；
用 OpenCode 作为课堂实操平台；
通过 Skill / config / permissions / plugins 增强 OpenCode。
```

---

# 7. 增强 OpenCode 的路径

为了让 OpenCode 更适合课程，可以从五条路径增强。

## 7.1 路径一：写项目级 AGENTS.md

在每个课程项目根目录放：

```text
AGENTS.md
```

内容包括：

```markdown
# AGENTS.md

## Project
这是暑期课程的 Agent Demo 项目。

## Setup
- 安装依赖：npm install
- 运行测试：npm test
- 启动项目：npm run dev

## Rules
- 不要直接 push main
- 修改后必须运行测试
- 不要新增依赖，除非用户确认
- 提交前必须查看 git diff
```

作用：

> 让 Agent 一进入项目就知道项目规则。

## 7.2 路径二：写 Skill

OpenCode 官方 Skills 文档说明，OpenCode 可以从项目或用户目录发现 `SKILL.md`，并按需通过原生 skill tool 加载；支持的位置包括 `.opencode/skills/<name>/SKILL.md`、`~/.config/opencode/skills/<name>/SKILL.md`，也兼容 `.claude/skills/` 和 `.agents/skills/`。

课程中可以先提供几个标准 Skill：

```text
git-safe-push
debug-with-tests
rag-read-docs
code-review
project-summary
```

例如：

```text
.opencode/skills/git-safe-push/SKILL.md
```

它封装：

```text
git status
git diff
敏感文件检查
commit message 生成
push 当前分支
```

这样学生只需要输入：

```text
Use the git-safe-push skill.
请一键检查并 push 当前项目。
```

## 7.3 路径三：配置 OpenCode 权限

OpenCode 官方权限文档说明，它的权限以工具名为 key，例如 `read`、`edit`、`bash`、`task`、`skill`、`webfetch` 等；默认多数权限是 allow，但 `.env` 文件默认拒绝读取，并且可以按 agent 覆盖权限。

课程中可以配置：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "git status*": "allow",
      "git diff*": "allow",
      "git add*": "ask",
      "git commit*": "ask",
      "git push*": "ask",
      "git push --force*": "deny"
    },
    "read": {
      "*.env": "deny",
      "*.env.*": "deny"
    }
  }
}
```

教学意义：

> 不是靠口头提醒 Agent 不要乱来，而是把安全边界写进配置。

## 7.4 路径四：使用 Plan / Build 分工

OpenCode 官方 Agents 文档说明，OpenCode 有 primary agents 和 subagents；内置 primary agent 包括 Build 和 Plan，其中 Build 默认拥有完整工具能力，Plan 更适合分析和规划，文件编辑和 Bash 默认需要询问。

课程中可以要求学生这样使用：

```text
先用 Plan Agent：
- 分析项目
- 制定修改计划
- 不改文件

再用 Build Agent：
- 按计划修改
- 运行测试
- 汇报结果
```

这可以避免学生一上来就让 Agent 直接乱改代码。

## 7.5 路径五：写 Plugin / Hook 类扩展

OpenCode 官方 Plugins 文档说明，plugin 可以 hook into various events，用来扩展功能、集成外部服务或修改默认行为；可以放在 `.opencode/plugins/` 或 `~/.config/opencode/plugins/` 中并在启动时自动加载。

课程初期不建议让学生写复杂 plugin，但可以讲概念：

```text
Skill 负责“告诉 Agent 怎么做”；
Permission 负责“限制 Agent 能做什么”；
Plugin 负责“在特定事件上自动插入行为”。
```

例如未来可以做：

* 自动记录 Agent 操作日志；
* 每次任务结束后自动提醒查看 git diff；
* 检测到 push 前自动检查分支；
* 检测到修改代码后自动建议运行测试。

---

# 8. 本节推荐 Demo

## Demo 1：从普通 Prompt 到结构化 Prompt

先让学生对 Agent 说：

```text
帮我修一下 bug。
```

观察它可能会问不清楚或直接乱改。

然后改成：

```text
目标：
- 修复 divide 函数除零问题。

上下文：
- 项目是 Python calculator。
- 测试文件在 tests/。

约束：
- 不要修改函数名。
- 不要新增依赖。

验收标准：
- 除数为 0 时抛出 ValueError。
- pytest 全部通过。
- 最后总结修改文件。
```

让学生感受 Prompt 结构的价值。

## Demo 2：AGENTS.md 改善 Agent 表现

第一次不放 `AGENTS.md`，让 Agent 自己猜测试命令。

第二次加入：

```markdown
## Test
- Run tests with: pytest
```

观察 Agent 是否更快找到验证命令。

## Demo 3：Git Safe Push Skill

让学生输入：

```text
Use the git-safe-push skill.
请一键检查并 push 当前项目。
```

展示 Agent 自动完成：

```text
检查 Git 仓库
检查 origin
检查分支
查看 status / diff
检查风险文件
commit
push
```

同时展示它不会 force push，也不会无提醒地直接推 main。

---

# 9. 本节总结

这一节的核心不是“学会更多 AI 工具”，而是建立一种工程化使用 Agent 的方法。

从低到高可以总结为：

```text
代码补全：AI 帮我写下一行。
对话式改代码：AI 回答我怎么改。
Coding Agent：AI 进入项目，读文件、改代码、跑命令、做验证。
工程化 Agent：通过上下文文件、Skill、权限、Hooks、MCP、Git 工作流，让 Agent 稳定、安全、可复用地工作。
```

学生需要记住三句话：

```text
1. Prompt 只解决一次对话，项目配置解决长期上下文。
2. Skill 不是魔法，而是把重复流程写成可复用操作规程。
3. Agent 可以执行，但人类必须审查；Git、测试和权限控制是安全边界。
```
