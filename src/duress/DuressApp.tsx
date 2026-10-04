import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { Sun, CheckSquare, Droplets, Footprints, BookOpen, Check, Plus, Lock, User, Bell, Palette, Trash2 } from 'lucide-react';

/**
 * DayBloom — the standalone daily-planner experience.
 * Completely separate identity, state and storage from Kardam.
 * Nothing here reads or exposes Kardam data.
 */

type DTab = 'today' | 'habits' | 'you';
interface Task { id: string; text: string; done: boolean }
const dayKey = () => new Date().toISOString().slice(0, 10);
const ls = {
  get<T>(k: string, fb: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

function BloomLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect width="40" height="40" rx="13" fill="#4a7c59" />
      <circle cx="20" cy="15" r="5" fill="#f4d06f" />
      <path d="M20 22v9M20 26c-3-1-5-3-5-6M20 28c3-1 5-3 5-6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function DuressApp() {
  const [tab, setTab] = useState<DTab>('today');
  return (
    <div className="flex-1 flex flex-col" style={{ background: '#f6f7f2' }}>
      <div className="flex-1 flex flex-col overflow-hidden" key={tab}>
        {tab === 'today' && <Today />}
        {tab === 'habits' && <Habits />}
        {tab === 'you' && <You />}
      </div>
      <div className="shrink-0 px-5 pb-5 pt-2">
        <div className="bg-white rounded-full flex items-center px-2 py-2" style={{ boxShadow: '0 10px 30px rgba(70,90,70,.12)' }}>
          {([['today', <Sun key="i" size={22} strokeWidth={2.2} />, 'Today'], ['habits', <CheckSquare key="i" size={22} strokeWidth={2.2} />, 'Habits'], ['you', <User key="i" size={22} strokeWidth={2.2} />, 'You']] as [DTab, React.ReactNode, string][]).map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)} className="flex flex-col items-center gap-1 flex-1 py-1" style={{ color: tab === id ? '#3e5f49' : '#a9b3a6' }}>
              <span className={`w-11 h-8 rounded-full flex items-center justify-center transition-all`} style={tab === id ? { background: '#3e5f49', color: '#fff' } : {}}>{icon}</span>
              <span className="text-[10px] font-extrabold">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
      <div className="flex items-center gap-2.5">
        <BloomLogo />
        <span className="font-extrabold text-[17px]" style={{ color: '#33473b' }}>DayBloom</span>
      </div>
      <span className="text-[11px] font-extrabold px-3 py-1.5 rounded-full bg-white" style={{ color: '#7b8a7c', boxShadow: '0 3px 10px rgba(70,90,70,.08)' }}>{title}</span>
    </div>
  );
}

