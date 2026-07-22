import { useEffect, useState } from 'react';

const WISHLIST_KEY = 'weaura_wishlist';
const WISHLIST_EVENT = 'weaura:wishlist-changed';

const loadWishlist = () => {
  try {
    const value = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: items }));
};

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState(loadWishlist);

  useEffect(() => {
    const handleChange = (event) => setWishlistItems(event.detail || loadWishlist());
    window.addEventListener(WISHLIST_EVENT, handleChange);
    return () => window.removeEventListener(WISHLIST_EVENT, handleChange);
  }, []);

  const addToWishlist = async (productId) => {
    const current = loadWishlist();
    if (current.some((item) => item.product_id === productId)) return;
    const next = [...current, { id: productId, product_id: productId }];
    saveWishlist(next);
    setWishlistItems(next);
  };

  const removeFromWishlist = async (wishlistItemId) => {
    const next = loadWishlist().filter((item) => item.id !== wishlistItemId);
    saveWishlist(next);
    setWishlistItems(next);
  };

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item.product_id === productId);

  const getWishlistItemId = (productId) =>
    wishlistItems.find((item) => item.product_id === productId)?.id;

  return {
    wishlistItems,
    loading: false,
    error: null,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist: () => setWishlistItems(loadWishlist()),
    isInWishlist,
    getWishlistItemId,
  };
};

