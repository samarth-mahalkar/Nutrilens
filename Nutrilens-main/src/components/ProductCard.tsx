import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  emoji: string;
  name: string;
  description: string;
  productCount: string;
  rating?: number;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  emoji, 
  name, 
  description, 
  productCount, 
  rating,
  className = ""
}) => {
  const handleViewMore = () => {
    // Handle navigation to product category
    console.log(`Viewing more products in ${name} category`);
  };

  return (
    <article 
      className={`bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1 group ${className}`}
      role="article"
      aria-label={`${name} product category`}
    >
      {/* Product Category Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {emoji}
      </div>
      
      {/* Category Info */}
      <div className="mb-4">
        <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          {description}
        </p>
        
        {/* Rating (if provided) */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 ${
                  i < rating 
                    ? 'text-primary fill-primary' 
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({rating}.0)
            </span>
          </div>
        )}
        
        {/* Product Count */}
        <div className="text-xs text-primary font-medium mb-4">
          {productCount}
        </div>
      </div>
      
      {/* View More Button */}
      <Button
        onClick={handleViewMore}
        variant="outline"
        size="sm"
        className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
        aria-label={`View more products in ${name} category`}
      >
        View More
        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </article>
  );
};

export default ProductCard;