
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { MOODS, SectionTitle } from '../components/chrome';
import { Sparkles, Wind, Moon, Heart, MessageCircleHeart, ArrowUpRight, Flame, CalendarCheck, BookHeart } from 'lucide-react';
import type { MainTab } from '../components/chrome';

function greeting(lang: 'en' | 'hi' | 'hg') {
  const h = new Date().getHours();
  if (h < 12) return t(lang, 'goodMorning');
  if (h < 17) return t(lang, 'goodAfternoon');
  return t(lang, 'goodEvening');
}

function EnergyRing({ score }: { score: number }) {
  const r = 74, c = 2 * Math.PI * r;
  const pct = score / 100;
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
      <circle cx="90" cy="90" r={r} fill="none" stroke="#eee7dd" strokeWidth="16" strokeLinecap="round" />
      <circle cx="90" cy="90" r={r} fill="none" stroke="url(#grad)" strokeWidth="16" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#BAAADB" /><stop offset="100%" stopColor="#7FAE6D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Home({ goTab, openChat }: { goTab: (t: MainTab) => void; openChat: () => void }) {
  const { lang, profile, todayMood, logMood, moods, journal } = useApp();
  const name = profile?.name?.split(' ')[0] || 'Friend';
  const score = todayMood ? { great: 92, good: 80, okay: 66, low: 48, heavy: 35 }[todayMood.mood as 'great'] ?? 70 : 72;
  const streak = Math.min(moods.length + 2, 21);

  return (
    <div className="scroll-area pb-6">
      {/* header */}
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg text-white" style={{ background: 'linear-gradient(135deg,#BAAADB,#FFB583)' }}>
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-extrabold text-soft">{greeting(lang)}</div>
            <div className="font-extrabold text-lg leading-tight">{name}</div>
          </div>
        </div>
        <div className="k-chip bg-white" style={{ boxShadow: '0 4px 14px rgba(84,69,63,.08)' }}>
          <Sparkles size={13} style={{ color: 'var(--lav)' }} /> AI Guide
        </div>
      </div>

      <div className="px-6 mt-5 anim-rise">
        <h1 className="font-display text-[30px] leading-[1.15] font-semibold">
          {lang === 'hi' ? 'AI आपके मन का\nसाथी है' : lang === 'hg' ? 'AI aapke mann ka saathi hai' : 'AI guides\nyour wellbeing'}
        </h1>
      </div>

      {/* mood check-in */}
      <SectionTitle>{t(lang, 'moodQ')}</SectionTitle>
      <div className="px-6">
        <div className="k-card-flat p-4 flex justify-between">
          {MOODS.map(m => (
            <button key={m.id} onClick={() => logMood(m.id)}
              className={`flex flex-col items-center gap-1.5 px-2 py-2 rounded-2xl transition-all active:scale-90 ${todayMood?.mood === m.id ? 'bg-[var(--cream)] scale-105' : ''}`}
              style={todayMood?.mood === m.id ? { boxShadow: 'inset 0 0 0 2px var(--ink)' } : {}}>
              <span className="w-11 h-11 rounded-full flex items-center justify-center text-[22px]" style={{ background: m.color }}>{m.emoji}</span>
              <span className="text-[10px] font-extrabold text-soft">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* wellness state */}
      <SectionTitle action={<button className="k-iconbtn !w-9 !h-9 !bg-[var(--ink)] !text-white" onClick={() => goTab('therapy')}><ArrowUpRight size={17} /></button>}>
        {t(lang, 'wellnessNow')}
      </SectionTitle>
      <div className="px-6">
        <div className="k-card p-6 flex flex-col items-center">
          <div className="relative">
            <EnergyRing score={score} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-extrabold text-soft">{lang === 'hi' ? 'ऊर्जा स्कोर' : 'Energy score'}</span>
              <span className="font-display text-[42px] font-semibold leading-none">{score}<span className="text-lg text-soft">/100</span></span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full mt-5">
            {[
              { icon: <Heart size={17} />, label: lang === 'hi' ? 'मन' : 'Calm', val: todayMood ? MOODS.find(m => m.id === todayMood.mood)!.label : '—', bg: 'var(--pink)' },
              { icon: <Moon size={17} />, label: lang === 'hi' ? 'नींद' : 'Sleep', val: '7h 45m', bg: 'var(--lav-soft)' },
              { icon: <Wind size={17} />, label: lang === 'hi' ? 'श्वास' : 'Breath', val: '6/min', bg: 'var(--blue)' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-3 text-center" style={{ background: s.bg }}>
                <div className="flex justify-center mb-1 opacity-70">{s.icon}</div>
                <div className="text-[10px] font-extrabold text-soft">{s.label}</div>
                <div className="font-extrabold text-[15px]">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* suggested */}
      <SectionTitle>{t(lang, 'suggested')}</SectionTitle>
      <div className="px-6 flex gap-3">
        <button onClick={() => goTab('exercises')} className="flex-1 k-card-flat p-4 text-left active:scale-[0.97] transition-transform" style={{ background: 'var(--peach-soft)' }}>
          <Wind size={22} className="mb-2" />
          <div className="font-extrabold text-[15px]">{t(lang, 'breathing')}</div>
          <div className="text-xs font-bold text-soft">4-7-8 · 4 {t(lang, 'min')}</div>
        </button>
        <button onClick={openChat} className="flex-1 k-card-flat p-4 text-left active:scale-[0.97] transition-transform" style={{ background: 'var(--lav-soft)' }}>
          <MessageCircleHeart size={22} className="mb-2" />
          <div className="font-extrabold text-[15px]">{t(lang, 'chatTitle')}</div>
          <div className="text-xs font-bold text-soft">{t(lang, 'online')}</div>
        </button>
      </div>

      {/* progress */}
      <SectionTitle>{t(lang, 'yourProgress')}</SectionTitle>
      <div className="px-6">
        <div className="k-card-flat p-5 flex justify-around">
          {[
            { icon: <Flame size={19} style={{ color: '#e08b4e' }} />, v: streak, l: t(lang, 'streakDays') },
            { icon: <CalendarCheck size={19} style={{ color: 'var(--sage-deep)' }} />, v: moods.length + 9, l: t(lang, 'checkins') },
            { icon: <BookHeart size={19} style={{ color: 'var(--lav)' }} />, v: journal.length, l: t(lang, 'journalEntries') },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              {s.icon}
              <div className="font-extrabold text-xl">{s.v}</div>
              <div className="text-[11px] font-bold text-soft">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
