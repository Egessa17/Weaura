
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!pb.authStore.isValid) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const items = await pb.collection('cart').getFullList({
        filter: `user_id = "${pb.authStore.model.id}"`,
        $autoCancel: false
      });

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await pb.collection('products').getOne(item.product_id, { $autoCancel: false });
            return { ...item, product };
          } catch (err) {
            console.error('Error fetching product:', err);
            return item;
          }
        })
      );

      setCartItems(itemsWithProducts);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [pb.authStore.isValid]);

  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    if (!pb.authStore.isValid) {
      throw new Error('Please log in to add items to cart');
    }

    try {
      const existingItems = await pb.collection('cart').getFullList({
        filter: `user_id = "${pb.authStore.model.id}" && product_id = "${productId}"`,
        $autoCancel: false
      });

      if (existingItems.length > 0) {
        const item = existingItems[0];
        await pb.collection('cart').update(item.id, {
          quantity: item.quantity + quantity
        }, { $autoCancel: false });
      } else {
        await pb.collection('cart').create({
          user_id: pb.authStore.model.id,
          product_id: productId,
          quantity,
          size,
          color
        }, { $autoCancel: false });
      }

      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await pb.collection('cart').update(cartItemId, { quantity }, { $autoCancel: false });
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await pb.collection('cart').delete(cartItemId, { $autoCancel: false });
      await fetchCart();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const items = await pb.collection('cart').getFullList({
        filter: `user_id = "${pb.authStore.model.id}"`,
        $autoCancel: false
      });

      await Promise.all(items.map(item => 
        pb.collection('cart').delete(item.id, { $autoCancel: false })
      ));

      setCartItems([]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    cartTotal,
    cartCount
  };
};
