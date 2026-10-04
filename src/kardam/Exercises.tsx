import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { TopBar, MOODS } from '../components/chrome';
import { Wind, Anchor, MoonStar, Flower2, PersonStanding, Play, Clock, Check, RotateCcw, ChevronRight } from 'lucide-react';

interface Exercise {
  id: string; cat: string; name: string; mins: number; tint: string; desc: string;
  steps: string[]; pattern: [string, number][];
}
const CATS = (lang: 'en' | 'hi' | 'hg') => [
  { id: 'breathing', label: t(lang, 'breathing'), icon: <Wind size={20} />, tint: 'var(--blue)' },
  { id: 'grounding', label: t(lang, 'grounding'), icon: <Anchor size={20} />, tint: 'var(--sage)' },
  { id: 'relaxation', label: t(lang, 'relaxation'), icon: <MoonStar size={20} />, tint: 'var(--lav-soft)' },
  { id: 'mindfulness', label: t(lang, 'mindfulness'), icon: <Flower2 size={20} />, tint: 'var(--pink)' },
  { id: 'body', label: t(lang, 'bodyCalm'), icon: <PersonStanding size={20} />, tint: 'var(--peach-soft)' },
];

const EXERCISES: Exercise[] = [
  { id: 'b478', cat: 'breathing', name: '4-7-8 Breath', mins: 4, tint: 'var(--blue)', desc: 'A slow breathing rhythm that settles the nervous system and eases you toward calm.',
    steps: ['Sit comfortably, shoulders soft', 'Inhale through the nose', 'Hold gently', 'Exhale slowly through the mouth'],
    pattern: [['Inhale', 4], ['Hold', 7], ['Exhale', 8]] },
  { id: 'box', cat: 'breathing', name: 'Box Breathing', mins: 5, tint: 'var(--blue)', desc: 'Four equal sides of breath. Used to steady the mind before exams and hard conversations.',
    steps: ['Picture tracing a square', 'Inhale — one side', 'Hold — next side', 'Exhale — next side', 'Hold — close the square'],
    pattern: [['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Hold', 4]] },
  { id: 'g54321', cat: 'grounding', name: '5-4-3-2-1 Senses', mins: 6, tint: 'var(--sage)', desc: 'Anchor yourself in the present by naming what your senses notice around you.',
    steps: ['Name 5 things you can see', '4 things you can touch', '3 things you can hear', '2 things you can smell', '1 thing you can taste'],
    pattern: [['Notice', 8], ['Name it', 8], ['Breathe', 6]] },
  { id: 'afeet', cat: 'grounding', name: 'Feet on the Floor', mins: 3, tint: 'var(--sage)', desc: 'A quick body anchor for moments when thoughts feel overwhelming.',
    steps: ['Press both feet into the floor', 'Notice the pressure and texture', 'Let your breath follow the weight downward'],
    pattern: [['Press', 5], ['Notice', 7], ['Release', 5]] },
  { id: 'pmr', cat: 'relaxation', name: 'Muscle Release', mins: 8, tint: 'var(--lav-soft)', desc: 'Tense and release each muscle group, from your face down to your toes.',
    steps: ['Softly tense your shoulders', 'Hold, then let go', 'Move down: arms, stomach, legs', 'Notice the warmth of release'],
    pattern: [['Tense', 5], ['Hold', 4], ['Release', 8]] },
  { id: 'yoganidra', cat: 'relaxation', name: 'Deep Rest Scan', mins: 10, tint: 'var(--lav-soft)', desc: 'A yoga-nidra inspired body scan for heavy, tired evenings.',
    steps: ['Lie down or recline', 'Let attention travel slowly through the body', 'Nothing to fix — only notice'],
    pattern: [['Rest', 10], ['Scan', 10], ['Soften', 10]] },
  { id: 'mbreath', cat: 'mindfulness', name: 'Mindful Breath', mins: 4, tint: 'var(--pink)', desc: 'Simply watch the breath arrive and leave, without changing it.',
    steps: ['Find one spot where breath is clearest', 'Follow it in and out', 'When the mind wanders, gently return'],
    pattern: [['Arrive', 6], ['Watch', 8], ['Return', 6]] },
  { id: 'mnoting', cat: 'mindfulness', name: 'Noting Practice', mins: 5, tint: 'var(--pink)', desc: 'Label thoughts as “thinking” and feelings as “feeling”, then come back to now.',
    steps: ['Notice whatever arises', 'Name it softly', 'Let it pass like clouds'],
    pattern: [['Notice', 6], ['Name', 5], ['Let go', 7]] },
  { id: 'bshake', cat: 'body', name: 'Shake It Off', mins: 3, tint: 'var(--peach-soft)', desc: 'Gentle shaking of hands, arms and shoulders to discharge stress from the body.',
    steps: ['Stand if you can', 'Shake out hands and arms', 'Let shoulders bounce softly', 'End with one long exhale'],
    pattern: [['Shake', 8], ['Slow', 5], ['Exhale', 6]] },
  { id: 'bstretch', cat: 'body', name: 'Desk Unwind', mins: 4, tint: 'var(--peach-soft)', desc: 'Neck rolls and shoulder circles made for long study sessions.',
    steps: ['Roll shoulders back, slowly', 'Tilt head side to side', 'Interlace fingers, stretch up', 'Finish with a deep breath'],
    pattern: [['Stretch', 7], ['Hold', 5], ['Release', 6]] },
];

