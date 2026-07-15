// Invite bundle generator: given a friend's name (and a band style), produce
// one paste-into-your-agent installer document that carries all three skills —
// the shelf contributor skill (with the secret), the learn skill (how this
// group likes to learn), and the beautiful-html-templates skill. The friend
// pastes the whole thing into Claude Code OR Codex and the agent installs the
// kit for BOTH tools, so whichever one they use (now or later) knows the shelf.

import { STYLE_TOKENS } from "./styleTokens";

// Self-hosted shelves set SHELF_URL so their minted kits point at their own
// deployment; unset, this is noah's original shelf.
const SHELF_URL = process.env.SHELF_URL ?? "https://learning-shelf-chi.vercel.app";

export function buildInviteInstaller(
  rawName: string,
  author: string,
  style: string,
  ownerToken: string,
): string {
  const name = rawName.trim().slice(0, 40) || "Friend";
  const bandStyle = STYLE_TOKENS.some((b) => b.id === style) ? style : "plain";
  const secret = process.env.SHELF_SECRET ?? "MISSING_SECRET";

  return `# 欢迎加入耕读，${name}！

把整段消息粘贴给你的编程代理 — Claude Code 或 Codex 都可以。工具包会自动为两个工具安装。

---

**代理：** ${name} 已被邀请加入耕读 — 一个布告板网站，朋友们在上面钉活学习文档，每篇文档由那个人的编程代理编写和更新。你现在的任务：

1. 在两个工具的目录下创建以下三个技能文件 — 即使现在只装了一个工具，也两个都建，这样另一个工具随时可用。每个路径内容相同：
   - \`~/.claude/skills/learning-shelf/SKILL.md\` 和 \`~/.codex/skills/learning-shelf/SKILL.md\`
   - \`~/.claude/skills/learn/SKILL.md\` 和 \`~/.codex/skills/learn/SKILL.md\`
   - \`~/.claude/skills/beautiful-html-templates/SKILL.md\` 和 \`~/.codex/skills/beautiful-html-templates/SKILL.md\`
2. 将下方的"学习 → 耕读"段落添加到 \`~/.claude/CLAUDE.md\` 和 \`~/.codex/AGENTS.md\` 两个文件中 —
   不存在就创建，已有"## 学习 → 耕读"段落则跳过。在 \`~/.codex/AGENTS.md\` 中，在段落前加一行
   （Codex 不会自动发现技能）：
   "技能文件位于 \`~/.codex/skills/*/SKILL.md\` — 当下方提到某个技能时，请阅读对应的 SKILL.md 并遵循其指引。"
   这个段落让你在 ${name} 想学东西时主动提供跟踪式学习计划。
3. 如果模板库还没下载，克隆它：
   \`git clone https://github.com/zarazhangrui/beautiful-html-templates ~/beautiful-html-templates\`
4. 在布告板上公布 ${name} — 现在就执行一次。这会钉上他们的空角落（使用他们选的风格），让大家在他们第一篇文档出来前就看到他们：

   \`\`\`bash
   curl -sS -X POST "${SHELF_URL}/api/join" \\
     -H "x-shelf-secret: ${secret}" \\
     -H "x-owner-token: ${ownerToken}" \\
     -F "author=${author}" \\
     -F "name=${name}" \\
     -F "style=${bandStyle}"
   \`\`\`

5. 确认安装内容，给 ${name} 看布告板 ${SHELF_URL} —
   他们的角落已经钉在那里了 — 然后问他们现在在学什么，主动提出开始第一篇文档（learning-shelf 技能解释了整个流程）。

──────── file: ~/.claude/skills/learning-shelf/SKILL.md AND ~/.codex/skills/learning-shelf/SKILL.md ────────

${shelfSkill(name, author, bandStyle, ownerToken)}

──────── file: ~/.claude/skills/learn/SKILL.md AND ~/.codex/skills/learn/SKILL.md ────────

${learnSkill()}

──────── file: ~/.claude/skills/beautiful-html-templates/SKILL.md AND ~/.codex/skills/beautiful-html-templates/SKILL.md ────────

${templatesSkill()}

──────── 追加到 ~/.claude/CLAUDE.md AND ~/.codex/AGENTS.md（已有则跳过）────────

${learningPlanRule(name, author, bandStyle)}

──────── 文件结束 ────────
`;
}

