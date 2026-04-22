import { useState } from "react";

const STEPS = [
  "inicio",
  "formas",
  "color",
  "tipografia",
  "personalidad",
  "estilo",
  "tono",
  "referencias",
  "resultado",
];

const paletteSwatches = {
  "Confianza y profundidad": ["#042C53","#185FA5","#378ADD","#B5D4F4","#E6F1FB"],
  "Sofisticación y visión":  ["#26215C","#534AB7","#7F77DD","#CECBF6","#EEEDFE"],
  "Vitalidad y naturaleza":  ["#04342C","#0F6E56","#1D9E75","#9FE1CB","#E1F5EE"],
  "Pasión y elegancia":      ["#4B1528","#993556","#D4537E","#F4C0D1","#FBEAF0"],
  "Energía y audacia":       ["#4A1B0C","#993C1D","#D85A30","#F5C4B3","#FAECE7"],
  "Neutralidad y solidez":   ["#2C2C2A","#5F5E5A","#888780","#D3D1C7","#F1EFE8"],
};

const interpretations = {
  shape: {
    Geométricas: "Precisión, modernidad y confianza técnica. Ideal para tecnología, finanzas o educación.",
    Orgánicas:   "Calidez humana y conexión genuina. Funciona muy bien en salud, bienestar y servicios.",
    Angulares:   "Dinamismo y ruptura. Para marcas que quieren generar impacto y diferenciación.",
  },
  style: {
    "Minimalista y editorial": "Narrativa visual sobria que pone el producto en primer plano.",
    "Cálido y lifestyle":      "Fotografía que crea empatía y cercanía. Las personas son protagonistas.",
    "Oscuro y dramático":      "Contraste alto que comunica exclusividad y seriedad.",
    "Vibrante e ilustrado":    "Energía visual que conecta con audiencias jóvenes y creativas.",
  },
  tone: {
    "Experto y formal":          "Comunicación que genera autoridad y credibilidad técnica.",
    "Cercano y conversacional":  "Lenguaje que genera confianza y elimina barreras.",
    "Inspirador y aspiracional": "Narrativa que eleva al cliente y le muestra su mejor versión.",
    "Audaz y disruptivo":        "Voz que desafía el statu quo y se hace recordar.",
  },
};