type Stage = 'browse' | 'detail' | 'session' | 'reflect';

export function Exercises() {
  const { lang } = useApp();
  const [cat, setCat] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>('browse');
  const [ex, setEx] = useState<Exercise | null>(null);

  if (stage === 'detail' && ex) return <ExerciseDetail ex={ex} onStart={() => setStage('session')} onBack={() => { setStage('browse'); setEx(null); }} />;
  if (stage === 'session' && ex) return <Session ex={ex} onDone={() => setStage('reflect')} onExit={() => { setStage('browse'); setEx(null); }} />;
  if (stage === 'reflect' && ex) return <Reflect ex={ex} onClose={() => { setStage('browse'); setEx(null); }} />;

  const list = cat ? EXERCISES.filter(e => e.cat === cat) : EXERCISES;
  return (
    <div className="scroll-area pb-6">
      <TopBar title={t(lang, 'exercises')} />
      <div className="px-6 mt-2 anim-rise">
        <h1 className="font-display text-[28px] font-semibold leading-tight">
          {lang === 'hi' ? 'थोड़ी सांस,\nथोड़ा सुकून' : lang === 'hg' ? 'Thodi saans,\nthoda sukoon' : 'A few breaths,\na little ease'}
        </h1>
      </div>

      {/* categories */}
      <div className="flex gap-2.5 px-6 mt-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setCat(null)} className={`k-chip shrink-0 ${!cat ? 'bg-[var(--ink)] text-white' : 'bg-white'}`}>All</button>
        {CATS(lang).map(c => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`k-chip shrink-0 ${cat === c.id ? 'bg-[var(--ink)] text-white' : 'bg-white'}`}>
            {c.icon}{c.label}
          </button>
        ))}
      </div>

      {/* exercise cards */}
      <div className="px-6 mt-4 grid grid-cols-2 gap-3.5">
        {list.map((e, i) => (
          <button key={e.id} onClick={() => { setEx(e); setStage('detail'); }}
            className="k-card-flat p-4 text-left flex flex-col min-h-[128px] active:scale-[0.97] transition-transform anim-rise"
            style={{ animationDelay: `${i * 0.05}s` }}>
            <span className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ background: e.tint }}>
              {CATS(lang).find(c => c.id === e.cat)?.icon}
            </span>
            <div className="font-extrabold text-[14.5px] leading-tight">{e.name}</div>
            <div className="text-[11px] font-bold text-soft mt-0.5">{e.mins} {t(lang, 'min')}</div>
            <span className="mt-auto pt-2 flex items-center gap-1 text-[11px] font-extrabold" style={{ color: 'var(--sage-deep)' }}>
              {t(lang, 'start')} <ChevronRight size={13} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExerciseDetail({ ex, onStart, onBack }: { ex: Exercise; onStart: () => void; onBack: () => void }) {
  const { lang } = useApp();
  return (
    <div className="flex-1 flex flex-col" style={{ background: `linear-gradient(180deg, ${ex.tint} 0%, var(--cream) 45%)` }}>
      <TopBar onBack={onBack} showLang={false} light />
      <div className="scroll-area px-7 pb-8">
        <div className="anim-rise mt-3">
          <span className="k-chip bg-white/80"><Clock size={13} /> {ex.mins} {t(lang, 'min')}</span>
          <h1 className="font-display text-[32px] font-semibold mt-3 leading-tight">{ex.name}</h1>
          <p className="text-soft font-bold mt-2 leading-relaxed">{ex.desc}</p>
        </div>
        <div className="k-card p-5 mt-6 anim-rise" style={{ animationDelay: '.12s' }}>
          <div className="font-extrabold text-sm mb-3">{lang === 'hi' ? 'कैसे करें' : 'How it goes'}</div>
          {ex.steps.map((s, i) => (
            <div key={i} className="flex gap-3 py-2 items-start">
              <span className="w-6 h-6 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 text-white" style={{ background: 'var(--ink)' }}>{i + 1}</span>
              <span className="text-[14px] font-bold text-soft leading-snug pt-0.5">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-8">
        <button className="k-btn k-btn-dark flex items-center justify-center gap-2" onClick={onStart}>
          <Play size={18} /> {t(lang, 'begin')}
        </button>
      </div>
    </div>
  );
}

function Session({ ex, onDone, onExit }: { ex: Exercise; onDone: () => void; onExit: () => void }) {
  const { lang } = useApp();
  const total = ex.mins * 60;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed(e => Math.min(e + 1, total)), 1000);
    return () => clearInterval(id);
  }, [running, total]);

  const cycleLen = ex.pattern.reduce((a, [, d]) => a + d, 0);
  const inCycle = elapsed % cycleLen;
  let acc = 0, phase = ex.pattern[0][0], phaseDur = ex.pattern[0][1];
  for (const [p, d] of ex.pattern) { if (inCycle < acc + d) { phase = p; phaseDur = d; break; } acc += d; }

  const mm = String(Math.floor((total - elapsed) / 60)).padStart(2, '0');
  const ss = String((total - elapsed) % 60).padStart(2, '0');
  const pct = elapsed / total;

  return (
    <div className="flex-1 flex flex-col items-center" style={{ background: `linear-gradient(180deg, ${ex.tint} 0%, var(--cream) 60%)` }}>
      <TopBar onBack={onExit} showLang={false} light />
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-56 h-56 rounded-full anim-ripple" style={{ background: 'rgba(255,255,255,.6)' }} />
          <div className="w-52 h-52 rounded-full bg-white flex flex-col items-center justify-center anim-breathe"
            style={{ boxShadow: '0 24px 60px rgba(84,69,63,.18)', animationDuration: `${phaseDur * 2}s` }}>
            <span className="font-display text-[26px] font-semibold">{phase}</span>
            <span className="text-soft font-extrabold text-sm mt-1">{mm}:{ss}</span>
          </div>
        </div>
        <div className="w-full max-w-[260px]">
          <div className="h-2 rounded-full bg-white overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct * 100}%`, background: 'var(--ink)' }} />
          </div>
        </div>
        {elapsed >= total ? (
          <button className="k-btn k-btn-dark max-w-[260px] anim-pop" onClick={onDone}><span className="flex items-center justify-center gap-2"><Check size={18} /> {t(lang, 'complete')}</span></button>
        ) : (
          <button className="k-btn k-btn-soft max-w-[260px]" onClick={() => setRunning(r => !r)}>
            {running ? 'Pause' : <span className="flex items-center justify-center gap-2"><RotateCcw size={16} /> Resume</span>}
          </button>
        )}
      </div>
    </div>
  );
}

function Reflect({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  const { lang, logMood } = useApp();
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ background: `linear-gradient(180deg, ${ex.tint} 0%, var(--cream) 55%)` }}>
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center anim-pop mb-6" style={{ boxShadow: '0 14px 36px rgba(84,69,63,.16)' }}>
        <Check size={34} style={{ color: 'var(--sage-deep)' }} />
      </div>
      <h1 className="font-display text-[30px] font-semibold anim-rise">{lang === 'hi' ? 'बहुत अच्छा' : 'Well done'}</h1>
      <p className="text-soft font-bold mt-2 anim-rise" style={{ animationDelay: '.1s' }}>{ex.name} · {t(lang, 'complete')}</p>
      <p className="font-extrabold mt-8 mb-4 anim-rise" style={{ animationDelay: '.2s' }}>{t(lang, 'reflectQ')}</p>
      <div className="flex gap-3 anim-rise" style={{ animationDelay: '.25s' }}>
        {MOODS.map(m => (
          <button key={m.id} onClick={() => { setPicked(m.id); logMood(m.id); }}
            className={`w-12 h-12 rounded-full text-[22px] flex items-center justify-center transition-all active:scale-90 ${picked === m.id ? 'scale-110 ring-2 ring-[var(--ink)]' : ''}`}
            style={{ background: m.color }}>{m.emoji}</button>
        ))}
      </div>
      <div className="w-full mt-10 anim-rise" style={{ animationDelay: '.35s' }}>
        <button className="k-btn k-btn-dark" onClick={onClose}>{t(lang, 'done')}</button>
      </div>
    </div>
  );
}
