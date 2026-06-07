import { useState, useEffect, useRef } from "react";

const QUOTES = [
  "Өнөөдрийн зовлон маргаашийн хүч болно.",
  "Залхуу бол дайсан. Сахилга бол найз.",
  "Чи хийж чадна. Одоо эхэл.",
  "Тав тухтай байдал чамайг өсгөдөггүй.",
  "Хэцүү зам хүчтэн рүү хөтөлдөг.",
  "Нэг алхам. Нэг шийдвэр. Нэг өдөр.",
  "Их зүйл хийхийн тулд жижиг зүйлсийг хий.",
];

const TASKS = [
  { id: 1, label: "Өглөөний дасгал", icon: "🏋️", xp: 30 },
  { id: 2, label: "Ном унших (20 мин)", icon: "📖", xp: 20 },
  { id: 3, label: "Хүйтэн шүршүүр", icon: "🚿", xp: 25 },
  { id: 4, label: "Усны норм дүүргэх", icon: "💧", xp: 15 },
  { id: 5, label: "Телефон харахгүй 1 цаг", icon: "📵", xp: 35 },
  { id: 6, label: "Тэмдэглэл бичих", icon: "📝", xp: 20 },
];

const LEVELS = [
  { name: "Тулааны шавь", min: 0, max: 100 },
  { name: "Хэвшлийн байгуул", min: 100, max: 250 },
  { name: "Сахилгын дайчин", min: 250, max: 500 },
  { name: "Хүсэл эрмэлзэлт", min: 500, max: 800 },
  { name: "Grit Мастер", min: 800, max: Infinity },
];

