# CI/CD 入门（50 分钟 · 大一软件工程）

---

## 总体结构

```
痛点（第一幕）
  ↓
CI/CD 核心活动 & 子工具（第二幕）
  ↓
CI/CD Pipeline 平台功能（第三幕）
  ↓
Configuration as Code（第四幕）
  ↓
全景总结 & 动手（第五幕）
```

**逻辑链**：

| 幕 | 核心问题 | 回答 | 对应文档章节 |
|----|---------|------|-------------|
| 二 | 要自动化什么？ | 构建 → 测试 → 部署 | 第 6 章 |
| 三 | 用什么平台来自动化？ | Pipeline 平台（功能体验） | 第 7 章 |
| 四 | 怎么告诉平台做什么？ | YAML 配置写成一个文件 | 第 8 章 |

---

## 第一幕：痛点引入（8 min）

**目标**：让学生代入"手动集成"的切肤之痛。

### 场景演绎

5 人小组做课程设计，分工开发不同模块：

- A 改了一个函数签名，B 拉下来编译报错
- C 本地 `npm test` 全绿，D 环境依赖版本不一致，跑不起来
- 第三天要交 demo，还在手动编译、手动 `scp` 部署到服务器
- 每次合并都有人喊"我这边怎么跑不了"

**核心矛盾**：代码改了很多，但"验证代码是否还能用"这件事还是纯手工。

**初步展示**：打开一个真实的 GitHub 仓库，点进 Actions 标签页，展示一排绿色 ✅。

> "GitHub 自带一个机器人——每次你 `git push`，它自动帮你跑编译、跑测试、部署。这节课就讲它是怎么做到的。"

---

### 第一幕 → 第二幕 衔接

> 刚才描述的"手动集成"场景，暴露了几件事：任务是在**自己的电脑**上执行的，环境配置因人而异所以跑出来的结果不一样，而且整个流程只有**自己想起来了才去做**。
>
> 那一个理想的自动化方案应该是怎样的？让这些任务转移到**服务器统一环境**执行，保证结果一致；并且每次代码变更**自动触发**，你不用惦记。这就是 CI/CD 要做的——把这些任务从**手动、本地、不定时**，变成**自动、统一环境、有固定触发机制**。

---

## 第二幕：CI/CD —— 一台上满发条的自动流水线（12 min）

**目标**：讲清 CI/CD 的三个核心活动，以及每个活动背后调用的具体工具。

> **本幕不展示任何 YAML 配置。**

### ① 构建（Build）—— 把源代码变成可运行的东西

**问题**：你写完了代码，怎么让它跑起来？

| 语言 | 需要做什么 | 常用工具 |
|------|-----------|---------|
| C/C++ | 编译 + 链接 | `make`（读 Makefile） |
| Java | 编译 + 打包 | `mvn compile`、`mvn package` |
| Node.js | 装依赖 + 打包 | `npm install` + `npm run build` |
| Python | 装依赖（不需要编译） | `pip install -r requirements.txt` |
| 容器化 | 构建镜像 | `docker build` |

**CI/CD 的角色**：自动替你调用这些工具，不用你手动敲：
```bash
npm install
npm run build
```
它们会被自动按顺序执行。

### ② 测试（Test）—— 自动验证代码还正不正常

**问题**：你怎么知道这次改动没搞坏别的东西？

**单元测试框架**（测最小函数单元）：

| 语言 | 工具 |
|------|------|
| Python | `pytest`、`unittest` |
| Java | `JUnit` |
| JavaScript | `jest`、`vitest` |

**代码风格 / 静态分析工具**（不用跑代码就能发现潜在问题）：

| 语言 | 工具 |
|------|------|
| Python | `pylint`、`flake8`、`mypy` |
| JavaScript | `eslint`、`prettier` |
| Java | `checkstyle`、`SpotBugs` |

**安全扫描**：
- `npm audit`（JavaScript 依赖漏洞检查）
- `bandit`（Python 安全扫描）
- `trivy`（容器镜像漏洞扫描）

