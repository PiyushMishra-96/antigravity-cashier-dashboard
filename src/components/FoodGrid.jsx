import React, { useEffect, useState } from 'react';
import { usePOS } from '../context/POSContext';
import { mockInventory } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export const FoodGrid = () => {
  const { addToCart, searchQuery, activeCategory } = usePOS();
  const [isLoading, setIsLoading] = useState(true);

  let filteredInventory = mockInventory;
  
  if (activeCategory !== 'All') {
    filteredInventory = filteredInventory.filter(item => item.category === activeCategory);
  }
  
  if (searchQuery) {
    filteredInventory = filteredInventory.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="glassmorphism rounded-2xl p-4 h-64 animate-pulse flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="w-full h-32 bg-white/10 rounded-xl mb-4"></div>
            <div className="w-1/3 h-3 bg-white/10 rounded mb-2"></div>
            <div className="w-2/3 h-5 bg-white/10 rounded mb-4"></div>
            <div className="mt-auto flex justify-between items-center">
              <div className="w-1/4 h-6 bg-white/10 rounded"></div>
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredInventory.length === 0) {
    return (
      <div className="glassmorphism p-8 rounded-2xl text-center text-white/50 w-full col-span-full">
        <p className="font-sans">No cosmic items found. Try asking Astra to clear filters!</p>
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <AnimatePresence mode="popLayout">
        {filteredInventory.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ProductCard item={item} addToCart={addToCart} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
