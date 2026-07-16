export type XiaoboQuote = {
  id: string;
  text: string;
  source: string;
  category: string;
  keywords: string[];
  note: string;
};

export const xiaoboQuotes: XiaoboQuote[] = [
  {
    id: "golden-01",
    text: "生活就是个缓慢受锤的过程……",
    source: "《黄金时代》",
    category: "压力与生活",
    keywords: ["压力", "疲惫", "累", "难熬", "挫折", "失败", "现实", "工作", "加班", "生活"],
    note: "它不负责粉饰生活，只提醒你：难受不一定证明你做错了，也可能只是生活正在使用它那把不太讲究的锤子。",
  },
  {
    id: "golden-02",
    text: "我想爱，想吃，还想在一瞬间变成天上半明半暗的云。",
    source: "《黄金时代》",
    category: "欲望与生命",
    keywords: ["愿望", "想要", "理想", "青春", "自由", "生活", "无聊", "快乐", "热爱", "活着"],
    note: "适合在你把日子过成任务清单时读。人的愿望未必都要通过审批，有些愿望存在本身就很要紧。",
  },
  {
    id: "thirty-01",
    text: "我要爱，要生活，把眼前的一世当做一百世一样。",
    source: "《三十而立》",
    category: "行动与选择",
    keywords: ["行动", "拖延", "选择", "决定", "现在", "未来", "后悔", "勇气", "生活", "爱情"],
    note: "它不是催你立刻干一番大事，而是反对把唯一的一生当成可以无限延期的草稿。",
  },
  {
    id: "thirty-02",
    text: "无论如何，我要对自己负起责任。",
    source: "《三十而立》",
    category: "责任与选择",
    keywords: ["选择", "责任", "决定", "纠结", "未来", "职业", "考研", "工作", "别人", "评价"],
    note: "当旁人的意见挤满房间时，这句话适合用来清场。选择可以参考别人，后果却仍要由自己生活。",
  },
  {
    id: "wanshou-01",
    text: "一个人只拥有此生此世是不够的，他还应该拥有诗意的世界。",
    source: "《万寿寺》",
    category: "庸常与想象",
    keywords: ["无聊", "庸常", "意义", "想象", "写作", "阅读", "诗意", "生活", "麻木", "孤独"],
    note: "现实世界负责交水电费，诗意世界负责不让你彻底变成水电费。二者最好都保留。",
  },
  {
    id: "revolution-01",
    text: "人活在世界上，快乐和痛苦本就分不清。所以我只求它货真价实。",
    source: "《革命时期的爱情》",
    category: "真实与得失",
    keywords: ["痛苦", "快乐", "真假", "真实", "失恋", "爱情", "选择", "得失", "矛盾", "迷茫"],
    note: "适合那些不能简单归入“好事”或“坏事”的经历。与其急着贴标签，不如先确认它是否真实地属于你。",
  },
  {
    id: "thinking-01",
    text: "一个人倘若需要从思想中得到快乐，那么他的第一个欲望就是学习。",
    source: "《思维的乐趣》",
    category: "学习与研究",
    keywords: ["学习", "科研", "读书", "考试", "论文", "知识", "研究", "好奇", "学业", "大学"],
    note: "把学习从分数和绩效里暂时救出来：真正持久的动力，往往是想把一个问题弄明白。",
  },
  {
    id: "thinking-02",
    text: "有趣是有道理而且新奇。",
    source: "《思维的乐趣》",
    category: "创造与趣味",
    keywords: ["有趣", "无聊", "创意", "写作", "研究", "新奇", "灵感", "思考", "麻木", "重复"],
    note: "有趣不是耍宝，也不是故作古怪；它至少得经得起一点道理，还要给旧世界开一扇新窗。",
  },
  {
    id: "thinking-03",
    text: "对于一位知识分子来说，成为思维的精英，比成为道德精英更为重要。",
    source: "《思维的乐趣》",
    category: "判断与思考",
    keywords: ["思考", "道德", "争论", "观点", "判断", "舆论", "社会", "偏见", "独立", "知识分子"],
    note: "遇到人人急着表态的场面，可以先检查事实和逻辑。道德姿势摆得再端正，也不能替代理解问题。",
  },
  {
    id: "thinking-04",
    text: "我认为低智、偏执、思想贫乏是最大的邪恶。",
    source: "《思维的乐趣》",
    category: "偏见与清醒",
    keywords: ["偏执", "愚蠢", "争论", "偏见", "逻辑", "清醒", "社会", "观点", "攻击", "信息"],
    note: "这句很尖锐，适合拿来要求自己多知道一点、少武断一点；若只用来骂别人，它的效力大概会减半。",
  },
  {
    id: "preface-01",
    text: "我活在世上，无非想要明白些道理，遇见些有趣的事。",
    source: "《沉默的大多数·前言》",
    category: "意义与人生",
    keywords: ["意义", "人生", "活着", "迷茫", "理想", "有趣", "道理", "未来", "方向", "孤独"],
    note: "当“人生意义”大得让人无从下手时，这句话给出了一种较小、也较诚实的尺度。",
  },
  {
    id: "preface-02",
    text: "倘能如我所愿，我的一生就算成功。",
    source: "《沉默的大多数·前言》",
    category: "成功与标准",
    keywords: ["成功", "失败", "比较", "焦虑", "标准", "别人", "评价", "学校", "成绩", "职业"],
    note: "成功不必只有社会统一印制的版本。先说清“如我所愿”的那个“我”究竟想要什么。",
  },
  {
    id: "youth-01",
    text: "青年的动人之处，就在于勇气，和他们的远大前程。",
    source: "《卖唱的人们》",
    category: "青年与勇气",
    keywords: ["年轻", "青春", "勇气", "未来", "尝试", "害怕", "失败", "机会", "毕业", "前途"],
    note: "年轻的优势不只是时间多，也包括还来得及笨拙地试一试。远大前程通常不会自己来敲门。",
  },
  {
    id: "pig-01",
    text: "我已经四十岁了，除了这只猪，还没见过谁敢于如此无视对生活的设置。",
    source: "《一只特立独行的猪》",
    category: "自由与规训",
    keywords: ["自由", "安排", "父母", "规训", "别人", "期待", "工作", "婚姻", "不理解", "独立"],
    note: "适合在生活被别人安排得井井有条时读。猪的办法未必能照搬，但先看见“设置”本身很重要。",
  },
  {
    id: "wisdom-01",
    text: "智慧本身就是好的。",
    source: "《智慧与国学》",
    category: "智慧与求知",
    keywords: ["智慧", "知识", "读书", "学习", "科研", "思考", "意义", "求知", "理性", "选择"],
    note: "有些事不需要再附加一个立刻变现的理由。把事情想明白，本身就可以是一项收益。",
  },
  {
    id: "work-01",
    text: "干什么都是好的；但要干出个样子来，这才是人的价值和尊严所在。",
    source: "《工作与人生》",
    category: "职业与尊严",
    keywords: ["工作", "职业", "就业", "考研", "选择", "转行", "毕业", "价值", "尊严", "努力"],
    note: "它不替你指定职业，只把注意力从职业名头移回做事本身：是否认真，是否做出了自己的样子。",
  },
  {
    id: "writing-01",
    text: "我相信我自己有文学才能，我应该做这件事。",
    source: "《我为什么要写作》",
    category: "写作与志业",
    keywords: ["写作", "创作", "梦想", "才能", "喜欢", "坚持", "职业", "选择", "作品", "自信"],
    note: "适合已经反复验证过兴趣和能力、却仍因旁人眼光迟疑的人。相信不是证明，但可以成为开始。",
  },
  {
    id: "letter-01",
    text: "我有了良心，我的良心就是你。真的。",
    source: "《爱你就像爱生命·致银河（书简1）》",
    category: "爱情与坦白",
    keywords: ["爱情", "喜欢", "表白", "恋爱", "爱人", "伴侣", "想念", "关系", "真心", "银河"],
    note: "这不是普适恋爱教程，而是一句带着具体关系和具体语境的坦白。适合真心，不适合群发。",
  },
  {
    id: "letter-20",
    text: "单单你的名字就够我爱一世的了。",
    source: "《爱你就像爱生命·致银河（书简20）》",
    category: "爱情与想念",
    keywords: ["爱情", "想念", "异地", "名字", "表白", "恋人", "爱人", "浪漫", "银河", "思念"],
    note: "适合想念一个具体的人时使用。请保留出处，也请确认对方愿意接收如此高浓度的浪漫。",
  },
  {
    id: "letter-21",
    text: "谁也管不住我爱你，真的，谁管谁就真傻……",
    source: "《爱你就像爱生命·致银河（书简21）》",
    category: "爱情与自由",
    keywords: ["爱情", "自由", "反对", "父母", "世俗", "恋爱", "表白", "勇气", "关系", "爱人"],
    note: "热烈归热烈，它说的是感情不服从外部命令，并不等于感情可以无视对方的边界。",
  },
];

