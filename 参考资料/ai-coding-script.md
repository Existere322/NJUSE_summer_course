# 基于 OpenCode + SuperPowers 实现 Agent Harness

## 前置工作

1. 已经根据《智能软件教学科研GAI Token Hub平台使用指南》配置好 OpenCode 和 NewAPI。
1. 已经在 OpenCode 中安装好 SuperPowers。（其实就是在 OpenCode 中输入神奇的 Prompt "Fetch and follow instructions from https://raw.githubusercontent.com/obra/superpowers/refs/heads/main/.opencode/INSTALL.md"，Agent 会帮你搞定一切）

## Step 1. 准备工作区目录

创建一个工作区目录，例如这里的 `agent-harness-demo`，然后把两份作业要求放到目录中，这是 Agent 开发的重要指导。

同时你也应该浏览这两份文件。

其中 AI4SE_Final_Project_0_通用要求.md 重点关注**四、工作流程与交付要求**，Agent 操作过程中会产出 `SPEC.md`, `PLAN.md`, `SPEC_PROCESS.md`，你需要检查这些文件的存在性和正确性。

此外还有 `AGENT_LOG.md` 可借助 OpenCode 的 `/export` 命令导出，并加入人工的修改记录。

最终项目完成时需完成 `REFLECTION.md` 反思报告。

选择 Agent Harness 题目时还需浏览 `AI4SE_Final_Project_A_Coding_Agent_Harness.md` 文件，细节让 OpenCode 处理，不过你需要对最终的输出负责。

## Step 2. SuperPowers 加持下的 brainstorming

用提示词引导 Agent 开始开发。

一步步地做架构决策：技术选型、责任分配、数据模型……（就像软件架构课中学到的那样）

一步步地确认实现方案。

直至生成 TODO List。

## Step 3. TDD driven 的 subagent 任务开发

> 通用要求中，4.5 自我验证：用"陌生"智能体冷启动试运行，事实上 subagent 已经能实现类似的效果。

（……相当漫长的等待，若干小时，这中间也没有比较好的介入点……）

## Step 4. 后续迭代

demo 实现后需要从你的视角（或者作业要求的视角）审视 demo 效果，并引导 agent 修复（或者手动修复）。
