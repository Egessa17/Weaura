import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentUserId = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  };

  const fetchWishlist = async () => {
    const userId = await getCurrentUserId();
    if (!userId) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('wishlist')
        .select('*, product:products(*)')
        .eq('user_id', userId);
      if (fetchError) throw fetchError;
      setWishlistItems(data || []);
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchWishlist();
    });
    return () => subscription.unsubscribe();
  }, []);

  const addToWishlist = async (productId) => {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('Please log in to add items to wishlist');

    try {
      const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (!existing) {
        const { error: insertError } = await supabase
          .from('wishlist')
          .insert({ user_id: userId, product_id: productId });
        if (insertError) throw insertError;
        await fetchWishlist();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      const { error: deleteError } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', wishlistItemId);
      if (deleteError) throw deleteError;
      await fetchWishlist();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.product_id === productId);

  const getWishlistItemId = (productId) =>
    wishlistItems.find((item) => item.product_id === productId)?.id;

  return {
    wishlistItems,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    isInWishlist,
    getWishlistItemId,
  };
};