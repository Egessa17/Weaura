import { useState, useEffect } from 'react';

const CART_KEY = 'weaura_cart';

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    console.error('Failed to save cart');
  }
};

export const useCart = () => {
  const [cartItems, setCartItems] = useState(loadCart);

  //Persist to local storage whenever cart changes
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product_id === product.id &&
          item.size === size &&
          item.color === color
      );

      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id &&
            item.size === size &&
            item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prev,
        {
          id: `${product.id}-${size}-${color}-${Date.now()}`,
          product_id: product.id,
          product,
          quantity,
          size,
          color,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? {
          ...item, quantity
        } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    cartTotal,
    cartCount,
    loading: false,
    error: null,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart: () => { }, //kept for API compatibility
  };
};
