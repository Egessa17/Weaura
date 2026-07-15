
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import ReviewCard from '@/components/ReviewCard.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import supabase from '@/lib/supabaseClient';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await pb.collection('products').getOne(id, {
          expand: 'reviews',
          $autoCancel: false
        });
        setProduct(productData);

        const related = await pb.collection('products').getList(1, 4, {
          filter: `category = "${productData.category}" && id != "${id}"`,
          $autoCancel: false
        });
        setRelatedProducts(related.items);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!pb.authStore.isValid) {
      toast.error('Please log in to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, quantity, selectedSize, selectedColor);
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!pb.authStore.isValid) {
      toast.error('Please log in to save items');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        const itemId = getWishlistItemId(product.id);
        await removeFromWishlist(itemId);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product not found</h2>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images.map(img => pb.files.getUrl(product, img))
    : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b'];

  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Weaura`}</title>
        <meta name="description" content={product.description || `Shop ${product.name} at Weaura. Premium quality fashion and accessories.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav
              items={[
                { label: 'Shop', href: '/shop' },
                { label: product.category, href: `/shop?category=${product.category}` },
                { label: product.name }
              ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              <div>
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImage === index ? 'border-primary' : 'border-transparent'
                          }`}
                      >
                        <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="mb-4">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    {product.category}
                  </span>
                </div>

                <h1 className="text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  {product.name}
                </h1>

                {product.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({product.expand?.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                  )}
                </div>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                {sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {colors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-3">Color</label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-6 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${selectedColor === color
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                            }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3">Quantity</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border-2 border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition-colors duration-200"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="px-6 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition-colors duration-200"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock_quantity} available
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mb-8">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleToggleWishlist}
                    variant="outline"
                    className="px-6 py-6"
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-primary text-primary' : ''
                        }`}
                    />
                  </Button>
                </div>

                <div className="space-y-4 border-t border-border pt-8">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-sm">Fast delivery within 2-3 business days</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm">Secure payment with MTN MoMo & Airtel Money</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-primary" />
                    <span className="text-sm">14-day return policy</span>
                  </div>
                </div>
              </div>
            </div>

            {product.expand?.reviews && product.expand.reviews.length > 0 && (
              <section className="mb-20">
                <h2 className="text-3xl font-bold mb-8">Customer reviews</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.expand.reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            )}

            {relatedProducts.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8">You might also like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard key={relatedProduct.id} product={relatedProduct} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
