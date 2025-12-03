import React from 'react';
import { Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center overflow-hidden">
      
      {/* Left Content */}
      <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
         <div className="inline-flex items-center gap-2 bg-ton/10 text-ton px-4 py-2 rounded-full font-bold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-ton animate-pulse"></span>
            Simulação Educacional
         </div>
         
         <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            Maximize Suas Vendas, <br/>
            <span className="text-ton relative">
               Domine o Terminal.
               <svg className="absolute w-full h-3 -bottom-1 left-0 text-ton opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
               </svg>
            </span>
         </h1>
         
         <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg leading-relaxed">
            Experimente a correria de gerenciar transações de alto volume. Aprenda as estratégias que os melhores comerciantes usam para aumentar a receita com o Ton.
         </p>
         
         <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button 
               onClick={onStart}
               className="bg-ton hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-ton/30"
            >
               <Play fill="currentColor" />
               Começar a Aprender
            </button>
            <button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
               Como Funciona
            </button>
         </div>
      </div>

      {/* Right Visuals */}
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen bg-ton/5 dark:bg-ton/5 relative flex items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-dark-bg lg:w-24"></div>
         
         {/* Floating Elements */}
         <div className="relative w-3/4 max-w-md animate-float">
            {/* Main Terminal Image Placeholder - CSS shape since we don't have the exact image asset, but we can make a cool CSS device */}
            <div className="bg-gray-900 rounded-[3rem] p-6 shadow-2xl border-8 border-gray-800 relative z-10 transform -rotate-6">
                <div className="bg-white dark:bg-gray-800 rounded-3xl h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="w-20 h-20 bg-ton rounded-full flex items-center justify-center text-white font-black text-4xl mb-4">
                        t
                    </div>
                    <h2 className="text-2xl font-bold dark:text-white">Ton Master</h2>
                    <p className="text-gray-500 mt-2">Pronto para usar</p>
                    
                    {/* Simulated screen glare */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Floating Stats Cards */}
            <div className="absolute top-10 -right-12 bg-white dark:bg-dark-surface p-4 rounded-2xl shadow-xl animate-bounce-short" style={{ animationDuration: '3s' }}>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">R$</div>
                  <div>
                     <p className="text-xs text-gray-500">Vendas Diárias</p>
                     <p className="font-bold text-lg dark:text-white">R$ 1.250</p>
                  </div>
               </div>
            </div>

            <div className="absolute bottom-20 -left-8 bg-ton text-white p-4 rounded-2xl shadow-xl shadow-ton/30 transform rotate-3">
                <p className="font-bold text-lg">App #1</p>
                <p className="text-sm opacity-90">Para lojistas</p>
            </div>
         </div>
      </div>

    </div>
  );
};