**举例**：一个 PR 提交后，CI 自动跑了：
```
pylint src/           → 代码风格 85 分 ✅
pytest tests/         → 128 passed, 0 failed ✅
npm audit             → 0 vulnerabilities ✅
```
不用人工追着问"你跑测试了吗"，CI 把结果贴在 PR 评论区。

> 🎯 **没有自动测试的 CI，只是一个编译器。** CI 的核心价值在于帮你自动跑测试工具，快速知道"坏了没"。

### ③ 部署（Deploy）—— 把通过验证的代码送到用户手中

**问题**：测试都过了，怎么让用户用上新版本？

**部署方式**：

| 目标 | 常用命令 |
|------|---------|
| 虚拟机/物理机 | `scp app.jar user@server:/opt/app/` + `ssh user@server 'systemctl restart myapp'` |
| Docker 容器 | `docker build -t myapp .` → `docker push` → SSH 拉取重启 |
| Kubernetes | `kubectl rollout restart deployment/myapp` |
| Serverless | `serverless deploy` / `aws lambda update-function-code` |

**部署策略（让同学知道部署不是简单"覆盖文件"）**：
- **蓝绿部署**：两套完整环境，一键切换流量
- **金丝雀发布**：先让 5% 用户用新版，没问题再全量
- **滚动更新**：一台一台替换，始终保持在线

> 🎯 CI/CD 不是"人点一下按钮"，而是自动调部署工具执行一套标准化流程。

### 第二幕小结

| 活动 | CI/CD 自动调用什么工具 | 产出什么 |
|------|----------------------|---------|
| 构建 | `make`、`mvn`、`npm run build`、`docker build` | 可运行的产物 |
| 测试 | `pytest`、`jest`、`pylint`、`eslint`、`npm audit` | 质量报告 |
| 部署 | `scp`、`kubectl`、`serverless deploy` | 用户用上新版本 |

**一句话**：CI/CD 不发明新工具，它像一只无形的手，自动按顺序帮你调用 `make`、`pytest`、`kubectl` 这些你本来就用的工具。

---

### 第二幕 → 第三幕 衔接

> 好了，我们知道要按顺序做三件事：构建 → 测试 → 部署。但"谁来执行这个顺序"？
>
> 你需要一个**执行器**，它负责接收你"按顺序跑"的指令，在一台干净的服务器上依次跑完，记录日志，把结果告诉你。这个执行器就是 **CI/CD Pipeline 平台**。
>
> 这样的平台有很多：老牌的有 **Jenkins**，与代码仓库深度集成的有 **GitLab CI**，而目前开源社区最受欢迎、上手最简单的，是 **GitHub Actions**（简称 GHA）。接下来就以 GHA 为例，看看一个 Pipeline 平台能做什么。

---

## 第三幕：CI/CD Pipeline —— 谁来调度这些工具？（12 min）

**目标**：讲清 Pipeline 作为平台，提供了哪些日常操作功能。

> **本幕仍然不展示 YAML 配置，只讲功能界面和使用体验。** 以 GitHub Actions 界面作为参照。

### 功能一：自动执行（Execution）

以前每次提交代码后要手动敲：
```bash
git pull
npm ci
npm test
npm run build
scp dist/ server:/var/www/
```
漏一步就出问题。

Pipeline 平台替你按顺序自动执行：

- **触发方式**（什么情况下它会跑）：
  - 你 `git push` → 自动跑
  - 你提 Pull Request → 自动跑（PR 页面上直接看到结果）
  - 你点一个 **Run workflow** 按钮 → 手动触发
  - 每天凌晨 2 点 → 定时跑
- **顺序控制**：先构建，再测试，最后部署。测试挂了，部署自动跳过——不会出现"编译都没过就上线了"的荒唐事。

> 🎯 你不用再记那串命令了。推代码就行，平台帮你跑。

### 功能二：查看结果（Visibility）

**PR 页面直接显示**：
```
✅ 构建通过
✅ 测试通过（128 passed, 0 failed）
❌ 部署失败
```
红色就是坏了，绿色就是好的，不需要点进去看。

