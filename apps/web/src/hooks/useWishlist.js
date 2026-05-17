
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWishlist = async () => {
    if (!pb.authStore.isValid) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const items = await pb.collection('wishlist').getFullList({
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

      setWishlistItems(itemsWithProducts);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [pb.authStore.isValid]);

  const addToWishlist = async (productId) => {
    if (!pb.authStore.isValid) {
      throw new Error('Please log in to add items to wishlist');
    }

    try {
      const existing = await pb.collection('wishlist').getFullList({
        filter: `user_id = "${pb.authStore.model.id}" && product_id = "${productId}"`,
        $autoCancel: false
      });

      if (existing.length === 0) {
        await pb.collection('wishlist').create({
          user_id: pb.authStore.model.id,
          product_id: productId
        }, { $autoCancel: false });
        await fetchWishlist();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await pb.collection('wishlist').delete(wishlistItemId, { $autoCancel: false });
      await fetchWishlist();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const getWishlistItemId = (productId) => {
    const item = wishlistItems.find(item => item.product_id === productId);
    return item?.id;
  };

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist,
    getWishlistItemId
  };
};
