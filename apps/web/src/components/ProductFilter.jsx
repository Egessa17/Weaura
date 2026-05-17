
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';

const ProductFilter = ({ filters, onFilterChange }) => {
  const categories = ['Men', 'Women', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Beige'];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Category</h3>
        <RadioGroup value={filters.category || ''} onValueChange={(value) => onFilterChange('category', value)}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All Products</Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category} className="cursor-pointer">{category}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={200}
            step={10}
            value={[filters.minPrice || 0, filters.maxPrice || 200]}
            onValueChange={(value) => {
              onFilterChange('minPrice', value[0]);
              onFilterChange('maxPrice', value[1]);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.minPrice || 0}</span>
            <span>${filters.maxPrice || 200}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onFilterChange('size', size)}
              className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                filters.size === size
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={color}
                checked={filters.color === color}
                onCheckedChange={(checked) => onFilterChange('color', checked ? color : null)}
              />
              <Label htmlFor={color} className="cursor-pointer">{color}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange('minRating', rating)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-200 ${
                filters.minRating === rating
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">& Up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