const sceneGroups: Record<string, string[]> = {
  "压力与生活": ["焦虑", "压力", "累", "疲惫", "失败", "考试", "成绩", "学校", "论文", "科研"],
  "爱情与想念": ["爱情", "恋爱", "喜欢", "表白", "失恋", "想念", "异地", "伴侣", "爱人"],
  "自由与规训": ["自由", "父母", "安排", "规训", "期待", "不理解", "别人", "世俗"],
  "学习与研究": ["学习", "科研", "论文", "读书", "考试", "知识", "研究", "大学"],
  "职业与选择": ["工作", "职业", "转行", "考研", "毕业", "选择", "决定", "前途"],
  "意义与人生": ["意义", "人生", "无聊", "孤独", "迷茫", "生活", "活着", "有趣"],
  "写作与创造": ["写作", "创作", "灵感", "作品", "创意", "才能", "新奇"],
};

function hash(value: string) {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function findXiaoboQuotes(scenario: string, nonce = 0, count = 3) {
  const input = scenario.trim().toLowerCase();
  const ranked = xiaoboQuotes.map((quote) => {
    let score = 0;
    quote.keywords.forEach((keyword) => {
      if (input.includes(keyword)) score += keyword.length > 1 ? 5 : 2;
    });
    Object.entries(sceneGroups).forEach(([group, words]) => {
      const matches = words.filter((word) => input.includes(word)).length;
      if (matches && (quote.category.includes(group.slice(0, 2)) || quote.keywords.some((word) => words.includes(word)))) {
        score += matches * 2;
      }
    });
    const jitter = hash(`${input || "随便看看"}-${nonce}-${quote.id}`) % 1000;
    return { quote, score, jitter };
  });

  ranked.sort((a, b) => b.score - a.score || b.jitter - a.jitter);
  const strongest = ranked[0]?.score ?? 0;
  const pool = strongest > 0
    ? ranked.filter((item) => item.score >= Math.max(1, strongest - 4))
    : ranked;

  const chosen: XiaoboQuote[] = [];
  [...pool, ...ranked].forEach(({ quote }) => {
    if (chosen.length < count && !chosen.some((item) => item.id === quote.id)) chosen.push(quote);
  });
  return chosen;
}
