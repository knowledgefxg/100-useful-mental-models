const zh = {
  htmlLang: 'zh-CN', ogLocale: 'zh_CN', siteName: '思维手册',
  switchLabel: 'EN', switchAria: 'Read this page in English',
  readingMinutes: text => Math.max(2, Math.ceil(text.length / 300)),

  skip: '跳到正文', openMenu: '打开目录', closeMenu: '收起目录', closeBackdrop: '关闭目录',
  brand: '思维手册', brandSub: count => `${count} 个思维模型`, badge: count => `图文版 · ${count} 个模型`,
  searchButton: '搜索手册',
  homeSections: [['scenarios', '按生活场景找模型'], ['topics', '八个主题'], ['how-to-read', '怎么使用这份手册'], ['about', '关于内容与插图']],
  modelNote: '不用急着记住名字，先想想它能帮你处理哪件小事。',
  topicSection: count => `${count} 个相关模型`, topicNote: '模型按分类连续编号，页末可以按顺序继续阅读。',
  tocNote: '好的模型，帮助我们提出更好的问题。', tocLabel: '本页内容', tocAria: '本页目录',
  toastRead: '已记录阅读进度', toastUnread: '已取消已读标记', toastNoStorage: '已更新本次进度；当前浏览器不允许持久保存',
  notFoundCrumb: '未找到页面', notFoundTitle: '这一页暂时不存在', notFoundText: '请从目录选择模型，或回到首页继续探索。', backHome: '回到首页 →',
  crumbRoot: '知识手册',

  sidebarAria: '手册目录', workspaceTitle: '思维模型知识库', workspaceSub: '让思考有据可循', startReading: '开始阅读',
  navLabel: '探索目录', progressLabel: '我的阅读进度', progressAria: '已读模型数量', progressNote: '保存在当前浏览器',

  mobileToc: '本篇目录', mobileTocHint: '跳到例子、做法或练习', mobileTocAria: '本篇文章目录',

  searchTitle: '搜索思维模型', searchPlaceholder: '搜模型名字，或说说遇到的问题…', searchAria: '搜索模型、概念或实际问题',
  searchClose: '关闭搜索', searchResults: '搜索结果', searchEmpty: '想解决什么问题？也可以输入模型名称。',
  searchCount: count => `找到 ${count} 个模型 · 按相关程度排序`, searchNone: '没有找到相关内容。试着换一个更短的关键词，或按主题浏览目录。',
  searchFoot: '支持生活场景、中文与英文名称', searchKeys: '↑↓ 选择 · Enter 打开',
  searchLabels: { lead: '一句话理解', when: '什么时候用', body: '定义', example: '身边的例子', extra: '换个场景', steps: '可以这样试', caution: '使用边界', exercise: '一分钟练习', scene: '适用场景' },
  sceneSnippet: (scene, when) => `${scene}：${when}`,

  sections: [['concept', '定义'], ['example', '举个身边的例子'], ['another-example', '换个场景看看'], ['practice', '可以这样试'],
    ['boundaries', '别用过头了'], ['exercise', '花一分钟试试'], ['related', '顺着看下去'], ['sources', '来源与延伸']],
  diagramAria: title => `查看${title}正文图解`, imageAlt: (title, brief) => `${title}：${brief}`, imageAria: title => `查看${title}配图原图`,
  minutes: count => `约 ${count} 分钟阅读`, handbookNumber: (number, total) => `手册编号 ${number} / ${total}`,
  whenLabel: '什么时候用得上？', exerciseLabel: '现在就能做',
  footnote: '例子为方便理解而设置，不是真实案例报道。', completion: '把一个动作带回现实，再来看看是否有帮助。',
  markRead: '✓ 标记为已读', markedRead: '✓ 已读 · 点击撤销', paginationAria: '按手册编号翻页',
  previousModel: number => `← 上一个模型 · ${number}`, nextModel: number => `下一个模型 · ${number} →`,
  backLabel: '← 返回', backToContents: '回到目录 →', exploreMore: '继续探索其他主题',

  homeCrumb: '开始阅读', heroTitle: ['给思考多一些工具，', '给判断多一点依据。'],
  heroText: count => [`${count} 个值得反复使用的思维模型。理解一个概念，看一个具体例子，`, '再把它带回真实的生活与工作中。'],
  startFirst: '从第一个模型开始', continueReading: title => `继续阅读 · ${title} ↗`, exploreTopics: '按主题探索 ↓',
  stats: [['常用模型', '按分类连续编号'], ['主题方向', '按需查阅'], ['行动步骤', '从理解到应用']],
  scenariosTitle: '你正遇到哪种情况？', scenariosSub: '从眼前的问题开始', scenariosIntro: '不用先记住模型名字，选一个场景，看看哪些方法能帮上忙。',
  sceneCount: count => `优先推荐 ${count} 个模型`,
  topicsTitle: '从你关心的问题开始', topicsSub: '八个主题，彼此连接', topicCount: count => `${count} 个模型 ↗`,
  howTitle: '不用懂专业词，也不用一次读完。',
  howText: '先看一个生活例子，再想想自己有没有遇到过类似的事。每页都有大白话解释、两个场景、三步做法和一分钟练习。挑一个动作试试，就已经开始用起来了。',
  aboutTitle: '关于这份手册',
  aboutText: (ready, total) => `包含科学概念、思想实验与经验框架，它们的用途和证据基础不同。中文内容重新组织，重要误区在各页说明。配图采用无文字火柴人信息图，按模型本身的逻辑组织结构，目前已完成 ${ready} / ${total} 篇。`,

  metaModel: model => `${model.title}（${model.en}）：${model.lead}${model.when}`,
  metaTopic: (category, names) => `${category.description}包含${names.slice(0, 6).join('、')}等 ${names.length} 个思维模型。`,
  metaHomeTitle: count => `${count} 个思维模型 · 思维手册`,
  metaHome: count => `${count} 个思维模型中文知识手册：从理解概念到实际应用，包含具体例子、行动步骤与使用边界。`,
  metaNotFoundTitle: '未找到页面 — 思维手册', metaNotFound: '这一页暂时不存在，请从目录选择模型。',
};