// The global habit: whenever the friend wants to learn something, their Claude
// offers to turn it into a tracked, published learning plan. Lives in
// ~/.claude/CLAUDE.md so it applies to every session.
function learningPlanRule(name: string, author: string, bandStyle: string): string {
  return `## 学习 → 耕读

${name} 在耕读上维护活学习文档（参见 \`learning-shelf\` 和 \`learn\` 技能）。每当 ${name} 想学、想理解、想研究或深入探索一个主题 — "教我……"、"帮我理解……"、"我想学……"、"给我讲讲……" — 不要直接开始解释。先提出做成一个跟踪式学习计划：

> "要不要把这个做成一个正式的学习计划 — 钉到耕读上，随你的进度更新？"

如果 ${name} 同意：

1. **问文档用哪种风格**，提供三个选择：
   - **你常用的** — \`${bandStyle}\` 模板（${name} 的默认外观）；
   - **给我惊喜** — 从 \`~/beautiful-html-templates\` 随机选一个合适的模板
     （读 \`index.json\`，选一个氛围匹配主题的）；
   - **或指定一个模板** 从库里选。
2. **用 \`learn\` 技能规划模块** — 勾勒完整模块集，然后只生成第一个模块。
3. **用 \`beautiful-html-templates\` 技能按选定模板构建文档**，并用 \`learning-shelf\` 技能**发布**，填写进度字段
   （\`modulesTotal\`、\`modulesDone=1\`、\`currentModule\`）和 \`author=${author}\`、\`authorStyle=${bandStyle}\`。
4. **持续更新**：每完成一个模块，重新发布，更新 \`modulesDone\` 和下一个 \`currentModule\`。

如果 ${name} 不同意，就正常教 — 仍然使用 \`learn\` 技能的深度与动机风格，只是不创建文档。`;
}

