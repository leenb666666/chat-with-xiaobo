"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { generateReply, Tone } from "./lib/ai";

type View = "home" | "chat" | "about" | "reading" | "favorites" | "letter" | "diagnosis" | "404";
type Message = { id: string; role: "user" | "assistant"; text: string; saved?: boolean; error?: boolean };
type Conversation = { id: string; title: string; createdAt: number; messages: Message[] };
type Favorite = { id: string; text: string; date: string };

const randomQuestions = [
  "你最近在为什么事情感到焦虑？",
  "你有没有正在坚持一件别人不太理解的事情？",
  "你更害怕失败，还是害怕活得没有意思？",
  "你最近一次觉得生活很荒诞，是什么时候？",
  "假如不考虑结果，你现在最想做什么？",
  "你觉得聪明和快乐之间有关系吗？",
  "你现在努力的事情，真的是你自己想要的吗？",
];

const dailyQuestions = [
  "人为什么总想证明自己的选择是唯一正确的？",
  "如果没人评价，你还愿意继续做现在的事吗？",
  "你最近一次诚实地改变主意，是什么时候？",
  "我们是在追求成功，还是在躲避被人看轻？",
  "生活必须有意义，还是有一点意思就够了？",
  "什么东西看似重要，其实只是大家都不敢说它无聊？",
  "你愿意为哪一种自由承担麻烦？",
];

const quickQuestions = [
  "我最近总担心自己会失败。",
  "我不知道现在努力的事情值不值得。",
  "为什么越长大，越难觉得生活有意思？",
];

const demoQuestions = [
  "我很努力，但还是害怕自己进不了理想的学校。",
  "我不知道自己是真的喜欢科研，还是只是喜欢成绩好的感觉。",
  "人为什么要做一个有趣的人？",
];

const loadingLines = [
  "正在想一件不那么糊涂的说法……",
  "正在把废话删掉……",
  "正在考虑该不该说得难听一点……",
];

const books = [
  { group: "爱情与个人生活", items: [["爱你就像爱生命", "书信中的坦率、热烈与日常。建议选择正规出版版本阅读。"], ["黄金时代", "从个人经验出发，观察欲望、尊严与时代处境。"]] },
  { group: "理性与自由", items: [["沉默的大多数", "关于常识、独立判断与知识分子责任的随笔集。"], ["我的精神家园", "讨论阅读、写作、智慧和一个人如何保持清醒。"]] },
  { group: "小说与荒诞", items: [["白银时代", "以冷静想象审视秩序、记忆和人的处境。"], ["青铜时代", "借历史与传奇展开关于自由、叙事和人性的实验。"], ["红拂夜奔", "在历史故事与现代意识之间制造活泼的错位。"]] },
  { group: "随笔与思想", items: [["一只特立独行的猪", "从日常经验切入，保留判断、幽默和不服从的空间。"], ["理想国与哲人王", "适合继续阅读其对理性、权力与知识的思考。"]] },
];

const uid = () => Math.random().toString(36).slice(2, 10);
const todayQuestion = () => {
  const now = new Date();
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  return dailyQuestions[day % dailyQuestions.length];
};

function newConversation(): Conversation {
  return { id: uid(), title: "一场尚未命名的谈话", createdAt: Date.now(), messages: [] };
}