function getLevel(xp) {
  return LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[0];
}
function CircularProgress({ value, max, size = 120, stroke = 10, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#gritGrad)" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)" }} />
        <defs>
          <linearGradient id="gritGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff4d00" />
            <stop offset="100%" stopColor="#ff9900" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

export default function GritApp() {
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(7);
  const [completed, setCompleted] = useState([]);
  const [tab, setTab] = useState("home");
  const [flash, setFlash] = useState(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  const level = getLevel(xp);
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1] || level;
  const progress = ((xp - level.min) / (nextLevel.min - level.min || 1)) * 100;

  useEffect(() => {
    const i = setInterval(() => setQuoteIdx((q) => (q + 1) % QUOTES.length), 5000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimerSec((s) => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  function completeTask(task) {
    if (completed.includes(task.id)) return;
    setCompleted((c) => [...c, task.id]);
    setXp((x) => x + task.xp);
    setFlash(`+${task.xp} XP — ${task.label}!`);
    setTimeout(() => setFlash(null), 2200);
  }

  function fmtTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  const styles = {
    app: { minHeight: "100vh", background: "#0a0a0f", color: "#f0ece4", fontFamily: "'Bebas Neue', 'Impact', sans-serif", display: "flex", flexDirection: "column", maxWidth: 420, margin: "0 auto", position: "relative", overflow: "hidden" },
    header: { padding: "28px 24px 16px", background: "linear-gradient(180deg, #0f0f1a 0%, transparent 100%)", borderBottom: "1px solid #1e1e2e" },
    logo: { fontSize: 38, letterSpacing: 8, color: "#ff4d00", textShadow: "0 0 30px #ff4d0066", lineHeight: 1 },
    subtitle: { fontSize: 12, letterSpacing: 4, color: "#666", fontFamily: "monospace", marginTop: 2 },
    streakBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #ff4d00, #ff9900)", borderRadius: 20, padding: "4px 14px", fontSize: 14, letterSpacing: 2, color: "#fff", fontWeight: 900, marginTop: 10, boxShadow: "0 4px 20px #ff4d0044" },
    quoteBox: { margin: "18px 24px", padding: "18px 20px", background: "#111118", border: "1px solid #ff4d0033", borderLeft: "3px solid #ff4d00", borderRadius: 8, fontSize: 15, letterSpacing: 1, color: "#d0ccc4", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.5 },
    section: { padding: "0 24px 20px" },
    sectionTitle: { fontSize: 13, letterSpacing: 5, color: "#ff4d00", marginBottom: 14, opacity: 0.9 },
    levelCard: { background: "#111118", border: "1px solid #222", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, marginBottom: 16 },
    levelName: { fontSize: 20, letterSpacing: 2, color: "#ff9900" },
    xpText: { fontSize: 13, color: "#888", fontFamily: "monospace", letterSpacing: 1, marginTop: 2 },
    taskGrid: { display: "flex", flexDirection: "column", gap: 10 },
    taskCard: (done) => ({ display: "flex", alignItems: "center", gap: 14, background: done ? "#111" : "#13131f", border: `1px solid ${done ? "#ff4d0055" : "#222"}`, borderRadius: 12, padding: "14px 18px", cursor: done ? "default" : "pointer", opacity: done ? 0.55 : 1, transition: "all 0.2s" }),
    taskIcon: { fontSize: 26, minWidth: 36, textAlign: "center" },
    taskLabel: { flex: 1, fontSize: 16, letterSpacing: 1 },
    taskXp: { fontSize: 13, color: "#ff9900", fontFamily: "monospace" },
    checkBox: (done) => ({ width: 22, height: 22, borderRadius: 6, border: `2px solid ${done ? "#ff4d00" : "#333"}`, background: done ? "#ff4d00" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, transition: "all 0.2s" }),
    flash: { position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #ff4d00, #ff9900)", color: "#fff", padding: "12px 28px", borderRadius: 30, fontSize: 15, letterSpacing: 2, zIndex: 100, boxShadow: "0 8px 32px #ff4d0066", whiteSpace: "nowrap" },
    nav: { display: "flex", justifyContent: "space-around", padding: "14px 0 24px", borderTop: "1px solid #1a1a2a", background: "#0a0a0f", position: "sticky", bottom: 0 },
    navBtn: (active) => ({ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontSize: 20, padding: "4px 16px", borderRadius: 12, border: "none", background: active ? "#ff4d0018" : "transparent", color: active ? "#ff4d00" : "#444", cursor: "pointer", transition: "all 0.2s" }),
    navLabel: { fontSize: 9, letterSpacing: 2, fontFamily: "monospace" },
    timerBtn: (active) => ({ display: "block", width: "100%", padding: "16px", background: active ? "linear-gradient(135deg, #1a0a00, #2a1200)" : "linear-gradient(135deg, #ff4d00, #ff9900)", border: `2px solid ${active ? "#ff4d00" : "transparent"}`, borderRadius: 14, color: active ? "#ff4d00" : "#fff", fontSize: 18, letterSpacing: 4, cursor: "pointer", marginTop: 12, transition: "all 0.2s" }),
    resetBtn: { display: "block", width: "100%", padding: "12px", background: "transparent", border: "1px solid #222", borderRadius: 14, color: "#444", fontSize: 14, letterSpacing: 3, cursor: "pointer", marginTop: 10, fontFamily: "monospace" },
  };

  return (
    <div style={styles.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap'); @keyframes popIn { from { opacity: 0; transform: translateX(-50%) scale(0.7); } to { opacity: 1; transform: translateX(-50%) scale(1); } } * { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0a0a0f; } ::-webkit-scrollbar { width: 0; }`}</style>
      {flash && <div style={styles.flash}>{flash}</div>}
      <div style={styles.header}>
        <div style={styles.logo}>GRIT</div>
        <div style={styles.subtitle}>ЗАЛХУУРЫГ АЛА. ХҮЧИЙГ БАЙГУУЛ.</div>
        <div style={styles.streakBadge}>🔥 {streak} ӨДРИЙН STREAK</div>
      </div>
      {tab === "home" && (
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 10 }}>
          <div style={styles.quoteBox}>{QUOTES[quoteIdx]}</div>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>ТАНЫ ТҮВШИН</div>
            <div style={styles.levelCard}>
              <CircularProgress value={xp - level.min} max={nextLevel.min - level.min || 1} size={90} stroke={8}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, color: "#ff4d00" }}>{xp}</div>
                  <div style={{ fontSize: 9, color: "#666", letterSpacing: 1, fontFamily: "monospace" }}>XP</div>
                </div>
              </CircularProgress>
              <div>
                <div style={styles.levelName}>{level.name}</div>
                <div style={styles.xpText}>{xp} / {nextLevel.min === Infinity ? "∞" : nextLevel.min} XP</div>
                <div style={{ marginTop: 8, width: 150, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: "linear-gradient(90deg, #ff4d00, #ff9900)", borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>
            </div>
          </div>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>ӨНӨӨДРИЙН ДААЛГАВАР</div>
            <div style={styles.taskGrid}>
              {TASKS.map((task) => {
                const done = completed.includes(task.id);
                return (
                  <div key={task.id} style={styles.taskCard(done)} onClick={() => completeTask(task)}>
                    <div style={styles.taskIcon}>{task.icon}</div>
                    <div style={styles.taskLabel}>{task.label}</div>
                    <div style={styles.taskXp}>+{task.xp} XP</div>
                    <div style={styles.checkBox(done)}>{done ? "✓" : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {tab === "timer" && (
        <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={styles.sectionTitle}>FOCUS TIMER</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 80, letterSpacing: 4, color: "#ff9900", textShadow: "0 0 40px #ff990066", textAlign: "center" }}>{fmtTime(timerSec)}</div>
          </div>
          <button style={styles.timerBtn(timerRunning)} onClick={() => setTimerRunning((r) => !r)}>{timerRunning ? "⏸  ЗОГСООХ" : "▶  ЭХЛЭХ"}</button>
          <button style={styles.resetBtn} onClick={() => { setTimerRunning(false); setTimerSec(0); }}>ДАХИН ТОХИРУУЛАХ</button>
        </div>
      )}
      {tab === "stats" && (
        <div style={{ flex: 1, padding: "24px" }}>
          <div style={styles.sectionTitle}>ТАНЫ СТАТИСТИК</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[{ label: "Нийт XP", value: xp, icon: "⚡" }, { label: "Streak", value: `${streak} өдөр`, icon: "🔥" }, { label: "Гүйцэтгэсэн", value: `${completed.length}/${TASKS.length}`, icon: "✅" }, { label: "Түвшин", value: level.name.split(" ")[0], icon: "🏆" }].map((stat) => (
              <div key={stat.label} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 14, padding: "18px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 28 }}>{stat.icon}</div>
                <div style={{ fontSize: 22, color: "#ff9900", marginTop: 6 }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: "#555", fontFamily: "monospace", letterSpacing: 2, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={styles.sectionTitle}>STREAK ХУАНЛИ</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} style={{ aspectRatio: 1, borderRadius: 6, background: i < streak ? "linear-gradient(135deg, #ff4d00, #ff9900)" : "#111118", border: "1px solid #1e1e2e", boxShadow: i < streak ? "0 2px 8px #ff4d0033" : "none" }} />
            ))}
          </div>
        </div>
      )}
      <nav style={styles.nav}>
        {[{ id: "home", icon: "🏠", label: "НҮҮР" }, { id: "timer", icon: "⏱", label: "ТАЙМЕР" }, { id: "stats", icon: "📊", label: "СТАТС" }].map((n) => (
          <button key={n.id} style={styles.navBtn(tab === n.id)} onClick={() => setTab(n.id)}>
            <span>{n.icon}</span>
            <span style={styles.navLabel}>{n.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
