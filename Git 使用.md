# Git 与 Agent 协作入门讲稿

# 一、Git 是什么：代码版本记录器

### 讲述

我们后面会使用 Coding Agent，让 AI 帮我们修改代码、修 bug、写测试，甚至执行命令。

但是这里有一个很重要的问题：

> 如果 Agent 一次性改了很多文件，我们怎么知道它到底改了什么？

如果没有 Git，Agent 改完代码之后，我们只能打开文件一个个看。这样很容易漏掉问题，比如：

- 它有没有改到不该改的文件？
- 它有没有偷偷删除某些内容？
- 它有没有引入新的 bug？
- 如果改坏了，我们怎么恢复？

所以，在使用 Agent 之前，我们必须先理解 Git。

一句话说：

> **Git 是代码版本记录器。它会记录每一次代码变化，让我们知道代码从哪里来、改了什么、能不能撤回。**

------

## 1.1 Git 的四层模型

Git 最重要的心智模型是四层：

```text
工作区 → 暂存区 → 本地仓库 → 远程仓库
```

可以这样理解：

| 层级     | 含义                                 | 类比       |
| -------- | ------------------------------------ | ---------- |
| 工作区   | 你正在编辑的代码文件                 | 草稿纸     |
| 暂存区   | 准备放进下一次提交的修改             | 打包区     |
| 本地仓库 | 你电脑上的版本历史                   | 本地档案馆 |
| 远程仓库 | GitHub / GitLab / Gitee 上的共享仓库 | 云端档案馆 |

对应的命令是：

```bash
git status
git diff
git add
git commit
git push
git pull
```

### 讲述

我们可以把 Git 操作理解成一个流水线。

首先，你在工作区修改代码。
然后，用 `git add` 把一部分修改放到暂存区。
接着，用 `git commit` 形成一次正式的版本记录。
最后，用 `git push` 把这个版本同步到远程仓库。

也就是说：

```text
修改代码 → git add → git commit → git push
```

但是在提交之前，我们一定要先检查：

```text
git status → git diff → git add → git commit
```

所以今天最重要的一句话是：

> **先看状态，再看 diff，再提交。**

------

# 二、从本地项目连接远程仓库

这一节我们不从 `git clone` 开始，而是假设我们已经在本地有一个项目，现在要把它连接到自己新建的远程仓库。

## 2.1 场景设定

假设我们现在有一个本地项目：

```text
agent-git-demo/
├── README.md
├── calculator.py
└── test_calculator.py
```

我们想把这个项目上传到 GitHub / GitLab / Gitee 上的一个新仓库。

------

## 2.2 在平台上创建空远程仓库

### 讲述

首先，我们打开 GitHub 或者 GitLab，创建一个新的仓库。

这里建议大家注意一点：

> 创建远程仓库时，最好先创建一个空仓库，不要勾选 README、LICENSE、.gitignore。

因为如果远程仓库里已经有 README，而本地也有自己的提交，第一次 push 时可能会出现历史不一致的问题。对于初学者来说，先用空仓库最简单。

创建完成后，平台会给我们一个远程仓库地址，例如：

```bash
https://github.com/yourname/agent-git-demo.git
```

这个地址就是我们后面要连接的 `origin`。

------

## 2.3 初始化本地 Git 仓库

进入本地项目目录：

```bash
cd agent-git-demo
```

初始化 Git：

```bash
git init
```

设置主分支名称为 `main`：

```bash
git branch -M main
```

### 讲述

`git init` 的意思是：让当前文件夹变成一个 Git 仓库。

执行之后，项目里会出现一个隐藏目录 `.git`。这个目录里保存了 Git 的版本信息。

注意：

> 不要手动删除 `.git` 目录。删除它就相当于删除这个项目的 Git 历史。

------

## 2.4 配置用户名和邮箱

如果是第一次使用 Git，需要配置用户名和邮箱：

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

### 讲述

这两个配置会记录在 commit 里，用来说明这次提交是谁做的。

可以用下面命令查看配置：

```bash
git config --global --list
```

------

## 2.5 查看当前状态

```bash
git status
```

第一次查看时，Git 会告诉我们当前有一些文件还没有被跟踪，也就是 `untracked files`。

例如：

```text
Untracked files:
  README.md
  calculator.py
  test_calculator.py
```

这说明 Git 发现了这些文件，但还没有把它们纳入版本管理。

------

## 2.6 添加远程仓库

把刚才创建的远程仓库地址添加进来：

```bash
git remote add origin https://github.com/yourname/agent-git-demo.git
```

查看是否添加成功/已有 origin 内容：

```bash
git remote -v
```

如果提示远程仓库已存在可以通过如下命令修改

```bash
git remote set-url origin https://github.com/yourname/agent-git-demo.git
```

如果成功，会看到类似输出：

```text
origin  https://github.com/yourname/agent-git-demo.git (fetch)
origin  https://github.com/yourname/agent-git-demo.git (push)
```