**展开日志**：
- 步骤分开展开，哪一步红了点哪一步
- 日志里自动标出错误行，不用从头翻到尾
- 对比以前：SSH 登录后 `journalctl -u myapp --no-pager | tail -50` → 体验天差地别

**状态徽章（Badge）**：放在 README.md 最顶上
```
[![CI Status](https://github.com/.../workflows/CI/badge.svg)]
```
别人进仓库第一眼就知道这个项目"健康不健康"。

> 🎯 不打开终端就能知道结果，出错了直接定位到具体步骤。

### 功能三：通知（Notification）

**场景**：你提交代码就去吃饭了，回来发现 CI 红了，但没人告诉你——可能过了半天才发现。

Pipeline 平台可以自动通知你：
- PR 评论区自动贴结果（@ 提交者）
- 邮件通知
- Slack / 飞书 / 钉钉消息

> 🎯 人不用一直盯着屏幕等结果，出问题平台会找你。

### 功能四：运行管理（Management）

- **取消运行**：发现最后一次提交有问题 → 点 Cancel，不浪费资源
- **重新运行**：网络超时导致失败 → 点 Re-run，不用重新 push
- **调试重跑**：以前成功的 job，换参数再跑一次 → Re-run with custom options
- **运行历史**：最近 N 次记录，谁、什么时间、什么分支、结果如何，一目了然

> 🎯 跑错了不是"再来一次"这么简单，平台给你各种补救手段。

### 功能五：敏感信息管理（Secrets）

- CI/CD 需要访问服务器、调用 API，但密码不能写死在代码里
- Pipeline 平台提供一个"保险箱"：你在网页上设置 `DATABASE_PASSWORD`，运行时平台注入，日志里自动打码成 `***`
- 这样一来，配置可以公开（开源），但密码只有平台知道。

### 第三幕小结

```
第二幕：我知道要调什么工具（npm test, pylint, kubectl...）
第三幕：我知道平台提供了什么功能界面来帮我跑这些工具

        ┌─────────────────────────────────────────────┐
        │  自动执行  │  结果查看  │  通知告警         │
        │  运行管理  │  敏感信息  │                    │
        └─────────────────────────────────────────────┘
```

---

### 第三幕 → 第四幕 衔接

> Pipeline 平台提供了这么多功能，但你有没有想过一个问题——**你怎么让平台知道"先构建、再测试、最后部署"？怎么告诉它"push 就触发、PR 也要检查"？**
>
> 答案很简单：**写一段配置**。平台的每个行为，都可以通过一个配置文件来定义。你写好这个文件，放到仓库里，平台读取它就知道自己要做什么。这就引出了第四幕的主题——**Configuration as Code（配置代码化）**。

---

## 第四幕：Configuration as Code —— 用 YAML 给平台写指令书（12 min）

**目标**：现在才引入 YAML——把流水线的编排逻辑写成一个文件，和源代码一起管理。

### 关键认知转变

```
以前：打开 Jenkins 网页 → 点"新建任务" → 在表单里填配置 → 点保存
现在：创建 .github/workflows/*.yml → 写配置 → git push → 自动生效
```

### 第一步：抽象模型（看一眼概念）

参考文档第 8 章的抽象描述：
```
Pipeline {
  triggers = [Trigger { event = "push" }]
  stages = [
    Stage {
      name = "build"
      jobs = [Job {
        name = "compile"
        steps = [Step { action = "checkout" },
                 Step { action = "build" }]
      }]
    }
  ]
}
```

> 这个模型就是文档里说的：**Pipeline（流水线）→ Stage（阶段）→ Job（作业）→ Step（步骤）**，四层结构。

### 第二步：真实 YAML（看实际怎么写）

```yaml
name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build
```

**逐行拆解**（每个关键字对应第三幕提到的功能）：

