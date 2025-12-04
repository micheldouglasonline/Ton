import React, { useState, useEffect } from 'react';
import { Terminal } from '../Terminal';
import { Customer, Product, UserState } from '../../types';
import { generateCustomerScenario } from '../../services/gemini';
import { ArrowLeft, ShoppingBag, CheckCircle, XCircle, TrendingUp, DollarSign } from 'lucide-react';

interface GameScreenProps {
  user: UserState;
  onExit: () => void;
  onWin: (reward: { money: number; xp: number }, customerName: string, totalAmount: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ user, onExit, onWin }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState("");
  
  // Animation states
  const [isShaking, setIsShaking] = useState(false);
  const [rewards, setRewards] = useState<{ money: number, xp: number } | null>(null);

  const loadNewCustomer = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedItems([]);
    setMessage("");
    // Difficulty scales with level slightly
    const difficulty = user.level < 5 ? 'Easy' : user.level < 15 ? 'Medium' : 'Hard';
    const newCustomer = await generateCustomerScenario(difficulty);
    setCustomer(newCustomer);
    setLoading(false);
  };

  useEffect(() => {
    loadNewCustomer();
  }, []);

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleTerminalInput = (amount: number) => {
    if (!customer) return;

    // Logic: The user must select the items the customer wants, THEN charge the correct amount.
    const correctTotal = customer.desiredItems.reduce((sum, i) => sum + i.price, 0);
    const tolerance = 0.01;

    if (Math.abs(amount - correctTotal) < tolerance) {
      // Success
      setFeedback('success');
      setMessage(`Ótimo trabalho! Pagamento de ${formatCurrency(amount)} aprovado.`);
      
      const rewardMoney = amount * 0.2;
      const rewardXP = 50;

      // Trigger Animations
      setRewards({ money: rewardMoney, xp: rewardXP });
      
      // Passing customer name and total amount back to App for history
      onWin({ money: rewardMoney, xp: rewardXP }, customer.name, amount); 
      
      setTimeout(() => {
        setRewards(null);
        loadNewCustomer();
      }, 2500);
    } else {
      // Failure
      setFeedback('error');
      setMessage(`Pagamento falhou! Esperado ${formatCurrency(correctTotal)}, mas recebido ${formatCurrency(amount)}.`);
      
      // Trigger Shake
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const toggleItem = (item: Product) => {
    if (selectedItems.find(i => i.id === item.id)) {
      setSelectedItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-12 h-12 border-4 border-ton border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 animate-pulse">Aguardando cliente...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto relative">
      {/* Rewards Overlay Animation */}
      {rewards && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center lg:justify-end lg:pr-32 pb-20">
           <div className="flex flex-col gap-4 animate-float-up">
              <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl border-4 border-green-400">
                 <DollarSign size={32} strokeWidth={3} />
                 <span className="text-4xl font-black">+{formatCurrency(rewards.money)}</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-6 py-3 rounded-2xl shadow-xl border-4 border-yellow-300">
                 <TrendingUp size={32} strokeWidth={3} />
                 <span className="text-4xl font-black">+{rewards.xp} XP</span>
              </div>
           </div>
        </div>
      )}

      {/* Header Mobile */}
      <div className="lg:hidden flex justify-between items-center mb-4">
         <button onClick={onExit} className="flex items-center text-gray-600"><ArrowLeft size={20} className="mr-1" /> Sair</button>
      </div>

      {/* Left Column: Context (Customer & Items) */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Customer Card */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden">
           <div className="flex items-start gap-4 z-10 relative">
              <div className="relative">
                 <img 
                    src={customer?.avatar} 
                    alt={customer?.name} 
                    className="w-20 h-20 rounded-full border-4 border-ton shadow-md object-cover"
                 />
                 <div className="absolute -bottom-2 -right-2 bg-ton text-white text-xs font-bold px-2 py-1 rounded-full">
                    NOVO
                 </div>
              </div>
              <div className="flex-1">
                 <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{customer?.name}</h2>
                 <div className="mt-2 bg-ton-bg dark:bg-ton/10 p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl inline-block max-w-md">
                    <p className="text-gray-700 dark:text-gray-200 italic">"{customer?.dialogue}"</p>
                 </div>
              </div>
           </div>
           {/* Decorative bg blob */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-ton/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        </div>

        {/* Product Selection Grid */}
        <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex-1">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                 <ShoppingBag className="text-ton" size={20} />
                 Produtos Disponíveis
              </h3>
              <span className="text-sm text-gray-500">Toque para adicionar</span>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[400px]">
              {customer?.desiredItems.map((item) => {
                 const isSelected = selectedItems.some(i => i.id === item.id);
                 return (
                    <button 
                       key={item.id}
                       onClick={() => toggleItem(item)}
                       className={`
                          p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center group
                          ${isSelected 
                            ? 'border-ton bg-ton-bg dark:bg-ton/20 ring-2 ring-ton/20' 
                            : 'border-gray-100 dark:border-dark-border hover:border-ton/50 dark:hover:border-ton/50'
                          }
                       `}
                    >
                       <div>
                          <p className={`font-bold ${isSelected ? 'text-ton-dark' : 'text-gray-800 dark:text-gray-200'}`}>{item.name}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                       </div>
                       <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-ton border-ton' : 'border-gray-300'}
                       `}>
                          {isSelected && <CheckCircle size={14} className="text-white" />}
                       </div>
                    </button>
                 )
              })}
           </div>

           <div className="mt-6 pt-4 border-t border-gray-100 dark:border-dark-border flex justify-between items-end">
              <div className="text-sm text-gray-500">Total Selecionado</div>
              <div className="text-3xl font-black text-gray-800 dark:text-white">{formatCurrency(totalAmount)}</div>
           </div>
        </div>

      </div>

      {/* Right Column: Terminal */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center relative">
          
          <div className="mb-4 flex justify-between items-center h-10">
             <div className="lg:hidden"></div>
             {feedback && (
                <div className={`
                   flex items-center gap-2 px-4 py-2 rounded-lg font-bold animate-bounce-short shadow-lg mx-auto
                   ${feedback === 'success' ? 'bg-ton text-white' : 'bg-red-500 text-white'}
                `}>
                   {feedback === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                   {feedback === 'success' ? 'Pagamento Aprovado!' : 'Recusado'}
                </div>
             )}
          </div>

          <div className={`${isShaking ? 'animate-shake' : ''} transition-transform`}>
            <Terminal 
               onConfirm={handleTerminalInput} 
               expectedAmount={totalAmount}
               className="w-full max-w-sm mx-auto"
            />
          </div>

          <p className="text-center text-gray-400 mt-6 text-sm">
             Digite o valor total mostrado no carrinho e pressione <span className="font-bold text-ton">Confirmar</span>.
          </p>

          <div className="absolute top-0 right-0 hidden lg:block">
              <button 
                onClick={onExit}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-dark-surface text-gray-600 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                  Sair do Jogo
              </button>
          </div>
      </div>

    </div>
  );
};