### 讲述

这里的 `origin` 是远程仓库的默认名字。

可以理解为：

```text
origin = 我这个本地项目对应的云端仓库
```

以后我们执行：

```bash
git add .
git commit -m "init_repo"
git push origin main
```

意思就是：

> 把本地的 main 分支推送到 origin 这个远程仓库。

------

# 三、基本工作流：第一次 commit 和 push


现在本地项目已经连接到了远程仓库，接下来我们完成第一次提交。

## 3.1 查看状态

```bash
git status
```

确认有哪些文件还没有提交。

------

## 3.2 添加文件到暂存区

```bash
git add .
```

这里的 `.` 表示添加当前目录下所有修改。

但是在真实项目中，大家不要永远无脑 `git add .`。如果项目很复杂，建议先看清楚修改了哪些文件，再选择性添加：

```bash
git add README.md
git add calculator.py
```

------

## 3.3 查看暂存区 diff

```bash
git diff --staged
```

### 讲述

`git diff` 是看工作区还没有暂存的修改。

`git diff --staged` 是看已经放进暂存区、准备提交的修改。

在 commit 之前看一眼 diff，是非常重要的习惯。

尤其是之后我们让 Agent 修改代码时，必须先看 diff。

------

## 3.4 创建第一次 commit

```bash
git commit -m "chore: initial commit"
```

### 讲述

`commit` 是一次正式的版本记录。

我们可以把一次 commit 理解为：

> 给当前代码状态拍一张快照，并写一句说明。

这里的 commit message 是：

```text
chore: initial commit
```

它使用的是一种常见规范，叫 Conventional Commits。

常见类型有：

| 类型     | 含义   | 示例                       |
| -------- | ------ | -------------------------- |
| feat     | 新功能 | feat: add login page       |
| fix      | 修 bug | fix: handle empty input    |
| docs     | 文档   | docs: update README        |
| test     | 测试   | test: add calculator tests |
| refactor | 重构   | refactor: simplify parser  |
| chore    | 杂项   | chore: initial commit      |

------

## 3.5 第一次 push 到远程仓库

```bash
git push -u origin main
```

### 讲述

这条命令的意思是：

> 把本地的 main 分支推送到 origin 远程仓库，并建立默认关联。

`-u` 的作用是设置 upstream。设置之后，下次在当前分支上可以直接写：

```bash
git push
```

不用每次都写：

```bash
git push origin main
```

推送成功后，刷新 GitHub 页面，就可以看到本地代码已经出现在远程仓库里。

到这里，我们已经完成了第一条完整链路：

```text
本地项目 → git init → remote add origin → add → commit → push → 远程仓库
```

------

# 四、Agent 为什么需要 Git

### 讲述

现在我们已经知道怎么把本地项目推送到远程仓库。接下来回到这门课的主题：Agent。

Agent 很强，它可以：

- 读代码；
- 改代码；
- 新建文件；
- 删除文件；
- 执行测试；
- 甚至帮我们提交代码。

但正因为它能做这么多事，所以我们更需要 Git 来约束它。

Agent 改代码之后，Git 可以帮我们回答五个问题：

1. **改了什么？**
   用 `git diff` 看。
2. **为什么改？**
   用 commit message 记录。
3. **能不能撤回？**
   用 `git restore`、`git revert` 等命令。
4. **能不能给别人 review？**
   push 到远程分支，创建 Pull Request。
5. **能不能触发 CI？**
   远程仓库收到 push 后，可以自动触发测试、构建、部署。

所以，Agent 不是 Git 的替代品。

更准确地说：

> **Agent 负责生成修改，Git 负责记录、审查和同步修改。**

或者说：

> **没有 Git 的 Agent 是黑箱改代码；有 Git 的 Agent 才是可审查、可回滚、可协作的工程助手。**

------

# 五、Agent 辅助 Git 的三个 Prompt

接下来我们讲三个最常用的 Prompt。

## Prompt 1：解释 diff

当 Agent 修改完代码之后，不要马上提交。
我们可以先让 Agent 解释当前 diff。

```text
请查看当前 Git diff，按文件解释修改内容。
不要修改文件，不要提交代码。
重点说明：
1. 每个文件改了什么；
2. 为什么需要这样改；
3. 有没有可能存在无关修改。
```

### 讲述

这个 Prompt 的目的不是让 Agent 继续写代码，而是让它变成一个“代码讲解员”。

我们要训练自己形成习惯：

```text
Agent 改完 → git diff → Agent 解释 diff → 人类判断
```

------

## Prompt 2：生成 commit message

如果我们已经确认修改没问题，并且已经执行：

```bash
git add .
```

这时可以让 Agent 根据暂存区内容生成 commit message。

```text
请根据当前 staged diff 生成一个符合 Conventional Commits 规范的 commit message。
只输出 commit message，不要执行 git commit。
```

可能输出：

```text
fix: handle division by zero
```

