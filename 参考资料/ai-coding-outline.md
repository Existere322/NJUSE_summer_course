# AI Coding Agent + SuperPowers 入门（30 分钟 · 大一软件工程）

---

## 总体结构

```
Coding Agent 是什么（第一幕）
  ↓
「裸 Agent」的局限性（第二幕）
  ↓
Super Powers 加持（第三幕）
  ↓
SuperPowers 的技能库（第四幕）
  ↓
动手用起来（第五幕）
```

---

## 第一幕：Coding Agent 是什么？（5 min）

**目标**：让学生理解 Coding Agent 不是"另一个 ChatGPT"，而是一个**能真正操作代码库的编程搭档**。

### 场景代入

> 你写了一个 bug，要找原因：打开终端 `grep` 搜索关键字 → 读代码文件 → 修复 → 跑测试 → 提交。这一串操作，过去全部手动完成。
>
> Coding Agent 来了：你跟它说"帮我找到这个 bug 并修复"，它自己搜索文件、读代码、改代码、跑测试、提交——你只需要 review 结果。

### 核心能力

Coding Agent = 大语言模型 + **工具（Tools）**：

| 能力 | 说明 |
|------|------|
| 读文件 | 可以打开并理解项目中的任意文件 |
| 写文件 | 创建、修改、删除代码文件 |
| 执行命令 | 在终端中运行命令（`grep`、`npm test`、`git commit`） |
| 搜索 | 在代码库中按文件名、文件内容搜索 |
| 对话 | 理解你的需求，解释它在做什么 |

### 具体实例：OpenCode

- 开源 Coding Agent 之一，GitHub Stars 增长最快的项目之一
- 使用 `opencode.json` 配置文件，支持插件扩展
- 核心工作模式：你描述任务（"给这个项目加一个单元测试"）→ Agent 自主完成 → 你 review 结果

> 🎯 **Coding Agent = 一个能读、能写、能跑命令、能跟你讨论代码的 AI 编程搭档。**

---

### 第一幕 → 第二幕 衔接

> 听起来很强大——但如果你真的用它做过一个完整项目，会发现一个尴尬的事实：**它经常跑偏。**
>
> 拿到需求就写代码，写到一半发现方向错了；改了一个 bug 但没跑测试就直接提交；代码是写出来了但架构一塌糊涂……这不是它笨，是它缺少一个东西——**流程**。

---

## 第二幕：「裸 Agent」的局限性（5 min）

**目标**：说明没有方法论加持的 Coding Agent 有哪些常见问题。

### 问题一：拿到需求就写代码

- 用户说"帮我做个笔记应用" → Agent 直接开始写
- 写到一半你发现：它选的框架你不熟悉、数据库用的是你不会的技术
- **缺什么**：没有先做设计讨论，没有确认需求就动手

### 问题二：不写测试

- Agent 改了一个函数，没有跑测试验证
- 你 review 时发现它引入了一个新 bug
- **缺什么**：没有 TDD 约束，没有验证机制

### 问题三：不记上下文

- 上一个会话讨论了架构，下一个会话 Agent 完全不记得
- 同样的决策反复讨论
- **缺什么**：没有设计文档留存

### 问题四：一次只盯一个文件

- Agent 改了一个模块，但没有检查依赖它的其他模块
- 集成时才发现不兼容
- **缺什么**：没有全局规划和任务分解

### 小结

| 裸 Agent 的问题 | 本质上是缺什么 |
|----------------|--------------|
| 拿到需求就写 | 缺少**设计环节** |
| 不写测试就提交 | 缺少**质量门禁** |
| 不记上下文 | 缺少**文档产出** |
| 只盯一个文件 | 缺少**任务分解与并行** |

> 🎯 **裸 Agent 是一个很强的"执行者"，但不是好的"工程师"。它需要一套方法论来引导它——就像新程序员需要一个有经验的导师带着走流程。**

---

### 第二幕 → 第三幕 衔接

> 如果我们可以给 Coding Agent 一套"操作手册"——碰到需求先做设计、写代码之前先写测试、改完代码要 review……那它是不是就能像个有经验的工程师一样工作了？
>
> 这就是 **SuperPowers** 在做的事。它是一套方法论，以 **Skills（技能）** 的形式注入到 Agent 的上下文中，让 Agent 在每一个环节都知道"现在该做什么、怎么做"。
>
> 名字一语双关：**给 Coding Agent "超能力"（Super Powers），而实现方式就是一套名为 SuperPowers 的技能系统。**

---

## 第三幕：如何赋予 Coding Agent "Super Powers"？（5 min）

**目标**：讲清 SuperPowers 的机制——它不是"再训练一个模型"，而是通过 Skills 注入流程。

### 核心机制：Skills（技能）

每个 Skill 是一个 Markdown 文件（`SKILL.md`），包含：
- **触发条件**：什么情况下激活（`description` 字段描述）
- **执行流程**：分步骤指导 Agent 怎么做
- **硬性规则**：必须遵守的约束（如 brainstorming 的"不写完设计不准写代码"）

