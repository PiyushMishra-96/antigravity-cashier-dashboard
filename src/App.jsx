import React, { useEffect, useState } from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import { FoodGrid } from './components/FoodGrid';
import { AstraAI } from './components/AstraAI';
import { Cart } from './components/Cart';
import { Dashboard } from './components/Dashboard';
import { ReceiptModal } from './components/ReceiptModal';
import { PaymentModal } from './components/PaymentModal';
import { Rocket, ShoppingBag, Bot, Focus, LayoutGrid, UtensilsCrossed, Cookie, Coffee, IceCream, Pizza } from 'lucide-react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingSilhouettes = () => {
  const icons = [Pizza, UtensilsCrossed, Coffee, IceCream, Cookie];
  const items = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    Icon: icons[i % icons.length],
    size: 60 + Math.random() * 120,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 40 + Math.random() * 60,
    delay: Math.random() * -50,
  }));

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-white/[0.02]"
          initial={{ 
            x: `${item.x}vw`, 
            y: `${item.y}vh`, 
            rotate: 0,
          }}
          animate={{
            x: [`${item.x}vw`, `${(item.x + 30) % 100}vw`, `${(item.x - 20 + 100) % 100}vw`, `${item.x}vw`],
            y: [`${item.y}vh`, `${(item.y - 40 + 100) % 100}vh`, `${(item.y + 30) % 100}vh`, `${item.y}vh`],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay
          }}
        >
          <item.Icon size={item.size} strokeWidth={0.5} />
        </motion.div>
      ))}
    </div>
  );
};

const Sidebar = () => {
  const { activeCategory, setActiveCategory } = usePOS();
  
  const categories = [
    { name: 'Galactic Mains', icon: UtensilsCrossed },
    { name: 'Orbital Sides', icon: Cookie },
    { name: 'Nebula Drinks', icon: Coffee },
    { name: 'Supernova Desserts', icon: IceCream },
  ];

  return (
    <div className="w-20 lg:w-64 glassmorphism border-r border-white/5 flex flex-col items-center lg:items-start py-6 px-4 gap-4 h-full fixed left-0 top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-8 w-full justify-center lg:justify-start px-2">
        <div className="bg-accent/20 p-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(88,166,255,0.4)] border border-accent/30">
          <Rocket className="text-accent drop-shadow-[0_0_8px_rgba(88,166,255,0.8)]" size={28} />
        </div>
        <h1 className="text-xl font-bold tracking-widest hidden lg:block font-sans text-white/90">ANTIGRAVITY</h1>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <motion.button
              key={cat.name}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full justify-center lg:justify-start
                ${isActive 
                  ? 'bg-accent/20 border border-accent/50 text-white shadow-[0_0_15px_rgba(88,166,255,0.2)]' 
                  : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              <Icon size={24} className={isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(88,166,255,0.8)]' : ''} />
              <span className="hidden lg:block font-sans font-semibold text-sm tracking-wide">{cat.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const Header = () => {
  const { setZenMode } = usePOS();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex items-center justify-between mb-8 glassmorphism px-6 py-4 rounded-2xl border-b-2 border-accent/30 relative z-20">
      <div className="font-mono text-xl tracking-widest text-accent font-bold drop-shadow-[0_0_10px_rgba(88,166,255,0.8)]">
        {time.toLocaleTimeString()}
      </div>
      
      <div className="hidden md:flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setZenMode(true)}
          className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 transition-colors text-sm font-sans"
        >
          <Focus size={16} /> Zen Mode
        </motion.button>
        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 font-mono text-sm flex items-center gap-2">
          System: <span className="text-success flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block animate-pulse shadow-[0_0_8px_rgba(63,185,80,0.8)]"></span> ONLINE</span>
        </div>
      </div>
    </header>
  );
};

function AppContent() {
  const { zenMode, setZenMode, isCartOpen, setIsCartOpen, isAstraOpen, setIsAstraOpen, cart } = usePOS();

  useEffect(() => {
    gsap.fromTo('header', 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="relative min-h-screen pb-20 lg:pb-0">
      <div className="cosmic-bg"></div>
      <div className="noise-overlay"></div>
      <div className="scanlines"></div>
      <FloatingSilhouettes />

      {!zenMode && <Sidebar />}

      <div className={`flex flex-col min-h-screen px-4 py-6 ${!zenMode ? 'ml-20 lg:ml-64' : ''}`}>
        {!zenMode && <Header />}

        {zenMode && (
          <div className="flex justify-end mb-4 relative z-20">
             <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setZenMode(false)}
                className="bg-[rgba(20,20,35,0.8)] border border-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2 transition-colors text-sm font-sans"
              >
                <LayoutGrid size={16} /> Exit Zen Mode
              </motion.button>
          </div>
        )}

        <div className="max-w-[1600px] w-full mx-auto flex-1">
          {!zenMode && <Dashboard />}

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            <div className={`flex flex-col gap-6 ${zenMode ? 'lg:col-span-12' : 'lg:col-span-8'}`}>
              <h2 className="text-xl font-bold border-b border-white/10 pb-2 mb-2 flex justify-between items-center font-sans tracking-wide">
                Cosmic Menu
              </h2>
              <FoodGrid />
            </div>

            <div className={`lg:col-span-4 flex flex-col gap-6 ${zenMode ? 'fixed bottom-4 right-4 z-40 w-80 shadow-[0_0_30px_rgba(0,0,0,0.5)]' : 'hidden lg:flex'}`}>
              {!zenMode && <Cart />}
              <div className={`${zenMode ? 'rounded-2xl backdrop-blur-xl' : 'h-full'}`}>
                 <AstraAI />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Bar */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 glassmorphism rounded-full px-6 py-3 flex items-center gap-8 z-50">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => { setIsCartOpen(!isCartOpen); setIsAstraOpen(false); }}
          className={`flex flex-col items-center gap-1 ${isCartOpen ? 'text-success drop-shadow-[0_0_8px_rgba(63,185,80,0.5)]' : 'text-white/50 hover:text-white'}`}
        >
          <div className="relative">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-success text-background text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase">Cart</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => { setIsAstraOpen(!isAstraOpen); setIsCartOpen(false); }}
          className={`flex flex-col items-center gap-1 ${isAstraOpen ? 'text-accent drop-shadow-[0_0_8px_rgba(88,166,255,0.5)]' : 'text-white/50 hover:text-white'}`}
        >
          <Bot size={24} />
          <span className="text-[10px] font-mono tracking-widest uppercase">Astra AI</span>
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => { setZenMode(!zenMode); setIsCartOpen(false); setIsAstraOpen(false); }}
          className={`flex flex-col items-center gap-1 ${zenMode ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/50 hover:text-white'}`}
        >
          <Focus size={24} />
          <span className="text-[10px] font-mono tracking-widest uppercase">Zen</span>
        </motion.button>
      </div>

      {/* Mobile Drawers */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed inset-x-0 bottom-[80px] z-40 p-4"
          >
            <Cart />
          </motion.div>
        )}
        {isAstraOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="lg:hidden fixed inset-x-0 bottom-[80px] z-40 p-4"
          >
            <AstraAI />
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal />
      <ReceiptModal />
    </div>
  );
}

function App() {
  return (
    <POSProvider>
      <AppContent />
    </POSProvider>
  );
}

export default App;
