import { useState } from 'react';
import { MainNav, type MainTab } from '../components/chrome';
import { Home } from './Home';
import { Exercises } from './Exercises';
import { SelfCare } from './SelfCare';
import { Therapy } from './Therapy';
import { MySpace } from './MySpace';
import { Chat } from './Chat';
import { MessageCircleHeart } from 'lucide-react';

export function MainApp() {
  const [tab, setTab] = useState<MainTab>('home');
  const [chat, setChat] = useState(false);
  const openChat = () => setChat(true);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden" key={tab}>
        {tab === 'home' && <Home goTab={setTab} openChat={openChat} />}
        {tab === 'exercises' && <Exercises />}
        {tab === 'selfcare' && <SelfCare openChat={openChat} />}
        {tab === 'therapy' && <Therapy openChat={openChat} />}
        {tab === 'space' && <MySpace />}
      </div>

      {/* floating chat (hidden in My Space so the journal stays distraction-free) */}
      {!chat && tab !== 'space' && (
        <button onClick={openChat} aria-label="chat"
          className="absolute right-5 bottom-[104px] w-[58px] h-[58px] rounded-full flex items-center justify-center text-white anim-pop z-20"
          style={{ background: 'linear-gradient(135deg,#BAAADB,#7FAE6D)', boxShadow: '0 14px 30px rgba(122,110,160,.45)' }}>
          <MessageCircleHeart size={26} />
        </button>
      )}

      <MainNav tab={tab} setTab={setTab} />
      {chat && <Chat onClose={() => setChat(false)} />}
    </div>
  );
}