```
Skill = 一段结构化的指令，告诉 Agent "在某种情况下，你应该怎么做"
```

### 安装即生效

- 在 OpenCode 中安装 SuperPowers 插件：
  ```json
  {
    "plugin": ["superpowers@git+https://github.com/obra/superpowers.git"]
  }
  ```
- 安装后所有 Skills 自动注册
- Agent 在启动时会加载 `using-superpowers` 这个引导 Skill
- 引导 Skill 的**核心规则**：

> "如果你觉得有 1% 的可能某个 Skill 适用于当前任务，你必须激活它。不是可选的，不是可商量的。"

### 工作流程（SuperPowers 加持后）

```
你的需求
  ↓
brainstorming Skill 激活 → 讨论设计 → 写设计文档（SPEC.md）
  ↓
writing-plans Skill 激活 → 分解任务 → 写实现计划（PLAN.md）
  ↓
subagent-driven-development 激活 → 每个任务派一个子 Agent 完成
  ├── test-driven-development 约束 → 先写测试，再写代码
  ├── requesting-code-review → 完成任务后审查
  └── verification-before-completion → 验证通过才算完成
  ↓
finishing-a-development-branch → 测试都通过 → 合并还是提 PR？
```

> 🎯 **SuperPowers = 一套工程方法论 + 可执行的 Skill 文件。Agent 不再凭"本能"写代码，而是按工程流程走。**

---

### 第三幕 → 第四幕 衔接

> SuperPowers 到底提供了哪些具体技能？每个技能负责什么？接下来我们拆开看看。
>
> 技能库可以按用途分为四类：**设计类、实现类、协作类、元技能**。

---

## 第四幕：SuperPowers 的技能库（8 min）

**目标**：逐一介绍 14 个 Skills，让学生知道每个技能解决什么问题。

### 设计类

| Skill | 触发场景 | 它做什么 |
|-------|---------|---------|
| **brainstorming** | 任何创意/开发工作之前 | 先问清楚需求、探索多种方案、分块确认设计、产出设计文档。**铁律：没有设计不准写代码** |
| **writing-plans** | 设计确认后、实现开始前 | 把设计拆成 2-5 分钟一个的小任务，每个任务包含：改哪个文件、写什么代码、怎么验证 |

### 实现类

| Skill | 触发场景 | 它做什么 |
|-------|---------|---------|
| **test-driven-development** | 写任何功能代码前 | RED（写一个会失败的测试）→ GREEN（写最少代码让它通过）→ REFACTOR（重构）。**铁律：代码必须写在测试之后** |
| **subagent-driven-development** | 有实现计划要执行 | 为每个任务启动一个"干净的"子 Agent，独立完成，完成后执行两阶段 review（符合设计？代码质量？） |
| **executing-plans** | 有实现计划、需要在当前会话中分批执行 | 类似 subagent 但分批执行、每次执行后有人工检查点 |
| **dispatching-parallel-agents** | 有 2 个以上独立任务 | 同时派多个子 Agent 并行工作，互不等待 |
| **using-git-worktrees** | 开始新功能开发时 | 创建隔离的 Git 工作区，不影响主分支 |

### 协作 / 质量保障类

| Skill | 触发场景 | 它做什么 |
|-------|---------|---------|
| **systematic-debugging** | 遇到 bug、测试失败 | 4 阶段根因分析：重现 → 缩小范围 → 定位根因 → 修复验证。**不猜，按流程查** |
| **requesting-code-review** | 完成任务后、合并之前 | 对照实现计划逐条检查、标记问题的严重级别、阻塞性问题不准通过 |
| **receiving-code-review** | 收到 review 反馈时 | 不盲目改——验证反馈是否合理、有疑问先确认再动手 |
| **verification-before-completion** | 声称"搞定了"之前 | 先跑一遍验证命令，确认输出正确再报告——**先有证据，再下结论** |
| **finishing-a-development-branch** | 全部功能完成、测试通过 | 验证测试 → 给出选项：合并/提 PR /保留分支 / 丢弃，帮你做决策 |

### 元技能

| Skill | 触发场景 | 它做什么 |
|-------|---------|---------|
| **using-superpowers** | 每次会话启动时 | 加载整套技能系统、告诉 Agent "有技能必须用、1% 概率也要触发" |
| **writing-skills** | 需要创建/修改/测试新 Skill | 如果现有技能不能满足需求，可以自己写新的 Skill |

### 一张图总结

```
                     SuperPowers Skills
                    ┌────────────────────┐
     设计           │ brainstorming       │
     阶段           │ writing-plans       │
                    ├────────────────────┤
     实现           │ test-driven-devel.  │
     阶段           │ subagent-driven-dev │
                    │ executing-plans     │
                    │ dispatching-parallel│
                    │ using-git-worktrees │
                    ├────────────────────┤
     质量           │ systematic-debugging│
     保障           │ requesting-code-rev │
                    │ receiving-code-rev  │
                    │ verification-before │
                    │ finishing-a-branch  │
                    ├────────────────────┤
     元技能         │ using-superpowers   │
                    │ writing-skills      │
                    └────────────────────┘
```

