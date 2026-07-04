---
name: git-safe-push
description:  当用户希望安全地检查 Git 状态、初始化仓库、连接远程仓库、提交修改并推送到远程分支时，使用这个 Skill。这个 Skill 主要用于教学场景，帮助学生借助 Agent 避免繁琐 Git 配置，同时保留必要的人类审查与安全边界。
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

---

name: git-safe-push
description: 当用户希望一键检查 Git 状态、提交修改并 push 到远程仓库时使用。本 Skill 用于教学场景，帮助学生用 Agent 自动完成安全的 Git push 流程。
-------------------------------------------------------------------------------------------------

# Git Safe Push Skill

## 目标

帮助用户完成安全 Git 流程：

```text
检查仓库 → 检查 remote → 检查 diff → 检查风险文件 → commit → push
```

核心原则：

> 先检查，再提交；先审查，再 push。

---

## 必须遵守的规则

1. **提交前必须运行：**

```bash
git status
git diff
```

2. **禁止 force push：**

不要执行：

```bash
git push --force
git push -f
git push --force-with-lease
```

3. **当前分支是 `main` 或 `master` 时必须提醒用户。**

如果是第一次 push 个人教学仓库，可以继续；否则建议创建功能分支。

4. **提交前检查敏感文件。**

如果发现下面文件或内容，停止提交并提醒用户：

```text
.env
.env.local
id_rsa
token
secret
password
api_key
PRIVATE KEY
sk-
```

5. **不要隐藏操作。**

执行关键命令前，用一句话说明正在做什么。

---

## 执行流程

### Step 1：检查是否是 Git 仓库

```bash
git rev-parse --is-inside-work-tree
```

如果不是 Git 仓库，执行：

```bash
git init
git branch -M main
```

---

### Step 2：检查 remote origin

```bash
git remote -v
```

如果没有 `origin`，请用户提供远程仓库 URL，然后执行：

```bash
git remote add origin <远程仓库URL>
```

如果 `origin` 已存在但地址不对，提醒用户确认后再执行：

```bash
git remote set-url origin <远程仓库URL>
```

---

### Step 3：检查当前分支

```bash
git branch --show-current
```

如果当前分支是 `main` 或 `master`，提醒用户：

```text
当前正在主分支上操作。教学仓库第一次 push 可以继续；功能开发建议新建分支。
```

如需新建分支：

```bash
git checkout -b agent/safe-push
```

---

### Step 4：检查修改内容

```bash
git status
git diff --name-only
git diff
```

简要总结：

```text
修改文件：
- ...

主要修改：
- ...

风险检查：
- 未发现敏感信息 / 发现风险，已停止
```

如果发现敏感文件或明显无关修改，停止执行。

---

### Step 5：暂存并提交

如果修改安全，执行：

```bash
git add .
```

生成一个简短 commit message，使用 Conventional Commits：

```text
feat: ...
fix: ...
docs: ...
test: ...
refactor: ...
chore: ...
```

第一次提交优先使用：

```text
chore: initial commit
```

然后执行：

```bash
git commit -m "<commit-message>"
```

如果没有可提交内容，不要创建空 commit。

---

### Step 6：push 当前分支

先确认当前分支：

```bash
git branch --show-current
```

第一次 push 当前分支：

```bash
git push -u origin <当前分支名>
```

如果已经设置 upstream：

```bash
git push
```

禁止使用 force push。

---

## 完成后的汇报格式

```text
Git Safe Push 完成。

当前分支：
远程仓库：
本次提交：
Push 结果：

检查结果：
- Git 仓库：通过
- remote origin：通过
- diff 检查：通过
- 敏感信息检查：通过 / 已停止
- commit：完成 / 无需提交
- push：完成 / 未执行

下一步：
如果这是功能分支，可以到远程仓库创建 Pull Request。
```