import { useMemo, useState } from 'react';
import { useApp, type JournalEntry } from '../lib/store';
import { t } from '../lib/i18n';
import { TopBar, MOODS, SectionTitle } from '../components/chrome';
import { PenLine, Search, Trash2, ChevronRight, User, Globe, ShieldCheck, HeartHandshake, Lock, BookHeart, Check } from 'lucide-react';

type View = { kind: 'journal' } | { kind: 'editor'; entry?: JournalEntry } | { kind: 'detail'; entry: JournalEntry } | { kind: 'settings' };

const fmtDay = (ts: number) => {
  const d = new Date(ts), today = new Date(), y = new Date(Date.now() - 864e5);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
};
const fmtTime = (ts: number) => new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

export function MySpace() {
  const { lang, journal } = useApp();
  const [view, setView] = useState<View>({ kind: 'journal' });
  const [query, setQuery] = useState('');

  const filtered = journal.filter(e => (e.title + ' ' + e.body).toLowerCase().includes(query.toLowerCase()));
  const grouped = useMemo(() => {
    const map = new Map<string, JournalEntry[]>();
    for (const e of filtered) {
      const k = fmtDay(e.createdAt);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(e);
    }
    return [...map.entries()];
  }, [filtered]);

  if (view.kind === 'editor') return <Editor entry={view.entry} onClose={() => setView({ kind: 'journal' })} />;
  if (view.kind === 'settings') return <Settings onClose={() => setView({ kind: 'journal' })} />;

  const detailEntry = view.kind === 'detail' ? journal.find(e => e.id === view.entry.id) : null;
  if (view.kind === 'detail' && detailEntry) return <EntryDetail entry={detailEntry} onBack={() => setView({ kind: 'journal' })} onEdit={() => setView({ kind: 'editor', entry: detailEntry })} />;

  return (
    <div className="scroll-area pb-6">
      <TopBar title={t(lang, 'mySpace')}
        onBack={undefined} />
      <div className="px-6 mt-1 flex items-end justify-between anim-rise">
        <div>
          <h1 className="font-display text-[30px] font-semibold leading-tight">{t(lang, 'myJournal')}</h1>
          <p className="text-soft font-bold text-sm mt-1">{lang === 'hi' ? 'सिर्फ़ आपके लिए, पूरी तरह निजी' : 'Just for you. Completely private.'}</p>
        </div>
        <button onClick={() => setView({ kind: 'settings' })} className="k-iconbtn !w-10 !h-10"><User size={18} /></button>
      </div>

      {/* search + new */}
      <div className="px-6 mt-5 flex gap-2.5">
        <div className="k-input !py-3.5 flex items-center gap-2.5 flex-1">
          <Search size={17} className="text-soft shrink-0" />
          <input className="bg-transparent outline-none w-full font-semibold text-[14px]" placeholder={t(lang, 'searchJournal')} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <button onClick={() => setView({ kind: 'editor' })} className="k-iconbtn !w-[52px] !h-[52px] !bg-[var(--ink)] !text-white shrink-0"><PenLine size={19} /></button>
      </div>

      {/* entries */}
      {journal.length === 0 ? (
        <div className="px-6 mt-10 flex flex-col items-center text-center anim-rise">
          <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-5" style={{ background: 'var(--lav-soft)' }}>
            <BookHeart size={38} style={{ color: 'var(--lav)' }} />
          </div>
          <h3 className="font-extrabold text-[18px]">{t(lang, 'emptyJournal')}</h3>
          <p className="text-soft font-bold text-[13.5px] mt-2 max-w-[260px] leading-relaxed">{t(lang, 'emptyJournalSub')}</p>
          <button className="k-btn k-btn-dark max-w-[220px] mt-6" onClick={() => setView({ kind: 'editor' })}>{t(lang, 'newEntry')}</button>
        </div>
      ) : (
        grouped.map(([dayLabel, entries]) => (
          <div key={dayLabel}>
            <SectionTitle><span className="text-soft text-[13px]">{dayLabel}</span></SectionTitle>
            <div className="px-6 flex flex-col gap-3">
              {entries.map(e => {
                const mood = MOODS.find(m => m.id === e.mood);
                return (
                  <button key={e.id} onClick={() => setView({ kind: 'detail', entry: e })}
                    className="k-card-flat p-4.5 p-4 text-left active:scale-[0.98] transition-transform">
                    <div className="flex items-center gap-2.5">
                      {mood && <span className="w-7 h-7 rounded-full flex items-center justify-center text-[14px]" style={{ background: mood.color }}>{mood.emoji}</span>}
                      <span className="font-extrabold text-[15px] flex-1 truncate">{e.title || 'Untitled'}</span>
                      <span className="text-[10.5px] font-bold text-soft">{fmtTime(e.createdAt)}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-soft mt-1.5 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{e.body}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------- editor ---------- */
function Editor({ entry, onClose }: { entry?: JournalEntry; onClose: () => void }) {
  const { lang, addEntry, updateEntry, deleteEntry } = useApp();
  const [title, setTitle] = useState(entry?.title ?? '');
  const [body, setBody] = useState(entry?.body ?? '');
  const [mood, setMood] = useState(entry?.mood ?? 'okay');
  const [confirmDel, setConfirmDel] = useState(false);

  const save = () => {
    if (!title.trim() && !body.trim()) return onClose();
    if (entry) updateEntry(entry.id, { title: title.trim(), body, mood });
    else addEntry({ title: title.trim(), body, mood });
    onClose();
  };

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, var(--beige) 0%, var(--cream) 34%)' }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button onClick={onClose} className="text-sm font-extrabold text-soft px-2">{t(lang, 'back')}</button>
        <div className="flex gap-2">
          {entry && (
            <button onClick={() => setConfirmDel(true)} className="k-iconbtn !w-10 !h-10"><Trash2 size={16} /></button>
          )}
          <button onClick={save} className="k-iconbtn !w-10 !h-10 !bg-[var(--ink)] !text-white"><Check size={17} /></button>
        </div>
      </div>
      <div className="scroll-area px-7 pb-8 flex flex-col">
        <div className="text-[11px] font-extrabold text-soft mb-3">{entry ? fmtDay(entry.createdAt) : fmtDay(Date.now())} · {fmtTime(Date.now())}</div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t(lang, 'entryTitle')}
          className="bg-transparent outline-none font-display text-[28px] font-semibold placeholder:text-black/25 w-full" />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder={t(lang, 'writeFreely')}
          className="bg-transparent outline-none font-semibold text-[16px] leading-[1.75] mt-4 w-full flex-1 min-h-[280px] resize-none placeholder:text-black/25" />
        <div className="mt-4">
          <div className="text-[11px] font-extrabold text-soft mb-2.5">{t(lang, 'howFelt')}</div>
          <div className="flex gap-3">
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)}
                className={`w-11 h-11 rounded-full text-[20px] flex items-center justify-center transition-all active:scale-90 ${mood === m.id ? 'ring-2 ring-[var(--ink)] scale-110' : 'opacity-70'}`}
                style={{ background: m.color }}>{m.emoji}</button>
            ))}
          </div>
        </div>
      </div>
      {confirmDel && (
        <div className="absolute inset-0 z-40 flex items-end" style={{ background: 'rgba(59,52,48,.35)' }} onClick={() => setConfirmDel(false)}>
          <div className="w-full anim-sheet rounded-t-[32px] p-6 pb-9" style={{ background: 'var(--cream)' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-extrabold text-[17px]">{lang === 'hi' ? 'यह entry हटाएँ?' : 'Delete this entry?'}</h3>
            <p className="text-soft font-bold text-sm mt-1.5">{lang === 'hi' ? 'इसे वापस नहीं लाया जा सकता।' : 'This cannot be undone.'}</p>
            <div className="flex gap-3 mt-5">
              <button className="k-btn k-btn-soft" onClick={() => setConfirmDel(false)}>{t(lang, 'back')}</button>
              <button className="k-btn" style={{ background: '#e26d5a', color: '#fff' }} onClick={() => { deleteEntry(entry!.id); onClose(); }}>{t(lang, 'delete')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- entry detail ---------- */
function EntryDetail({ entry, onBack, onEdit }: { entry: JournalEntry; onBack: () => void; onEdit: () => void }) {
  const mood = MOODS.find(m => m.id === entry.mood);
  return (
    <div className="flex-1 flex flex-col" style={{ background: `linear-gradient(180deg, ${mood?.color ?? 'var(--beige)'} 0%, var(--cream) 38%)` }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button onClick={onBack} className="k-iconbtn"><ChevronRight size={18} className="rotate-180" /></button>
        <button onClick={onEdit} className="k-iconbtn"><PenLine size={16} /></button>
      </div>
      <div className="scroll-area px-7 pb-8">
        <div className="flex items-center gap-2 text-[11px] font-extrabold text-soft mb-3">
          {fmtDay(entry.createdAt)} · {fmtTime(entry.createdAt)}
          {mood && <span className="k-chip bg-white/80">{mood.emoji} {mood.label}</span>}
        </div>
        <h1 className="font-display text-[30px] font-semibold leading-tight">{entry.title || 'Untitled'}</h1>
        <p className="font-semibold text-[16px] leading-[1.8] mt-5 whitespace-pre-wrap">{entry.body}</p>
      </div>
    </div>
  );
}

/* ---------- settings ---------- */
function Settings({ onClose }: { onClose: () => void }) {
  const { lang, profile, lock } = useApp();
  const rows = [
    { icon: <User size={18} />, label: t(lang, 'profile'), val: profile?.name ?? '' },
    { icon: <Globe size={18} />, label: t(lang, 'language'), val: lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'Hinglish' },
    { icon: <ShieldCheck size={18} />, label: t(lang, 'security'), val: '••••' },
    { icon: <HeartHandshake size={18} />, label: t(lang, 'trustedContactSetting'), val: profile?.trusted?.name ?? '—' },
    { icon: <Lock size={18} />, label: t(lang, 'privacy'), val: lang === 'hi' ? 'डेटा केवल इस डिवाइस पर' : 'On-device only' },
  ];
  return (
    <div className="scroll-area pb-8">
      <TopBar title={t(lang, 'settings')} onBack={onClose} />
      <div className="px-6 mt-4">
        <div className="k-card-flat overflow-hidden">
          {rows.map((r, i) => (
            <div key={i} className={`flex items-center gap-3.5 px-5 py-4 ${i ? 'border-t border-black/5' : ''}`}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--cream)' }}>{r.icon}</span>
              <span className="font-extrabold text-[14.5px] flex-1">{r.label}</span>
              <span className="text-[12px] font-bold text-soft truncate max-w-[120px]">{r.val}</span>
            </div>
          ))}
        </div>
        <button onClick={lock} className="k-btn k-btn-dark mt-6 flex items-center justify-center gap-2">
          <Lock size={17} /> {t(lang, 'lockApp')}
        </button>
        <p className="text-center text-[11.5px] font-bold text-soft mt-4 leading-relaxed px-4">
          {lang === 'hi' ? 'आपकी डायरी और निजी डेटा इसी डिवाइस पर रहता है।' : 'Your journal and private data never leave this device.'}
        </p>
      </div>
    </div>
  );
}
