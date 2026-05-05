import React, { createContext, useState, useEffect, useContext } from 'react';

const POSContext = createContext();

export const usePOS = () => useContext(POSContext);

export const POSProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('antigravity_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem('antigravity_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Galactic Mains');
  const [zenMode, setZenMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAstraOpen, setIsAstraOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('antigravity_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('antigravity_history', JSON.stringify(orderHistory));
  }, [orderHistory]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const completeOrder = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: `#ANTIG-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total: getCartTotal() * 1.08, // Includes 8% tax
      date: new Date().toISOString(),
    };
    
    setOrderHistory((prevHistory) => [...prevHistory, newOrder]);
    setCurrentOrder(newOrder);
    setIsReceiptOpen(true);
    setCart([]); // clear cart
    setIsCartOpen(false); // close cart on mobile after checkout
  };

  const getTotalSales = () => {
    return orderHistory.reduce((total, order) => total + order.total, 0);
  };

  return (
    <POSContext.Provider value={{
      cart,
      orderHistory,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      completeOrder,
      getCartTotal,
      getTotalSales,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      zenMode,
      setZenMode,
      isCartOpen,
      setIsCartOpen,
      isAstraOpen,
      setIsAstraOpen,
      currentOrder,
      isReceiptOpen,
      setIsReceiptOpen,
      isPaymentOpen,
      setIsPaymentOpen
    }}>
      {children}
    </POSContext.Provider>
  );
};