export default function Home() {
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState({
    marca: "",
    sector: "",
    shape: null,
    palette: null,
    typo: null,
    words: [],
    style: null,
    tone: null,
    refs: [],
  });

  const set = (key, val) => setAnswers((a) => ({ ...a, [key]: val }));

  const toggleWord = (word) => {
    setAnswers((a) => {
      const has = a.words.includes(word);
      if (!has && a.words.length >= 5) return a;
      return { ...a, words: has ? a.words.filter((w) => w !== word) : [...a.words, word] };
    });
  };

  const toggleRef = (name) => {
    setAnswers((a) => {
      const has = a.refs.includes(name);
      if (!has && a.refs.length >= 3) return a;
      return { ...a, refs: has ? a.refs.filter((r) => r !== name) : [...a.refs, name] };
    });
  };

  const canNext = () => {
    if (step === 0) return answers.marca.trim().length > 0;
    if (step === 1) return !!answers.shape;
    if (step === 2) return !!answers.palette;
    if (step === 3) return !!answers.typo;
    if (step === 4) return answers.words.length >= 3;
    if (step === 5) return !!answers.style;
    if (step === 6) return !!answers.tone;
    if (step === 7) return answers.refs.length > 0;
    return true;
  };

  const submit = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!res.ok) throw new Error("Error al enviar");
      setSent(true);
      setStep(8);
    } catch (e) {
      setError("Hubo un problema al guardar. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const progress = Math.round((step / 8) * 100);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand: #1a1a2e;
          --accent: #c9a84c;
          --accent-light: #f0e4c4;
          --text: #1a1a2e;
          --text-muted: #6b6b7b;
          --border: rgba(26,26,46,0.12);
          --border-hover: rgba(26,26,46,0.3);
          --bg: #faf9f6;
          --card: #ffffff;
          --selected-bg: #1a1a2e;
          --selected-text: #f0e4c4;
          --radius: 4px;
          --radius-lg: 8px;
        }

        html, body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3rem;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: var(--brand);
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-mark svg { display: block; }

        .logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 0.04em;
          color: var(--brand);
        }

        .progress-track {
          height: 1px;
          background: var(--border);
          margin-bottom: 3rem;
          position: relative;
        }

        .progress-fill {
          height: 1px;
          background: var(--accent);
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        .step-badge {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(28px, 5vw, 40px);
          font-weight: 300;
          line-height: 1.2;
          color: var(--brand);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .subtitle {
          font-size: 15px;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 520px;
        }

        .input-field {
          width: 100%;
          border: none;
          border-bottom: 1px solid var(--border);
          background: transparent;
          padding: 12px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 2rem;
        }

        .input-field::placeholder { color: var(--text-muted); }
        .input-field:focus { border-bottom-color: var(--accent); }

        .input-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          display: block;
          margin-bottom: 6px;
        }

        /* Cards grid */
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 2.5rem; }
        .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; margin-bottom: 2.5rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 2.5rem; }

        @media(max-width:520px) {
          .grid-3 { grid-template-columns: 1fr; }
          .grid-4 { grid-template-columns: repeat(2,1fr); }
        }

        .opt-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1rem;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s;
          background: var(--card);
          position: relative;
          user-select: none;
        }

        .opt-card:hover { border-color: var(--border-hover); transform: translateY(-1px); }

        .opt-card.selected {
          border-color: var(--brand);
          background: var(--brand);
        }

        .opt-card.selected .opt-title { color: var(--accent-light); }
        .opt-card.selected .opt-desc  { color: rgba(240,228,196,0.6); }
        .opt-card.selected svg path,
        .opt-card.selected svg rect,
        .opt-card.selected svg circle,
        .opt-card.selected svg ellipse,
        .opt-card.selected svg polygon,
        .opt-card.selected svg line { stroke: var(--accent); }

        .opt-preview { height: 72px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
        .opt-title { font-size: 13px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
        .opt-desc  { font-size: 11px; color: var(--text-muted); line-height: 1.5; }

        /* Palette swatch */
        .swatch { display: flex; height: 40px; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .swatch div { flex: 1; }

        /* Typo preview */
        .typo-pre { height: 60px; display: flex; align-items: center; margin-bottom: 1rem; }

        /* Words */
        .words-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 2.5rem; }
        .word-btn {
          border: 1px solid var(--border);
          border-radius: 99px;
          padding: 8px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: var(--text);
          background: var(--card);
          cursor: pointer;
          transition: all 0.15s;
        }
        .word-btn:hover { border-color: var(--accent); color: var(--accent); }
        .word-btn.selected { background: var(--brand); border-color: var(--brand); color: var(--accent-light); }

        .hint { font-size: 12px; color: var(--text-muted); margin-bottom: 1rem; letter-spacing: 0.03em; }

        /* Ref cards */
        .ref-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          background: var(--card);
          text-align: left;
        }
        .ref-card:hover { border-color: var(--border-hover); transform: translateY(-1px); }
        .ref-card.selected { border-color: var(--brand); background: var(--brand); }
        .ref-card.selected .ref-name { color: var(--accent-light); }
        .ref-card.selected .ref-sector { color: rgba(240,228,196,0.5); }

        .ref-logo {
          width: 36px; height: 36px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700;
          margin-bottom: 10px;
        }
        .ref-name   { font-size: 12px; font-weight: 500; color: var(--text); margin-bottom: 2px; }
        .ref-sector { font-size: 10px; color: var(--text-muted); line-height: 1.4; }

        /* Nav */
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }

        .btn-back {
          background: none;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 11px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.15s;
          letter-spacing: 0.03em;
        }
        .btn-back:hover { border-color: var(--border-hover); color: var(--text); }

        .btn-next {
          background: var(--brand);
          border: none;
          border-radius: var(--radius);
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent-light);
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .btn-next:hover:not(:disabled) { background: #2d2d4e; }
        .btn-next:disabled { opacity: 0.35; cursor: not-allowed; }

        /* Result */
        .result-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: var(--card);
        }
        .result-tag {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 500;
          margin-bottom: 6px;
        }
        .result-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--brand);
          margin-bottom: 6px;
        }
        .result-interp { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
        .result-swatch { display: flex; gap: 5px; height: 28px; border-radius: 4px; overflow: hidden; margin-top: 10px; }
        .result-swatch div { flex: 1; }

        .cta-final {
          width: 100%;
          background: var(--accent);
          border: none;
          border-radius: var(--radius);
          padding: 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: var(--brand);
          cursor: pointer;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: opacity 0.15s;
          margin-top: 1.5rem;
        }
        .cta-final:hover { opacity: 0.85; }
        .cta-final:disabled { opacity: 0.5; cursor: not-allowed; }

        .error-msg { font-size: 13px; color: #c0392b; margin-top: 1rem; }

        .sent-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 99px;
          padding: 8px 18px;
          font-size: 13px;
          font-weight: 500;
          margin-top: 1.5rem;
        }

        .divider {
          height: 1px;
          background: var(--border);
          margin: 2rem 0;
        }
      `}</style>

      <div className="wrap">
        {/* Header */}
        <div className="header">
          <div className="logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="#c9a84c" strokeWidth="1.2" fill="none"/>
              <circle cx="9" cy="9" r="2" fill="#c9a84c"/>
            </svg>
          </div>
          <span className="logo-name">Brand Discovery</span>
        </div>

        {/* Progress */}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* ── STEP 0: Inicio ── */}
        {step === 0 && (
          <div>
            <div className="step-badge">Bienvenido</div>
            <h1>Descubrimiento<br /><em>de marca</em></h1>
            <p className="subtitle">
              Este formulario nos ayuda a entender tu visión de manera visual e intuitiva.
              No hay respuestas correctas — solo preferencias. Duración: 5–8 minutos.
            </p>
            <label className="input-label">Nombre de la marca o proyecto</label>
            <input className="input-field" placeholder="Ej. Studio Naranja, Clínica Luz..."
              value={answers.marca} onChange={e => set("marca", e.target.value)} />
            <label className="input-label">¿A qué se dedica?</label>
            <input className="input-field" placeholder="Ej. educación, moda, salud, tecnología..."
              value={answers.sector} onChange={e => set("sector", e.target.value)} />
            <div className="nav">
              <span />
              <button className="btn-next" onClick={() => setStep(1)} disabled={!canNext()}>
                Comenzar →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Formas ── */}
        {step === 1 && (
          <div>
            <div className="step-badge">Paso 1 de 7 — Lenguaje visual</div>
            <h1>¿Qué familia de<br /><em>formas</em> te resuena?</h1>
            <p className="subtitle">Elige la que más te resuene de manera instintiva.</p>
            <div className="grid-3">
              {[
                { val: "Geométricas", desc: "Precisión, modernidad, tecnología",
                  svg: <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#1a1a2e" strokeWidth="1.2"><rect x="10" y="10" width="40" height="40"/><rect x="20" y="20" width="20" height="20"/></svg> },
                { val: "Orgánicas", desc: "Calidez, humanidad, naturaleza",
                  svg: <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#1a1a2e" strokeWidth="1.2"><path d="M30 8C50 8 54 26 46 38C38 50 14 52 8 38C2 24 10 8 30 8Z"/><circle cx="30" cy="30" r="7"/></svg> },
                { val: "Angulares", desc: "Dinamismo, fuerza, innovación",
                  svg: <svg width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="#1a1a2e" strokeWidth="1.2"><polygon points="30,6 54,50 6,50"/><polygon points="30,20 44,46 16,46"/></svg> },
              ].map(o => (
                <div key={o.val} className={`opt-card${answers.shape===o.val?" selected":""}`}
                  onClick={() => set("shape", o.val)}>
                  <div className="opt-preview">{o.svg}</div>
                  <div className="opt-title">{o.val}</div>
                  <div className="opt-desc">{o.desc}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(0)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(2)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Paleta ── */}
        {step === 2 && (
          <div>
            <div className="step-badge">Paso 2 de 7 — Color</div>
            <h1>¿Qué <em>paleta</em> conecta<br />con tu marca?</h1>
            <p className="subtitle">El color comunica emoción antes que cualquier palabra.</p>
            <div className="grid-3">
              {Object.entries(paletteSwatches).map(([name, colors]) => (
                <div key={name} className={`opt-card${answers.palette===name?" selected":""}`}
                  onClick={() => set("palette", name)}>
                  <div className="swatch">
                    {colors.map(c => <div key={c} style={{ background: c }} />)}
                  </div>
                  <div className="opt-title">{name}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(1)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(3)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Tipografía ── */}
        {step === 3 && (
          <div>
            <div className="step-badge">Paso 3 de 7 — Tipografía</div>
            <h1>¿Qué estilo de letra<br /><em>define</em> tu marca?</h1>
            <p className="subtitle">La tipografía es la voz visual de una marca.</p>
            <div className="grid-3">
              {[
                { val: "Clásica y elegante", desc: "Tradición, confianza, prestigio",
                  preview: <span style={{ fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 400 }}>Marca</span> },
                { val: "Moderna y limpia", desc: "Claridad, tecnología, apertura",
                  preview: <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 28, fontWeight: 300, letterSpacing: 3 }}>Marca</span> },
                { val: "Creativa y expresiva", desc: "Personalidad, calidez, artesanía",
                  preview: <span style={{ fontFamily: "cursive", fontSize: 30 }}>Marca</span> },
              ].map(o => (
                <div key={o.val} className={`opt-card${answers.typo===o.val?" selected":""}`}
                  onClick={() => set("typo", o.val)}>
                  <div className="typo-pre">{o.preview}</div>
                  <div className="opt-title">{o.val}</div>
                  <div className="opt-desc">{o.desc}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(2)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(4)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Personalidad ── */}
        {step === 4 && (
          <div>
            <div className="step-badge">Paso 4 de 7 — Personalidad</div>
            <h1>¿Con qué palabras<br /><em>describes</em> tu marca?</h1>
            <p className="hint">Elige entre 3 y 5 palabras</p>
            <div className="words-grid">
              {["Innovadora","Confiable","Exclusiva","Accesible","Atrevida","Serena",
                "Sofisticada","Divertida","Profesional","Humana","Minimalista","Vibrante",
                "Auténtica","Premium","Cercana","Experimental"].map(w => (
                <button key={w} className={`word-btn${answers.words.includes(w)?" selected":""}`}
                  onClick={() => toggleWord(w)}>{w}</button>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(3)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(5)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Estilo visual ── */}
        {step === 5 && (
          <div>
            <div className="step-badge">Paso 5 de 7 — Estilo visual</div>
            <h1>¿Qué estilo visual<br /><em>atrae</em> a tu marca?</h1>
            <p className="subtitle">Piensa en el mundo visual que rodearía tu marca.</p>
            <div className="grid-2">
              {[
                { val: "Minimalista y editorial", desc: "Blanco, silencio, protagonismo del objeto. Lujo silencioso.",
                  svg: <svg width="72" height="50" viewBox="0 0 72 50" fill="none"><rect x="1" y="1" width="70" height="48" rx="3" fill="#f5f5f0" stroke="#e0e0d8"/><line x1="14" y1="25" x2="58" y2="25" stroke="#1a1a2e" strokeWidth="0.8"/><line x1="36" y1="12" x2="36" y2="38" stroke="#1a1a2e" strokeWidth="0.8"/><circle cx="36" cy="25" r="7" stroke="#1a1a2e" strokeWidth="0.8"/></svg> },
                { val: "Cálido y lifestyle", desc: "Luz natural, personas, momentos cotidianos auténticos.",
                  svg: <svg width="72" height="50" viewBox="0 0 72 50" fill="none"><rect x="1" y="1" width="70" height="48" rx="3" fill="#faeeda"/><circle cx="28" cy="20" r="10" fill="#EF9F27" opacity="0.5"/><ellipse cx="46" cy="34" rx="14" ry="9" fill="#FAC775" opacity="0.4"/><path d="M8 42 Q36 18 64 36" stroke="#BA7517" strokeWidth="1" fill="none"/></svg> },
                { val: "Oscuro y dramático", desc: "Contraste, misterio, sofisticación de alto impacto.",
                  svg: <svg width="72" height="50" viewBox="0 0 72 50" fill="none"><rect x="1" y="1" width="70" height="48" rx="3" fill="#1a1a2e"/><circle cx="36" cy="25" r="14" fill="#2d2d4e"/><circle cx="36" cy="25" r="6" fill="#888780"/></svg> },
                { val: "Vibrante e ilustrado", desc: "Color, ilustración, energía. Marcas jóvenes y creativas.",
                  svg: <svg width="72" height="50" viewBox="0 0 72 50" fill="none"><rect x="1" y="1" width="70" height="48" rx="3" fill="#EEEDFE"/><circle cx="22" cy="25" r="10" fill="#7F77DD" opacity="0.7"/><rect x="36" y="12" width="18" height="18" rx="3" fill="#1D9E75" opacity="0.7"/><polygon points="50,40 62,40 56,28" fill="#D85A30" opacity="0.7"/></svg> },
              ].map(o => (
                <div key={o.val} className={`opt-card${answers.style===o.val?" selected":""}`}
                  onClick={() => set("style", o.val)}>
                  <div className="opt-preview">{o.svg}</div>
                  <div className="opt-title">{o.val}</div>
                  <div className="opt-desc">{o.desc}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(4)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(6)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 6: Tono ── */}
        {step === 6 && (
          <div>
            <div className="step-badge">Paso 6 de 7 — Tono de comunicación</div>
            <h1>¿Cómo <em>habla</em><br />tu marca?</h1>
            <p className="subtitle">Si tu marca fuera una persona, ¿cómo se expresaría?</p>
            <div className="grid-2">
              {[
                { val: "Experto y formal", desc: "Lenguaje técnico, datos, autoridad. Para consultoras, finanzas, legales.",
                  svg: <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#1a1a2e" strokeWidth="1"><rect x="6" y="8" width="32" height="7" rx="1.5"/><rect x="6" y="19" width="24" height="5" rx="1.5"/><rect x="6" y="28" width="16" height="5" rx="1.5"/></svg> },
                { val: "Cercano y conversacional", desc: "Amigable, directo, sin tecnicismos. Para marcas con propósito humano.",
                  svg: <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#1a1a2e" strokeWidth="1"><path d="M8 12Q8 6 22 6Q36 6 36 14Q36 22 22 22L12 36L16 22Q8 20 8 12Z"/></svg> },
                { val: "Inspirador y aspiracional", desc: "Motiva, eleva, transforma. Para lifestyle o educación.",
                  svg: <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#1a1a2e" strokeWidth="1"><path d="M22 6L26 16L38 16L28 24L32 36L22 28L12 36L16 24L6 16L18 16Z"/></svg> },
                { val: "Audaz y disruptivo", desc: "Retador, irreverente, diferente. Para startups y marcas de impacto.",
                  svg: <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#1a1a2e" strokeWidth="1"><path d="M26 6L6 26L20 26L18 38L38 18L24 18Z"/></svg> },
              ].map(o => (
                <div key={o.val} className={`opt-card${answers.tone===o.val?" selected":""}`}
                  onClick={() => set("tone", o.val)}>
                  <div className="opt-preview">{o.svg}</div>
                  <div className="opt-title">{o.val}</div>
                  <div className="opt-desc">{o.desc}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(5)}>← Atrás</button>
              <button className="btn-next" onClick={() => setStep(7)} disabled={!canNext()}>Continuar →</button>
            </div>
          </div>
        )}

        {/* ── STEP 7: Referencias ── */}
        {step === 7 && (
          <div>
            <div className="step-badge">Paso 7 de 7 — Referencias</div>
            <h1>¿Qué marcas<br /><em>te inspiran</em>?</h1>
            <p className="hint">Selecciona hasta 3. No necesitan ser de tu mismo sector.</p>
            <div className="grid-4">
              {[
                { name:"Apple",        sector:"Tecnología · Minimalismo", logo:"⌘", bg:"#f5f5f7", color:"#1d1d1f" },
                { name:"Nike",         sector:"Deporte · Aspiración",     logo:"✓", bg:"#111",    color:"#fff"    },
                { name:"Airbnb",       sector:"Hospitalidad · Comunidad", logo:"♥", bg:"#FF5A5F", color:"#fff"    },
                { name:"Louis Vuitton",sector:"Lujo · Herencia",          logo:"LV",bg:"#1a1a1a", color:"#c8a96e" },
                { name:"Spotify",      sector:"Entretenimiento · Juventud",logo:"♪",bg:"#1DB954", color:"#fff"    },
                { name:"Patagonia",    sector:"Naturaleza · Propósito",   logo:"▲", bg:"#3d5a3e", color:"#fff"    },
                { name:"Tesla",        sector:"Innovación · Futuro",      logo:"T", bg:"#CC0000", color:"#fff"    },
                { name:"Rolex",        sector:"Precisión · Estatus",      logo:"R", bg:"#1a6b3a", color:"#f5d26e" },
              ].map(o => (
                <div key={o.name} className={`ref-card${answers.refs.includes(o.name)?" selected":""}`}
                  onClick={() => toggleRef(o.name)}>
                  <div className="ref-logo" style={{ background: o.bg, color: o.color }}>{o.logo}</div>
                  <div className="ref-name">{o.name}</div>
                  <div className="ref-sector">{o.sector}</div>
                </div>
              ))}
            </div>
            <div className="nav">
              <button className="btn-back" onClick={() => setStep(6)}>← Atrás</button>
              <button className="btn-next" onClick={submit} disabled={!canNext() || sending}>
                {sending ? "Guardando..." : "Ver perfil →"}
              </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
          </div>
        )}

        {/* ── STEP 8: Resultado ── */}
        {step === 8 && (
          <div>
            <div className="step-badge">Perfil de marca</div>
            <h1>{answers.marca || "Tu marca"}<br /><em>ADN de marca</em></h1>
            <p className="subtitle">
              Basado en tus respuestas, hemos identificado el perfil visual y de comunicación.
              Este brief es el punto de partida para construir una identidad auténtica.
            </p>

            {sent && (
              <div className="sent-badge">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="6.5" stroke="#2e7d32"/>
                  <path d="M4 7L6 9L10 5" stroke="#2e7d32" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                Respuestas guardadas en Google Sheets
              </div>
            )}

            <div className="divider" />

            <div className="result-card">
              <div className="result-tag">Lenguaje visual</div>
              <div className="result-val">{answers.shape}</div>
              <div className="result-interp">{interpretations.shape[answers.shape]}</div>
            </div>

            <div className="result-card">
              <div className="result-tag">Paleta de color</div>
              <div className="result-val">{answers.palette}</div>
              {paletteSwatches[answers.palette] && (
                <div className="result-swatch">
                  {paletteSwatches[answers.palette].map(c => <div key={c} style={{ background: c }} />)}
                </div>
              )}
            </div>

            <div className="result-card">
              <div className="result-tag">Tipografía</div>
              <div className="result-val">{answers.typo}</div>
              <div className="result-interp">
                {answers.typo === "Clásica y elegante" && "Tipografía con serifs que transmite herencia y confianza."}
                {answers.typo === "Moderna y limpia"   && "Sans-serif que proyecta apertura y claridad digital."}
                {answers.typo === "Creativa y expresiva" && "Lettering expresivo que refleja personalidad única."}
              </div>
            </div>

            <div className="result-card">
              <div className="result-tag">Personalidad</div>
              <div className="result-val" style={{ fontSize: 16 }}>{answers.words.join(" · ")}</div>
            </div>

            <div className="result-card">
              <div className="result-tag">Estilo visual</div>
              <div className="result-val">{answers.style}</div>
              <div className="result-interp">{interpretations.style[answers.style]}</div>
            </div>

            <div className="result-card">
              <div className="result-tag">Tono de comunicación</div>
              <div className="result-val">{answers.tone}</div>
              <div className="result-interp">{interpretations.tone[answers.tone]}</div>
            </div>

            <div className="result-card">
              <div className="result-tag">Marcas de referencia</div>
              <div className="result-val" style={{ fontSize: 16 }}>{answers.refs.join(", ")}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}