import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { Logo, TopBar, PinPad } from '../components/chrome';
import { ShieldCheck, Sparkles, HeartHandshake, Lock } from 'lucide-react';

/* ================= SPLASH ================= */
export function Splash() {
  const { go, profile } = useApp();
  useEffect(() => {
    const id = setTimeout(() => go(profile?.registered ? 'gate' : 'welcome'), 2100);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6" style={{ background: 'linear-gradient(160deg,#f7f4ee 0%,#ffe4cd 45%,#e9e4f6 100%)' }}>
      <div className="anim-logo"><Logo size={92} /></div>
      <div className="anim-rise text-center" style={{ animationDelay: '.35s' }}>
        <div className="font-display text-[34px] font-semibold tracking-tight">Kardam</div>
        <div className="text-soft font-bold text-sm mt-1">A calmer mind, every day</div>
      </div>
    </div>
  );
}

/* ================= WELCOME ================= */
export function Welcome() {
  const { go, lang } = useApp();
  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(170deg,#bbe9f2 0%,#f7f4ee 45%,#ffe4cd 100%)' }}>
      <TopBar showLang />
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
        <div className="anim-pop relative">
          <div className="absolute inset-0 rounded-full anim-ripple" style={{ background: 'rgba(255,255,255,.7)' }} />
          <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center relative" style={{ boxShadow: '0 20px 50px rgba(84,69,63,.18)' }}>
            <Logo size={72} />
          </div>
        </div>
        <h1 className="font-display text-[40px] leading-[1.08] font-semibold anim-rise" style={{ animationDelay: '.15s' }}>
          Start today,<br />feel lighter
        </h1>
        <p className="text-soft font-bold text-[15px] max-w-[260px] anim-rise" style={{ animationDelay: '.25s' }}>{t(lang, 'tagline')}. Private, warm, and made for you.</p>
      </div>
      <div className="px-6 pb-10 anim-rise" style={{ animationDelay: '.35s' }}>
        <button className="k-btn k-btn-dark" onClick={() => go('login')}>{t(lang, 'getStarted')}</button>
      </div>
    </div>
  );
}

/* ================= AUTH ================= */
function SocialButtons() {
  const { saveProfile, go } = useApp();
  const social = (via: string) => {
    saveProfile({ name: via === 'Google' ? 'Aarav Sharma' : 'Aarav S.', phone: '', password: '' });
    go('trusted');
  };
  return (
    <div className="flex justify-center gap-4">
      <button onClick={() => social('Google')} className="k-iconbtn !w-14 !h-14" aria-label="Google sign-in">
        <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.6z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5.1l-3.9 3C3.3 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.2 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3l-3.9-3C.5 8.3 0 10.1 0 12s.5 3.7 1.3 5.3l3.9-3z"/><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.7l3.9 3c1-2.9 3.7-5 6.8-5z"/></svg>
      </button>
      <button onClick={() => social('X')} className="k-iconbtn !w-14 !h-14" aria-label="X sign-in">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.2h3.7l-8.1 9.3L24 23.2h-7.5l-5.9-7.7-6.7 7.7H.2l8.7-9.9L0 1.2h7.7l5.3 7 5.9-7zm-1.3 19.7h2L6.6 3.3H4.4l13.2 17.6z"/></svg>
      </button>
    </div>
  );
}

export function Login() {
  const { go, lang, profile } = useApp();
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = () => {
    if (!phone.trim() || !pw) return setErr('Please enter your phone and password.');
    if (profile?.registered) {
      if (profile.phone === phone.trim() && profile.password === pw) { setErr(''); go('gate'); }
      else setErr('Details do not match our records.');
    } else setErr('No account found — please register first.');
  };
  return (
    <div className="flex-1 flex flex-col">
      <TopBar onBack={() => go('welcome')} />
      <div className="scroll-area px-7 pb-10">
        <div className="mt-4 mb-8 anim-rise">
          <h1 className="font-display text-[34px] font-semibold">{t(lang, 'welcomeBack')}</h1>
          <p className="text-soft font-bold mt-1">{t(lang, 'loginSub')}</p>
        </div>
        <div className="flex flex-col gap-3.5 anim-rise" style={{ animationDelay: '.1s' }}>
          <input className="k-input" placeholder={t(lang, 'phone')} inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="k-input" placeholder={t(lang, 'password')} type="password" value={pw} onChange={e => setPw(e.target.value)} />
          {err && <div className="text-[#c05a48] text-sm font-bold px-2">{err}</div>}
          <button className="self-end text-sm font-extrabold text-soft px-2" onClick={() => setErr('A reset link would be sent to your phone (demo).')}>{t(lang, 'forgot')}</button>
          <button className="k-btn k-btn-dark mt-1" onClick={submit}>{t(lang, 'login')}</button>
        </div>
        <div className="flex items-center gap-4 my-7">
          <div className="h-px flex-1 bg-black/10" /><span className="text-xs font-extrabold text-soft">{t(lang, 'orContinue')}</span><div className="h-px flex-1 bg-black/10" />
        </div>
        <SocialButtons />
        <button className="w-full text-center mt-8 text-sm font-bold text-soft" onClick={() => go('register')}>
          {t(lang, 'noAccount')} <span className="underline" style={{ color: 'var(--ink)' }}>{t(lang, 'register')}</span>
        </button>
      </div>
    </div>
  );
}

export function Register() {
  const { go, lang, saveProfile } = useApp();
  const [f, setF] = useState({ name: '', phone: '', pw: '', pw2: '' });
  const [err, setErr] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const submit = () => {
    if (!f.name.trim() || !f.phone.trim()) return setErr('Please fill in your name and phone.');
    if (f.pw.length < 4) return setErr('Password needs at least 4 characters.');
    if (f.pw !== f.pw2) return setErr('Passwords do not match.');
    saveProfile({ name: f.name.trim(), phone: f.phone.trim(), password: f.pw });
    go('trusted');
  };
  return (
    <div className="flex-1 flex flex-col">
      <TopBar onBack={() => go('login')} />
      <div className="scroll-area px-7 pb-10">
        <div className="mt-4 mb-8 anim-rise">
          <h1 className="font-display text-[34px] font-semibold">{t(lang, 'joinKardam')}</h1>
          <p className="text-soft font-bold mt-1">{t(lang, 'regSub')}</p>
        </div>
        <div className="flex flex-col gap-3.5 anim-rise" style={{ animationDelay: '.1s' }}>
          <input className="k-input" placeholder={t(lang, 'fullName')} value={f.name} onChange={set('name')} />
          <input className="k-input" placeholder={t(lang, 'phone')} inputMode="tel" value={f.phone} onChange={set('phone')} />
          <input className="k-input" placeholder={t(lang, 'password')} type="password" value={f.pw} onChange={set('pw')} />
          <input className="k-input" placeholder={t(lang, 'confirmPassword')} type="password" value={f.pw2} onChange={set('pw2')} />
          {err && <div className="text-[#c05a48] text-sm font-bold px-2">{err}</div>}
          <button className="k-btn k-btn-dark mt-1" onClick={submit}>{t(lang, 'createAccount')}</button>
        </div>
        <div className="flex items-center gap-4 my-7">
          <div className="h-px flex-1 bg-black/10" /><span className="text-xs font-extrabold text-soft">{t(lang, 'orContinue')}</span><div className="h-px flex-1 bg-black/10" />
        </div>
        <SocialButtons />
      </div>
    </div>
  );
}

/* ================= TRUSTED CONTACT ================= */
export function TrustedContact() {
  const { go, lang, saveProfile, profile } = useApp();
  const [f, setF] = useState({ name: '', phone: '', relation: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const done = () => {
    if (f.name.trim() && f.phone.trim()) saveProfile({ trusted: { name: f.name.trim(), phone: f.phone.trim(), relation: f.relation.trim() || 'Trusted person' } });
    go('pinMain');
  };
  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg,#ffd3e0 0%, var(--cream) 38%)' }}>
      <TopBar />
      <div className="scroll-area px-7 pb-10">
        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mt-4 mb-5 anim-pop" style={{ boxShadow: '0 8px 24px rgba(84,69,63,.12)' }}>
          <HeartHandshake size={30} strokeWidth={2} />
        </div>
        <h1 className="font-display text-[32px] font-semibold anim-rise">{t(lang, 'trustedTitle')}</h1>
        <p className="text-soft font-bold mt-2 mb-7 leading-relaxed anim-rise" style={{ animationDelay: '.1s' }}>{t(lang, 'trustedSub')}</p>
        <div className="flex flex-col gap-3.5 anim-rise" style={{ animationDelay: '.18s' }}>
          <input className="k-input" placeholder={t(lang, 'contactName')} value={f.name} onChange={set('name')} />
          <input className="k-input" placeholder={t(lang, 'phone')} inputMode="tel" value={f.phone} onChange={set('phone')} />
          <input className="k-input" placeholder={t(lang, 'relationPh')} value={f.relation} onChange={set('relation')} />
          <button className="k-btn k-btn-dark mt-2" onClick={done} disabled={!f.name.trim() || !f.phone.trim()} style={{ opacity: !f.name.trim() || !f.phone.trim() ? .45 : 1 }}>
            {t(lang, 'continue')}
          </button>
          <button className="text-sm font-extrabold text-soft py-2" onClick={() => go('pinMain')}>{t(lang, 'skip')}</button>
        </div>
        {profile?.name && <p className="text-xs font-bold text-soft mt-4 px-1">For {profile.name}'s safety circle.</p>}
      </div>
    </div>
  );
}

/* ================= PIN SETUP ================= */
export function PinSetup() {
  const { flow, go, lang, profile, saveProfile, completeRegistration } = useApp();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => { setPin(''); setErr(''); }, [flow]);

  const meta: Record<string, { title: string; sub: string; tint: string; icon: React.ReactNode }> = {
    pinMain: { title: t(lang, 'createMainPin'), sub: t(lang, 'mainPinSub'), tint: 'linear-gradient(180deg,#bbe9f2 0%, var(--cream) 40%)', icon: <Lock size={28} /> },
    pinMainConfirm: { title: t(lang, 'confirmMainPin'), sub: t(lang, 'mainPinConfirmSub'), tint: 'linear-gradient(180deg,#bbe9f2 0%, var(--cream) 40%)', icon: <Lock size={28} /> },
    pinDuress: { title: t(lang, 'createDuressPin'), sub: t(lang, 'duressPinSub'), tint: 'linear-gradient(180deg,#e9e4f6 0%, var(--cream) 40%)', icon: <ShieldCheck size={28} /> },
    pinDuressConfirm: { title: t(lang, 'confirmDuressPin'), sub: t(lang, 'duressPinConfirmSub'), tint: 'linear-gradient(180deg,#e9e4f6 0%, var(--cream) 40%)', icon: <ShieldCheck size={28} /> },
  };
  const m = meta[flow];

  useEffect(() => {
    if (pin.length !== 4 || !profile) return;
    const id = setTimeout(() => {
      if (flow === 'pinMain') { saveProfile({ mainPin: pin }); go('pinMainConfirm'); }
      else if (flow === 'pinMainConfirm') {
        if (pin === profile.mainPin) go('pinDuress');
        else { setErr(t(lang, 'pinsMismatch')); setPin(''); }
      } else if (flow === 'pinDuress') {
        if (pin === profile.mainPin) { setErr(t(lang, 'pinsDiffer')); setPin(''); return; }
        saveProfile({ duressPin: pin }); go('pinDuressConfirm');
      } else if (flow === 'pinDuressConfirm') {
        if (pin === profile.duressPin) { completeRegistration(profile); go('success'); }
        else { setErr(t(lang, 'pinsMismatch')); setPin(''); }
      }
    }, 260);
    return () => clearTimeout(id);
  }, [pin]);

  return (
    <div className="flex-1 flex flex-col" style={{ background: m.tint }}>
      <TopBar />
      <div className="flex-1 flex flex-col items-center px-7 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 anim-pop" style={{ boxShadow: '0 8px 22px rgba(84,69,63,.12)' }}>{m.icon}</div>
        <h1 className="font-display text-[27px] font-semibold text-center">{m.title}</h1>
        <p className="text-soft font-bold text-sm text-center mt-2 mb-8 max-w-[290px] leading-relaxed">{m.sub}</p>
        {err && <div className="text-[#c05a48] text-sm font-bold mb-3 anim-fade">{err}</div>}
        <PinPad value={pin} onChange={(v) => { setErr(''); setPin(v); }} error={!!err} />
      </div>
    </div>
  );
}

/* ================= SUCCESS ================= */
export function Success() {
  const { go, lang } = useApp();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ background: 'linear-gradient(170deg,#c9e7b5 0%, var(--cream) 55%)' }}>
      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center anim-pop mb-7" style={{ boxShadow: '0 16px 40px rgba(84,69,63,.16)' }}>
        <Sparkles size={40} style={{ color: 'var(--sage-deep)' }} />
      </div>
      <h1 className="font-display text-[36px] font-semibold anim-rise" style={{ animationDelay: '.15s' }}>{t(lang, 'allSet')}</h1>
      <p className="text-soft font-bold mt-3 max-w-[270px] leading-relaxed anim-rise" style={{ animationDelay: '.25s' }}>{t(lang, 'allSetSub')}</p>
      <div className="w-full mt-12 anim-rise" style={{ animationDelay: '.4s' }}>
        <button className="k-btn k-btn-dark" onClick={() => go('gate')}>{t(lang, 'continue')}</button>
      </div>
    </div>
  );
}
