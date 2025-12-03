import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  LayoutDashboard, 
  Gamepad2, 
  Store, 
  User, 
  Menu, 
  X, 
  Moon, 
  Sun,
  CreditCard,
  MessageCircle,
  Instagram
} from 'lucide-react';
import { GameScreen } from './components/screens/GameScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { StoreScreen } from './components/screens/StoreScreen';
import { TutorialScreen } from './components/screens/TutorialScreen';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { UserState, Transaction } from './types';

// Types
export enum Screen {
  WELCOME = 'WELCOME',
  TUTORIAL = 'TUTORIAL',
  DASHBOARD = 'DASHBOARD',
  GAME = 'GAME',
  STORE = 'STORE',
  LEADERBOARD = 'LEADERBOARD',
  PROFILE = 'PROFILE'
}

const AFFILIATE_LINK = "https://ton.com.br/catalogo/?referrer=E5BC3242-005F-4294-B78A-44C0294A43C5&userAnticipation=0&utm_medium=invite_share&utm_source=revendedor";
const WHATSAPP_LINK = "https://wa.me/5511951070457?text=Olá,%20gostaria%20de%20solicitar%20a%20maquininha%20Ton!";

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global User State
  const [userState, setUserState] = useState<UserState>({
    merchantName: "Michel Douglas Online",
    balance: 1250.75,
    xp: 2500,
    level: 15,
    completedTutorial: false,
    unlockedItems: ['basic_terminal'],
    transactions: [
      { id: 'tx1', customerName: 'João Silva', amount: 45.90, date: new Date(Date.now() - 3600000).toISOString(), status: 'completed' },
      { id: 'tx2', customerName: 'Ana Clara', amount: 120.00, date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' },
      { id: 'tx3', customerName: 'Roberto Dias', amount: 15.50, date: new Date(Date.now() - 172800000).toISOString(), status: 'completed' },
    ]
  });

  // Effect for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsSidebarOpen(false); // Close sidebar on mobile nav
  };

  const handleGameWin = (reward: { money: number; xp: number }, customerName: string, totalAmount: number) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      customerName: customerName,
      amount: totalAmount,
      date: new Date().toISOString(),
      status: 'completed'
    };

    setUserState(prev => ({
      ...prev,
      balance: prev.balance + reward.money,
      xp: prev.xp + reward.xp,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME:
        return <WelcomeScreen onStart={() => navigateTo(userState.completedTutorial ? Screen.DASHBOARD : Screen.TUTORIAL)} />;
      case Screen.TUTORIAL:
        return <TutorialScreen onComplete={() => {
          setUserState(prev => ({ ...prev, completedTutorial: true }));
          navigateTo(Screen.DASHBOARD);
        }} />;
      case Screen.DASHBOARD:
        return <DashboardScreen 
          user={userState} 
          setUser={setUserState}
          onPlay={() => navigateTo(Screen.GAME)} 
          onStore={() => navigateTo(Screen.STORE)}
        />;
      case Screen.GAME:
        return <GameScreen 
          user={userState} 
          onExit={() => navigateTo(Screen.DASHBOARD)}
          onWin={handleGameWin}
        />;
      case Screen.STORE:
        return <StoreScreen 
          user={userState} 
          onPurchase={(cost) => setUserState(prev => ({ ...prev, balance: prev.balance - cost }))}
          onBack={() => navigateTo(Screen.DASHBOARD)} 
        />;
      default:
        return <DashboardScreen user={userState} setUser={setUserState} onPlay={() => navigateTo(Screen.GAME)} onStore={() => navigateTo(Screen.STORE)} />;
    }
  };

  // If welcome screen, don't show the app shell
  if (currentScreen === Screen.WELCOME) {
    return (
      <div className="min-h-screen bg-ton-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
         <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-md hover:scale-105 transition-transform"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-ton" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        {renderScreen()}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-dark-bg overflow-hidden text-gray-900 dark:text-gray-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ton flex items-center justify-center text-white font-bold text-xl">
              t
            </div>
            <span className="text-xl font-black text-gray-800 dark:text-white tracking-tight leading-none">ton<span className="text-ton">master</span></span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Painel" 
            isActive={currentScreen === Screen.DASHBOARD} 
            onClick={() => navigateTo(Screen.DASHBOARD)} 
          />
          <NavItem 
            icon={<Gamepad2 size={20} />} 
            label="Modo Prático" 
            isActive={currentScreen === Screen.GAME} 
            onClick={() => navigateTo(Screen.GAME)} 
          />
          <NavItem 
            icon={<Store size={20} />} 
            label="Loja de Melhorias" 
            isActive={currentScreen === Screen.STORE} 
            onClick={() => navigateTo(Screen.STORE)} 
          />
          <NavItem 
            icon={<Trophy size={20} />} 
            label="Ranking" 
            isActive={currentScreen === Screen.LEADERBOARD} 
            onClick={() => navigateTo(Screen.LEADERBOARD)} 
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Perfil" 
            isActive={currentScreen === Screen.PROFILE} 
            onClick={() => navigateTo(Screen.PROFILE)} 
          />
        </nav>

        <div className="p-4">
           <a 
            href={AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-ton hover:bg-green-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-ton/20 transition-all hover:scale-105 mb-4 text-sm text-center"
           >
            <CreditCard size={18} />
            Obter maquininha
           </a>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ton to-green-300 flex items-center justify-center text-white font-bold text-lg">
                {userState.merchantName.charAt(0)}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold truncate dark:text-white">{userState.merchantName}</p>
               <p className="text-xs text-gray-500 dark:text-gray-400">Nível {userState.level}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border flex items-center justify-between px-6 shrink-0 lg:hidden">
           <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
             <Menu size={24} />
           </button>
           <span className="font-bold text-lg dark:text-white">Ton Master</span>
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
           >
             {isDarkMode ? <Sun className="w-5 h-5 text-ton" /> : <Moon className="w-5 h-5" />}
           </button>
        </header>

        <div className="absolute top-4 right-6 hidden lg:block z-10">
           <button 
             onClick={() => setIsDarkMode(!isDarkMode)}
             className="p-2 rounded-full bg-white dark:bg-dark-surface shadow-sm border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
           >
             {isDarkMode ? <Sun className="w-5 h-5 text-ton" /> : <Moon className="w-5 h-5 text-gray-600" />}
           </button>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8 relative">
           {renderScreen()}
           
           {/* Enhanced Footer */}
           <footer className="mt-12 pt-8 pb-20 lg:pb-8 border-t border-gray-100 dark:border-dark-border flex flex-col items-center justify-center text-center gap-4 text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm">Créditos: <strong className="text-gray-700 dark:text-gray-300">Michel Douglas Online</strong></p>
                <div className="flex items-center gap-2 text-sm font-medium text-ton hover:text-green-600 transition-colors">
                  <Instagram size={16} />
                  <span>@micheldouglasonline</span>
                </div>
              </div>
              <a 
                href={AFFILIATE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs hover:text-ton underline transition-colors"
              >
                Obter maquininha física com desconto
              </a>
           </footer>
        </div>
        
        {/* Floating WhatsApp Button */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none sm:pointer-events-auto">
           {/* Tooltip / Call to Action */}
           <div className="bg-white dark:bg-dark-surface px-4 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-dark-border animate-bounce-short pointer-events-auto relative mb-1 mr-1">
              <span className="text-sm font-bold text-gray-800 dark:text-white">Solicite a maquininha agora!</span>
              {/* Little triangle arrow pointing down */}
              <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white dark:bg-dark-surface transform rotate-45 border-r border-b border-gray-100 dark:border-dark-border"></div>
           </div>
           
           {/* Button */}
           <a 
             href={WHATSAPP_LINK}
             target="_blank"
             rel="noopener noreferrer"
             className="bg-[#25D366] hover:bg-[#20b85c] text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-transform hover:scale-110 flex items-center justify-center pointer-events-auto"
           >
              <MessageCircle size={28} fill="white" />
           </a>
        </div>

      </main>
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${isActive 
        ? 'bg-ton/10 text-ton dark:bg-ton/20' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
      }
    `}
  >
    <span className={`transition-colors ${isActive ? 'text-ton' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
      {icon}
    </span>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

export default App;