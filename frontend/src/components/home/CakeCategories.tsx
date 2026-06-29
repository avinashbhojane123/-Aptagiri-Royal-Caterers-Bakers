// FILE: CakeCategories.tsx
// CHANGES: Overhauls occasions highlight grid with a live filter bar, diagonal "Today's Special" ribbon, blur-up progressive images, and scroll-reveal transitions.
// BS5 COMPONENTS USED: Container, Row, Col, Card, Button Group, Badge

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const CakeCategories: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
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

  const categories = [
    {
      title: 'Birthday Cakes',
      description: 'Make birthdays sweeter with custom shapes, custom letters, and delightful flavors.',
      imageUrl: 'https://images.unsplash.com/photo-1530101121876-66298efd5df7?w=600&auto=format&fit=crop&q=80',
      tag: 'Birthday',
      isFeatured: false
    },
    {
      title: 'Wedding Cakes',
      description: 'Grand, elegant multi-tiered floral and architectural cake designs for your wedding ceremony.',
      imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80',
      tag: 'Wedding',
      isFeatured: true // Featured card that gets "Today's Special" ribbon badge
    },
    {
      title: 'Anniversary Special',
      description: 'Sophisticated chocolate drip, red velvet, and gold-foiled designs to celebrate milestones.',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      tag: 'Anniversary',
      isFeatured: false
    },
    {
      title: 'Custom Theme Cakes',
      description: 'Personalized children character cakes, corporate logo bakes, and novelty shapes.',
      imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
      tag: 'Custom',
      isFeatured: false
    }
  ];

  return (
    <section className="py-5 bg-white position-relative" id="cakes-section">
      <div 
        ref={sectionRef}
        className="container py-4 scroll-reveal"
      >
        
        {/* Header Block */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: 'var(--color-accent-light) !important', 
              color: 'var(--color-accent-dark)', 
              fontWeight: 700, 
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          >
            Handcrafted Baking
          </span>
          <h2 className="display-fluid-2 fw-bold font-serif mb-2 text-gradient">
            Cakes for Every Occasion
          </h2>
          <p className="text-muted-custom fs-5 mx-auto" style={{ maxWidth: '600px', fontWeight: 400 }}>
            From simple milestones to spectacular grand celebrations, we bake custom designs that taste as good as they look.
          </p>
        </div>

        {/* Live Filter Bar using BS5 Pill Buttons */}
        <div className="d-flex justify-content-center mb-5">
          <div className="btn-group p-1 bg-light rounded-pill shadow-sm" role="group" aria-label="Live Cake Categories Filter">
            <button
              type="button"
              onClick={() => setSelectedTag('all')}
              className={`btn rounded-pill px-4 py-2 font-sans fw-semibold border-0 ${selectedTag === 'all' ? 'btn-primary-custom text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.85rem' }}
            >
              All Occasions
            </button>
            <button
              type="button"
              onClick={() => setSelectedTag('Wedding')}
              className={`btn rounded-pill px-4 py-2 font-sans fw-semibold border-0 ${selectedTag === 'Wedding' ? 'btn-primary-custom text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.85rem' }}
            >
              Wedding Cakes
            </button>
            <button
              type="button"
              onClick={() => setSelectedTag('Birthday')}
              className={`btn rounded-pill px-4 py-2 font-sans fw-semibold border-0 ${selectedTag === 'Birthday' ? 'btn-primary-custom text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.85rem' }}
            >
              Birthday Cakes
            </button>
            <button
              type="button"
              onClick={() => setSelectedTag('Custom')}
              className={`btn rounded-pill px-4 py-2 font-sans fw-semibold border-0 ${selectedTag === 'Custom' ? 'btn-primary-custom text-white' : 'btn-light text-muted'}`}
              style={{ fontSize: '0.85rem' }}
            >
              Custom Themes
            </button>
          </div>
        </div>

        {/* Categories Grid (with hidden/visible filter transitions) */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {categories.map((cat, idx) => {
            const isMatch = selectedTag === 'all' || cat.tag === selectedTag;
            const isImgLoaded = loadedImages[idx] || false;

            return (
              <div 
                className={`col filterable-card ${isMatch ? '' : 'hidden'}`} 
                key={idx}
                aria-hidden={!isMatch}
              >
                <div className={`premium-card h-100 ${cat.isFeatured ? 'ribbon-wrapper' : ''}`}>
                  
                  {/* Today's Special Diagonal Ribbon Badge */}
                  {cat.isFeatured && (
                    <div className="ribbon-badge">
                      Special!
                    </div>
                  )}

                  {/* Progressive image blur-up zoom wrapper */}
                  <div className="hover-zoom" style={{ height: '220px' }}>
                    <img 
                      src={isImgLoaded ? cat.imageUrl : `${cat.imageUrl}&w=20&q=20`} 
                      onLoad={() => handleImageLoad(idx)}
                      alt={`APTAGIRI ROYAL Caterers & Events Custom ${cat.title}`} 
                      className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
                      style={{ objectFit: 'cover' }}
                    />
                    <span 
                      className="position-absolute badge shadow-sm" 
                      style={{
                        bottom: '16px',
                        left: '16px',
                        backgroundColor: 'var(--color-primary-dark)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {cat.tag}
                    </span>
                  </div>

                  {/* Card Content details */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text)' }}>
                        {cat.title}
                      </h3>
                      <p className="text-muted-custom font-sans mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {cat.description}
                      </p>
                    </div>
                    <Link 
                      to="/shop" 
                      className="btn btn-sm btn-outline-primary-custom rounded-pill fw-semibold py-2 w-100 btn-modern"
                      style={{ fontSize: '0.75rem' }}
                    >
                      Browse Catalog
                    </Link>
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
