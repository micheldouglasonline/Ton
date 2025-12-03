import React, { useState } from 'react';
import { Terminal } from '../Terminal';
import { ArrowRight, CheckCircle, Info } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

export const TutorialScreen: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [terminalValue, setTerminalValue] = useState(0);

  const handleTerminalInput = (amount: number) => {
    setTerminalValue(amount);
    if (step === 1 && amount === 50) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Instruction Side */}
        <div className="space-y-8">
           <div className="flex items-center gap-3 mb-8">
              <div className="bg-ton p-3 rounded-xl text-white">
                 <Info size={24} />
              </div>
              <div>
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white">Tutorial Interativo</h1>
                 <p className="text-gray-500">Aprenda o básico em 2 minutos.</p>
              </div>
           </div>

           <div className={`
              transition-all duration-500 p-6 rounded-2xl border-l-4 
              ${step === 1 ? 'bg-white dark:bg-dark-surface border-ton shadow-lg scale-105' : 'bg-transparent border-gray-200 opacity-50'}
           `}>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Passo 1: Insira o Valor da Venda</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                 Use o teclado para digitar exatamente <span className="font-bold text-ton">50.00</span>. Isso representa uma venda padrão.
              </p>
              {step === 1 && <span className="text-xs font-bold text-ton bg-ton/10 px-2 py-1 rounded">Aguardando entrada...</span>}
              {step > 1 && <span className="flex items-center gap-1 text-green-600 font-bold"><CheckCircle size={16} /> Concluído</span>}
           </div>

           <div className={`
              transition-all duration-500 p-6 rounded-2xl border-l-4 
              ${step === 2 ? 'bg-white dark:bg-dark-surface border-ton shadow-lg scale-105' : 'bg-transparent border-gray-200 opacity-50'}
           `}>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Passo 2: Confirmação</h2>
              <p className="text-gray-600 dark:text-gray-400">
                 Ótimo! Você inseriu o valor. Em um cenário real, o cliente aproximaria o cartão agora.
              </p>
              {step === 2 && (
                 <button 
                    onClick={onComplete}
                    className="mt-4 bg-ton hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
                 >
                    Finalizar Tutorial <ArrowRight size={20} />
                 </button>
              )}
           </div>
        </div>

        {/* Interactive Side */}
        <div className="relative flex justify-center">
           {/* Background blob */}
           <div className="absolute inset-0 bg-ton/20 rounded-full blur-[80px] opacity-50 animate-pulse"></div>
           
           <div className="relative z-10 transform rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
              <Terminal 
                 onConfirm={handleTerminalInput} 
                 className="w-full max-w-sm"
              />
              {/* Floating Tooltip */}
              {step === 1 && (
                 <div className="absolute -right-8 top-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xl animate-bounce-short hidden lg:block">
                    Digite 50.00 aqui!
                    <div className="absolute top-1/2 -left-2 w-4 h-4 bg-black transform -translate-y-1/2 rotate-45"></div>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};