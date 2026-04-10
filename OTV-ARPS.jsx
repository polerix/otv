const { useState, useEffect, useRef, useCallback } = React;

const IMG_BASE = "./ARPS/1x"; // Points to the PNG folder──────────────────────────────────────────────────────────────
const STATUS = { PLAYING: "playing", NEXT: "next", QUEUED: "queued", DONE: "done" };
const STATUS_COLOR = { playing: "#ff2222", next: "#ffcc00", queued: "#666", done: "#22cc55" };
const STATUS_GLOW = { playing: "#ff000066", next: "#ffcc0044", queued: "transparent", done: "#22cc5533" };

const INIT_TAPES = [
  { id: 1, label: "SPOT-001", title: "Coca-Cola :30", status: STATUS.DONE, duration: 30 },
  { id: 2, label: "SHOW-042", title: "Evening News", status: STATUS.DONE, duration: 1800 },
  { id: 3, label: "SPOT-002", title: "Ford Trucks :60", status: STATUS.DONE, duration: 60 },
  { id: 4, label: "SPOT-003", title: "Bank NS :15", status: STATUS.PLAYING, duration: 15 },
  { id: 5, label: "SPOT-004", title: "Tide :30", status: STATUS.NEXT, duration: 30 },
  { id: 6, label: "MOV-017", title: "Feature Film", status: STATUS.QUEUED, duration: 7200 },
  { id: 7, label: "SPOT-005", title: "McDonalds :30", status: STATUS.QUEUED, duration: 30 },
  { id: 8, label: "SPOT-006", title: "News Promo :15", status: STATUS.QUEUED, duration: 15 },
];

const LIBRARY = [
  { id: "L001", label: "SPOT-101", title: "Rogers Cable :30" },
  { id: "L002", label: "SPOT-102", title: "Tim Hortons :15" },
  { id: "L003", label: "SHOW-099", title: "Late Night Talk" },
  { id: "L004", label: "SPOT-103", title: "Lotto Max :30" },
  { id: "L005", label: "MOV-018", title: "Weekend Movie" },
  { id: "L006", label: "SPOT-104", title: "Canadian Tire :60" },
];

// ── Robot timing (ms) ──────────────────────────────────────────────────────
const T_EJECT = 2000;
const T_GRAB = 5000;
const T_ROTATE = 4000;
const T_RELEASE = 5000;
const T_RETURN = 2000;

