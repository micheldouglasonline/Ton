import React from 'react';
import { UserState } from '../../types';
import { Play, TrendingUp, Users, ShoppingCart, Lock, CreditCard, History, Edit2 } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  user: UserState;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
  onPlay: () => void;
  onStore: () => void;
}

const mockChartData = [
  { name: 'Seg', sales: 400 },
  { name: 'Ter', sales: 300 },
  { name: 'Qua', sales: 600 },
  { name: 'Qui', sales: 800 },
  { name: 'Sex', sales: 500 },
  { name: 'Sáb', sales: 900 },
  { name: 'Dom', sales: 1200 },
];

const AFFILIATE_LINK = "https://ton.com.br/catalogo/?referrer=E5BC3242-005F-4294-B78A-44C0294A43C5&userAnticipation=0&utm_medium=invite_share&utm_source=revendedor";

export const DashboardScreen: React.FC<DashboardProps> = ({ user, setUser, onPlay, onStore }) => {
  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* Merchant Name Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
        <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Nome do Comerciante</label>
            <div className="flex items-center gap-2">
                <input 
                    type="text" 
                    value={user.merchantName}
                    onChange={(e) => setUser(prev => ({ ...prev, merchantName: e.target.value }))}
                    className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full placeholder-gray-400"
                    placeholder="Digite o nome da sua loja"
                />
                <Edit2 size={16} className="text-gray-400" />
            </div>
        </div>
        <a 
            href={AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-ton to-green-500 hover:from-green-500 hover:to-ton text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
        >
            <CreditCard size={18} />
            Obter maquininha física
        </a>
      </div>

      {/* Hero / Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main CTA Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-ton to-green-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
           <div className="relative z-10">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md">Nível {user.level}</span>
              <h1 className="text-3xl lg:text-5xl font-black mt-4 mb-2">Pronto para vender,<br/>{user.merchantName}?</h1>
              <p className="text-green-100 text-lg mb-8 max-w-md">Clientes estão esperando. Processe transações rapidamente para ganhar o máximo de XP.</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={onPlay}
                  className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-green-50 hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                  <Play fill="currentColor" size={20} />
                  Iniciar Turno
                </button>
              </div>
           </div>
           
           {/* Decorative Elements */}
           <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
              <ShoppingCart size={300} />
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
           {/* Balance Card */}
           <div className="bg-white dark:bg-dark-surface p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between h-full">
              <div>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">Saldo Total</p>
                 <h2 className="text-4xl font-black text-gray-900 dark:text-white">{formatCurrency(user.balance)}</h2>
                 <div className="flex items-center gap-1 text-green-500 text-sm font-bold mt-2">
                    <TrendingUp size={16} />
                    <span>+15% esta semana</span>
                 </div>
              </div>
              <div className="mt-6 h-32">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                       <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#00dd00" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#00dd00" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="sales" stroke="#00dd00" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

      </div>

      {/* Challenges Grid */}
      <div>
         <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Desafios Ativos</h2>
               <p className="text-gray-500 dark:text-gray-400">Complete-os para ganhar recompensas extras.</p>
            </div>
            <button className="text-ton font-bold hover:text-green-600">Ver Todos</button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <ChallengeCard 
               title="Corrida do Pequeno Negócio"
               desc="Atenda 10 clientes em 5 minutos."
               xp={500}
               difficulty="Fácil"
               color="bg-green-500"
               onClick={onPlay}
            />
            
            <ChallengeCard 
               title="Loucura das Vendas de Feriado"
               desc="Processe devoluções de alto valor e pedidos complexos."
               xp={1500}
               difficulty="Médio"
               color="bg-yellow-500"
               onClick={onPlay}
            />
            
            <div className="bg-gray-100 dark:bg-dark-surface/50 border border-gray-200 dark:border-dark-border p-6 rounded-2xl flex flex-col items-center justify-center text-center opacity-75">
               <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <Lock size={32} />
               </div>
               <h3 className="font-bold text-xl text-gray-500 dark:text-gray-400">Divisão de Conta</h3>
               <p className="text-gray-400 text-sm mt-2">Chegue ao Nível 20 para desbloquear</p>
            </div>

         </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-dark-surface rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-dark-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <History size={24} className="text-ton" />
                  Histórico de Transações
              </h2>
              <span className="text-sm text-gray-500">Recentes</span>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border">
                      <tr>
                          <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Cliente</th>
                          <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Data</th>
                          <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">Status</th>
                          <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-sm text-right">Valor</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                      {user.transactions.length > 0 ? (
                          user.transactions.map((tx) => (
                              <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                  <td className="px-6 py-4">
                                      <div className="font-bold text-gray-900 dark:text-white">{tx.customerName}</div>
                                      <div className="text-xs text-gray-500">ID: {tx.id.slice(0, 8)}</div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                      {formatDate(tx.date)}
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                          Concluído
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                                      {formatCurrency(tx.amount)}
                                  </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                  Nenhuma transação registrada ainda. Jogue o Modo Prático para começar!
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};

const ChallengeCard: React.FC<{ title: string, desc: string, xp: number, difficulty: string, color: string, onClick: () => void }> = ({ title, desc, xp, difficulty, color, onClick }) => (
   <button 
      onClick={onClick}
      className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border text-left hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
   >
      <div className="flex justify-between items-start mb-4">
         <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${color} bg-opacity-90`}>
            {difficulty}
         </div>
         <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <TrendingUp size={12} /> {xp} XP
         </span>
      </div>
      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-ton transition-colors">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
      <div className="mt-6 w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
         <div className={`h-full ${color} w-1/3 rounded-full`}></div>
      </div>
   </button>
);