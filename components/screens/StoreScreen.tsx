import React, { useState } from 'react';
import { UserState, Upgrade } from '../../types';
import { Zap, Layout, Tag, Box, ArrowLeft, Check, Loader2 } from 'lucide-react';

interface StoreScreenProps {
  user: UserState;
  onPurchase: (cost: number) => void;
  onBack: () => void;
}

const UPGRADES: Upgrade[] = [
  { id: 'u1', title: 'Processamento Rápido', description: 'Reduza o tempo de transação em 50%.', cost: 500, iconName: 'zap', purchased: false },
  { id: 'u2', title: 'Layout da Loja', description: 'Personalize seu tema visual.', cost: 800, iconName: 'layout', purchased: false },
  { id: 'u3', title: 'Gerenciador de Descontos', description: 'Crie cupons de fidelidade.', cost: 350, iconName: 'tag', purchased: true }, // Mock purchased
  { id: 'u4', title: 'Controle de Estoque', description: 'Reposição automática de itens populares.', cost: 1200, iconName: 'box', purchased: false },
];

export const StoreScreen: React.FC<StoreScreenProps> = ({ user, onPurchase, onBack }) => {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handlePurchase = (upgrade: Upgrade) => {
    if (user.balance < upgrade.cost) return;

    setPurchasingId(upgrade.id);

    // Simulate API/Processing delay
    setTimeout(() => {
      setPurchasingId(null);
      setSuccessId(upgrade.id);
      
      // Perform the actual transaction
      onPurchase(upgrade.cost);

      // Keep success state for a moment before reverting (or disabling in a real app)
      setTimeout(() => {
        setSuccessId(null);
      }, 2000);
    }, 800);
  };
  
  const getIcon = (name: string) => {
    switch (name) {
      case 'zap': return <Zap size={32} />;
      case 'layout': return <Layout size={32} />;
      case 'tag': return <Tag size={32} />;
      case 'box': return <Box size={32} />;
      default: return <Box size={32} />;
    }
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 bg-white dark:bg-dark-surface rounded-full shadow-sm lg:hidden hover:bg-gray-50 transition-colors">
                <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
             </button>
             <div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white">Loja de Melhorias</h1>
                <p className="text-gray-500 dark:text-gray-400">Invista no seu negócio.</p>
             </div>
          </div>
          <div className="bg-gray-900 dark:bg-black text-ton px-6 py-3 rounded-xl font-mono font-bold text-xl shadow-lg border border-gray-800 dark:border-gray-700 animate-pulse">
             {formatCurrency(user.balance)}
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {UPGRADES.map(upgrade => {
             const isPurchasing = purchasingId === upgrade.id;
             const isSuccess = successId === upgrade.id;
             // In a real app, we would check user.unlockedItems.includes(upgrade.id) instead of the static purchased prop
             const isPurchased = upgrade.purchased; 

             return (
                <div 
                    key={upgrade.id}
                    className={`
                       relative overflow-hidden rounded-2xl p-6 flex flex-col transition-all duration-300
                       ${isPurchased 
                          ? 'bg-gray-100 dark:bg-dark-surface opacity-70 cursor-default border border-transparent' 
                          : 'bg-white dark:bg-dark-surface shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100 dark:border-dark-border hover:border-ton/30'
                       }
                    `}
                 >
                    <div className={`
                       w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-colors duration-500
                       ${isPurchased ? 'bg-gray-400' : isSuccess ? 'bg-green-600 scale-110' : 'bg-ton'}
                    `}>
                       {isSuccess ? <Check size={32} className="animate-scale-check" /> : getIcon(upgrade.iconName)}
                    </div>
    
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">{upgrade.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow">{upgrade.description}</p>
    
                    <div className="mt-auto">
                       {isPurchased ? (
                          <button disabled className="w-full py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold flex items-center justify-center gap-2 cursor-default">
                             <Check size={18} /> Comprado
                          </button>
                       ) : (
                          <div className="flex items-center justify-between gap-3">
                             <span className="font-bold text-xl text-ton whitespace-nowrap">{formatCurrency(upgrade.cost)}</span>
                             <button 
                                onClick={() => handlePurchase(upgrade)}
                                disabled={user.balance < upgrade.cost || isPurchasing || isSuccess}
                                className={`
                                   flex-1 py-3 rounded-lg font-bold text-sm transition-all duration-300 relative overflow-hidden
                                   ${isSuccess 
                                      ? 'bg-green-600 text-white shadow-lg shadow-green-500/40' 
                                      : user.balance >= upgrade.cost 
                                         ? 'bg-ton text-white hover:bg-green-600 shadow-lg shadow-ton/30' 
                                         : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                   }
                                `}
                             >
                                {isPurchasing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                    </div>
                                ) : isSuccess ? (
                                    <div className="flex items-center justify-center gap-2 animate-scale-check">
                                        <Check size={18} strokeWidth={3} />
                                        <span>Feito!</span>
                                    </div>
                                ) : (
                                    'Comprar'
                                )}
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
             );
          })}
       </div>
    </div>
  );
};