或者：

```text
feat: add calculator divide operation
```

### 讲述

这个 Prompt 适合初学者，因为很多同学不知道 commit message 怎么写。

但注意，我们这里只让 Agent 生成 message，不让它提交。

------

## Prompt 3：安全提交

当我们比较信任 Agent，并且已经知道当前修改内容时，可以让它帮我们执行提交。

```text
请检查当前 diff，如果没有敏感信息和无关文件，就帮我 git add 并 commit。
要求：
1. 先展示将要提交的文件列表；
2. commit message 使用 Conventional Commits；
3. 不要 push；
4. 不要使用 --force；
5. 不要修改其他文件；
6. 如果发现密钥、密码、token、无关文件，立即停止并提醒我。
```

### 讲述

这里最关键的是两个限制：

```text
不要 push
不要 force
```

因为 commit 只是保存到本地，出问题还比较容易处理。
但是 push 会把代码同步到远程，影响团队其他人。
而 `--force` 更危险，可能覆盖别人已经提交的代码。

所以我们的原则是：

> **可以让 Agent 辅助 commit，但 push 和 merge 最好由人类最终确认。**

------

# 六、Demo：修 bug + 提交 + push

最后我们做一个完整 Demo。

## 6.1 当前项目状态

假设我们的项目里有一个简单的计算器文件：

```python
def add(a, b):
    return a + b

def divide(a, b):
    return a / b
```

这里有一个潜在 bug：当 `b = 0` 时，会直接报错。
我们希望 Agent 帮我们改成：如果除数为 0，主动抛出 `ValueError`，并添加测试。

------

## 6.2 创建 Agent 工作分支

不要直接在 `main` 上让 Agent 改代码。
先创建一个新分支：

```bash
git checkout -b agent/fix-divide-zero
```

### 讲述

分支的意义是：

> 把这次 Agent 修改隔离起来，不影响 main 分支。

推荐大家以后使用 Agent 做任务时，都先创建一个类似这样的分支：

```bash
agent/fix-login-bug
agent/add-readme
agent/refactor-parser
```

------

## 6.3 给 Agent 任务

对 Agent 输入：

```text
请修复 calculator.py 中 divide 函数的除零问题。
要求：
1. 当除数为 0 时抛出 ValueError；
2. 添加对应单元测试；
3. 运行测试；
4. 不要提交代码；
5. 完成后汇报修改了哪些文件。
```

Agent 修改完成后，我们不急着提交。

------

## 6.4 人类查看状态和 diff

先看状态：

```bash
git status
```

再看 diff：

```bash
git diff
```

如果有测试，就运行：

```bash
pytest
```

### 讲述

这一步非常关键。

我们不是让 Agent 改完就结束，而是要检查它的工作结果。

标准流程是：

```text
Agent 修 bug → 人看 diff → 人跑测试 → 再决定是否提交
```

------

## 6.5 让 Agent 解释 diff

继续对 Agent 输入：

```text
请查看当前 Git diff，按文件解释这次修改。
不要修改文件，不要提交。
请特别说明是否存在无关修改。
```

如果确认没有问题，就提交。

------

## 6.6 提交代码

可以人工提交：

```bash
git add .
git commit -m "fix: handle division by zero"
```

也可以让 Agent 安全提交：

```text
请将当前修改提交。
要求：
1. 先展示将要提交的文件；
2. commit message 使用：fix: handle division by zero；
3. 不要 push；
4. 不要修改其他文件。
```

------

## 6.7 push 到远程分支

最后由人类执行：

```bash
git push -u origin agent/fix-divide-zero
```

推送之后，打开远程仓库，可以看到一个新的分支。

如果是 GitHub，可以继续创建 Pull Request：

```text
agent/fix-divide-zero → main
```

在 Pull Request 页面里，我们可以看到：

- 这次提交的 commit message；
- 修改了哪些文件；
- 每一行代码的 diff；
- 如果配置了 CI，还能看到测试是否通过。

------

# 七、全节总结

今天我们讲了 Git 和 Agent 协作的最小流程。

完整链路是：

```text
本地项目
  ↓ git init
连接远程仓库
  ↓ git remote add origin
第一次提交
  ↓ git add / git commit
推送 main
  ↓ git push -u origin main
创建 Agent 分支
  ↓ git checkout -b agent/xxx
Agent 修改代码
  ↓
人类查看 git status / git diff
  ↓
运行测试
  ↓
commit
  ↓
push 到远程分支
  ↓
Pull Request / CI
```

最重要的原则是：

> **先看状态，再看 diff，再提交。**

对 Agent 来说，最重要的原则是：

> **Agent 负责执行，人类负责判断；Agent 可以帮忙提交，但不能无审查地 push、force push 或 merge。**

最后用一句话总结：

> **Git 让 Agent 的代码修改变得可审查、可回滚、可协作。学会 Git，不是为了背命令，而是为了安全地驾驭 Agent。**