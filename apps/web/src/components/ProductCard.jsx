
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useWishlist();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const imageUrl = product.images && product.images.length > 0 
    ? pb.files.getUrl(product, product.images[0])
    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!pb.authStore.isValid) {
      toast.error('Please log in to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pb.authStore.isValid) {
      toast.error('Please log in to save items');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (inWishlist) {
        const itemId = getWishlistItemId(product.id);
        await removeFromWishlist(itemId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img 
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {discountPercent}% OFF
            </div>
          )}
          <button
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-all duration-200 active:scale-95"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-200 ${
                inWishlist ? 'fill-primary text-primary' : 'text-foreground'
              }`}
            />
          </button>
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <div className="absolute bottom-4 left-4 bg-destructive/90 text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
              Only {product.stock_quantity} left
            </div>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
        
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          {product.rating && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.length || 0})
              </span>
            </div>
          )}
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mt-auto">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock_quantity === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-98"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
