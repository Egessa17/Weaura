
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const BreadcrumbNav = ({ items }) => {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
      <Link to="/" className="hover:text-primary transition-colors duration-200">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary transition-colors duration-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNav;
