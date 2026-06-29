// FILE: Decorations.tsx
// CHANGES: Modernizes venue decoration showcases using custom premium cards, progressive blur-ups, list spacing, and entry scroll reveals.
// BS5 COMPONENTS USED: Container, Row, Col, Card, Button, Badge

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Decorations: React.FC = () => {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer scroll reveal hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const decorationsList = [
    {
      title: 'Floral Arch & Stage Decor',
      description: 'Elegant fresh floral arches, drapery work, stage platforms, and modern chandelier setups custom-crafted for receptions, weddings, and awards.',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
      priceText: 'Custom Quotes Available'
    },
    {
      title: 'Banquet Table Settings',
      description: 'Fine linens, satin table runners, botanical centerpieces, customized placeholders, and premium crystal tableware styled to perfection.',
      imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&auto=format&fit=crop&q=80',
      priceText: 'From INR 250 / table'
    },
    {
      title: 'Thematic Backdrops & Lighting',
      description: 'Enchanting LED fairy light canopy backdrops, custom name signage boards, ambient color washes, and photo-booth structures.',
      imageUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&auto=format&fit=crop&q=80',
      priceText: 'Starting at INR 5,000'
    }
  ];

  return (
    <section className="py-5 bg-white position-relative" id="decorations-section">
      <div 
        ref={sectionRef}
        className="container py-4 scroll-reveal"
      >
        
        {/* Header Block */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: '#ECFDF5 !important', 
              color: '#0f5132', 
              fontWeight: 700, 
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          >
            Premium Venue Aesthetics
          </span>
          <h2 className="display-fluid-2 fw-bold font-serif mb-2 text-gradient">
            Royal Event Decorations
          </h2>
          <p className="text-muted-custom fs-5 mx-auto" style={{ maxWidth: '600px', fontWeight: 400 }}>
            Coordinate gorgeous venue themes, floral stages, and premium seating arrangements designed by our event managers.
          </p>
        </div>

        {/* Responsive Grid list of Decor options */}
        <div className="row g-4 justify-content-center">
          {decorationsList.map((decor, index) => {
            const isImgLoaded = loadedImages[index] || false;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="premium-card h-100">
                  
                  {/* Progressive image blur-up zoom wrapper */}
                  <div className="hover-zoom" style={{ height: '230px' }}>
                    <img 
                      src={isImgLoaded ? decor.imageUrl : `${decor.imageUrl}&w=20&q=20`} 
                      onLoad={() => handleImageLoad(index)}
                      alt={`APTAGIRI ROYAL Caterers & Events Event Decoration: ${decor.title}`} 
                      className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Card content and pricing panel */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="h5 fw-bold mb-2 font-serif" style={{ color: 'var(--color-text)' }}>
                        {decor.title}
                      </h3>
                      <p className="text-muted-custom font-sans mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {decor.description}
                      </p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                      <span className="text-dark fw-bold font-sans" style={{ fontSize: '0.8rem' }}>
                        {decor.priceText}
                      </span>
                      <Link 
                        to="/gallery" 
                        className="btn btn-sm btn-link text-decoration-none fw-bold text-gradient btn-modern"
                        style={{ fontSize: '0.8rem' }}
                      >
                        View Real Photos →
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