> 🎯 **每个 Skill 解决一个"裸 Agent 会犯的错误"。装上一整套，Agent 就从一个"会写代码的聊天机器人"变成了一个"遵守工程流程的 AI 工程师"。**

---

### 第四幕 → 第五幕 衔接

> 说了这么多，那实际用起来是什么感觉？我们看一下一个真实项目——基于 OpenCode + SuperPowers 完成课程设计——是怎么一步步走下来的。

---

## 第五幕：SuperPowers 使用实战（7 min）

**目标**：基于真实流程，展示从安装到完成的全过程。

### 安装

在 OpenCode 中一句话完成：

```
Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md
```

Agent 会自己读文档、改 `opencode.json`、重启加载插件。

### 真实项目流程（参考 `script.md`）

以一个课程设计项目为例，流程分四步走：

#### Step 1：准备工作区

- 创建项目目录
- 放入作业要求文档（`通用要求.md`、`题目说明.md`）
- 浏览文件，了解约束

#### Step 2：Brainstorming 设计阶段

> "一步步地做架构决策：技术选型、责任分配、数据模型……一步步地确认实现方案。直至生成 TODO List。"

- Agent 激活 `brainstorming` Skill
- 与你讨论：用什么技术栈？模块怎么划分？数据怎么存？
- 每确认一个部分，写一段设计文档
- 最终产出：`SPEC.md`（设计文档）+ TODO List

**此时打开项目目录可以看到这些文件：**
```
agent-harness-demo/
├── AI4SE_Final_Project_0_通用要求.md
├── AI4SE_Final_Project_A_Coding_Agent_Harness.md
├── SPEC.md              ← 设计文档
└── PLAN.md              ← 待生成
```

#### Step 3：Subagent 驱动的 TDD 实现

- `writing-plans` Skill 激活 → 把 TODO List 变成实现计划 → 产出 `PLAN.md`
- `subagent-driven-development` Skill 激活 → 每个任务启动一个子 Agent
- 每个子 Agent 受 `test-driven-development` 约束：先写测试，再写代码，再重构
- 任务完成后 `requesting-code-review` 检查质量
- 全部完成后 `finishing-a-development-branch` 处理合并

**这个过程可能需要几小时，但 Agent 自主完成，你只需要检查最终结果。**

#### Step 4：后续迭代

- 检查 demo 效果
- 如果不符合预期，引导 Agent 修复
- 最终产出还包括：`AGENT_LOG.md`（操作日志）、`REFLECTION.md`（反思报告）

### 完整产出物

| 文件 | 说明 | 由什么生成 |
|------|------|-----------|
| `SPEC.md` | 设计文档 | brainstorming |
| `PLAN.md` | 实现计划 | writing-plans |
| `AGENT_LOG.md` | 操作日志 | 人工 `/export` 导出 + 修改记录 |
| `REFLECTION.md` | 反思报告 | 人工完成 |
| 源代码 | 项目代码 | subagent TDD |

> 🎯 **你的角色不再是"写代码的人"，而是"提需求、做决策、审结果的人"。Agent 负责执行，你负责把关。**

---

## 全景总结

```
                Coding Agent（如 OpenCode）
                       ↓ 裸 Agent 会跑偏
                ┌──────────────────────┐
                │  缺设计 → 直接写代码  │
                │  缺测试 → 埋下 bug    │
                │  缺文档 → 上下文丢失  │
                │  缺规划 → 只见树木    │
                └──────────────────────┘
                       ↓ 安装 SuperPowers
                ┌──────────────────────┐
                │  brainstorming 保设计  │
                │  TDD 保质量            │
                │  subagent 保效率       │
                │  writing-plans 保规划  │
                │  code-review 保正确性  │
                └──────────────────────┘
                       ↓
            一个遵守工程流程的 AI 工程师
```

**一句话总结**：

> **OpenCode 给了 Agent"手脚"（读文件、写代码、跑命令），SuperPowers 给了它"大脑"（什么时候该做什么、按什么流程做）。两者加起来，才是一个真正可用的 AI 编程搭档。**

### 课后任务

1. 安装 OpenCode（如果还没装）
2. 对 OpenCode 说：`Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md`
3. 验证安装：问 Agent "Tell me about your superpowers"
4. 试试看：说"我想做一个简单的 TODO 应用"——观察 `brainstorming` Skill 是不是先跟你讨论设计，而不是直接写代码

### 延伸阅读

- [SuperPowers GitHub](https://github.com/obra/superpowers)
- [SuperPowers for OpenCode 文档](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md)
- [OpenCode 官网](https://opencode.ai)

---

## 附录：节奏总览

| 幕 | 内容 | 时长 |
|----|------|------|
| 一 | Coding Agent 是什么（以 OpenCode 为例） | 5 min |
| 二 | 裸 Agent 的局限性 | 5 min |
| 三 | Super Powers 加持机制（Skills + 工作流） | 5 min |
| 四 | SuperPowers 技能库一览（14 个 Skills） | 8 min |
| 五 | 使用实战（安装 → 设计 → 实现 → 迭代） | 7 min |
