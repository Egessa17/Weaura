
import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {formatDate(review.created)}
        </span>
      </div>
      
      {review.comment && (
        <p className="text-foreground leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
};

export default ReviewCard;