const en = {
  htmlLang: 'en', ogLocale: 'en_US', siteName: 'Mental Models Handbook',
  switchLabel: '中文', switchAria: '阅读本页中文版',
  readingMinutes: text => Math.max(2, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200)),

  skip: 'Skip to content', openMenu: 'Open contents', closeMenu: 'Close contents', closeBackdrop: 'Close contents',
  brand: 'Mental Models', brandSub: count => `${count} thinking tools`, badge: count => `Illustrated · ${count} models`,
  searchButton: 'Search',
  homeSections: [['scenarios', 'Find a model by situation'], ['topics', 'Eight topics'], ['how-to-read', 'How to use this handbook'], ['about', 'About the content']],
  modelNote: "No need to memorize the name. Think about one small problem it could help with.",
  topicSection: count => `${count} related models`, topicNote: 'Models are numbered in order across topics, so you can keep reading from the end of each page.',
  tocNote: 'Good models help us ask better questions.', tocLabel: 'On this page', tocAria: 'On this page',
  toastRead: 'Progress saved', toastUnread: 'Marked as unread', toastNoStorage: "Progress updated for now; this browser doesn't allow saving it",
  notFoundCrumb: 'Page not found', notFoundTitle: "This page doesn't exist", notFoundText: 'Pick a model from the contents, or head back to the home page.', backHome: 'Back to home →',
  crumbRoot: 'Handbook',

  sidebarAria: 'Handbook contents', workspaceTitle: 'Mental Models Library', workspaceSub: 'Reasoning you can stand on', startReading: 'Start here',
  navLabel: 'Contents', progressLabel: 'My reading progress', progressAria: 'Models read', progressNote: 'Saved in this browser',

  mobileToc: 'In this article', mobileTocHint: 'Jump to examples, steps, or practice', mobileTocAria: 'Article contents',

  searchTitle: 'Search mental models', searchPlaceholder: 'Search a model, or describe your problem…', searchAria: 'Search models, ideas, or real-life problems',
  searchClose: 'Close search', searchResults: 'Search results', searchEmpty: 'What are you trying to solve? You can also type a model name.',
  searchCount: count => `${count} model${count === 1 ? '' : 's'} found · sorted by relevance`, searchNone: 'Nothing found. Try a shorter keyword, or browse by topic.',
  searchFoot: 'Search by situation or by model name', searchKeys: '↑↓ to select · Enter to open',
  searchLabels: { lead: 'In short', when: 'When to use it', body: 'Definition', example: 'Example', extra: 'Another scenario', steps: 'Try this', caution: 'Limits', exercise: 'One-minute practice', scene: 'Good for' },
  sceneSnippet: (scene, when) => `${scene}: ${when}`,

  sections: [['concept', 'What it means'], ['example', 'An everyday example'], ['another-example', 'Another scenario'], ['practice', 'Try this'],
    ['boundaries', "Don't overdo it"], ['exercise', 'One-minute practice'], ['related', 'Keep reading'], ['sources', 'Sources and further reading']],
  diagramAria: title => `View the ${title} diagram`, imageAlt: (title, brief) => `${title}: ${brief}`, imageAria: title => `View the full ${title} illustration`,
  minutes: count => `${count} min read`, handbookNumber: (number, total) => `No. ${number} of ${total}`,
  whenLabel: 'When is it useful?', exerciseLabel: 'Do it now',
  footnote: 'Examples are made up to aid understanding; they are not real case reports.', completion: 'Bring one action into real life, then come back and see if it helped.',
  markRead: '✓ Mark as read', markedRead: '✓ Read · click to undo', paginationAria: 'Page through the handbook',
  previousModel: number => `← Previous · ${number}`, nextModel: number => `Next · ${number} →`,
  backLabel: '← Back', backToContents: 'Back to contents →', exploreMore: 'Explore other topics',

  homeCrumb: 'Start here', heroTitle: ['More tools for thinking,', 'better grounds for judgment.'],
  heroText: count => [`${count} mental models worth using again and again. Understand an idea, see a concrete example, then bring it back to your real life and work.`],
  startFirst: 'Start with the first model', continueReading: title => `Continue · ${title} ↗`, exploreTopics: 'Explore by topic ↓',
  stats: [['models', 'numbered by topic'], ['topics', 'browse as needed'], ['action steps', 'from idea to practice']],
  scenariosTitle: 'What are you dealing with?', scenariosSub: 'Start from the problem in front of you', scenariosIntro: "You don't need to know any model names. Pick a situation and see which ideas can help.",
  sceneCount: count => `${count} recommended models`,
  topicsTitle: 'Start with what you care about', topicsSub: 'Eight connected topics', topicCount: count => `${count} models ↗`,
  howTitle: 'No jargon needed, and no need to read it all at once.',
  howText: "Start with an everyday example, then ask whether something similar has happened to you. Every page has a plain-language explanation, two scenarios, three steps, and a one-minute exercise. Try one action and you've already started.",
  aboutTitle: 'About this handbook',
  aboutText: (ready, total) => `It covers scientific concepts, thought experiments, and practical frameworks, which differ in purpose and strength of evidence. Common misunderstandings are noted on each page. The illustrations are wordless stick-figure infographics shaped by each model's own logic; ${ready} of ${total} are complete.`,

  metaModel: model => `${model.title}: ${model.lead} ${model.when}`,
  metaTopic: (category, names) => `${category.description} Includes ${names.slice(0, 6).join(', ')} and more: ${names.length} mental models in total.`,
  metaHomeTitle: count => `${count} Mental Models · Mental Models Handbook`,
  metaHome: count => `A handbook of ${count} mental models in plain English, with everyday examples, practical steps, and the limits of each idea.`,
  metaNotFoundTitle: 'Page not found — Mental Models Handbook', metaNotFound: "This page doesn't exist. Pick a model from the contents.",
};

export const dictionaries = { zh, en };
export let t = zh;
export function setLanguage(lang) { t = dictionaries[lang]; }