function shelfSkill(
  name: string,
  author: string,
  bandStyle: string,
  ownerToken: string,
): string {
  const secret = process.env.SHELF_SECRET ?? "MISSING_SECRET";

  return `---
name: learning-shelf
description: 发布和维护 ${name} 在耕读上的学习文档 — 一个共享的活 HTML 学习文档目录。当被要求创建、更新、发布或查看学习文档/日志时使用，或开始记录 ${name} 正在学习的新主题时使用。
---

# 耕读 — ${name} 的贡献者技能

耕读是一个布告板网站，每个朋友的 AI 代理维护一篇活 HTML 学习文档 — 一个随着学习不断增长的自包含 HTML 文件。

## 你的身份（不要修改）

- **你的人是**：\`${name}\` — 发布时始终用 \`author=${author}\`。
- **你的角落风格是**：\`${bandStyle}\` — 发布时始终用 \`authorStyle=${bandStyle}\`。

## 你需要知道的三个信息

- **布告板地址**：\`${SHELF_URL}\`
- **发布密钥**（全组共享）：\`${secret}\`
- **${name} 的 owner token**（私密 — 证明 ${name} 的角落归其所有）：\`${ownerToken}\`

密钥放在每次发布、删除和头像上传的 \`x-shelf-secret\` 头部，owner token 放在 \`x-owner-token\` 头部。布告板没有正确的 owner token 就会拒绝对 ${name} 角落的写操作 — 这就是防止其他人改动 ${name} 文档的机制，也是为什么你绝对不能对 \`${author}\` 以外的作者使用它。绝不要把这两个值放进 HTML 文档里，绝不要提交到公开仓库。

## 布告板规则

1. **一篇文档 = 一个自包含 HTML 文件。** 内联所有 CSS 和 JS。只允许外部请求 Google Fonts。
2. **首次发布前必须选定模板。** 使用 beautiful-html-templates 技能：筛选 2–3 个氛围匹配主题的模板，让 ${name} 选，然后完全遵循该模板的设计系统。绝不混用模板。绝不替换字体。
3. **教，不是记笔记。** 使用 learn 技能的理念：先解释每个概念为什么重要再讲解，多用图表和实例，用大白话解释术语。文档应该能教会一个陌生人，而不是提醒一个专家。
4. **在交互比文字更有效的地方使用交互。** 文档是网页，不是 PDF — 利用这一点。文档是内联 JS 的自包含 HTML，所以每个模块都应该问："这里如果读者能动手操作，会不会效果更好？" 适合的交互形式：
   - **滑块/旋钮** 用于任何参数化概念（改利率、改学习率、改釉烧温度 — 看结果变化）；
   - **分步图** — 一个"下一步/上一步"按钮逐个状态变化地走，而不是一张巨大的静态图；
   - **自测翻牌** — learn 技能的理解检查题做成点击翻开的卡片，让读者先答再看；
   - **实时切换/对比** — 在错误做法和正确做法之间切换，前后对比，朴素 vs 优化；
   - **小沙盒** 在主题允许时（一个可编辑输入，输出实时重算）。
   交互必须服务于概念 — 每个模块在合适的地方放一个，不要到处撒。静态概念用静态文字就好。所有交互部分必须使用所选模板的设计系统（颜色、字体、组件语法），并在单文件中离线工作 — 不依赖外部库。
5. **每篇文档在顶部附近放两个复制按钮** — "复制 HTML" 和 "复制 Markdown" — 小巧，使用模板的设计系统风格，放在文档头部区域。这样构建：
   - 在文件中嵌入整个文档的 Markdown 版本：
     \`<script type="text/markdown" id="doc-markdown"> …文档内容的纯 Markdown… </script>\`。每次更新模块时同步更新 — 绝不能和页面教的内容脱节。
   - "复制 HTML" 复制整个活文档：
     \`navigator.clipboard.writeText("<!doctype html>\\n" + document.documentElement.outerHTML)\`
   - "复制 Markdown" 复制嵌入块：
     \`navigator.clipboard.writeText(document.getElementById("doc-markdown").textContent.trim())\`
   - 按下的按钮标签切换为"已复制 ✓"几秒钟。
   这让任何人都能把文档提取到笔记、README 或另一个代理的上下文中，无需爬取。
6. **保留本地源文件** 在 ${name} 的主目录或项目目录中。布告板存的是副本；本地文件才是你编辑的。
7. **每次有意义的更新都重新发布** — 布告板始终显示最新版。
8. **阅读并对照托管副本迭代** \`${SHELF_URL}/d/<slug>\`，
   这样 ${name} 看到的和所有人看到的一样 — 并在那里点击测试交互部分和两个复制按钮，确认托管后正常工作。

## 发布（和重新发布 — 同一条命令）

\`\`\`bash
curl -sS -X POST "${SHELF_URL}/api/publish" \\
  -H "x-shelf-secret: ${secret}" \\
  -H "x-owner-token: ${ownerToken}" \\
  -F "slug=<kebab-case-stable-id>" \\
  -F "title=<可读标题>" \\
  -F "subject=<实际在学什么，例如 陶瓷>" \\
  -F "description=<给目录卡片的一两句话>" \\
  -F "modulesTotal=<该主题计划的模块数>" \\
  -F "modulesDone=<目前已写完的模块数>" \\
  -F "currentModule=<正在学的模块名>" \\
  -F "author=${author}" \\
  -F "authorStyle=${bandStyle}" \\
  -F "template=<你为这篇文档选的模板 slug>" \\
  -F "interests=<${name} 的活兴趣行 — 见下文>" \\
  -F "html=@/absolute/path/to/your-doc.html"
\`\`\`

- \`slug\` 是永久的 — 选定后不变；用同一个 slug 重新发布会原地更新。
- \`subject\` 和 \`description\` 是目录卡片显示的内容；随文档演进保持新鲜。
- **\`interests\`** 是 ${name} 的活"我在搞什么"行，显示在布告板上他们纸张背后的兴趣便签上。每次发布都发送，全新重写（不是追加）：一句温暖的话，最多 ~280 字，读起来像一个朋友在描述 ${name} — 融合他们角落上所有主题加上这篇文档，最近的倾向放前面。例如：
  "最近沉迷纹身线条 — 也是那个为了好玩从零重建 Next.js 的人。" 你自己根据已知信息写；不要问 ${name}，除非他们想口述。
- **进度字段** 驱动 ${name} 卡片上的小进度条。一个主题被拆成模块（见 learn 技能）；\`modulesTotal\` 是计划总数，\`modulesDone\` 是已写完的数量，\`currentModule\` 是 ${name} 当前在学的。每完成一个模块就更新 \`modulesDone\` 并重新发布。如果某篇文档不跟踪模块，省略这三个字段。
- 响应是 JSON：\`{ ok: true, url: "/d/<slug>" }\`。出错时读 \`error\` 字段。403 表示 slug 或 author 属于别人 — 绝不要换作者名重试；换个 slug。
- 发布后验证：\`${SHELF_URL}/\` 目录页在 ${name} 的角落下显示这篇文档，日期是新的。

## 删除文档

只有 ${name} 明确要求时才删除 — 删除是永久的（本地源文件不受影响，之后可重新发布）：

\`\`\`bash
curl -sS -X DELETE "${SHELF_URL}/api/publish?slug=<slug>" \\
  -H "x-shelf-secret: ${secret}" \\
  -H "x-owner-token: ${ownerToken}"
\`\`\`

这只能删除 ${name} 自己的文档 — 布告板拒绝删除别人的，你也绝不能尝试。

## 你的大头照（可选，一次）

${name} 可以在他们的角落上方挂一张小拍立得照片。第一次为 ${name} 发布时（以及他们想换的时候），主动问："要在你的角落放张照片吗？给我一个图片文件。" 如果他们给了，上传：

\`\`\`bash
curl -sS -X POST "${SHELF_URL}/api/avatar" \\
  -H "x-shelf-secret: ${secret}" \\
  -H "x-owner-token: ${ownerToken}" \\
  -F "author=${author}" \\
  -F "image=@/absolute/path/to/photo.jpg"
\`\`\`

- 方形照片最好看（渲染为 86×86）；png/jpeg/webp/gif。上传不超过 ~4MB — 主机拒绝更大的请求体 — 所以大手机照片先缩小再上传（例如 macOS 上 \`sips -Z 1200 photo.jpg\`）。
- 重新上传会替换旧照片。显示在 \`${SHELF_URL}/a/${author}\`。
- 绝不上传 ${name} 没明确选择的照片，绝不设置其他作者的照片。

## 浏览

目录在 \`${SHELF_URL}/\` — 所有人角落。看别人的找灵感；绝不要发布到别人的 slug 或作者名下。`;
}

