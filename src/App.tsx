import { AppProvider, useApp } from './lib/store';
import { Splash, Welcome, Login, Register, TrustedContact, PinSetup, Success } from './flows/onboarding';
import { PinGate } from './flows/PinGate';
import { MainApp } from './kardam/MainApp';
import { DuressApp } from './duress/DuressApp';

function Router() {
  const { flow } = useApp();
  return (
    <div className="app-canvas">
      {flow === 'splash' && <Splash />}
      {flow === 'welcome' && <Welcome />}
      {flow === 'login' && <Login />}
      {flow === 'register' && <Register />}
      {flow === 'trusted' && <TrustedContact />}
      {(flow === 'pinMain' || flow === 'pinMainConfirm' || flow === 'pinDuress' || flow === 'pinDuressConfirm') && <PinSetup key={flow} />}
      {flow === 'success' && <Success />}
      {flow === 'gate' && <PinGate />}
      {flow === 'main' && <MainApp />}
      {flow === 'duress' && <DuressApp />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
