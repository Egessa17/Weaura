
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1, perPage = 12) => {
    try {
      setLoading(true);
      
      let filterString = '';
      const filterParts = [];

      if (filters.category) {
        filterParts.push(`category = "${filters.category}"`);
      }

      if (filters.search) {
        filterParts.push(`(name ~ "${filters.search}" || description ~ "${filters.search}")`);
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
          filterParts.push(`price >= ${filters.minPrice} && price <= ${filters.maxPrice}`);
        } else if (filters.minPrice !== undefined) {
          filterParts.push(`price >= ${filters.minPrice}`);
        } else {
          filterParts.push(`price <= ${filters.maxPrice}`);
        }
      }

      if (filters.minRating) {
        filterParts.push(`rating >= ${filters.minRating}`);
      }

      filterString = filterParts.join(' && ');

      const result = await pb.collection('products').getList(page, perPage, {
        filter: filterString || undefined,
        sort: filters.sort || '-created',
        $autoCancel: false
      });

      setProducts(result.items);
      setTotalPages(result.totalPages);
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
      const product = await pb.collection('products').getOne(id, {
        expand: 'reviews',
        $autoCancel: false
      });
      return product;
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.search, filters.minPrice, filters.maxPrice, filters.minRating, filters.sort]);

  return {
    products,
    loading,
    error,
    totalPages,
    fetchProducts,
    getProductById
  };
};