function learnSkill(): string {
  return `---
name: learn
description: 深度、循序、有动机的教学。当用户想学、想理解、想研究或深入探索一个概念时使用 — "教我"、"帮我理解"、"给我讲讲"、"我想学"。
---

# Learn 技能

## 目的

当用户想学、想理解、想研究或深入探索一个概念时使用此技能。

目标不是快速总结信息。目标是以建立真正理解的方式教学：一次一个概念，每个概念由前一个引出，深度足够让用户不仅理解什么是正确的，还理解为什么重要、为什么下一个想法自然跟进。

## 学习风格

用户在以下教学方式中学习效果最好：

* 循序：一次教一个概念。
* 累积：每个概念建立在前一个之上。
* 有动机：在引入下一个概念前解释为什么需要它。
* 深度：不停留在表面定义。
* 耐心：不因用户似乎理解了就急于前进。
* 具体：使用例子、类比、反例和边界情况。
* 适时交互：在继续前检查理解。

## 核心教学循环

对每个学习请求，遵循这个循环：

### 1. 确定当前概念

先命名当前正在教的单个概念。

不要一次引入多个主要想法。

### 2. 引出动机

在解释概念之前，先解释为什么它重要。

好的动机回答这样的问题：

* 这个概念解决什么问题？
* 它消除了什么困惑？
* 为什么有人会发明这个想法？
* 如果不理解它会怎样？

### 3. 深入解释概念

先用大白话解释概念。

然后逐层加深：

1. 简单解释
2. 具体例子
3. 更精确的解释
4. 常见误解
5. 边界情况或对比
6. 为什么这个概念引出下一个

不要把这些折叠成一个快速概述。

### 4. 连接前一个概念

明确说明这个概念如何建立在前面的内容之上。

使用这样的语言：

* "这承接上一个想法，因为……"
* "既然我们理解了 X，就可以问 Y……"
* "我们需要下一个部分的原因是……"

### 5. 检查理解

在继续之前，问一个简短的问题、提示或小练习。

检查应测试真正的理解，不是记忆。

例子：

* "你能解释为什么这一步是必要的吗？"
* "哪部分感觉最不直观？"
* "你觉得如果我们去掉这个假设会怎样？"
* "试着用自己的话说一遍。"

### 6. 决定是否继续

如果用户的回答显示理解了，进入下一个概念。

如果回答显示困惑，留在同一概念，换一种方式解释。

不要为了保持节奏而继续前进。

## 深度规则

解释概念时：

* 宁深不广。
* 避免列出十个相关想法。
* 避免说"基本上"然后跳过重要部分。
* 避免模糊的类比，除非后面跟着精确的解释。
* 在有帮助时使用图表、例子或逐步推理。
* 解释专家关心什么，不只是初学者记什么。

## 节奏规则

默认以小节教学。

不要写整章教科书，除非用户要求完整概述。

一个好的回答通常覆盖一个主要概念并轻轻预告下一个。

## 当用户问了一个宽泛的问题

如果用户问了宽泛的问题，先创建学习路径。

例子：

用户："教我神经网络怎么工作。"

不要立刻解释一切。

而是：

1. 确定前置知识链。
2. 从第一个必要的概念开始。
3. 解释为什么那个概念排在前面。
4. 只教那个概念。
5. 在继续前检查理解。

## 模块与进度

一个主题作为有序的模块集来学习 — 上面的前置知识链，每个模块是一个连贯的概念或里程碑。两条规则：

1. **先规划完整模块列表，但一次只生成一个模块。**
   当用户选定主题时，勾勒完整计划模块集（这就是总数）。然后只教学和编写当前模块。不要跑在前面生成后面的模块，直到用户表示准备好继续。

2. **进度是已完成模块 / 总模块。** 如果计划有 X 个模块，用户真正学完了 2 个，进度是 2 / X。模块数可以随理解加深而增长 — 这没问题；计划有变时更新总数。

这直接映射到耕读上的学习文档（如果用户有）：文档一次增加一个模块部分，每次你完成一个模块并重新发布时，更新 \`modulesDone\` 并将 \`currentModule\` 设为下一个。他们卡片上的进度条就是那个比率。绝不虚报 — 进度条应反映实际已写和理解的内容，不是计划的。

把模块写进文档时，同时规划它的交互时刻和文字：文档是活的网页，所以如果模块的核心概念有参数、序列或对比，把它做成读者可以驱动的（滑块、分步、切换、翻牌检查）而不是只描述。每个模块默认一个精准的交互元素；只在概念确实是静态的时才跳过。

## 当用户要快速答案

如果用户明显想要快速的事实答案，直接回答。

不要强迫完整教学循环。

但如果用户说"教教我"、"帮我理解"、"给我讲讲"或"我想学"，使用完整学习风格。

## 语气

清晰、冷静、鼓励、智识上认真。

不要居高临下。

不要过度夸奖。

用户沮丧时给予鼓励，但重点放在让概念点通上。

## 输出风格

一个典型的教学回答应是这样的：

1. 概念名称
2. 为什么这个概念重要
3. 深入解释
4. 例子
5. 常见误解
6. 这如何引出下一个概念
7. 一个理解检查

在用户回应或要求继续之前，不要进入下一个主要概念。`;
}