| YAML 关键字 | 对应第三幕的功能 | 含义 |
|-------------|-----------------|------|
| `on: [push]` | 自动执行→触发方式 | 什么时候触发 |
| `jobs:` | 自动执行→顺序控制 | 定义一组任务 |
| `runs-on:` | 运行环境 | 在什么机器上跑 |
| `steps:` | 第二幕的工具调用 | 依次执行哪些操作 |
| `run:` | 第二幕的工具调用 | 执行一条 shell 命令 |
| `uses:` | 插件机制 | 引用别人写好的功能模块 |

### 第三步：概念映射

| 抽象模型 | 文档中的术语 | GitHub Actions 中的写法 |
|----------|-------------|----------------------|
| 流水线 | Pipeline | `.github/workflows/*.yml` |
| 触发条件 | Trigger | `on: [push, pull_request]` |
| 阶段 | Stage | 由 `needs` 隐式表达的串行组 |
| 作业 | Job | `jobs.job_name` |
| 步骤 | Step | `steps[].run` 或 `steps[].uses` |
| 插件 | Plugin | `actions/*@v4`（别人写好的 action 包） |

### 第四步：插件机制——"乐高积木"

```yaml
steps:
  - uses: actions/checkout@v4            # 官方插件：拉代码
  - uses: actions/setup-node@v4          # 官方插件：装 Node
  - uses: actions/upload-artifact@v4     # 官方插件：上传构建产物
  - uses: peaceiris/actions-gh-pages@v4  # 社区插件：部署到 GitHub Pages
```

每个 `uses` 就是一个可复用的乐高积木块。别人写好的功能模块，直接引用就能用。

### 第五步：完整 Pipeline 走读

```yaml
name: Full Pipeline
on:
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    needs: lint
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
      - run: echo "Deploying to production..."
```

**执行顺序**：`lint → test（矩阵 ×3）→ build → deploy`

- 每步出错了，后续自动跳过（红色箭头阻断）
- `strategy.matrix` = 文档里的"矩阵并行"——一次展开成 3 个 job（Node 18/20/22）
- `needs` 声明依赖关系，控制执行顺序

### Configuration as Code 的三个价值

**① 版本控制**：流水线的每一次改动都有 git 记录
```bash
git log --oneline .github/workflows/ci.yml
# 谁、什么时间、为什么改了流水线 —— 一目了然
```

**② 可审查**：想改流水线？提 PR → 同事 review → merge → 自动生效。和改业务代码的流程一样。

**③ 可复用**：GitHub 的 Actions 模板市场——选一个模板，自动生成 YAML，复制到自己的项目改几个参数就能跑。

### 第四幕小结

> 你在 `.github/workflows/ci.yml` 里写 YAML → git push → Pipeline 平台自动按你写的顺序调用 `npm test`、`pylint`、`kubectl` → 出结果了通知你。**这就是 Configuration as Code。**

---

## 第五幕：全景总结 + 课后任务（6 min）

### 整节课逻辑链

```
           CI/CD                           Pipeline                      Config as Code
      （自动化什么？）               （用什么平台自动化？）            （怎么描述自动化流程？）
            ↓                                ↓                                ↓
     构建 → make / mvn              自动执行（触发方式）             .github/workflows/*.yml
     测试 → pytest / pylint         结果查看（日志 + 徽章）          on（触发）→ jobs（作业）
     部署 → scp / kubectl           通知（邮件/IM）                  → steps（步骤）
                                    运行管理（重跑/取消）             run（命令）/ uses（插件）
                                    敏感信息（Secrets）
```

### 真实项目流程：从零跑通一次 CI

> 理解了概念，我们看看一个完整的 CI 运行周期长什么样——从创建文件到看到结果，一共五步。

#### Step 1：编写 workflow.yml

在项目根目录创建 `.github/workflows/ci.yml`：

```yaml
name: My First CI
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
```

> 🎯 只写必要的三要素：**什么时候触发**（`on`）、**在什么环境跑**（`runs-on`）、**依次做什么**（`steps`）。

