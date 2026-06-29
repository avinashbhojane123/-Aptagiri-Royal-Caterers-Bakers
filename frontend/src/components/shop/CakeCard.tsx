// FILE: CakeCard.tsx
// CHANGES: Overhauls the catalog card items to use premium-card structures, custom hover zooms, progressive blur-ups, and accessible labels.
// BS5 COMPONENTS USED: Card, Badge, Button, Spinner

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface CakeCardProps {
  cake: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    flavor: string;
    size: string;
  };
  onAddToCartSuccess?: (message: string) => void;
}

export const CakeCard: React.FC<CakeCardProps> = ({ cake, onAddToCartSuccess }) => {
  const { addToCart } = useCart();
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const isOutOfStock = cake.stock <= 0;

  const handleAddToCart = () => {
    addToCart(cake);
    if (onAddToCartSuccess) {
      onAddToCartSuccess(`Added "${cake.name}" to your cart!`);
    }
  };

  return (
    <div className="premium-card h-100 d-flex flex-column justify-content-between p-0">
      <div>
        
        {/* Progressive image blur-up zoom wrapper */}
        <div className="hover-zoom" style={{ height: '220px', position: 'relative' }}>
          <img
            src={isImgLoaded ? cake.imageUrl : `${cake.imageUrl}&w=20&q=20`}
            onLoad={() => setIsImgLoaded(true)}
            alt={`APTAGIRI ROYAL Caterers & Events product: ${cake.name}`}
            className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
            style={{ objectFit: 'cover' }}
          />

          {/* Sizing Badge overlay */}
          <span 
            className="position-absolute badge shadow-sm font-sans"
            style={{
              top: '16px',
              left: '16px',
              backgroundColor: 'rgba(253, 250, 247, 0.95)',
              color: 'var(--color-text)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {cake.size}
          </span>

          {/* Out of Stock Ribbon Badge overlay */}
          {isOutOfStock && (
            <span 
              className="position-absolute badge bg-danger shadow-sm font-sans"
              style={{
                top: '16px',
                right: '16px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}
            >
              Sold Out
            </span>
          )}
        </div>

        {/* Card Body details */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h3 className="h5 fw-bold font-serif mb-0" style={{ color: 'var(--color-text)' }}>
              {cake.name}
            </h3>
            <span 
              className="badge font-sans text-uppercase text-decoration-none"
              style={{
                backgroundColor: 'var(--color-accent-light)',
                color: 'var(--color-accent-dark)',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                padding: '5px 10px',
                borderRadius: '20px'
              }}
            >
              {cake.flavor}
            </span>
          </div>
          
          <p 
            className="text-muted-custom font-sans mb-0"
            style={{
              fontSize: '0.85rem',
              lineHeight: '1.6',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '63px'
            }}
          >
            {cake.description}
          </p>
        </div>

      </div>

      {/* Pricing & Call-to-action layout */}
      <div className="px-4 pb-4 pt-0 d-flex justify-content-between align-items-center">
        <div>
          <span className="d-block text-muted-custom font-sans" style={{ fontSize: '0.7rem', lineHeight: 1, marginBottom: '2px' }}>Price</span>
          <span className="font-serif fw-bold text-gradient fs-4" style={{ color: 'var(--color-primary)' }}>
            ₹{Number(cake.price).toFixed(2)}
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn d-flex align-items-center gap-2 rounded-pill px-4 py-2 font-sans fw-semibold btn-modern ${isOutOfStock ? 'btn-outline-secondary' : 'btn-primary-custom'}`}
          style={{
            fontSize: '0.8rem',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
          }}
          aria-label={isOutOfStock ? `${cake.name} is currently out of stock` : `Add ${cake.name} to shopping cart`}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>

    </div>
  );
};
