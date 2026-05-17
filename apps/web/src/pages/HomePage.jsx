
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await pb.collection('products').getList(1, 6, {
          sort: '-rating',
          $autoCancel: false
        });
        setFeaturedProducts(products.items);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Fast delivery',
      description: 'Get your orders delivered within 2-3 business days'
    },
    {
      icon: Shield,
      title: 'Secure payments',
      description: 'Shop with confidence using MTN MoMo and Airtel Money'
    },
    {
      icon: RefreshCw,
      title: 'Easy returns',
      description: '14-day return policy on all products'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Weaura - Premium Fashion & Accessories</title>
        <meta name="description" content="Discover premium fashion and accessories at Weaura. Shop the latest trends in men's and women's clothing with fast delivery across Uganda." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[90dvh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1678547241895-1c307914b50c"
                alt="Premium fashion collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Discover your style
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-prose">
                  Shop the latest trends in premium fashion and accessories. Quality pieces that define your unique style.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/shop">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/shop?category=Men">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                      Browse Collections
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Featured products
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Handpicked selections from our latest collection
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card rounded-2xl overflow-hidden">
                      <div className="aspect-[3/4] bg-muted animate-pulse"></div>
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                        <div className="h-8 bg-muted rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="text-center mt-12">
                <Link to="/shop">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    View All Products
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="py-24 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  New arrivals every week
                </h2>
                <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Stay ahead of the trends with our weekly collection updates
                </p>
                <Link to="/shop">
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                    Explore New Arrivals
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
