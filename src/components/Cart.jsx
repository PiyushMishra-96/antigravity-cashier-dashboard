import React from 'react';
import { usePOS } from '../context/POSContext';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, setIsPaymentOpen } = usePOS();
  
  const total = getCartTotal();
  const tax = total * 0.08; // 8% tax
  const finalTotal = total + tax;

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear the entire cart?")) {
      clearCart();
    }
  };

  return (
    <div className="glassmorphism rounded-2xl flex flex-col h-[500px] border-success/20 border-t-4 relative">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div id="cart-icon-target" className="bg-success/20 p-2 rounded-full relative z-10 shadow-[0_0_15px_rgba(63,185,80,0.3)]">
            <ShoppingBag className="text-success relative z-10" size={24} />
          </div>
          <h2 className="font-bold text-lg font-sans">Current Order</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-mono">{cart.length} items</span>
          {cart.length > 0 && (
             <motion.button 
               whileTap={{ scale: 0.9 }} 
               onClick={handleClearAll}
               className="text-[#f85149] hover:bg-[#f85149]/20 p-2 rounded-full transition-colors"
               title="Clear All"
             >
               <RotateCcw size={16} />
             </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <ShoppingBag size={48} className="mb-4 opacity-20" />
            <p className="font-sans">Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
              <div className="flex-1">
                <h4 className="font-semibold text-sm font-sans">{item.name}</h4>
                <span className="font-mono text-success text-sm">${item.price.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-black/40 rounded-full border border-white/10">
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, -1)} className="p-1.5 hover:text-[#f85149] transition-colors">
                    <Minus size={14} />
                  </motion.button>
                  <span className="font-mono text-sm w-6 text-center">{item.quantity}</span>
                  <motion.button whileTap={{ scale: 0.8 }} onClick={() => updateQuantity(item.id, 1)} className="p-1.5 hover:text-success transition-colors">
                    <Plus size={14} />
                  </motion.button>
                </div>
                <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeFromCart(item.id)} className="text-white/40 hover:text-[#f85149] transition-colors p-1">
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm text-white/70 font-sans">
            <span>Subtotal</span>
            <span className="font-mono">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-white/70 font-sans">
            <span>Tax (8%)</span>
            <span className="font-mono">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10 text-accent font-sans">
            <span>Total</span>
            <span className="font-mono drop-shadow-[0_0_8px_rgba(88,166,255,0.5)]">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <motion.button 
          whileTap={cart.length > 0 ? { scale: 0.95 } : {}}
          onClick={() => setIsPaymentOpen(true)}
          disabled={cart.length === 0}
          className="neon-pulse-btn w-full bg-success hover:bg-success/90 text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans tracking-wide"
        >
          <CreditCard size={20} />
          Complete Order
        </motion.button>
      </div>
    </div>
  );
};
