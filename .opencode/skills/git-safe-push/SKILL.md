---
name: git-safe-push
description:  当用户希望安全地检查 Git 状态、初始化仓库、连接远程仓库、提交修改并推送到远程分支时，使用这个 Skill。这个 Skill 主要用于教学场景，帮助学生借助 Agent 避免繁琐 Git 配置，同时保留必要的人类审查与安全边界。
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

# Git 安全检查与一键 Push Skill

## 目标

这个 Skill 用来帮助用户完成一套安全的 Git 工作流。

它可以帮助用户：

* 检查当前目录是否是 Git 仓库；
* 在需要时初始化 Git 仓库；
* 检查或设置 `origin` 远程仓库；
* 检查当前分支；
* 查看当前修改了哪些文件；
* 检查是否存在敏感文件或密钥；
* 生成合适的 commit message；
* 提交修改；
* 将当前分支 push 到远程仓库。

这个 Skill 的目的不是让用户完全不用学 Git，而是把重复、容易出错的 Git 操作封装起来，同时保留关键的安全检查。

核心理念：

> Agent 可以帮人执行 Git 操作，但人类仍然需要理解状态、审查 diff、确认分支，并对最终 push 负责。

---

# 适用场景

当用户提出类似需求时，使用本 Skill：

* “帮我检查并 push”
* “一键提交并推送”
* “帮我把这个项目 push 到 GitHub”
* “帮我连接远程仓库并推送”
* “检查当前 Git 状态，然后提交”
* “把当前修改提交到远程分支”
* “帮学生演示 Git 一键 push 流程”

---

# 安全规则

以下规则必须严格遵守。

## 规则一：提交前必须检查状态

在任何 commit 之前，必须先运行：

```bash
git status
```

然后检查当前修改了哪些文件。

不能在不知道修改内容的情况下直接提交。

---

## 规则二：禁止 force push

不要执行：

```bash
git push --force
git push -f
git push --force-with-lease
```

除非用户非常明确地要求，并且清楚知道后果。

在教学场景中，默认拒绝 force push。

---

## 规则三：不要无提醒地直接 push 到 main

如果当前分支是：

```text
main
master
```

必须提醒用户。

在学生实验中，优先建议创建功能分支：

```bash
git checkout -b agent/demo
```

或者：

```bash
git checkout -b agent/<任务名>
```

只有在以下情况下，才可以直接 push 到 `main`：

1. 这是个人演示仓库的第一次提交；
2. 用户明确表示可以 push 到 `main`；
3. 这是单人教学仓库，不涉及多人协作。

---

## 规则四：提交前检查敏感信息

提交前必须检查是否存在可能包含敏感信息的文件，例如：

* `.env`
* `.env.local`
* 文件名包含 `token`
* 文件名包含 `secret`
* 文件名包含 `key`
* `id_rsa`
* 私钥文件
* 凭据文件
* API key 配置文件

可以检查 diff 中是否存在可疑字符串，例如：

```text
api_key
apikey
secret
token
password
PRIVATE KEY
sk-
```

如果发现疑似敏感信息，必须停止提交，并提醒用户处理。

---

## 规则五：不要隐藏 Git 操作

执行关键 Git 命令之前，要简要说明将要做什么。

例如：

```text
我将依次检查仓库状态、确认远程 origin、查看修改文件、检查敏感信息，然后在安全的情况下提交并 push 当前分支。
```

这是教学 Skill，所以用户应该看到完整流程。

---

## 规则六：优先小步提交

如果当前修改包含多个无关任务，不要自动把所有内容放进一个 commit。

应该先总结修改类型，并建议用户拆分提交。

例如：

* 源代码修改；
* 测试修改；
* 文档修改；
* 配置修改；
* 无关临时文件。

---

# 工作流程

按下面步骤执行。

---

## Step 1：检查当前目录是否是 Git 仓库

运行：

```bash
git rev-parse --is-inside-work-tree
```

如果成功，继续下一步。

如果失败，说明当前目录还不是 Git 仓库。

这时初始化 Git：

```bash
git init
git branch -M main
```

然后继续。

---

## Step 2：检查当前分支

运行：

```bash
git branch --show-current
```

如果没有分支名，运行：

```bash
git status
```

并解释当前状态。

如果当前分支是 `main` 或 `master`，需要判断是否适合直接提交。

如果是第一次推送个人教学仓库，可以继续使用 `main`。

如果是功能开发，建议创建新分支：

```bash
git checkout -b agent/<任务名>
```

如果用户没有提供任务名，可以使用：

```bash
git checkout -b agent/safe-push
```

---

## Step 3：检查远程 origin

运行：

```bash
git remote -v
```

如果 `origin` 已存在，展示 fetch 和 push 地址，然后继续。

如果 `origin` 不存在，且用户已经提供远程仓库 URL，则添加：

