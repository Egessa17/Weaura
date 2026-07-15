import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1, perPage = 2) => {
    try {
      setLoading(true);

      let query = supabase.from('products').select('*', { count: 'exact' });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.or(
          'name.ilike.%s{filters.search}%,decription.ilike.%{filters.search}%'
        );
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxprice !== undefined) {
        query = query.lte('price', filters.maxprice);
      }

      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      const sortMap = {
        '-created': { column: 'created_at', ascending: false },
        'created': { column: 'created_at', ascending: true },
        '-price': { column: 'price', ascending: false },
        'price': { column: 'price', ascending: true },
        '-rating': { column: 'rating', ascending: false },
      };

      const sort = sortMap[filters.sort] || { column: 'created_at', ascending: false };
      query = query.order(sort.column, { ascending: sort.ascending });

      const from = (page - 1) * perPage;
      const to = from + perPage - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;
      if (fetchError) throw fetchError;

      setProducts(data || []);
      setTotalPages(Math.ceil((count || 0) / perPage));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, reviews(*)')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.sort,
  ]);

  return { products, loading, error, totalPages, fetchProducts, getProductById };
};