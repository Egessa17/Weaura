
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import ProductFilter from '@/components/ProductFilter.jsx';
import SearchBar from '@/components/SearchBar.jsx';
import BreadcrumbNav from '@/components/BreadcrumbNav.jsx';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ShopPage = () => {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { products, loading, totalPages, fetchProducts } = useProducts(filters);

  useEffect(() => {
    fetchProducts(currentPage, 12);
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Shop - Weaura</title>
        <meta name="description" content="Browse our complete collection of premium fashion and accessories at Weaura. Filter by category, size, color, and price to find your perfect style." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BreadcrumbNav items={[{ label: 'Shop' }]} />

            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Shop all products
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover our complete collection of premium fashion
              </p>
            </div>

            <div className="mb-6">
              <SearchBar onSearch={handleSearch} onToggleFilters={() => setShowFilters(!showFilters)} />
            </div>

            <div className="flex gap-8">
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 bg-card rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-6">Filters</h2>
                  <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
                </div>
              </aside>

              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <ProductFilter filters={filters} onFilterChange={handleFilterChange} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    {loading ? 'Loading...' : `${products.length} products found`}
                  </p>
                  <select
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="-created">Newest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="-rating">Highest Rated</option>
                  </select>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(12)].map((_, i) => (
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
                ) : products.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={() => setFilters({})}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-12">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <Button
                            key={i}
                            variant={currentPage === i + 1 ? 'default' : 'outline'}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'bg-primary text-primary-foreground' : ''}
                          >
                            {i + 1}
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ShopPage;
