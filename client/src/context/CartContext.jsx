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

  const [eventItem, setEventItem] = useState(() => {
    try {
      const saved = localStorage.getItem('event-cart-event');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [ticketCount, setTicketCount] = useState(() => {
    try {
      const saved = localStorage.getItem('event-cart-tickets');
      return saved ? JSON.parse(saved) : 1;
    } catch {
      return 1;
    }
  });

  useEffect(() => {
    localStorage.setItem('event-cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (eventItem) {
      localStorage.setItem('event-cart-event', JSON.stringify(eventItem));
    } else {
      localStorage.removeItem('event-cart-event');
    }
  }, [eventItem]);

  useEffect(() => {
    localStorage.setItem('event-cart-tickets', JSON.stringify(ticketCount));
  }, [ticketCount]);

  const addEventToCart = (event, tickets = 1) => {
    setEventItem(event);
    setTicketCount(tickets);
    toast.success(`${event.title} added to cart`);
  };

  const removeEventFromCart = () => {
    setEventItem(null);
    setTicketCount(1);
    toast.success('Event removed from cart');
  };

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
    setEventItem(null);
    setTicketCount(1);
    toast.success('Cart cleared');
  };

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    const addOnCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return eventItem ? addOnCount + 1 : addOnCount;
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
    eventItem,
    ticketCount,
    setTicketCount,
    addEventToCart,
    removeEventFromCart,
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
