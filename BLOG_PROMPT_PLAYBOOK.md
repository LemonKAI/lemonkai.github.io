# KAI Blog Prompt Playbook

用於生成 LemonKAI / KAI K8s之路文章。目標不是 AI 摘要，而是 KAI 自己的 infra notebook：有理解、有生活例子、有可帶走的心智模型，也要保持專業精準。

## Core principle

文章不是把知識點攤平，而是把 KAI 如何理解一個技術問題寫出來。

讀者看完要得到：

1. 一句能記住的核心判斷
2. 一個好懂但不幼稚的生活例子
3. 一個能放進自己腦子的心智模型
4. 一條能和前後文章串起來的主線
5. 幾個真的能拿去排查/設計/思考的實用點

## KAI Blog Writing Constitution v2

### What makes it KAI

KAI 的文章不是「完整介紹某概念」，而是「把一個問題放進自己的技術筆記裡理解」。

每篇都要回答四件事：

1. **我為什麼現在要理解它？**
2. **我會用哪個生活例子讓人先懂？**
3. **我會怎麼記住它？**
4. **它後面會影響我看哪些問題？**

### Preferred KAI sentence patterns

這些不是固定模板，而是語氣方向：

- `我會先記這句：...`
- `我不會急著背 YAML。`
- `先用一個生活例子想：...`
- `這件事後面會反覆出現。`
- `這不是 XXX，而是 YYY。`
- `如果只看表面，很容易以為...`
- `真正要看的不是...而是...`
- `我會先問一個問題：...`
- `這裡的坑在於...`
- `這也是為什麼後面一定要接著看...`

### Anti-template rules

避免這些 AI / 教科書 / LinkedIn 味開場：

- `在現代雲原生時代...`
- `隨著 Kubernetes 的普及...`
- `本文將深入探討...`
- `作為一個強大的容器編排平台...`
- `無論你是初學者還是資深工程師...`
- `在當今快速變化的技術環境中...`

也避免這些泛泛結尾：

- `希望本文對你有所幫助。`
- `總之，掌握 XXX 非常重要。`
- `未來我們將繼續探索更多內容。`

### Series memory rule

KAI K8s 主線文章必須知道自己在系列裡的位置。`KAI K8s之路` 這個名字可以保留，但文章氣質要是筆記本，不是旅遊路線或課程 roadmap：

- **上一章留下什麼問題**
- **這一章解哪個核心卡點**
- **下一章自然接去哪裡**
- **這一章用哪個生活例子先建立直覺**

文章不要像孤立知識卡片，也不要像旅遊 itinerary；要像一本慢慢長出來的 Kubernetes 主線筆記。

### Language / mirror rule

- 繁體中文是主稿與主要語氣。
- English 版是 mirror/export layer，只做技術對照與對外分享，不反過來主導繁中語氣。
- 不使用 `KAI's K8s Journey` 作為英文主品牌；英文可寫 `KAI K8s之路 — English mirror` 或 `KAI Kubernetes mainline notes`.

### Default output format

生成正式文章時，固定輸出：

1. `frontmatter`
   - title
   - description
   - pubDate
   - updatedDate
   - lang
   - kind
   - series / seriesOrder（如適用）
   - tags
   - draft
2. `article_md`
3. `ig_caption`
4. `ig_image_prompt`
5. `quality_score`
   - KAI understanding
   - memorability
   - everyday example
   - mainline continuity
   - technical precision
   - practical value

若 technical precision 沒把握，必須標記 `needs_fact_check: true`，不能裝懂。

## Master prompt

