
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-bold">Weaura</span>
            </div>
            <p className="text-sm text-secondary-foreground/80 leading-relaxed">
              Your destination for premium fashion and accessories.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>Email: support@weaura.com</li>
              <li>Phone: +256 700 123 456</li>
              <li>Address: Kampala, Uganda</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/80">
            © 2026 Weaura. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
