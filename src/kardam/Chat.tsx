import { useEffect, useRef, useState } from 'react';
import { useApp } from '../lib/store';
import { t } from '../lib/i18n';
import { ChevronLeft, Plus, Mic, SendHorizonal, HeartPulse, Moon, Footprints, Flame } from 'lucide-react';

interface Msg { id: string; from: 'me' | 'ai'; text: string }

function replyFor(text: string, lang: 'en' | 'hi' | 'hg', name: string): string {
  const s = text.toLowerCase();
  const hi = lang === 'hi', hg = lang === 'hg';
  if (/\b(sad|depress|down|cry|dukhi|udaas)\b/.test(s))
    return hi ? `मुझे खेद है कि आप ऐसा महसूस कर रहे हैं, ${name}। यह भावना वास्तविक है और इसे महसूस करना ठीक है। क्या आप बता सकते हैं कि क्या हुआ?`
      : hg ? `Sorry you're feeling this, ${name}. Ye feeling real hai, aur feel karna theek hai. Kya hua, batana chahenge?`
      : `I'm sorry you're feeling this, ${name}. What you're feeling is real, and it's okay to feel it. Would you like to tell me what happened?`;
  if (/\b(exam|study|marks|result|padhai|paper)\b/.test(s))
    return hi ? 'परीक्षा का दबाव बहुत असली होता है। चलिए इसे छोटे हिस्सों में बाँटते हैं — अभी सबसे ज़्यादा चिंता किस विषय की है?'
      : hg ? 'Exam ka pressure bilkul real hai. Chalo ise chhote parts mein baant te hain — abhi sabse zyada tension kis subject ki hai?'
      : 'Exam pressure is genuinely heavy. Let’s break it into smaller pieces — which subject is weighing on you the most right now?';
  if (/\b(sleep|neend|insomnia|tired|thak)\b/.test(s))
    return hi ? 'नींद और मन गहराई से जुड़े हैं। आज रात सोने से 30 मिनट पहले स्क्रीन दूर रखकर 4-7-8 श्वास आज़माएँ — Exercises में है।'
      : hg ? 'Neend aur mann deeply connected hain. Aaj raat sone se 30 min pehle screen door rakho aur 4-7-8 breathing try karo — Exercises mein hai.'
      : 'Sleep and the mind are deeply linked. Tonight, try putting screens away 30 minutes before bed and doing the 4-7-8 breath — it’s in Exercises.';
  if (/\b(anxious|anxiety|panic|ghabra|dar|scared|fear)\b/.test(s))
    return hi ? 'चलिए एक साथ धीमी साँस लेते हैं। 4 गिनती में साँस अंदर… रोकें… और 6 में बाहर। आप सुरक्षित हैं।'
      : hg ? 'Chalo saath mein ek dheemi saans lete hain. 4 count mein saans andar… hold… aur 6 mein bahar. Aap safe ho.'
      : 'Let’s take one slow breath together. In for 4… hold… and out for 6. You are safe right now.';
  if (/\b(hi|hello|hey|namaste)\b/.test(s))
    return hi ? `नमस्ते ${name}! मैं यहाँ हूँ। आज आपका मन कैसा है?`
      : hg ? `Hey ${name}! Main yahan hoon. Aaj mann kaisa hai?`
      : `Hi ${name}! I'm here. How is your mind today?`;
  return hi ? 'मैं सुन रहा हूँ। थोड़ा और बताइए — मैं आपके साथ हूँ।'
    : hg ? 'Main sun raha hoon. Thoda aur batao — main aapke saath hoon.'
    : 'I’m listening. Tell me a little more — I’m right here with you.';
}

const QUICK = [
  { icon: <HeartPulse size={16} />, label: 'Heart check' },
  { icon: <Footprints size={16} />, label: 'Daily steps' },
  { icon: <Moon size={16} />, label: 'Sleep log' },
  { icon: <Flame size={16} />, label: 'Streak' },
];