```bash
git remote add origin <远程仓库URL>
```

然后验证：

```bash
git remote -v
```

如果 `origin` 已存在但指向错误仓库，不要直接覆盖。

先展示当前 URL，并询问用户是否替换。

用户确认后，运行：

```bash
git remote set-url origin <新的远程仓库URL>
```

---

## Step 4：检查工作区状态

运行：

```bash
git status
```

需要向用户说明：

* 当前分支；
* 是否有未跟踪文件；
* 是否有已修改文件；
* 是否有已暂存文件；
* 是否有内容需要提交。

如果没有任何可提交内容，不要创建空 commit。

如果没有修改但已有 commit，可以询问是否只 push 当前分支。

---

## Step 5：查看修改文件列表

运行：

```bash
git diff --name-only
```

如果有已暂存内容，也运行：

```bash
git diff --cached --name-only
```

按类别总结文件：

```text
源代码：
- ...

测试：
- ...

文档：
- ...

配置：
- ...

潜在风险文件：
- ...
```

如果发现风险文件，先停止提交。

---

## Step 6：检查 diff 内容

运行：

```bash
git diff
```

如果文件已经暂存，运行：

```bash
git diff --cached
```

总结 diff 内容，不需要逐行贴出全部 diff。

重点说明：

* 改了什么；
* 为什么可能需要这样改；
* 这些修改是否和当前任务相关；
* 是否有无关或可疑修改。

---

## Step 7：暂存安全文件

如果所有修改都是安全且相关的，可以执行：

```bash
git add .
```

如果存在无关修改，只暂存相关文件：

```bash
git add <文件1> <文件2>
```

暂存后运行：

```bash
git diff --cached --name-only
```

展示最终准备提交的文件列表。

---

## Step 8：生成 commit message

使用 Conventional Commits 规范生成 commit message。

常用类型：

```text
feat: 新功能
fix: 修复 bug
docs: 文档修改
test: 测试修改
refactor: 重构
chore: 杂项配置
```

示例：

```text
chore: initial commit
```

```text
feat: add todo filter
```

```text
fix: handle division by zero
```

```text
docs: add git safe push guide
```

规则：

* 默认使用英文 commit message；
* 如果用户要求中文，可以使用中文；
* 第一行保持简短；
* 第一次提交新仓库时，优先使用 `chore: initial commit`。

---

## Step 9：提交修改

提交前向用户展示：

```text
即将提交：
- 当前分支：
- 远程仓库：
- 暂存文件：
- commit message：
```

然后运行：

```bash
git commit -m "<commit-message>"
```

如果 Git 提示没有配置用户名和邮箱，引导用户运行：

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

然后重新提交。

---

## Step 10：push 当前分支

先检查当前分支：

```bash
git branch --show-current
```

第一次 push 当前分支时，运行：

```bash
git push -u origin <当前分支名>
```

如果之前已经设置过 upstream，可以运行：

```bash
git push
```

禁止使用 force push。

---

# 常见错误处理

## 错误一：src refspec main does not match any

如果 push 时出现：

```text
error: src refspec main does not match any
```

说明本地可能没有 `main` 分支，或者还没有任何 commit。

检查：

```bash
git branch
git log --oneline
```

如果还没有 commit，执行：

```bash
git add .
git commit -m "chore: initial commit"
git branch -M main
git push -u origin main
```

---

## 错误二：remote origin already exists

如果添加 origin 时出现：

```text
error: remote origin already exists.
```

说明 `origin` 已经存在。

先查看：

```bash
git remote -v
```

如果地址错误，修改：

```bash
git remote set-url origin <新的远程仓库URL>
```

---

## 错误三：远程仓库已有内容，本地 push 被拒绝

如果出现远程仓库和本地历史不一致，不要直接执行危险命令。

先解释原因：

```text
远程仓库已经有提交，本地仓库也有自己的提交，Git 无法直接合并两段历史。
```

然后根据情况选择：

* 如果远程仓库只是刚创建时自动生成的 README，可以考虑重新创建空仓库；
* 如果远程仓库内容重要，需要先 pull 或 rebase；
* 不要自动使用 `--force` 覆盖远程。

---

# 输出格式

完成后，按下面格式汇报：

```text
Git Safe Push 已完成。

仓库信息：
- 当前分支：
- 远程仓库：
- 本次提交：
- push 目标：

检查结果：
- Git 仓库检查：通过
- remote origin 检查：通过
- diff 检查：通过
- 敏感文件检查：未发现 / 已发现并停止
- commit 创建：是 / 否
- push 完成：是 / 否

下一步：
- 如果这是功能分支，可以打开远程仓库创建 Pull Request。
```

如果因为风险停止，按下面格式汇报：

```text
Git Safe Push 已停止。

停止原因：
- ...

建议处理：
- ...
```

---