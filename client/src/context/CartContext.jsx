import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('event-cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('event-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (addOn, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === addOn._id);
      if (existing) {
        toast.success(`Updated ${addOn.name} quantity`);
        return prev.map(i => i._id === addOn._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      toast.success(`${addOn.name} added to cart`);
      return [...prev, { ...addOn, quantity }];
    });
  };

  const removeItem = (addOnId) => {
    setItems(prev => {
      const item = prev.find(i => i._id === addOnId);
      if (item) toast.success(`${item.name} removed from cart`);
      return prev.filter(i => i._id !== addOnId);
    });
  };

  const updateQuantity = (addOnId, quantity) => {
    if (quantity < 1) {
      removeItem(addOnId);
      return;
    }
    setItems(prev => prev.map(i => i._id === addOnId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getItemsByCategory = () => {
    const grouped = {};
    items.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    getItemsByCategory,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