export function Chat({ onClose }: { onClose: () => void }) {
  const { lang, profile } = useApp();
  const name = profile?.name?.split(' ')[0] || 'friend';
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: '0', from: 'ai', text: lang === 'hi' ? `नमस्ते ${name}! आज मन कैसा है?` : lang === 'hg' ? `Hi ${name}! Aaj mann kaisa lag raha hai?` : `Hi ${name}! How are you feeling today?` },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMsgs(m => [...m, { id: Math.random().toString(36).slice(2), from: 'me', text: clean }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { id: Math.random().toString(36).slice(2), from: 'ai', text: replyFor(clean, lang, name) }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col anim-fade" style={{ background: 'linear-gradient(180deg, var(--lav-soft) 0%, var(--cream) 42%)' }}>
      {/* header */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-3 shrink-0">
        <button onClick={onClose} className="k-iconbtn"><ChevronLeft size={20} /></button>
        <div className="flex-1">
          <div className="font-extrabold text-[16px]">{t(lang, 'chatTitle')}</div>
          <div className="text-[11.5px] font-bold flex items-center gap-1.5" style={{ color: 'var(--sage-deep)' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--sage-deep)' }} /> {t(lang, 'online')}
          </div>
        </div>
      </div>

      {/* hero */}
      <div className="flex flex-col items-center pt-2 pb-4 shrink-0">
        <div className="w-20 h-20 rounded-[28px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#BBE9F2,#BAAADB)', boxShadow: '0 14px 34px rgba(122,110,160,.35)' }}>
          <svg width="40" height="40" viewBox="0 0 40 40"><rect x="4" y="6" width="32" height="26" rx="12" fill="#3B3430"/><circle cx="15" cy="19" r="2.6" fill="#BBE9F2"/><circle cx="25" cy="19" r="2.6" fill="#BBE9F2"/><path d="M14 36l2-4h8l2 4" stroke="#3B3430" strokeWidth="3" strokeLinejoin="round"/></svg>
        </div>
        <div className="font-extrabold text-[18px] mt-3">{lang === 'hi' ? `नमस्ते ${name}!` : `Hi ${name}!`}</div>
        <div className="text-[12.5px] font-bold text-soft">{t(lang, 'chatSub')}</div>
      </div>

      {/* messages */}
      <div className="scroll-area px-5 flex flex-col gap-2.5 pb-3">
        {msgs.map(m => (
          <div key={m.id} className={`max-w-[78%] px-4 py-3 text-[14px] font-semibold leading-snug anim-rise ${m.from === 'me' ? 'bubble-me self-end' : 'bubble-ai self-start'}`}>
            {m.text}
          </div>
        ))}
        {typing && (
          <div className="bubble-ai self-start px-5 py-3.5 flex gap-1.5">
            {[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-black/30 typing-dot" style={{ animationDelay: `${i * .18}s` }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* quick topics */}
      <div className="flex gap-2 px-5 pb-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
        {QUICK.map(q => (
          <button key={q.label} onClick={() => send(q.label)} className="k-chip bg-white shrink-0 active:scale-95 transition-transform" style={{ boxShadow: '0 3px 10px rgba(84,69,63,.08)' }}>
            {q.icon}{q.label}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="px-5 pb-6 pt-1 shrink-0">
        <div className="k-card-flat !rounded-full flex items-center gap-1.5 p-1.5 pl-2">
          <button className="k-iconbtn !w-10 !h-10 !shadow-none !bg-transparent"><Plus size={19} /></button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder={t(lang, 'chatPlaceholder')} className="flex-1 bg-transparent outline-none font-semibold text-[14px] placeholder:text-black/30" />
          <button className="k-iconbtn !w-10 !h-10 !shadow-none !bg-transparent" onClick={() => send(lang === 'hi' ? '(वॉइस नोट)' : '(voice note)')}><Mic size={18} /></button>
          <button onClick={() => send(input)} className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 active:scale-90 transition-transform" style={{ background: 'var(--ink)' }}>
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
