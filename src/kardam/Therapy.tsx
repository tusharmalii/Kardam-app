import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { TopBar, SectionTitle } from '../components/chrome';
import { BrainCircuit, ClipboardList, Moon, Wind, Waves, Sparkles, Stethoscope, Check, ChevronRight, X } from 'lucide-react';

/* ---------- tiny self-care routine (persisted per day) ---------- */
const ROUTINE = [
  { id: 'water', label: { en: 'A glass of water, slowly', hi: 'एक गिलास पानी, धीरे-धीरे', hg: 'Ek glass paani, dheere se' }, tint: 'var(--blue)' },
  { id: 'sun', label: { en: '2 minutes of daylight', hi: '2 मिनट धूप', hg: '2 minute dhoop' }, tint: 'var(--peach-soft)' },
  { id: 'breath', label: { en: '5 slow breaths', hi: '5 धीमी साँसें', hg: '5 dheemi saansein' }, tint: 'var(--sage)' },
  { id: 'kind', label: { en: 'One kind thought for yourself', hi: 'अपने लिए एक अच्छा विचार', hg: 'Apne liye ek kind thought' }, tint: 'var(--pink)' },
];

function useRoutine() {
  const dayKey = 'kardam.routine.' + new Date().toISOString().slice(0, 10);
  const [done, setDone] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem(dayKey) || '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(dayKey, JSON.stringify(done)); } catch { /* ignore */ } }, [done, dayKey]);
  return { done, toggle: (id: string) => setDone(d => d.includes(id) ? d.filter(x => x !== id) : [...d, id]) };
}

/* ---------- wellbeing mini check-in ---------- */
interface Q { text: string; options: { label: string; score: number }[] }
const TESTS: Record<string, { title: string; sub: string; icon: React.ReactNode; tint: string; questions: Q[]; interpret: (s: number) => string }> = {
  mood: {
    title: 'Mood Questionnaire', sub: 'PHQ-2 · 2 min', tint: 'var(--pink)',
    icon: <ClipboardList size={20} />,
    questions: [
      { text: 'Over the last 2 weeks, how often have you felt down or hopeless?', options: [{ label: 'Not at all', score: 0 }, { label: 'Several days', score: 1 }, { label: 'More than half', score: 2 }, { label: 'Nearly every day', score: 3 }] },
      { text: 'How often have you lost interest or pleasure in things you usually enjoy?', options: [{ label: 'Not at all', score: 0 }, { label: 'Several days', score: 1 }, { label: 'More than half', score: 2 }, { label: 'Nearly every day', score: 3 }] },
    ],
    interpret: s => s <= 2 ? 'Your responses suggest a low level of low mood right now. Keep nurturing what helps.' : s <= 4 ? 'Some signs of low mood are showing up. Gentle daily care and talking to someone can help.' : 'Your answers suggest you may be carrying a lot. Please consider talking to a counsellor — support helps.',
  },
  sleep: {
    title: 'Insomnia Rating', sub: 'ISI-mini · 2 min', tint: 'var(--lav-soft)',
    icon: <Moon size={20} />,
    questions: [
      { text: 'How hard is it for you to fall asleep lately?', options: [{ label: 'Not hard', score: 0 }, { label: 'A little', score: 1 }, { label: 'Quite hard', score: 2 }, { label: 'Very hard', score: 3 }] },
      { text: 'How often do you wake up feeling unrested?', options: [{ label: 'Rarely', score: 0 }, { label: 'Sometimes', score: 1 }, { label: 'Often', score: 2 }, { label: 'Almost always', score: 3 }] },
    ],
    interpret: s => s <= 2 ? 'Your sleep looks fairly settled. A steady routine will protect it.' : s <= 4 ? 'Your sleep seems a little disturbed. A wind-down ritual may help.' : 'Sleep looks quite disturbed. A counsellor can help you rebuild rest — you deserve it.',
  },
};