function Today() {
  const key = 'daybloom.tasks.' + dayKey();
  const [tasks, setTasks] = useState<Task[]>(() => ls.get(key, [
    { id: 'a', text: 'Morning walk — 15 min', done: true },
    { id: 'b', text: 'Finish lecture notes (Ch. 4)', done: false },
    { id: 'c', text: 'Call home', done: false },
    { id: 'd', text: 'Read 10 pages before bed', done: false },
  ]));
  const [draft, setDraft] = useState('');
  useEffect(() => { ls.set(key, tasks); }, [tasks, key]);

  const doneCount = tasks.filter(t => t.done).length;
  const pct = tasks.length ? doneCount / tasks.length : 0;
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const add = () => {
    if (!draft.trim()) return;
    setTasks(ts => [...ts, { id: Math.random().toString(36).slice(2), text: draft.trim(), done: false }]);
    setDraft('');
  };

  const r = 30, c = 2 * Math.PI * r;
  return (
    <div className="scroll-area pb-6">
      <Header title="Planner" />
      <div className="px-6 mt-2">
        <h1 className="font-display text-[28px] font-semibold" style={{ color: '#33473b' }}>Today’s plan</h1>
        <p className="text-[13px] font-bold" style={{ color: '#7b8a7c' }}>{dateStr}</p>
      </div>

      <div className="px-6 mt-4">
        <div className="bg-white rounded-[28px] p-5 flex items-center gap-5" style={{ boxShadow: '0 8px 26px rgba(70,90,70,.10)' }}>
          <div className="relative shrink-0">
            <svg width="76" height="76" viewBox="0 0 76 76" className="-rotate-90">
              <circle cx="38" cy="38" r={r} fill="none" stroke="#eef1ea" strokeWidth="9" />
              <circle cx="38" cy="38" r={r} fill="none" stroke="#4a7c59" strokeWidth="9" strokeLinecap="round"
                strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: 'stroke-dashoffset .6s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-extrabold text-[15px]" style={{ color: '#33473b' }}>{Math.round(pct * 100)}%</span>
          </div>
          <div>
            <div className="font-extrabold text-[15.5px]" style={{ color: '#33473b' }}>{doneCount} of {tasks.length} done</div>
            <p className="text-[12.5px] font-bold mt-0.5" style={{ color: '#7b8a7c' }}>
              {pct === 1 ? 'All done — lovely day!' : pct >= 0.5 ? 'Nice momentum. Keep going.' : 'Small steps count. You’ve got this.'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-5 flex flex-col gap-2.5">
        {tasks.map(task => (
          <div key={task.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 group" style={{ boxShadow: '0 3px 12px rgba(70,90,70,.06)' }}>
            <button onClick={() => setTasks(ts => ts.map(x => x.id === task.id ? { ...x, done: !x.done } : x))}
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
              style={task.done ? { background: '#4a7c59' } : { boxShadow: 'inset 0 0 0 2px #d5dcd2' }}>
              {task.done && <Check size={13} className="text-white" />}
            </button>
            <span className={`flex-1 font-bold text-[14.5px] ${task.done ? 'line-through opacity-40' : ''}`} style={{ color: '#33473b' }}>{task.text}</span>
            <button onClick={() => setTasks(ts => ts.filter(x => x.id !== task.id))} className="opacity-30 active:opacity-100"><Trash2 size={15} /></button>
          </div>
        ))}
        <div className="bg-white rounded-full flex items-center gap-2 p-1.5 pl-4 mt-1" style={{ boxShadow: '0 3px 12px rgba(70,90,70,.08)' }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Add a task for today…" className="flex-1 bg-transparent outline-none font-semibold text-[14px] placeholder:text-black/30" style={{ color: '#33473b' }} />
          <button onClick={add} className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform" style={{ background: '#4a7c59' }}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Habits() {
  const key = 'daybloom.habits.' + dayKey();
  const [vals, setVals] = useState<Record<string, number>>(() => ls.get(key, { water: 3, steps: 4200, pages: 12 }));
  useEffect(() => { ls.set(key, vals); }, [vals, key]);
  const bump = (id: string, d: number, max: number) => setVals(v => ({ ...v, [id]: Math.max(0, Math.min(max, (v[id] ?? 0) + d)) }));

  const cards = [
    { id: 'water', icon: <Droplets size={22} />, name: 'Water', unit: 'glasses', goal: 8, step: 1, tint: '#d8ecf5', accent: '#5b93ad' },
    { id: 'steps', icon: <Footprints size={22} />, name: 'Steps', unit: 'today', goal: 8000, step: 500, tint: '#e6efdc', accent: '#6d8f57' },
    { id: 'pages', icon: <BookOpen size={22} />, name: 'Reading', unit: 'pages', goal: 20, step: 2, tint: '#f7e8ef', accent: '#ad6b8b' },
  ];
  return (
    <div className="scroll-area pb-6">
      <Header title="Habits" />
      <div className="px-6 mt-2">
        <h1 className="font-display text-[28px] font-semibold" style={{ color: '#33473b' }}>Daily habits</h1>
        <p className="text-[13px] font-bold" style={{ color: '#7b8a7c' }}>Tap + to log progress</p>
      </div>
      <div className="px-6 mt-4 flex flex-col gap-3.5">
        {cards.map(c => {
          const v = vals[c.id] ?? 0;
          const pct = Math.min(1, v / c.goal);
          return (
            <div key={c.id} className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 6px 20px rgba(70,90,70,.08)' }}>
              <div className="flex items-center gap-3.5">
                <span className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: c.tint, color: c.accent }}>{c.icon}</span>
                <div className="flex-1">
                  <div className="font-extrabold text-[15px]" style={{ color: '#33473b' }}>{c.name}</div>
                  <div className="text-[11.5px] font-bold" style={{ color: '#7b8a7c' }}>{v.toLocaleString()} / {c.goal.toLocaleString()} {c.unit}</div>
                </div>
                <button onClick={() => bump(c.id, c.step, c.goal)} className="w-9 h-9 rounded-full flex items-center justify-center text-white active:scale-90 transition-transform" style={{ background: c.accent }}>
                  <Plus size={17} />
                </button>
              </div>
              <div className="h-2 rounded-full mt-3.5 overflow-hidden" style={{ background: c.tint }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct * 100}%`, background: c.accent }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function You() {
  const { lock } = useApp();
  const rows = [
    { icon: <User size={18} />, label: 'Profile', val: 'Guest' },
    { icon: <Bell size={18} />, label: 'Reminders', val: '8:00 AM' },
    { icon: <Palette size={18} />, label: 'Theme', val: 'Garden light' },
  ];
  return (
    <div className="scroll-area pb-8">
      <Header title="You" />
      <div className="px-6 mt-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-extrabold text-2xl" style={{ background: 'linear-gradient(135deg,#4a7c59,#8fbf7f)' }}>G</div>
        <div className="font-extrabold text-[19px] mt-3" style={{ color: '#33473b' }}>Guest planner</div>
        <div className="text-[12.5px] font-bold" style={{ color: '#7b8a7c' }}>Your plans stay on this device</div>
      </div>
      <div className="px-6 mt-6">
        <div className="bg-white rounded-[24px] overflow-hidden" style={{ boxShadow: '0 6px 20px rgba(70,90,70,.08)' }}>
          {rows.map((r, i) => (
            <div key={i} className={`flex items-center gap-3.5 px-5 py-4 ${i ? 'border-t border-black/5' : ''}`}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#f0f3ec', color: '#4a7c59' }}>{r.icon}</span>
              <span className="font-extrabold text-[14.5px] flex-1" style={{ color: '#33473b' }}>{r.label}</span>
              <span className="text-[12px] font-bold" style={{ color: '#7b8a7c' }}>{r.val}</span>
            </div>
          ))}
        </div>
        <button onClick={lock} className="w-full mt-6 py-4 rounded-full font-extrabold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          style={{ background: '#33473b', boxShadow: '0 10px 24px rgba(51,71,59,.25)' }}>
          <Lock size={16} /> Lock DayBloom
        </button>
      </div>
    </div>
  );
}
