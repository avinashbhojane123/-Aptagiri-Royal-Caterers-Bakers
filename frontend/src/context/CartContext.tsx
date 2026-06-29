import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (cake: any, quantity?: number) => void;
  removeFromCart: (cakeId: string) => void;
  updateQuantity: (cakeId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  deliveryFee: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('cake_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cake_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (cake: any, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === cake.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === cake.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, {
        id: cake.id,
        name: cake.name,
        price: Number(cake.price),
        imageUrl: cake.imageUrl,
        quantity,
      }];
    });
  };

  const removeFromCart = (cakeId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cakeId));
  };

  const updateQuantity = (cakeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cakeId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === cakeId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = totalAmount > 0 && totalAmount < 50 ? 5.99 : 0; // Free delivery over $50
  const grandTotal = totalAmount + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
        deliveryFee,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