function Stamp() {
  return <span className="stamp" aria-hidden="true">波</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tone, setTone] = useState<Tone>("清醒");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState("");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [toolText, setToolText] = useState("");
  const [letterTone, setLetterTone] = useState("保留原文");
  const [toolResult, setToolResult] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("xb-theme") as "light" | "dark" | null;
    const storedChats = localStorage.getItem("xb-conversations");
    const storedFavorites = localStorage.getItem("xb-favorites");
    const initial = storedChats ? JSON.parse(storedChats) as Conversation[] : [newConversation()];
    setTheme(storedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    setConversations(initial);
    setActiveId(initial[0].id);
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("xb-theme", theme);
  }, [theme]);
  useEffect(() => {
    if (conversations.length) localStorage.setItem("xb-conversations", JSON.stringify(conversations));
  }, [conversations]);
  useEffect(() => localStorage.setItem("xb-favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [conversations, loading]);
  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => setLoadingIndex((i) => (i + 1) % loadingLines.length), 1500);
    return () => clearInterval(timer);
  }, [loading]);

  const active = conversations.find((c) => c.id === activeId) || conversations[0];
  const go = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const patchActive = (updater: (c: Conversation) => Conversation) => {
    setConversations((all) => all.map((c) => c.id === activeId ? updater(c) : c));
  };

  const createChat = (seed?: string) => {
    const fresh = newConversation();
    setConversations((all) => [fresh, ...all]);
    setActiveId(fresh.id);
    setView("chat");
    setMenuOpen(false);
    if (seed) setTimeout(() => send(seed, fresh.id), 80);
  };

  const send = async (raw?: string, targetId?: string, variant: "normal" | "plain" | "sharp" = "normal") => {
    const text = (raw ?? input).trim();
    const id = targetId || activeId;
    if (!text || loading) return;
    setInput("");
    setLoading(true);
    const userMessage: Message = { id: uid(), role: "user", text };
    setConversations((all) => all.map((c) => c.id === id ? {
      ...c,
      title: c.messages.length ? c.title : text.slice(0, 22),
      messages: [...c.messages, userMessage],
    } : c));
    try {
      const history = conversations.find((c) => c.id === id)?.messages ?? [];
      const reply = await generateReply(text, tone, variant, history);
      setConversations((all) => all.map((c) => c.id === id ? {
        ...c, messages: [...c.messages, { id: uid(), role: "assistant", text: reply }],
      } : c));
    } catch {
      setConversations((all) => all.map((c) => c.id === id ? {
        ...c, messages: [...c.messages, { id: uid(), role: "assistant", text: "刚才那句话在半路上摔了一跤。再试一次。", error: true }],
      } : c));
    } finally {
      setLoading(false);
    }
  };

  const regenerate = (variant: "normal" | "plain" | "sharp") => {
    if (!active) return;
    const lastUser = [...active.messages].reverse().find((m) => m.role === "user");
    if (lastUser) send(lastUser.text, active.id, variant);
  };

  const deleteConversation = (id: string) => {
    const left = conversations.filter((c) => c.id !== id);
    const next = left.length ? left : [newConversation()];
    setConversations(next);
    if (id === activeId) setActiveId(next[0].id);
  };

  const saveSentence = (message: Message) => {
    const exists = favorites.some((f) => f.id === message.id);
    setFavorites((all) => exists ? all.filter((f) => f.id !== message.id) : [...all, { id: message.id, text: message.text, date: new Date().toLocaleDateString("zh-CN") }]);
    setNotice(exists ? "已取消收藏" : "已存入句子档案");
    setTimeout(() => setNotice(""), 1800);
  };

  const exportText = () => {
    if (!active) return;
    const body = active.messages.map((m) => `${m.role === "user" ? "我" : "小波式对话者"}：\n${m.text}`).join("\n\n");
    const blob = new Blob([`和小波聊聊\n${new Date(active.createdAt).toLocaleString("zh-CN")}\n\n${body}\n\n本站为非官方文学互动项目。对话内容由人工智能生成。`], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${active.title}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const shareCard = (message: Message) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080; canvas.height = 1350;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#eee8d8"; ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = "rgba(70,58,40,.035)";
    for (let i = 0; i < 9000; i++) ctx.fillRect(Math.random() * 1080, Math.random() * 1350, 1, 1);
    ctx.strokeStyle = "#8b2e24"; ctx.lineWidth = 4; ctx.strokeRect(72, 72, 936, 1206);
    ctx.fillStyle = "#1d1c19"; ctx.font = "700 48px serif"; ctx.fillText("和小波聊聊", 112, 150);
    ctx.fillStyle = "#8b2e24"; ctx.font = "700 38px serif"; ctx.fillText("波", 886, 148);
    ctx.font = "34px serif"; ctx.fillStyle = "#26231e";
    const text = message.text.replace(/\n+/g, " ");
    const chars = [...text]; const lines: string[] = []; let line = "";
    chars.forEach((ch) => { const next = line + ch; if (ctx.measureText(next).width > 810) { lines.push(line); line = ch; } else line = next; });
    if (line) lines.push(line);
    lines.slice(0, 15).forEach((l, i) => ctx.fillText(l, 112, 280 + i * 62));
    ctx.font = "24px serif"; ctx.fillStyle = "#6d675b"; ctx.fillText(`${new Date().toLocaleDateString("zh-CN")}  ·  AI 生成内容`, 112, 1210);
    const a = document.createElement("a"); a.download = "和小波聊聊-句子卡片.png"; a.href = canvas.toDataURL("image/png"); a.click();
  };

  const makeLetter = () => {
    if (!toolText.trim()) return;
    const turns: Record<string, string> = {
      保留原文: toolText.trim(),
      更清醒一点: `我决定先承认这件事确实让我为难，再把能做的和不能控制的分开。${toolText.trim()} 我不需要今天解决全部，只需要让明天的自己少接手一点混乱。`,
      更幽默一点: `${toolText.trim()} 目前看，我的大脑已经为此成立了一个常设委员会，全天开会，毫无产出。希望未来的我看到这里时，已经把委员会解散，或者至少让它按时下班。`,
      更温柔一点: `${toolText.trim()} 写下这些，并不是要责怪现在的自己。我知道你已经尽力周旋。愿未来的我记得：那时的疲惫是真实的，而我仍然一点点走到了这里。`,
    };
    setToolResult(`写给未来的我：\n\n${turns[letterTone]}\n\n如果你已经走过这段路，请不要嘲笑当时的我。那时我知道的不多，但还是在认真生活。\n\n来自 ${new Date().toLocaleDateString("zh-CN")} 的我`);
  };

  const makeDiagnosis = () => {
    if (!toolText.trim()) return;
    setDiagnosis(`症状名称：尚未发生的麻烦预演综合征\n\n发作时间：事情安静下来、尤其准备睡觉时\n\n主要诱因：${toolText.trim().slice(0, 70)}${toolText.length > 70 ? "……" : ""}\n\n荒诞程度：7 / 10（大脑已提前举行数次新闻发布会）\n\n实际问题：不确定性偏高，控制感不足，并把可能性误当成了判决书。\n\n建议处方：今天完成一件可控的小事；把最坏结果写成具体方案；然后暂停为尚未发生的事情加班。`);
  };

  const header = (
    <header className="topbar">
      <button className="brand" onClick={() => go("home")}><Stamp /><span>和小波聊聊</span></button>
      <nav className="desktop-nav" aria-label="主导航">
        <button onClick={() => go("chat")}>谈谈</button>
        <button onClick={() => go("reading")}>阅读入口</button>
        <button onClick={() => go("favorites")}>句子档案</button>
        <button onClick={() => go("about")}>关于</button>
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="切换深浅模式">{theme === "light" ? "◐" : "◑"}</button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开菜单">目录</button>
      </div>
    </header>
  );

  const mobileMenu = menuOpen && (
    <div className="mobile-drawer">
      {([["home", "首页"], ["chat", "开始谈谈"], ["reading", "阅读入口"], ["favorites", "句子档案"], ["letter", "写一封信"], ["diagnosis", "荒诞诊断书"], ["about", "关于本站"]] as [View, string][]).map(([v, label]) => <button key={v} onClick={() => go(v)}>{label}</button>)}
    </div>
  );

  if (view === "home") {
    return <main className="site-shell">{header}{mobileMenu}
      <section className="hero">
        <div className="edition-mark">非官方文学互动项目 · 第 01 号</div>
        <div className="hero-art" aria-hidden="true">
          <div className="window"><i /><i /><i /></div><div className="lamp"><b /><em /></div><div className="desk" /><div className="figure"><i /><b /></div><div className="papers">////</div>
        </div>
        <div className="hero-copy">
          <p className="chapter">CHAPTER 01 / 一场谈话的开头</p>
          <h1>和小波<br />聊聊</h1>
          <blockquote>在一个不太正常的世界里，<br />尽量做一个头脑清楚的人。</blockquote>
          <small>— 网站文案，非王小波原话</small>
          <p className="intro">你可以在这里谈论爱情、自由、科研、生活，以及那些说出来似乎没有用，但不说又会憋坏的问题。</p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => createChat()}>开始谈谈 <span>→</span></button>
            <button className="secondary" onClick={() => createChat(randomQuestions[Math.floor(Math.random() * randomQuestions.length)])}>随便问一个问题</button>
          </div>
        </div>
        <aside className="today-card">
          <span>今日一问 / {String(new Date().getDate()).padStart(2, "0")}</span>
          <p>{todayQuestion()}</p>
          <button onClick={() => createChat(todayQuestion())}>从这里开始 →</button>
        </aside>
        <p className="disclaimer">本站为非官方文学互动项目。对话内容由人工智能生成，仅受到相关文学精神与思想气质的启发，不代表王小波本人，也不应被视为其真实言论。</p>
      </section>
      <section className="home-grid">
        <div><span>01</span><h2>清醒，不是冷漠</h2><p>承认事情复杂，但不把复杂当作逃避判断的借口。</p></div>
        <div><span>02</span><h2>幽默，不是油滑</h2><p>看见生活的荒诞，也保留对真实痛苦的尊重。</p></div>
        <div><span>03</span><h2>自由，不是口号</h2><p>把“别人怎么看”与“事情是否值得”分开来谈。</p></div>
      </section>
      <footer><Stamp /><p>不是让一个作家重新开口，<br />而是给思考留一张椅子。</p><button onClick={() => go("about")}>了解这个项目</button><span className="credit">created by Lee</span></footer>
    </main>;
  }

  if (view === "chat") {
    return <main className="chat-page">
      <aside className={`chat-sidebar ${menuOpen ? "open" : ""}`}>
        <button className="side-brand" onClick={() => go("home")}><Stamp /><b>和小波聊聊</b></button>
        <button className="new-chat" onClick={() => createChat()}>＋ 新建对话</button>
        <p className="side-label">最近的谈话</p>
        <div className="history-list">{conversations.map((c) => <div className={c.id === activeId ? "active" : ""} key={c.id}>
          <button onClick={() => { setActiveId(c.id); setMenuOpen(false); }}>{c.title}</button>
          <button className="delete" onClick={() => deleteConversation(c.id)} aria-label={`删除 ${c.title}`}>×</button>
        </div>)}</div>
        <p className="side-label">别的入口</p>
        <nav>
          <button onClick={() => createChat(randomQuestions[Math.floor(Math.random() * randomQuestions.length)])}>⌁ 随机话题</button>
          <button onClick={() => createChat(todayQuestion())}>◷ 今日一问</button>
          <button onClick={() => go("letter")}>✉ 把烦恼写成信</button>
          <button onClick={() => go("diagnosis")}>⌘ 荒诞诊断书</button>
          <button onClick={() => go("favorites")}>◇ 句子档案</button>
          <button onClick={() => go("about")}>ⓘ 关于本站</button>
        </nav>
        <div className="side-bottom"><button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? "◐ 深色模式" : "◑ 浅色模式"}</button><small>created by Lee</small></div>
      </aside>
      <section className="chat-main">
        <div className="chat-header">
          <button className="chat-menu" onClick={() => setMenuOpen(!menuOpen)}>目录</button>
          <div><b>小波式对话者</b><span><i /> 非本人 · AI 生成</span></div>
          <div className="chat-header-actions"><button onClick={exportText}>导出</button><button onClick={() => patchActive((c) => ({ ...c, messages: [] }))}>清空</button></div>
        </div>
        <div className="messages">
          {!active?.messages.length && <div className="empty-chat">
            <Stamp /><p>有些问题并不缺少答案，<br />只是缺少一个可以慢慢把它说清楚的地方。</p>
            <div>{quickQuestions.map((q) => <button key={q} onClick={() => send(q)}>{q}<span>↗</span></button>)}</div>
            <p className="demo-label">或者看看演示对话</p>
            <div>{demoQuestions.map((q) => <button key={q} onClick={() => send(q)}>{q}<span>→</span></button>)}</div>
          </div>}
          {active?.messages.map((m) => <article key={m.id} className={`message ${m.role}`}>
            {m.role === "assistant" && <div className="speaker"><Stamp /><span>小波式对话者</span></div>}
            <div className="message-text">{m.text.split("\n").map((p, i) => <p key={i}>{p || "\u00a0"}</p>)}</div>
            {m.role === "assistant" && <div className="message-tools">
              {m.error ? <button onClick={() => regenerate("normal")}>重新生成</button> : <>
                <button onClick={() => regenerate("plain")}>别跟我讲道理</button>
                <button onClick={() => regenerate("sharp")}>再尖锐一点</button>
                <button onClick={() => saveSentence(m)}>{favorites.some((f) => f.id === m.id) ? "已收藏" : "保存句子"}</button>
                <button onClick={() => shareCard(m)}>生成卡片</button>
              </>}
            </div>}
          </article>)}
          {loading && <div className="thinking"><Stamp /><span>{loadingLines[loadingIndex]}</span><b className="cursor" /></div>}
          <div ref={endRef} />
        </div>
        <div className="composer-wrap">
          <div className="tone-row"><span>对话语气</span>{(["清醒", "荒诞", "温和", "辩论"] as Tone[]).map((t) => <button className={tone === t ? "active" : ""} key={t} onClick={() => setTone(t)}>{t}</button>)}</div>
          <div className="composer">
            <button className="random-button" onClick={() => setInput(randomQuestions[Math.floor(Math.random() * randomQuestions.length)])} aria-label="随机问题">⌁</button>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="说说你的问题。严肃的、荒诞的，都行。" rows={1} />
            <button className="send-button" disabled={!input.trim() || loading} onClick={() => send()}>发送 ↗</button>
          </div>
          <small>Enter 发送 · Shift + Enter 换行 · 对话仅保存在此设备</small>
        </div>
      </section>
      {menuOpen && <button className="drawer-backdrop" onClick={() => setMenuOpen(false)} aria-label="关闭菜单" />}
      {notice && <div className="toast">{notice}</div>}
    </main>;
  }

  const pageHeader = (no: string, title: string, intro: string) => <div className="page-heading"><p>CHAPTER {no}</p><h1>{title}</h1><div className="rule" /><p>{intro}</p></div>;

  return <main className="site-shell inner">{header}{mobileMenu}
    {view === "about" && <section className="content-page">
      {pageHeader("05", "关于本站", "我们并不试图让一个作家重新开口。")}
      <div className="about-lead"><Stamp /><blockquote>真正值得留下来的，也许不是某个人说话时的口音，而是他曾经提醒我们：人在这个世界上，应当尽量活得明白一点，也有趣一点。</blockquote></div>
      <div className="about-grid">
        <article><span>我们在做什么</span><h2>给思考留一个不着急的地方</h2><p>这是一个非官方文学互动项目。我们借助人工智能，尝试延续理性、幽默、自由与清醒的思考气质，而不是复刻某个人的口吻。</p><p>对话可以谈现实，也可以谈一些看似无用的问题。无用有时只是尚未被填写进表格。</p></article>
        <article className="principles"><span>四条边界</span><ol><li><b>非官方项目</b><p>与王小波本人、家属及出版机构无隶属关系。</p></li><li><b>不制造虚假语录</b><p>站内生成内容统一标注为 AI 生成。</p></li><li><b>不进行数字复活</b><p>虚拟角色只叫“小波式对话者”。</p></li><li><b>尊重作品版权</b><p>阅读页只做原创介绍，不复制长段原文。</p></li></ol></article>
      </div>
      <div className="notice-box"><b>重要说明</b><p>本站对话内容由人工智能生成，仅受到相关文学精神与思想气质的启发，不代表王小波本人，也不应被视为其真实言论。本站不提供医疗、法律或其他专业意见。</p></div>
    </section>}

    {view === "reading" && <section className="content-page">
      {pageHeader("03", "阅读入口", "与其收集真假难辨的语录，不如回到作品本身。")}
      <div className="books">{books.map((group, gi) => <section key={group.group}><header><span>0{gi + 1}</span><h2>{group.group}</h2></header><div>{group.items.map(([title, desc]) => <article key={title}><h3>《{title}》</h3><p>{desc}</p><small>建议通过正规出版社、图书馆或授权电子平台阅读</small></article>)}</div></section>)}</div>
      <div className="reading-note"><Stamp /><p>这里不预置大段作品摘录。一本书最不走运的命运，大概是被拆成许多句子，在互联网上轮流证明它没说过的话。</p></div>
    </section>}

    {view === "favorites" && <section className="content-page">
      {pageHeader("04", "句子档案", "只保存你在对话里真正想留下的东西。")}
      {!favorites.length ? <div className="empty-archive"><span>◇</span><h2>档案还是空的</h2><p>这很好，说明暂时还没有句子被迫承担纪念碑的工作。</p><button className="primary" onClick={() => go("chat")}>去谈谈</button></div> :
      <div className="favorite-grid">{favorites.map((f, i) => <article key={f.id}><span>NO. {String(i + 1).padStart(3, "0")}</span><p>{f.text}</p><footer><small>{f.date} · AI 对话生成内容</small><button onClick={() => setFavorites((all) => all.filter((x) => x.id !== f.id))}>删除</button></footer></article>)}</div>}
    </section>}

    {view === "letter" && <section className="content-page tool-page">
      {pageHeader("06", "把烦恼写成一封信", "有些事写给未来，今天就会稍微轻一点。")}
      <div className="tool-layout"><div className="tool-input"><label htmlFor="letter">把你的烦恼写在这里</label><textarea id="letter" value={toolText} onChange={(e) => setToolText(e.target.value)} placeholder="最近让我困扰的是……" /><div className="choice-row">{["保留原文", "更清醒一点", "更幽默一点", "更温柔一点"].map((x) => <button className={letterTone === x ? "active" : ""} onClick={() => setLetterTone(x)} key={x}>{x}</button>)}</div><button className="primary" onClick={makeLetter}>写给未来的我</button></div><div className="paper-result"><span>LETTER / {new Date().getFullYear()}</span>{toolResult ? <pre>{toolResult}</pre> : <p>信纸还空着。<br />它没有催你，这一点比许多人强。</p>}</div></div>
    </section>}

    {view === "diagnosis" && <section className="content-page tool-page">
      {pageHeader("07", "荒诞诊断书", "把烦恼装进表格里，它有时就不那么像命运。")}
      <div className="diagnosis-warning">文学互动功能 · 不是医学诊断</div>
      <div className="tool-layout"><div className="tool-input"><label htmlFor="diag">最近是什么在让你烦恼？</label><textarea id="diag" value={toolText} onChange={(e) => setToolText(e.target.value)} placeholder="例如：结果还没公布，我已经想了十七种失败方式……" /><button className="primary" onClick={makeDiagnosis}>开具一份诊断书</button></div><div className="paper-result diagnosis-paper"><span>荒诞生活临时观察所</span>{diagnosis ? <pre>{diagnosis}</pre> : <p>本诊断书只负责把荒诞说清楚，<br />不负责替代医生，也不收挂号费。</p>}<i>AI<br />生成</i></div></div>
    </section>}

    {view === "404" && <section className="not-found"><b>404</b><h1>你来到了一页不存在的地方。</h1><p>这倒不算罕见，人有时也会走到一些并不存在的答案里。</p><button className="primary" onClick={() => go("home")}>回到首页</button></section>}
    <footer className="inner-footer"><p>和小波聊聊 · 非官方文学互动项目</p><p>所有对话均为 AI 生成内容</p><p className="credit">created by Lee</p></footer>
  </main>;
}
