import { useEffect, useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { Logo, PinPad, LangMenu } from '../components/chrome';

export function PinGate() {
  const { unlock, lang, profile, go } = useApp();
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (pin.length !== 4) return;
    const id = setTimeout(() => {
      const res = unlock(pin);
      if (res === 'wrong') { setErr(t(lang, 'wrongPin')); setPin(''); }
    }, 300);
    return () => clearTimeout(id);
  }, [pin]);

  return (
    <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(175deg,#f7f4ee 0%,#ffe4cd 55%,#ffd3e0 100%)' }}>
      <div className="flex justify-end px-5 pt-5"><LangMenu light /></div>
      <div className="flex-1 flex flex-col items-center justify-center px-7">
        <div className="anim-pop mb-6"><Logo size={64} /></div>
        <h1 className="font-display text-[30px] font-semibold">{t(lang, 'enterPin')}</h1>
        <p className="text-soft font-bold text-sm mt-1.5 mb-9">
          {profile?.name ? `${profile.name.split(' ')[0]}, ` : ''}{t(lang, 'pinSub')}
        </p>
        {err && <div className="text-[#c05a48] text-sm font-bold mb-4 anim-fade">{err}</div>}
        <PinPad value={pin} onChange={(v) => { setErr(''); setPin(v); }} error={!!err} />
      </div>
      {!profile?.registered && (
        <button className="pb-8 text-sm font-extrabold text-soft" onClick={() => go('welcome')}>← {t(lang, 'back')}</button>
      )}
    </div>
  );
}