```text
Write a Traditional Chinese technical blog post for LemonKAI / KAI K8s之路.

Topic: {topic}
Audience: engineers learning Kubernetes / DevOps / platform engineering seriously, not beginners who only want surface-level definitions.

Voice:
- Kai's personal infra notebook
- clean, direct, thoughtful
- not corporate, not textbook, not hype
- explain through Kai's own understanding
- use declarative statements more than questions
- keep some personal judgment, but stay technically precise
- build a memorable mental model, not a generic tutorial
- include one everyday example per KAI K8s mainline chapter

Core writing goal:
Do not merely summarize the topic. Build a mental model the reader can remember. The post should feel like one page in Kai's Kubernetes notebook: easy to understand, technically serious, and connected to the broader mainline.

Structure:
1. Opening: start from a concrete confusion, mistake, or practical observation.
2. Core judgment: state the one sentence Kai wants readers to remember.
3. Everyday example: use one simple life example to establish intuition.
4. Mental model: explain the concept using a clear metaphor or boundary.
5. Technical breakdown: explain what actually happens in Kubernetes.
6. Practical lens: show how this affects debugging, design, or operations.
7. Common trap: name the misconception engineers often have.
8. Kai's bias / field note: add a short personal conclusion or rule of thumb.
9. Bridge: end by connecting this chapter to the next concept in the series.

Series memory:
- Mention what previous confusion this chapter resolves if part of a series.
- End with a natural bridge to the next chapter.

KAI sentence flavor:
- Use patterns like "我會先記這句", "我不會急著背 YAML", "這不是 XXX，而是 YYY" when natural.
- Do not overuse them mechanically.

Style rules:
- Use short paragraphs.
- Use bullets only when they help memory.
- Keep Kubernetes terms accurate: Pod, container, Deployment, Service, readiness, liveness, rollout, etc.
- Avoid fake production stories unless explicitly provided.
- Avoid unsupported claims.
- Avoid generic motivational language.
- Avoid sounding like an AI-generated tutorial.
- Avoid template openings like "在現代雲原生時代", "本文將深入探討", "隨著 Kubernetes 的普及".

Output:
- frontmatter
- article_md
- IG caption draft in Traditional Chinese
- IG image prompt using the correct visual lane:
  - KAI K8s mainline -> KAI notebook
  - incident/SRE -> Production field notes
  - standalone concept -> Concept model
- quality_score
- needs_fact_check
```

## KAI K8s mainline prompt

```text
Write chapter {chapter} of KAI K8s之路 in Traditional Chinese.

Topic: {topic}
Previous chapter connection: {previous_connection}
Next chapter bridge: {next_bridge}

This is part of Kai's Kubernetes mainline notebook. Keep the name KAI K8s之路, but do not make it sound like tourism, a course roadmap, or generic tutorial. The post must help readers build a durable mental model, not just learn a definition.

Use Kai's personal infra notebook voice:
- I want the reader to feel: "I finally know how to think about this."
- Include Kai's own core judgment.
- Make the concept memorable with one everyday example and one central mental model.
- Show why this concept matters later when reading YAML, debugging Pods, or operating production workloads.

Required sections:
1. Why this topic appears at this point in the series
2. The one sentence to remember
3. A simple everyday example
4. The mental model
5. What Kubernetes is actually doing
6. What beginners usually misunderstand
7. How I would inspect/debug it
8. How this connects to the next chapter

Required series continuity:
- Previous chapter left us with: {previous_problem}
- This chapter resolves: {current_problem}
- Next chapter should naturally ask: {next_problem}

Tone:
Clean, direct, personal, technical. Easy to understand without becoming shallow. No hype. No textbook voice.
```

## Incident / SRE post prompt

```text
Write a Traditional Chinese production field-note style blog post.

Topic: {topic}
Incident pattern: {incident_pattern}

This is not a fictional war story. If exact incident details are not provided, write it as a pattern note: "這類事故通常長這樣".

Goal:
Help readers recognize the failure pattern, know what to inspect first, and remember the operational lesson.

Required flow:
1. What the failure looks like from outside
2. Why it is easy to misread
3. What signals I would check first
4. The real mechanism behind the issue
5. Safer operating rule / guardrail
6. Kai's bias: one field-note conclusion

Tone:
Production debugging, precise, calm, no drama, no fake certainty.
```

## Concept model post prompt

```text
Write a Traditional Chinese concept explanation blog post.

Topic: {topic}

Goal:
Turn one infrastructure concept into a mental object the reader can remember.

Required flow:
1. What this concept is not
2. What it is
3. The mental object / metaphor
4. Where it shows up in real systems
5. The mistake people make with it
6. A simple rule of thumb

Tone:
Clear, compact, memorable, KAI notebook style.
```

## Quality checklist before publishing

Rate 1–5:

- KAI understanding: does it show Kai's own view?
- memorability: is there one sentence readers can remember?
- mainline continuity: does it connect to the broader K8s notebook?
- everyday example: does the mainline chapter include one simple example that helps understanding without reducing precision?
- technical precision: are terms and mechanisms accurate?
- practical value: can readers use it later?

Do not publish if KAI understanding or technical precision is below 4.
