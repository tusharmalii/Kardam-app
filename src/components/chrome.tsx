import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronLeft, Delete, Home, Leaf, HeartHandshake, Flower2, BookHeart } from 'lucide-react';
import { useApp } from '../lib/store';
import { LANGS, t, type Key } from '../lib/i18n';

/* ---------- Logo ---------- */
export function Logo({ size = 64, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <rect x="4" y="4" width="56" height="56" rx="18" fill={dark ? '#fff' : '#3B3430'} />
        <path d="M20 44V20M20 32l12-12M22 33l13 11" stroke={dark ? '#3B3430' : '#fff'} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="21" r="4" fill="#FFB583" />
        <path d="M38 44c2-6 8-6 10 0" stroke="#C9E7B5" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ---------- Language menu ---------- */
export function LangMenu({ light = false }: { light?: boolean }) {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)} className={`k-iconbtn ${light ? '!bg-white/70 backdrop-blur' : ''}`} aria-label="Language">
        <Globe size={19} strokeWidth={2.2} />
      </button>
      {open && (
        <div className="absolute right-0 top-13 mt-1.5 w-40 k-card-flat p-1.5 z-50 anim-pop" style={{ top: '100%' }}>
          {LANGS.map(l => (
            <button key={l.id} onClick={() => { setLang(l.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors ${lang === l.id ? 'bg-[var(--ink)] text-white' : 'hover:bg-black/5'}`}>
              {l.native}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Top bar ---------- */
export function TopBar({ title, onBack, showLang = true, light = false }: { title?: string; onBack?: () => void; showLang?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5 pb-2 shrink-0">
      <div className="w-11">
        {onBack && (
          <button onClick={onBack} className={`k-iconbtn ${light ? '!bg-white/70 backdrop-blur' : ''}`} aria-label="back">
            <ChevronLeft size={20} strokeWidth={2.4} />
          </button>
        )}
      </div>
      {title && <div className="font-extrabold text-[17px]">{title}</div>}
      <div className="w-11 flex justify-end">{showLang && <LangMenu light={light} />}</div>
    </div>
  );
}

/* ---------- PIN pad ---------- */
export function PinPad({ value, onChange, error }: { value: string; onChange: (v: string) => void; error?: boolean }) {
  const press = (d: string) => { if (value.length < 4) onChange(value + d); };
  const back = () => onChange(value.slice(0, -1));
  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="flex gap-5 h-4">
        {[0,1,2,3].map(i => (
          <div key={i} className={`pin-dot ${value.length > i ? 'on' : ''} ${error ? 'err' : ''}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-x-8 gap-y-4">
        {keys.map((k, i) => k === '' ? <div key={i} /> : k === 'del' ? (
          <button key={i} onClick={back} className="w-[68px] h-[68px] rounded-full flex items-center justify-center active:bg-black/5 transition-colors" aria-label="delete">
            <Delete size={24} className="text-soft" />
          </button>
        ) : (
          <button key={i} onClick={() => press(k)}
            className="w-[68px] h-[68px] rounded-full bg-white text-[26px] font-extrabold transition-all active:scale-90"
            style={{ boxShadow: '0 4px 16px rgba(84,69,63,.09)', color: 'var(--ink)' }}>
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Section heading ---------- */
export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 mt-7 mb-3">
      <h2 className="font-extrabold text-[17px]">{children}</h2>
      {action}
    </div>
  );
}

/* ---------- Mood faces ---------- */
export const MOODS = [
  { id: 'great', label: 'Great', emoji: '😊', color: 'var(--sage)' },
  { id: 'good', label: 'Good', emoji: '🙂', color: 'var(--blue)' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: 'var(--beige)' },
  { id: 'low', label: 'Low', emoji: '😔', color: 'var(--pink)' },
  { id: 'heavy', label: 'Heavy', emoji: '😢', color: 'var(--lav-soft)' },
];

/* ---------- Main bottom nav ---------- */
export type MainTab = 'home' | 'exercises' | 'selfcare' | 'therapy' | 'space';
export function MainNav({ tab, setTab }: { tab: MainTab; setTab: (t: MainTab) => void }) {
  const { lang } = useApp();
  const items: { id: MainTab; icon: React.ReactNode; key: Key }[] = [
    { id: 'home', icon: <Home size={22} strokeWidth={2.2} />, key: 'home' },
    { id: 'exercises', icon: <Leaf size={22} strokeWidth={2.2} />, key: 'exercises' },
    { id: 'selfcare', icon: <HeartHandshake size={22} strokeWidth={2.2} />, key: 'selfCare' },
    { id: 'therapy', icon: <Flower2 size={22} strokeWidth={2.2} />, key: 'therapy' },
    { id: 'space', icon: <BookHeart size={22} strokeWidth={2.2} />, key: 'mySpace' },
  ];
  return (
    <div className="shrink-0 px-5 pb-5 pt-2">
      <div className="k-card !rounded-full flex items-center px-2 py-2">
        {items.map(it => (
          <button key={it.id} onClick={() => setTab(it.id)} className={`nav-item ${tab === it.id ? 'on' : ''}`}>
            <span className={`w-11 h-8 rounded-full flex items-center justify-center transition-all ${tab === it.id ? 'bg-[var(--ink)] text-white' : ''}`}>
              {it.icon}
            </span>
            <span className="text-[10px] font-extrabold">{t(lang, it.key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