// ── Helpers ────────────────────────────────────────────────────────────────
function useInterval(fn, ms) {
  const cb = useRef(fn);
  useEffect(() => { cb.current = fn; }, [fn]);
  useEffect(() => {
    if (ms == null) return;
    const id = setInterval(() => cb.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

function otvArps() {
  const [tapes, setTapes] = useState(INIT_TAPES);
  const [busy, setBusy] = useState(false);
  const [robotPhase, setRobotPhase] = useState("idle");
  const [armDeg, setArmDeg] = useState(0);
  const [fingersOpen, setFingersOpen] = useState(false);
  const [hasTape, setHasTape] = useState(false);
  const [ejecting, setEjecting] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [termLog, setTermLog] = useState([
    "otv-ARPS LIBRARY SYSTEM v2.1",
    "────────────────────────────",
    "> Type HELP for commands.",
  ]);
  const [scrollOff, setScrollOff] = useState(0);
  const [tick, setTick] = useState(0);

  useInterval(() => setTick(t => t + 1), 500);

  const changeOrder = useCallback(() => {
    if (busy) return;
    setBusy(true);
    const chain = [
      [0, () => { setRobotPhase("ejecting"); setEjecting(true); }],
      [T_EJECT, () => { setEjecting(false); setRobotPhase("grabbing"); setFingersOpen(true); }],
      [T_EJECT + T_GRAB, () => { setFingersOpen(false); setHasTape(true); setRobotPhase("rotating"); setArmDeg(d => d + 180); }],
      [T_EJECT + T_GRAB + T_ROTATE, () => { setRobotPhase("releasing"); setFingersOpen(true); }],
      [T_EJECT + T_GRAB + T_ROTATE + T_RELEASE, () => { setFingersOpen(false); setHasTape(false); setRobotPhase("returning"); }],
      [T_EJECT + T_GRAB + T_ROTATE + T_RELEASE + T_RETURN, () => {
        setRobotPhase("idle");
        setBusy(false);
        setTapes(prev => {
          const next = prev.map(t => ({ ...t }));
          const pi = next.findIndex(t => t.status === STATUS.PLAYING);
          const ni = next.findIndex(t => t.status === STATUS.NEXT);
          const qi = next.findIndex(t => t.status === STATUS.QUEUED);
          if (pi >= 0) next[pi].status = STATUS.DONE;
          if (ni >= 0) { next[ni].status = STATUS.PLAYING; if (qi >= 0) next[qi].status = STATUS.NEXT; }
          return next;
        });
      }],
    ];
    const timers = chain.map(([delay, fn]) => setTimeout(fn, delay));
    return () => timers.forEach(clearTimeout);
  }, [busy]);

  const removeTape = id => setTapes(p => p.filter(t => t.id !== id));

  const addToQueue = item => {
    const nw = { id: Date.now(), label: item.label, title: item.title, status: STATUS.QUEUED, duration: 30 };
    setTapes(prev => {
      const arr = [...prev, nw];
      if (!arr.find(t => t.status === STATUS.NEXT)) {
        const fi = arr.findIndex(t => t.status === STATUS.QUEUED);
        if (fi >= 0) arr[fi].status = STATUS.NEXT;
      }
      return arr;
    });
    setTermLog(p => [...p, `> Queued: ${item.label} — ${item.title}`]);
  };

  const progress =
    robotPhase === "idle" ? 0
      : robotPhase === "ejecting" ? 12
        : robotPhase === "grabbing" ? 35
          : robotPhase === "rotating" ? 60
            : robotPhase === "releasing" ? 82
              : robotPhase === "returning" ? 94
                : 100;

  return (
    <div style={S.root}>
      <style>{CSS}</style>

      {/* ── Main row ───────────────────────────────────────────────────── */}
      <div style={S.main}>

        {/* LEFT SIDEBAR */}
        <div style={S.sidebar}>
          <otvLogo />
          <div style={S.brand}>otv</div>
          <div style={S.acro}>
            <AcroLine letter="A" word="utomated" />
            <AcroLine letter="R" word="ecord" />
            <AcroLine letter="P" word="layback" />
            <AcroLine letter="S" word="ystem" />
          </div>

          <button
            onClick={changeOrder}
            disabled={busy}
            className={busy ? "btn-flash" : ""}
            style={{ ...S.btn, opacity: busy ? 1 : 1, cursor: busy ? "not-allowed" : "pointer", padding: 0, background: "none", border: "none", boxShadow: "none" }}
          >
            <img src={`${IMG_BASE}/${busy ? 'ACODOWN.png' : 'ACOUP.png'}`} style={{ width: "100%", height: "auto" }} alt="ACO" />
          </button>

          <div style={S.statusLabel}>
            {robotPhase === "idle"
              ? <><span style={{ color: "#22cc55" }}>●</span> STANDBY</>
              : <><span style={{ color: "#ff8800", animation: "pulse 0.6s infinite" }}>●</span> {robotPhase.toUpperCase()}</>
            }
          </div>

          {busy && (
            <div style={S.progressTrack}>
              <div style={{ ...S.progressBar, width: `${progress}%`, transition: "width 1s ease" }} />
            </div>
          )}

          <div style={S.sideFooter}>
            <div style={S.ledRow}>
              {["PWR", "REC", "PBK", "ERR"].map((lbl, i) => (
                <LedLabel key={lbl} label={lbl}
                  on={lbl === "PWR" ? true : lbl === "REC" ? busy : lbl === "PBK" ? !!tapes.find(t => t.status === STATUS.PLAYING) : false}
                  color={lbl === "ERR" ? "#ff2222" : lbl === "REC" ? "#ff5500" : "#22cc55"}
                  blink={lbl === "REC" && busy}
                  tick={tick}
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT VIEWPORT */}
        <div style={S.viewport}>
          <RobotSVG
            armDeg={armDeg}
            fingersOpen={fingersOpen}
            hasTape={hasTape}
            ejecting={ejecting}
            robotPhase={robotPhase}
            tick={tick}
            onLibraryClick={() => setShowTerminal(true)}
          />
        </div>
      </div>

      {/* TAPE QUEUE */}
      <TapeQueue
        tapes={tapes}
        scrollOff={scrollOff}
        setScrollOff={setScrollOff}
        onRemove={removeTape}
      />

      {/* LIBRARY TERMINAL */}
      {showTerminal && (
        <LibraryTerminal
          onClose={() => setShowTerminal(false)}
          onAdd={addToQueue}
          library={LIBRARY}
          log={termLog}
          setLog={setTermLog}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  ROBOT SVG
// ══════════════════════════════════════════════════════════════════════════
function RobotSVG({ armDeg, fingersOpen, hasTape, ejecting, robotPhase, tick, onLibraryClick }) {
  const HX = 300, HY = 290;
  const ARM = 115;
  const T_ROTATE = 4000; // imported from top for transition

  return (
    <svg viewBox="0 0 600 560" width="100%" height="100%" style={{ display: "block" }}>

      <g onClick={onLibraryClick} style={{ cursor: "pointer" }}>
        <image href={`${IMG_BASE}/TapeDeck.png`} x={185} y={16} width={230} height={106} preserveAspectRatio="none" />
        {/* Hover ring */}
        <rect x={185} y={16} width={230} height={106} rx={8} fill="transparent"
          stroke="#4488ff" strokeWidth={1} opacity={0.4} />
        <text x={300} y={118} textAnchor="middle" fill="#224488" fontSize={7} fontFamily="'Courier New',monospace">[ TAP TO BROWSE ]</text>
      </g>

      {/* Indicator pins on top of library */}
      {[0, 1, 2].map(i => (
        <rect key={i} x={247 + i * 22} y={4} width={7} height={16} rx={2}
          fill={(tick + i) % 3 === 0 ? "#00ffaa" : "#004433"} />
      ))}

      {/* ── EJECT SLOT ── */}
      <rect x={268} y={120} width={64} height={14} rx={3} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth={1} />
      <text x={300} y={131} textAnchor="middle" fill="#333" fontSize={7} fontFamily="'Courier New',monospace">EJECT</text>

      {/* ── EJECTED TAPE ── */}
      {ejecting && (
        <g className="tape-eject">
          <image href={`${IMG_BASE}/TapeCassette.png`} x={272} y={90} width={56} height={34} preserveAspectRatio="none" />
        </g>
      )}

      {/* ── VERTICAL SPINE from library to hub ── */}
      <rect x={296} y={134} width={8} height={HY - 134 - 20} fill="#223355" rx={3} />

      {/* ── UPPER CASSETTE CLAMP ── */}
      <image href={`${IMG_BASE}/${robotPhase !== "idle" ? 'GripOpen.png' : 'GripClosed.png'}`} x={244} y={153} width={112} height={36} preserveAspectRatio="none" />

      {/* ── ARM GROUP (rotates around hub) ── */}
      <g style={{ transform: `rotate(${armDeg}deg)`, transformOrigin: `${HX}px ${HY}px`, transition: `transform ${T_ROTATE / 1000}s ease-in-out` }}>

        {/* Upper arm shaft & Grip */}
        <image href={`${IMG_BASE}/${fingersOpen ? 'ClawOpenLong.png' : 'ClawClosedLong.png'}`} x={HX - 20} y={HY - 135} width={40} height={135} preserveAspectRatio="xMidYMid meet" />

        {/* Upper tape (in-transit) */}
        {hasTape && (
          <image href={`${IMG_BASE}/TapeCassette.png`} x={HX - 28} y={HY - ARM - 18} width={56} height={34} preserveAspectRatio="none" />
        )}

        {/* Lower arm shaft & Grip (rotated 180 to point down) */}
        <image href={`${IMG_BASE}/${fingersOpen ? 'ClawOpenLong.png' : 'ClawClosedLong.png'}`} x={HX - 20} y={HY - 135} width={40} height={135} preserveAspectRatio="xMidYMid meet" transform={`rotate(180 ${HX} ${HY})`} />

      </g>

      {/* ── HUB (always on top, never rotates) ── */}
      <image href={`${IMG_BASE}/Rotor.png`} x={HX - 52} y={HY - 52} width={104} height={104} preserveAspectRatio="none" />
      <circle cx={HX - 8} cy={HY - 8} r={6} fill="rgba(255,255,255,0.15)" />

      {/* ── LOWER CASSETTE CLAMP ── */}
      <image href={`${IMG_BASE}/${robotPhase !== "idle" ? 'GripOpen.png' : 'GripClosed.png'}`} x={244} y={HY + 73} width={112} height={36} preserveAspectRatio="none" />

      {/* Phase label on hub */}
      {robotPhase !== "idle" && (
        <text x={HX} y={HY + 4} textAnchor="middle" fill="rgba(255,255,255,0.7)"
          fontSize={8} fontFamily="'Courier New',monospace" fontWeight="bold" letterSpacing={1}>
          {robotPhase.toUpperCase()}
        </text>
      )}

      {/* Corner deco lines */}
      {[[8, 8, 50, 8, 8, 50], [592, 8, 550, 8, 592, 50],
      [8, 552, 50, 552, 8, 510], [592, 552, 550, 552, 592, 510]].map(([x1, y1, x2, y2, x3, y3], i) => (
        <polyline key={i} points={`${x1},${y1} ${x2},${y2}`} fill="none" stroke="#1a4422" strokeWidth={1.5} />
      ))}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  TAPE QUEUE
// ══════════════════════════════════════════════════════════════════════════
function TapeQueue({ tapes, scrollOff, setScrollOff, onRemove }) {
  return (
    <div style={S.queue}>
      <button onClick={() => setScrollOff(o => Math.max(0, o - 1))} style={S.qBtn}>‹</button>
      {Array.from({ length: 8 }, (_, i) => {
        const tape = tapes[scrollOff + i];
        return <TapeSlot key={i} tape={tape} onRemove={tape && (tape.status === STATUS.DONE || tape.status === STATUS.QUEUED) ? () => onRemove(tape.id) : null} />;
      })}
      <button onClick={() => setScrollOff(o => Math.min(Math.max(0, tapes.length - 8), o + 1))} style={S.qBtn}>›</button>
    </div>
  );
}

function TapeSlot({ tape, onRemove }) {
  if (!tape) return <div style={{ ...S.slot, background: "#111", border: "1px solid #1e1e1e" }}><span style={{ color: "#222", fontSize: 14 }}>·</span></div>;
  const col = STATUS_COLOR[tape.status];
  const active = tape.status === STATUS.PLAYING || tape.status === STATUS.NEXT;
  return (
    <div
      onClick={onRemove}
      title={onRemove ? "Click to remove from queue" : tape.title}
      style={{
        ...S.slot,
        border: `2px solid ${col}`,
        boxShadow: active ? `0 0 10px ${STATUS_GLOW[tape.status]}` : "none",
        cursor: onRemove ? "pointer" : "default",
      }}
    >
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: col, marginBottom: 3, boxShadow: `0 0 6px ${col}` }} />
      <div style={{ color: "#666", fontSize: 8, letterSpacing: 0.5 }}>{tape.label}</div>
      <div style={{ color: "#ccc", fontSize: 9, fontWeight: "bold", lineHeight: 1.2, marginTop: 1 }}>
        {tape.title.length > 13 ? tape.title.slice(0, 13) + "…" : tape.title}
      </div>
      <div style={{ color: col, fontSize: 7, marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>
        {tape.status}
      </div>
      {onRemove && <span style={{ position: "absolute", top: 2, right: 5, color: "#444", fontSize: 11, lineHeight: 1 }}>×</span>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  LIBRARY TERMINAL
// ══════════════════════════════════════════════════════════════════════════
function LibraryTerminal({ onClose, onAdd, library, log, setLog }) {
  const [input, setInput] = useState("");
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const runCmd = cmd => {
    const up = cmd.trim().toUpperCase();
    setLog(p => [...p, `>> ${cmd}`]);
    if (!cmd.trim()) return setInput("");
    if (up === "HELP") {
      setLog(p => [...p, "  LIST          — show available tapes", "  ADD [ID]      — add tape to queue", "  EXIT          — close terminal"]);
    } else if (up === "LIST") {
      library.forEach(t => setLog(p => [...p, `  ${t.id}  ${t.label.padEnd(10)}${t.title}`]));
    } else if (up.startsWith("ADD ")) {
      const id = up.split(" ")[1];
      const item = library.find(t => t.id === id);
      item ? onAdd(item) : setLog(p => [...p, `> ERROR: ID "${id}" not found. Use LIST to see IDs.`]);
    } else if (up === "EXIT") {
      onClose();
    } else {
      setLog(p => [...p, `> Unknown: "${cmd}". Type HELP.`]);
    }
    setInput("");
  };

  return (
    <div style={S.overlay}>
      <div style={S.terminal}>
        <div style={S.termHead}>
          <span style={S.termTitle}>◉ otv-ARPS LIBRARY TERMINAL v2.1</span>
          <button onClick={onClose} style={S.exitBtn}>[EXIT]</button>
        </div>
        <div ref={logRef} style={S.termLog}>
          {log.map((l, i) => <div key={i} style={{ color: l.startsWith(">>") ? "#88ffcc" : l.startsWith("> E") ? "#ff6644" : "#44cc88" }}>{l}</div>)}
          <div style={{ height: 4 }} />
        </div>
        <div style={S.quickAdd}>
          <div style={{ color: "#224", fontSize: 10, marginBottom: 6, letterSpacing: 1 }}>QUICK-ADD:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {library.map(item => (
              <button key={item.id} onClick={() => { onAdd(item); }} style={S.quickBtn}>
                <span style={{ color: "#2255aa" }}>{item.id}</span> {item.label} — {item.title}
              </button>
            ))}
          </div>
        </div>
        <div style={S.termInputRow}>
          <span style={{ color: "#44cc88", fontFamily: "Courier New", fontSize: 13, marginRight: 6 }}>{">"}</span>
          <input
            autoFocus value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && runCmd(input)}
            placeholder="Type HELP for commands…"
            style={S.termInput}
          />
        </div>
      </div>
    </div>
  );
}

// ── Small components ───────────────────────────────────────────────────────
function otvLogo() {
  return (
    <img src={`${IMG_BASE}/OTV-Logo.png`} alt="otv" style={{ marginBottom: 6, width: 88, height: 72, objectFit: 'contain' }} />
  );
}

function AcroLine({ letter, word }) {
  return (
    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.85 }}>
      <span style={{ color: "#ddd", fontWeight: "bold" }}>{letter}</span>{word}
    </div>
  );
}

function LedLabel({ label, on, color, blink, tick }) {
  const lit = on && (!blink || tick % 2 === 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: lit ? color : "#1a1a1a", boxShadow: lit ? `0 0 6px ${color}` : "none" }} />
      <span style={{ color: "#444", fontSize: 7, letterSpacing: 0.5 }}>{label}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  STYLES
// ══════════════════════════════════════════════════════════════════════════
const S = {
  root: { width: "100vw", height: "100vh", background: "#000", display: "flex", flexDirection: "column", fontFamily: "'Courier New', Courier, monospace", overflow: "hidden", userSelect: "none" },
  main: { flex: 1, display: "flex", overflow: "hidden", minHeight: 0 },

  sidebar: { width: 218, flexShrink: 0, background: "#3c3f44", borderRight: "2px solid #1a1a1a", display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 14px 12px", gap: 0 },
  brand: { color: "#ccc", fontSize: 24, fontWeight: "bold", letterSpacing: 8, marginBottom: 8 },
  acro: { textAlign: "left", width: "100%", paddingLeft: 14, marginBottom: 18 },
  btn: { background: "#00cc33", border: "3px solid #000", borderRadius: 6, padding: "14px 10px", width: "100%", color: "#000", fontSize: 14, fontWeight: 900, letterSpacing: 1, lineHeight: 1.5, textAlign: "center", boxShadow: "0 0 10px #00aa2266", outline: "none" },
  statusLabel: { marginTop: 12, color: "#555", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" },
  progressTrack: { marginTop: 8, width: "100%", height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" },
  progressBar: { height: "100%", background: "#00ff44", borderRadius: 2 },
  sideFooter: { marginTop: "auto", width: "100%", borderTop: "1px solid #2a2a2a", paddingTop: 12 },
  ledRow: { display: "flex", justifyContent: "space-around", alignItems: "center" },

  viewport: { flex: 1, background: `#161819 url("${IMG_BASE}/MovementGrid.png") center/cover no-repeat`, overflow: "hidden", position: "relative" },

  queue: { height: 78, background: "#0d0d0d", borderTop: "2px solid #222", display: "flex", alignItems: "center", padding: "0 6px", gap: 4, flexShrink: 0 },
  qBtn: { background: "#1e1e1e", border: "1px solid #333", color: "#888", width: 22, height: 44, cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0, borderRadius: 3 },
  slot: { flex: 1, height: 62, background: "#161616", borderRadius: 3, padding: "5px 7px", position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", overflow: "hidden", transition: "box-shadow 0.3s" },

  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  terminal: { width: 620, height: 420, display: "flex", flexDirection: "column", background: `url("${IMG_BASE}/ApplicationCRT.png") center/100% 100% no-repeat`, border: "none", borderRadius: 8, overflow: "hidden", boxShadow: "0 0 50px #0033aa55", padding: "10px" },
  termHead: { padding: "10px 14px", borderBottom: "1px solid #102040", display: "flex", justifyContent: "space-between", alignItems: "center" },
  termTitle: { color: "#3388ff", fontSize: 11, letterSpacing: 2 },
  exitBtn: { background: "none", border: "1px solid #224", color: "#446", cursor: "pointer", padding: "3px 10px", fontSize: 11, fontFamily: "Courier New", letterSpacing: 1 },
  termLog: { height: 240, overflowY: "auto", padding: "10px 14px", fontFamily: "Courier New", fontSize: 11, lineHeight: 1.7 },
  quickAdd: { padding: "8px 14px", borderTop: "1px solid #0a1a28", borderBottom: "1px solid #0a1a28" },
  quickBtn: { background: "#050d18", border: "1px solid #0a2040", color: "#3388aa", fontSize: 9, fontFamily: "Courier New", padding: "3px 9px", cursor: "pointer", borderRadius: 2 },
  termInputRow: { display: "flex", padding: "8px 12px", alignItems: "center", background: "transparent" },
  termInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#44cc88", fontFamily: "Courier New", fontSize: 12, caretColor: "#44cc88" },
};

const CSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes flash { 0%,100%{background:#00ff44;box-shadow:0 0 22px #00ff44} 50%{background:#007722;box-shadow:0 0 6px #004411} }
  @keyframes tapeEject { 0%{transform:translateY(0)} 30%{transform:translateY(-26px)} 70%{transform:translateY(-26px)} 100%{transform:translateY(0)} }
  .btn-flash { animation: flash 0.5s infinite !important; }
  .tape-eject { animation: tapeEject 2s ease forwards; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #050d18; }
  ::-webkit-scrollbar-thumb { background: #1a4a88; border-radius: 2px; }
`;

// Render the application to the root DOM node
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<otvArps />);