function templatesSkill(): string {
  return `---
name: beautiful-html-templates
description: 用 beautiful-html-templates 库构建精美的单文件 HTML 文档和演示。创建或重设任何 HTML 文档、演示或页面样式时使用 — 包括耕读的学习文档。库位于 ~/beautiful-html-templates。
---

# Beautiful HTML Templates — 代理指引

你通过**选对模板、克隆其设计系统、用真实内容替换占位内容**来构建完成的 HTML 文档。库位于 \`~/beautiful-html-templates\`（缺失时从 https://github.com/zarazhangrui/beautiful-html-templates 克隆）。

## 工作流程

1. **先问用途和氛围** 再选模板。文档是干什么的？应该感觉活泼、文学、粗野、温暖、复古还是精准？
2. **读 \`index.json\`** 在仓库根目录。把所述氛围与每个模板的 \`mood\`、\`tone\`、\`best_for\`、\`formality\` 匹配。筛选 2–3 个真正不同的候选，让人选。
3. **写之前完整阅读所选模板** — 同时读 \`design.md\`（设计系统：颜色、字号阶梯、组件、宜忌）和 \`template.html\`（活示例）。
4. **在系统内构建。** 适配，绝不对抗：

   **始终保留** — 字体（绝不替换）、调色板（绝不改色）、布局语法、组件词汇、装饰签名（它们是身份，不是噪音）。

   **始终替换** — 标题、正文、数字、名字、日期和占位标签用真实内容。

5. **如果需要模板没有的布局，在模板的设计系统中从头设计** — 同样的字体、同样的调色板、同样的间距节奏、同样的组件语法。绝不引入另一个模板的语言；绝不在一篇文档中混用两个模板。
6. **在浏览器中打开结果并发送文件路径。** 每次草稿，每次迭代。

## 陷阱

- 不要替换字体（"差不多"永远不够）。
- 不要改色或使用调色板外的颜色。
- 不要删掉你以为是噪音的装饰 — 它们是系统。
- 不要混用不同模板的布局。
- 不要因为模板"看起来简单"就跳过读 design.md。`;
}
