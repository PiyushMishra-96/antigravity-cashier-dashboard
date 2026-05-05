import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { gsap } from 'gsap';

export const ProductCard = ({ item, addToCart }) => {
  const handleAddToCart = (e) => {
    addToCart(item);

    const btn = e.currentTarget;
    const card = btn.closest('.food-card');
    const img = card.querySelector('img');
    
    if (img) {
      const imgRect = img.getBoundingClientRect();
      const cartIcon = document.getElementById('cart-icon-target');
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        
        const clone = img.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${imgRect.left}px`;
        clone.style.top = `${imgRect.top}px`;
        clone.style.width = `${imgRect.width}px`;
        clone.style.height = `${imgRect.height}px`;
        clone.style.borderRadius = '12px';
        clone.style.zIndex = 9999;
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.8';
        clone.style.objectFit = 'cover';
        
        document.body.appendChild(clone);
        
        gsap.to(clone, {
          x: cartRect.left - imgRect.left,
          y: cartRect.top - imgRect.top,
          scale: 0.1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            clone.remove();
            gsap.fromTo(cartIcon, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1 });
          }
        });
      }
    }
  };

  return (
    <div className="food-card glassmorphism rounded-2xl p-4 flex flex-col justify-between transition-colors duration-300 border border-white/20 hover:border-accent/70 cursor-pointer h-full group">
      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 relative bg-white/5">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,27,34,0.9)] to-transparent opacity-80"></div>
      </div>
      <div>
        <span className="text-xs font-semibold text-accent uppercase tracking-wider font-mono">{item.category}</span>
        <h3 className="text-lg font-bold mt-1 mb-2 font-sans leading-tight">{item.name}</h3>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xl font-mono text-success font-bold">${item.price.toFixed(2)}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleAddToCart}
          className="neon-pulse-btn p-2 rounded-full backdrop-blur-sm"
        >
          <Plus size={20} />
        </motion.button>
      </div>
    </div>
  );
};
