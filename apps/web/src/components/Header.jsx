
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuthContext();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">W</span>
            </div>
            <span className="text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
              Weaura
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link to="/shop" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
              Shop
            </Link>
            {currentUser && (
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors duration-200 font-medium">
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/shop" className="hidden sm:block">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <Search className="w-5 h-5" />
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:text-primary">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">{currentUser.name || currentUser.email}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              {currentUser && (
                <Link
                  to="/dashboard"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {!currentUser && (
                <>
                  <Link
                    to="/login"
                    className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
