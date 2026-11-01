// Shared by the home shortcuts and search, so the same question gets the same recommendations.
export const scenarios = [
  { id: 'start', title: '总是拖延，迟迟不开始', query: '拖延', description: '把“待会儿再做”变成一个具体动作。', aliases: ['拖延', '不想开始', '迟迟不开始', '行动力', '执行力', '坚持不下去', 'procrastination'], models: [86, 100, 44, 66] },
  { id: 'choose', title: '选择太多，不知道怎么选', query: '选择困难', description: '先定标准，再比较真正重要的差别。', aliases: ['选择困难', '选择太多', '怎么选', '难以决定', '纠结', '取舍', '做决定'], models: [54, 47, 9, 58, 55] },
  { id: 'talk', title: '沟通容易误会，话说不清', query: '沟通误会', description: '分清事实与猜测，把需要说清楚。', aliases: ['沟通误会', '沟通', '误会', '表达', '说不清', '吵架', '沟通容易误会'], models: [88, 89, 31, 32, 90] },
  { id: 'learn', title: '学了就忘，知识记不住', query: '记不住', description: '换一种复习方法，让知识留得更久。', aliases: ['记不住', '学了就忘', '记忆', '复习', '学习效率', '背不下来', '遗忘', '记不牢'], models: [87, 63, 61, 73] },
  { id: 'effort', title: '忙了很久，还是没进展', query: '没进展', description: '找到卡住的地方，把力气用在关键处。', aliases: ['没进展', '忙了很久', '效率低', '瞎忙', '瓶颈', '抓重点', '忙不过来'], models: [84, 56, 96, 69] },
  { id: 'stop', title: '投入太多，舍不得放弃', query: '舍不得放弃', description: '把过去的投入和未来的选择分开。', aliases: ['舍不得放弃', '舍不得', '及时止损', '止损', '钱都花了', '不甘心', '沉没成本'], models: [1, 28, 9, 92] },
];

export const enScenarios = [
  { id: 'start', title: 'I keep putting things off', query: 'procrastination', description: 'Turn "I\'ll do it later" into one concrete action.', aliases: ['procrastination', 'procrastinate', 'putting off', 'put off', "can't get started", 'getting started', 'motivation', 'follow through'], models: [86, 100, 44, 66] },
  { id: 'choose', title: "Too many options, can't decide", query: 'hard to decide', description: 'Set your criteria first, then compare the differences that matter.', aliases: ['hard to decide', 'too many options', 'too many choices', 'indecisive', 'which to choose', 'trade-off', 'tradeoff', 'making a decision'], models: [54, 47, 9, 58, 55] },
  { id: 'talk', title: 'Conversations keep going wrong', query: 'miscommunication', description: 'Separate facts from guesses, and say clearly what you need.', aliases: ['miscommunication', 'misunderstanding', 'misunderstood', 'communication', 'argument', 'arguing', 'express myself'], models: [88, 89, 31, 32, 90] },
  { id: 'learn', title: 'I forget what I learn', query: "can't remember", description: 'Try a different way of reviewing so knowledge sticks.', aliases: ["can't remember", 'forget', 'forgetting', 'memory', 'memorize', 'studying', 'retention'], models: [87, 63, 61, 73] },
  { id: 'effort', title: 'Busy for ages, still no progress', query: 'no progress', description: "Find where you're stuck and put effort where it counts.", aliases: ['no progress', 'always busy', 'productivity', 'unproductive', 'bottleneck', 'stuck', 'priorities', 'prioritize', 'overwhelmed'], models: [84, 56, 96, 69] },
  { id: 'stop', title: 'Too invested to let go', query: "can't let go", description: 'Separate what you have already put in from the choice ahead.', aliases: ["can't let go", 'let go', 'give up', 'cut losses', 'cut my losses', 'already paid', 'sunk cost'], models: [1, 28, 9, 92] },
];

export const scenariosFor = lang => (lang === 'en' ? enScenarios : scenarios);

export function matchingScenarios(query, list = scenarios) {
  const text = query.toLocaleLowerCase().trim();
  // Latin-script fragments need more letters before they count as a partial alias match.
  const minPartial = /[a-z]/.test(text) ? 4 : 2;
  if (text.length < 2) return [];
  return list.filter(scene => scene.aliases.some(alias => text.includes(alias) || (text.length >= minPartial && alias.includes(text))));
}