#### Step 2：git add + commit

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow"
```

> 🔑 关键认知：这个文件和源代码在同一个仓库、同一个 commit 里。流水线配置和代码是**一起版本化**的。

#### Step 3：git push

```bash
git push origin main
```

就这一步，触发 Pipeline。

#### Step 4：自动 Run

- 推送完成后，打开 GitHub 仓库 → **Actions** 标签页
- 能看到一个新运行（Run）正在执行，状态是黄色 🟡（进行中）
- 点击进去可以看到每个 step 的实时日志，绿的 ✅ 表示通过，红的 ❌ 表示失败

> 整个过程不需要你打开终端跑任何命令。推完代码，等结果就行。

#### Step 5：检查结果

- **绿色 ✅**：测试通过，放心继续开发
- **红色 ❌**：点进日志，看哪一步失败——通常错误行会被高亮
- 修复后再次 commit + push，触发新的 Run

**完整周期图解**：

```
编写 workflow.yml → git commit → git push
                                    ↓
                         GitHub Actions 自动触发
                                    ↓
                        分配 runner → 拉代码 → 装依赖 → 跑测试
                                    ↓
                        结果 ✅ / ❌ 显示在 Actions 页面
                                    ↓
                        通知（邮件 / PR 评论）
```

> 这就是一个完整的 CI 循环。适应它之后，你会养成习惯：**每次推送前不敢保证代码是对的，但推送后看到绿色 ✅ 就安心了**。

### make + Makefile 的类比（方便理解）

> 为了让你更容易理解这种关系，可以类比一个你已经熟悉的工具——**make**：

| | make（构建工具） | CI/CD Pipeline 平台 |
|---|---|---|
| 配置文件 | **Makefile**——定义编译规则 | **.github/workflows/*.yml**——定义流水线规则 |
| 执行器 | `make` 命令读 Makefile，按规则编译 | GHA Runner 读 YAML，按编排跑 job |
| 任务单元 | target（目标）→ 依赖 → 命令 | job → needs → steps |
| 触发 | 手动 `make` | push / PR / 定时 / 手动 |

> 当你理解了 `make` + `Makefile` 的关系（写规则 → 让 make 执行），就理解了 **Pipeline 平台 + YAML 配置** 的关系。区别在于：make 只做**构建**这一个环节（编译代码），而 Pipeline 平台做**构建+测试+部署**全流程，功能范围更广，还要管触发、通知、环境等一大堆事。

### 一句话总结

> **你写好 `.github/workflows/ci.yml`，每次 `git push`，Pipeline 平台自动按顺序调用 `npm test`、`pylint`、`kubectl` 这些工具来构建、测试、部署你的代码。这就是 CI/CD。**

### 课后任务

1. 打开你的 GitHub，进入任意一个项目仓库
2. 点顶部 **Actions** 标签 → 点 **set up a workflow yourself**
3. 使用生成的模板，把测试命令改成你项目的：
   ```yaml
   - run: npm test     # Node 项目
   # 或
   - run: python -m pytest   # Python 项目
   ```
4. 提交文件（commit），观察 Actions 页面自动变绿 ✅
5. 故意改坏一个测试再提交，看它变红 ❌
6. 体验"查看日志定位错误"和"re-run 失败任务"

### 延伸阅读

- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [GitHub Actions 官方文档](https://docs.github.com/en/actions)

---

## 附录：节奏总览

| 幕 | 内容 | 衔接 | 是否展示 YAML | 时长 |
|----|------|------|--------------|------|
| 一 | 痛点引入 | —— | 否 | 8 min |
| | **→ 手动/本地/不定时 → 自动/统一环境/固定触发** | | | |
| 二 | CI/CD 核心活动 & 子工具 | | 否 | 12 min |
| | **→ 这些任务需要一个执行器 → Pipeline 平台** | | | |
| 三 | Pipeline 平台功能（执行/查看/通知/管理/Secrets） | | 否 | 12 min |
| | **→ 使用平台的方式 → 写配置** | | | |
| 四 | Configuration as Code（YAML + 插件 + 完整示例） | | **是** | 12 min |
| 五 | 全景总结 + 课后任务 | | — | 6 min |
