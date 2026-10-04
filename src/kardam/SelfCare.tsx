import { useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { TopBar, SectionTitle } from '../components/chrome';
import { Users, ShieldCheck, Headphones, Heart, Check, Clock, Sparkles } from 'lucide-react';

const CIRCLES = [
  { id: 'exam', name: 'Exam Stress Circle', members: 214, tint: 'var(--blue)', desc: 'Sharing the weight of deadlines, results and expectations.' },
  { id: 'hostel', name: 'Away From Home', members: 168, tint: 'var(--peach-soft)', desc: 'For hostel life, homesickness and finding your people.' },
  { id: 'night', name: 'Night Owls', members: 96, tint: 'var(--lav-soft)', desc: 'Quiet company for the hours when everything feels heavier.' },
  { id: 'first', name: 'First-Gen Students', members: 132, tint: 'var(--pink)', desc: 'Navigating university as the first in your family.' },
];

const LISTENERS = [
  { id: 'l1', name: 'Meera K.', tag: 'Final-year Psychology', lang: 'Hindi · English', free: true },
  { id: 'l2', name: 'Arjun T.', tag: 'Trained peer listener', lang: 'English · Hinglish', free: true },
];

export function SelfCare({ openChat }: { openChat: () => void }) {
  const { lang } = useApp();
  const [joined, setJoined] = useState<string[]>(['night']);
  const [requested, setRequested] = useState<string | null>(null);

  return (
    <div className="scroll-area pb-6">
      <TopBar title={t(lang, 'selfCare')} />
      <div className="px-6 mt-2 anim-rise">
        <h1 className="font-display text-[28px] font-semibold leading-tight">
          {lang === 'hi' ? 'आप अकेले नहीं हैं' : lang === 'hg' ? 'Aap akele nahi ho' : 'You don’t have to\ncarry it alone'}
        </h1>
      </div>

      {/* safety note */}
      <div className="px-6 mt-4">
        <div className="rounded-3xl p-4 flex gap-3 items-start" style={{ background: 'var(--sage)' }}>
          <ShieldCheck size={20} className="shrink-0 mt-0.5" style={{ color: 'var(--sage-deep)' }} />
          <p className="text-[12.5px] font-bold leading-snug" style={{ color: '#4a6340' }}>{t(lang, 'safeSpaceNote')}</p>
        </div>
      </div>

      {/* listeners */}
      <SectionTitle>{t(lang, 'talkToListener')}</SectionTitle>
      <div className="px-6 flex flex-col gap-3">
        {LISTENERS.map(l => (
          <div key={l.id} className="k-card-flat p-4 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-white shrink-0" style={{ background: 'linear-gradient(135deg,#7FAE6D,#BBE9F2)' }}>
              {l.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[15px]">{l.name}</div>
              <div className="text-[11.5px] font-bold text-soft truncate">{l.tag} · {l.lang}</div>
            </div>
            <button
              onClick={() => setRequested(requested === l.id ? null : l.id)}
              className={`k-chip transition-all active:scale-95 ${requested === l.id ? 'bg-[var(--sage)]' : 'bg-[var(--ink)] text-white'}`}>
              {requested === l.id ? <><Check size={12} /> {t(lang, 'requested')}</> : <><Headphones size={12} /> Connect</>}
            </button>
          </div>
        ))}
        {requested && (
          <div className="rounded-2xl bg-white p-3.5 text-[12.5px] font-bold text-soft flex gap-2 items-center anim-fade">
            <Clock size={15} className="shrink-0" /> A peer listener will reach out within the app soon. Conversations stay private.
          </div>
        )}
      </div>

      {/* circles */}
      <SectionTitle>{t(lang, 'supportCircles')}</SectionTitle>
      <div className="px-6 grid grid-cols-2 gap-3.5">
        {CIRCLES.map((c, i) => {
          const isIn = joined.includes(c.id);
          return (
            <div key={c.id} className="k-card-flat overflow-hidden anim-rise" style={{ animationDelay: `${i * .05}s` }}>
              <div className="p-4 pb-3" style={{ background: c.tint }}>
                <Users size={20} className="mb-2 opacity-70" />
                <div className="font-extrabold text-[14.5px] leading-tight">{c.name}</div>
                <div className="text-[11px] font-bold text-soft mt-0.5">{c.members} {t(lang, 'members')}</div>
              </div>
              <div className="p-4 pt-3">
                <p className="text-[11.5px] font-bold text-soft leading-snug min-h-[44px]">{c.desc}</p>
                <button
                  onClick={() => setJoined(prev => isIn ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                  className={`w-full mt-2 py-2.5 rounded-full text-[12.5px] font-extrabold transition-all active:scale-95 ${isIn ? 'bg-[var(--cream)]' : 'bg-[var(--ink)] text-white'}`}>
                  {isIn ? <span className="flex items-center justify-center gap-1"><Check size={13} /> {t(lang, 'joined')}</span> : t(lang, 'joinCircle')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* human backup */}
      <SectionTitle>{lang === 'hi' ? 'मानवीय सहारा' : 'Human backup'}</SectionTitle>
      <div className="px-6">
        <button onClick={openChat} className="w-full k-card p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform" style={{ background: 'linear-gradient(120deg,#fff 30%, var(--lav-soft))' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--lav)' }}>
            <Heart size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[15px]">{lang === 'hi' ? 'किसी से बात शुरू करें' : 'Start a conversation'}</div>
            <div className="text-[12px] font-bold text-soft">{lang === 'hi' ? 'Kardam साथी आपके साथ है' : 'Kardam Companion stays with you'}</div>
          </div>
          <Sparkles size={18} className="text-soft" />
        </button>
      </div>
    </div>
  );
}
