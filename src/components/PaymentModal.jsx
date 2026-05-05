import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePOS } from '../context/POSContext';
import { CreditCard, Smartphone, Banknote, X, CheckCircle } from 'lucide-react';

export const PaymentModal = () => {
  const { isPaymentOpen, setIsPaymentOpen, getCartTotal, completeOrder } = usePOS();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isPaymentOpen) return null;

  const total = getCartTotal() * 1.08;

  const handlePayment = (method) => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Show success briefly, then complete order
      setTimeout(() => {
        setIsSuccess(false);
        setIsPaymentOpen(false);
        completeOrder(); // This will clear cart and show receipt modal
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl">
      <AnimatePresence>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glassmorphism w-full max-w-md p-8 rounded-2xl relative overflow-hidden"
        >
          <button 
            onClick={() => !isProcessing && setIsPaymentOpen(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors disabled:opacity-50"
            disabled={isProcessing || isSuccess}
          >
            <X size={24} />
          </button>

          {!isSuccess ? (
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold mb-2 font-sans text-white/70">Total Amount Due</h2>
              <div className="text-5xl font-mono font-bold text-accent drop-shadow-[0_0_20px_rgba(88,166,255,0.8)] mb-8">
                ${total.toFixed(2)}
              </div>

              <p className="w-full text-sm text-white/50 mb-4 font-sans text-center">Select Payment Method</p>
              
              <div className="grid grid-cols-3 gap-4 w-full">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePayment('UPI')}
                  disabled={isProcessing}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <Smartphone size={28} className="text-accent drop-shadow-[0_0_10px_rgba(88,166,255,0.5)]" />
                  <span className="text-xs font-bold font-sans">UPI</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePayment('Card')}
                  disabled={isProcessing}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#f85149] hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <CreditCard size={28} className="text-[#f85149] drop-shadow-[0_0_10px_rgba(248,81,73,0.5)]" />
                  <span className="text-xs font-bold font-sans">Card</span>
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePayment('Cash')}
                  disabled={isProcessing}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-success hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <Banknote size={28} className="text-success drop-shadow-[0_0_10px_rgba(63,185,80,0.5)]" />
                  <span className="text-xs font-bold font-sans">Cash</span>
                </motion.button>
              </div>

              {isProcessing && (
                <div className="mt-6 flex flex-col items-center text-accent">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-xs font-mono animate-pulse">Processing Transaction...</span>
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8"
            >
              <CheckCircle size={64} className="text-success drop-shadow-[0_0_20px_rgba(63,185,80,0.8)] mb-4" />
              <h2 className="text-2xl font-bold font-sans">Payment Successful</h2>
              <p className="text-white/50 font-mono mt-2">Generating receipt...</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
