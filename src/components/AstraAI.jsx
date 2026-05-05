import React, { useState, useEffect, useRef } from 'react';
import { usePOS } from '../context/POSContext';
import { Bot, Send, DollarSign, Calculator, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const AstraAI = () => {
  const { getCartTotal, getTotalSales, clearCart } = usePOS();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const simulateTyping = (response) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: 'ai' }]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); 
  };

  const processCommand = (text) => {
    const lowerText = text.toLowerCase();
    let response = "I'm not sure how to help with that. Try asking to 'Check Sales' or 'Calculate Total'.";

    if (lowerText.includes('total') || lowerText.includes('calculate')) {
      const total = getCartTotal();
      response = `Your current cart total is $${total.toFixed(2)}.`;
    } else if (lowerText.includes('sales') || lowerText.includes('revenue') || lowerText.includes('check sales')) {
      const sales = getTotalSales();
      response = `Your total revenue so far is $${sales.toFixed(2)}. Stellar work!`;
    } else if (lowerText.includes('reset') || lowerText.includes('session')) {
      clearCart();
      setMessages([]);
      return; 
    }

    simulateTyping(response);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input);
  };

  const handleSend = (text) => {
    setMessages(prev => [...prev, { text, sender: 'user' }]);
    processCommand(text);
    setInput('');
  };

  const isChatEmpty = messages.length === 0;

  return (
    <div className="glassmorphism rounded-2xl flex flex-col h-full min-h-[400px] border border-accent/20 shadow-[0_0_20px_rgba(88,166,255,0.1)] relative overflow-hidden bg-[rgba(20,20,35,0.8)]">
      
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
        <div className="bg-accent/20 p-2 rounded-full relative shadow-[0_0_15px_rgba(88,166,255,0.4)]">
          <Bot className="text-accent relative z-10" size={24} />
        </div>
        <div>
          <h2 className="font-bold text-lg font-sans tracking-wide text-white/90">Astra AI</h2>
          <span className="text-[10px] text-success flex items-center gap-1.5 font-mono uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-success inline-block shadow-[0_0_8px_rgba(63,185,80,0.8)] animate-pulse"></span> 
            Astra Core: Online
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
        {isChatEmpty ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
             <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(88,166,255,0.2)]">
               <Bot size={32} className="text-accent opacity-50" />
             </div>
             <p className="text-sm text-white/50 font-sans mb-6">Awaiting your command, Commander.</p>
             <div className="flex flex-col gap-3 w-full max-w-[200px]">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSend('Check Sales')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-mono">
                  <DollarSign size={14} className="text-success" /> Check Sales
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSend('Calculate Total')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-mono">
                  <Calculator size={14} className="text-accent" /> Calculate Total
                </motion.button>
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSend('Reset Session')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors font-mono">
                  <RotateCcw size={14} className="text-[#f85149]" /> Reset Session
                </motion.button>
             </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-sans leading-relaxed backdrop-blur-md shadow-lg ${msg.sender === 'user' ? 'bg-accent/30 text-white rounded-tr-none border border-accent/30' : 'bg-white/10 rounded-tl-none border border-white/10 text-white/90'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3.5 rounded-2xl rounded-tl-none backdrop-blur-md flex items-center border border-white/10 shadow-lg text-accent">
                  <span className="font-mono font-bold animate-pulse">|</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/30">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command..."
            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 pr-12 focus:outline-none focus:border-accent/50 focus:shadow-[0_0_15px_rgba(88,166,255,0.2)] text-sm transition-all font-mono tracking-wide shadow-inner"
          />
          <button 
            type="submit" 
            className="absolute right-3 text-accent hover:text-white transition-colors p-1"
            disabled={isTyping}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
