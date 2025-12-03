import React, { useState } from 'react';
import { Delete, Check, Wifi, Battery, Signal } from 'lucide-react';

interface TerminalProps {
  onConfirm: (amount: number) => void;
  expectedAmount?: number;
  className?: string;
}

export const Terminal: React.FC<TerminalProps> = ({ onConfirm, expectedAmount, className }) => {
  const [input, setInput] = useState("0");

  const handlePress = (key: string) => {
    if (key === 'backspace') {
      setInput(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
    } else if (key === '.') {
      if (!input.includes('.')) setInput(prev => prev + '.');
    } else {
      setInput(prev => prev === "0" ? key : prev + key);
    }
  };

  const handleConfirm = () => {
    onConfirm(parseFloat(input));
    setInput("0"); // Reset after confirm
  };

  return (
    <div className={`relative ${className}`}>
        {/* The Device Body */}
        <div className="bg-ton rounded-[2rem] p-4 shadow-2xl transform transition-transform hover:scale-[1.01] duration-300 relative overflow-hidden">
             
             {/* Screen Area */}
             <div className="bg-gray-900 rounded-xl p-4 mb-4 relative min-h-[160px] flex flex-col justify-between">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-gray-400 text-xs">
                    <div className="flex gap-1">
                        <Signal size={14} />
                        <Wifi size={14} />
                    </div>
                    <span>12:45</span>
                    <Battery size={14} />
                </div>

                {/* Main Display */}
                <div className="text-right mt-4">
                    <p className="text-gray-400 text-sm font-medium">Valor</p>
                    <div className="text-white text-4xl font-mono font-bold tracking-tight">
                        <span className="text-ton mr-1">R$</span>
                        {input.replace('.', ',')}
                    </div>
                </div>

                 {/* NFC Icon / Brand */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
                     <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center">
                         <Wifi size={32} className="text-white rotate-90" />
                     </div>
                 </div>
             </div>

             {/* Keypad */}
             <div className="grid grid-cols-4 gap-2">
                 {[1, 2, 3].map(n => (
                     <KeyBtn key={n} onClick={() => handlePress(n.toString())}>{n}</KeyBtn>
                 ))}
                 <button 
                    onClick={() => handlePress('backspace')}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-xl h-14 flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                 >
                     <Delete size={20} />
                 </button>

                 {[4, 5, 6].map(n => (
                     <KeyBtn key={n} onClick={() => handlePress(n.toString())}>{n}</KeyBtn>
                 ))}
                 <button 
                    onClick={() => handlePress('.')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold text-xl h-14 flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                 >
                     ,
                 </button>

                 {[7, 8, 9].map(n => (
                     <KeyBtn key={n} onClick={() => handlePress(n.toString())}>{n}</KeyBtn>
                 ))}
                 
                 <div className="row-span-2">
                    <button 
                        onClick={handleConfirm}
                        className="h-full w-full bg-ton-dark hover:bg-green-700 text-white rounded-lg font-bold text-xl flex flex-col items-center justify-center transition-colors active:scale-95 shadow-sm"
                    >
                        <Check size={28} />
                    </button>
                 </div>

                 <div className="col-span-2">
                    <KeyBtn onClick={() => handlePress('0')}>0</KeyBtn>
                 </div>
                 <div className="col-span-1">
                     <KeyBtn onClick={() => handlePress('00')}>00</KeyBtn>
                 </div>
             </div>
        </div>
        
        {/* Receipt Slot (Visual Only) */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-gray-800 rounded-t-lg opacity-80 -z-10"></div>
    </div>
  );
};

const KeyBtn: React.FC<{ children: React.ReactNode, onClick: () => void, className?: string }> = ({ children, onClick, className }) => (
    <button 
        onClick={onClick}
        className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg font-bold text-xl h-14 flex items-center justify-center transition-all active:scale-95 shadow-sm ${className}`}
    >
        {children}
    </button>
);