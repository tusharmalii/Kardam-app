import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang } from './i18n';
import { sendTrustedContactAlert } from './alert';

export type Flow =
  | 'splash' | 'welcome' | 'login' | 'register' | 'trusted'
  | 'pinMain' | 'pinMainConfirm' | 'pinDuress' | 'pinDuressConfirm'
  | 'success' | 'gate' | 'main' | 'duress';

export interface TrustedContact { name: string; phone: string; relation: string }
export interface Profile {
  name: string; phone: string; password: string;
  trusted: TrustedContact | null;
  mainPin: string; duressPin: string;
  registered: boolean;
}
export interface JournalEntry {
  id: string; title: string; body: string; mood: string; createdAt: number; updatedAt: number;
}
export interface MoodLog { day: string; mood: string; ts: number }

interface Store {
  flow: Flow;
  go: (f: Flow) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  profile: Profile | null;
  saveProfile: (p: Partial<Profile>) => void;
  completeRegistration: (p: Profile) => void;
  unlock: (pin: string) => 'main' | 'duress' | 'wrong';
  lock: () => void;
  journal: JournalEntry[];
  addEntry: (e: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => JournalEntry;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  moods: MoodLog[];
  logMood: (mood: string) => void;
  todayMood: MoodLog | null;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);
const day = () => new Date().toISOString().slice(0, 10);
const ls = {
  get<T>(k: string, fb: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [flow, setFlow] = useState<Flow>('splash');
  const [lang, setLangState] = useState<Lang>(() => ls.get<Lang>('kardam.lang', 'en'));
  const [profile, setProfile] = useState<Profile | null>(() => ls.get<Profile | null>('kardam.profile', null));
  const [journal, setJournal] = useState<JournalEntry[]>(() => ls.get('kardam.journal', []));
  const [moods, setMoods] = useState<MoodLog[]>(() => ls.get('kardam.moods', []));

  useEffect(() => { ls.set('kardam.lang', lang); }, [lang]);
  useEffect(() => { if (profile) ls.set('kardam.profile', profile); }, [profile]);
  useEffect(() => { ls.set('kardam.journal', journal); }, [journal]);
  useEffect(() => { ls.set('kardam.moods', moods); }, [moods]);

  const go = useCallback((f: Flow) => setFlow(f), []);
  const setLang = useCallback((l: Lang) => setLangState(l), []);

  const saveProfile = useCallback((p: Partial<Profile>) => {
    setProfile(prev => ({ name: '', phone: '', password: '', trusted: null, mainPin: '', duressPin: '', registered: false, ...prev, ...p } as Profile));
  }, []);

  const completeRegistration = useCallback((p: Profile) => { setProfile({ ...p, registered: true }); }, []);

  const unlock = useCallback((pin: string): 'main' | 'duress' | 'wrong' => {
    if (!profile) return 'wrong';
    if (pin === profile.mainPin) { setFlow('main'); return 'main'; }
    if (pin === profile.duressPin) {
      // silently trigger trusted-contact alert (mock), never surfaced in UI
      sendTrustedContactAlert(profile.trusted?.name);
      setFlow('duress');
      return 'duress';
    }
    return 'wrong';
  }, [profile]);

  const lock = useCallback(() => setFlow('gate'), []);

  const addEntry = useCallback((e: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const entry: JournalEntry = { ...e, id: Math.random().toString(36).slice(2), createdAt: Date.now(), updatedAt: Date.now() };
    setJournal(prev => [entry, ...prev]);
    return entry;
  }, []);
  const updateEntry = useCallback((id: string, patch: Partial<JournalEntry>) => {
    setJournal(prev => prev.map(e => e.id === id ? { ...e, ...patch, updatedAt: Date.now() } : e));
  }, []);
  const deleteEntry = useCallback((id: string) => setJournal(prev => prev.filter(e => e.id !== id)), []);

  const logMood = useCallback((mood: string) => {
    setMoods(prev => [...prev.filter(m => m.day !== day()), { day: day(), mood, ts: Date.now() }]);
  }, []);
  const todayMood = useMemo(() => moods.find(m => m.day === day()) ?? null, [moods]);

  const resetAll = useCallback(() => {
    ['kardam.profile', 'kardam.journal', 'kardam.moods', 'kardam.alertLog'].forEach(k => localStorage.removeItem(k));
    setProfile(null); setJournal([]); setMoods([]); setFlow('welcome');
  }, []);

  const value = useMemo(() => ({
    flow, go, lang, setLang, profile, saveProfile, completeRegistration, unlock, lock,
    journal, addEntry, updateEntry, deleteEntry, moods, logMood, todayMood, resetAll,
  }), [flow, go, lang, setLang, profile, saveProfile, completeRegistration, unlock, lock,
       journal, addEntry, updateEntry, deleteEntry, moods, logMood, todayMood, resetAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useApp outside provider');
  return s;
}