function TestSheet({ testId, onClose }: { testId: string; onClose: () => void }) {
  const { lang } = useApp();
  const test = TESTS[testId];
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const finished = step >= test.questions.length;
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end" style={{ background: 'rgba(59,52,48,.35)' }} onClick={onClose}>
      <div className="anim-sheet rounded-t-[32px] p-6 pb-9" style={{ background: 'var(--cream)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <span className="k-chip" style={{ background: test.tint }}>{test.icon}{test.title}</span>
          <button onClick={onClose} className="k-iconbtn !w-9 !h-9"><X size={16} /></button>
        </div>
        {!finished ? (
          <div className="anim-fade" key={step}>
            <div className="text-[11px] font-extrabold text-soft mb-1.5">Question {step + 1} of {test.questions.length}</div>
            <h3 className="font-extrabold text-[17px] leading-snug mb-4">{test.questions[step].text}</h3>
            <div className="flex flex-col gap-2">
              {test.questions[step].options.map(o => (
                <button key={o.label} onClick={() => { setScore(s => s + o.score); setStep(s => s + 1); }}
                  className="k-card-flat px-5 py-3.5 text-left font-bold text-[14.5px] active:scale-[0.98] transition-transform">
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="anim-fade">
            <h3 className="font-display text-[24px] font-semibold mb-2">Thank you for checking in</h3>
            <p className="text-soft font-bold text-[14px] leading-relaxed">{test.interpret(score)}</p>
            <p className="text-[11px] font-bold text-soft mt-3">This is a wellbeing reflection, not a medical diagnosis.</p>
            <button className="k-btn k-btn-dark mt-5" onClick={onClose}>{t(lang, 'done')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- main ---------- */
export function Therapy({ openChat }: { openChat: () => void }) {
  const { lang } = useApp();
  const { done, toggle } = useRoutine();
  const [test, setTest] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const pct = Math.round((done.length / ROUTINE.length) * 100);

  const guided = useMemo(() => [
    { id: 'g1', name: lang === 'hi' ? 'भावनाओं को शांत करना' : 'Emotional regulation', meta: 'Guided · 6 min', icon: <Waves size={19} />, tint: 'var(--blue)' },
    { id: 'g2', name: lang === 'hi' ? 'शरीर से शुरुआत' : 'Body-first reset', meta: 'Somatic · 5 min', icon: <Wind size={19} />, tint: 'var(--sage)' },
    { id: 'g3', name: lang === 'hi' ? 'रीसेट साँस' : 'Recovery breathing', meta: 'Guided · 4 min', icon: <Sparkles size={19} />, tint: 'var(--pink)' },
  ], [lang]);

  return (
    <div className="scroll-area pb-6">
      <TopBar title={t(lang, 'therapy')} />

      {/* CBT analytics card */}
      <div className="px-6 mt-3 anim-rise">
        <div className="k-card p-5 flex gap-4 items-center" style={{ background: 'linear-gradient(120deg, #fff 40%, var(--lav-soft))' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--lav)' }}>
            <BrainCircuit size={26} className="text-white" />
          </div>
          <div>
            <div className="font-extrabold text-[16px]">{lang === 'hi' ? 'CBT अभ्यास विश्लेषण' : 'CBT Exercise Analytics'}</div>
            <p className="text-[12px] font-bold text-soft leading-snug mt-0.5">{lang === 'hi' ? 'AI-आधारित CBT अंतर्दृष्टि और बेहतर जीवन के लिए सुझाव।' : 'AI-assisted CBT insights and gentle recommendations for better living.'}</p>
          </div>
        </div>
      </div>

      {/* daily routine */}
      <SectionTitle action={<span className="k-chip bg-white">{pct}%</span>}>{t(lang, 'dailyRoutine')}</SectionTitle>
      <div className="px-6">
        <div className="k-card-flat p-3 flex flex-col">
          {ROUTINE.map(r => {
            const on = done.includes(r.id);
            return (
              <button key={r.id} onClick={() => toggle(r.id)} className="flex items-center gap-3.5 px-3 py-3 rounded-2xl active:bg-black/5 transition-colors text-left">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${on ? '' : 'ring-2 ring-black/10'}`} style={{ background: on ? 'var(--ink)' : 'transparent' }}>
                  {on && <Check size={13} className="text-white" />}
                </span>
                <span className={`font-bold text-[14.5px] ${on ? 'line-through opacity-40' : ''}`}>{r.label[lang]}</span>
                <span className="ml-auto w-2.5 h-2.5 rounded-full" style={{ background: r.tint }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* guided */}
      <SectionTitle>{t(lang, 'guidedForYou')}</SectionTitle>
      <div className="flex gap-3 px-6 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {guided.map(g => (
          <button key={g.id} className="k-card-flat p-4 min-w-[150px] text-left shrink-0 active:scale-[0.97] transition-transform">
            <span className="w-9 h-9 rounded-full flex items-center justify-center mb-2.5" style={{ background: g.tint }}>{g.icon}</span>
            <div className="font-extrabold text-[14px] leading-tight">{g.name}</div>
            <div className="text-[11px] font-bold text-soft mt-1">{g.meta}</div>
          </button>
        ))}
      </div>

      {/* tests */}
      <SectionTitle>{t(lang, 'wellbeingTests')}</SectionTitle>
      <div className="px-6 grid grid-cols-2 gap-3.5">
        {Object.entries(TESTS).map(([id, ts]) => (
          <button key={id} onClick={() => setTest(id)} className="k-card-flat p-4 text-left active:scale-[0.97] transition-transform">
            <span className="w-9 h-9 rounded-full flex items-center justify-center mb-2.5" style={{ background: ts.tint }}>{ts.icon}</span>
            <div className="font-extrabold text-[14px] leading-tight">{ts.title}</div>
            <div className="text-[11px] font-bold text-soft mt-1">{ts.sub}</div>
          </button>
        ))}
      </div>

      {/* counsellor */}
      <SectionTitle>{t(lang, 'counsellorPath')}</SectionTitle>
      <div className="px-6">
        <div className="k-card p-5" style={{ background: 'linear-gradient(120deg, #fff 35%, var(--peach-soft))' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-extrabold text-lg shrink-0" style={{ background: 'linear-gradient(135deg,#FFB583,#BAAADB)' }}>
              <Stethoscope size={24} />
            </div>
            <div>
              <div className="font-extrabold text-[16px]">{lang === 'hi' ? 'कैंपस counsellor से जुड़ें' : 'Talk to a campus counsellor'}</div>
              <div className="text-[12px] font-bold text-soft">{t(lang, 'counsellorSub')}</div>
            </div>
          </div>
          <button onClick={() => setBooked(b => !b)} className={`k-btn mt-4 ${booked ? 'k-btn-soft' : 'k-btn-dark'}`}>
            {booked ? <span className="flex items-center justify-center gap-2"><Check size={17} /> {t(lang, 'requested')}</span> : t(lang, 'bookSession')}
          </button>
          {booked && <p className="text-[11.5px] font-bold text-soft mt-2.5 text-center anim-fade">The counselling cell will contact you privately within 24 hours. (Demo)</p>}
        </div>
      </div>

      {/* AI support */}
      <div className="px-6 mt-5">
        <button onClick={openChat} className="w-full k-card-flat p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--ink)' }}><Sparkles size={20} /></div>
          <div className="flex-1 text-left">
            <div className="font-extrabold text-[15px]">{t(lang, 'aiSupport')}</div>
            <div className="text-[12px] font-bold text-soft">{t(lang, 'chatSub')}</div>
          </div>
          <ChevronRight size={18} className="text-soft" />
        </button>
      </div>

      {test && <TestSheet testId={test} onClose={() => setTest(null)} />}
    </div>
  );
}
