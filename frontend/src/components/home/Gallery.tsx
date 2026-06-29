// FILE: Gallery.tsx
// CHANGES: Overhauls visual bakes/catering grids with clean overlay caption slides, progressive image blur-ups, and a Bootstrap 5 modal image lightbox preview.
// BS5 COMPONENTS USED: Container, Row, Col, Modal, Button, Spinner, Badge

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  url: string;
  caption: string;
}

export const Gallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
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

  // Keyboard navigation for accessible modal close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
      }
    };
    if (activeImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const images: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80',
      caption: 'Tiered Celebrations'
    },
    {
      url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
      caption: 'Fine Dessert Platters'
    },
    {
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
      caption: 'Premium Catering Setups'
    },
    {
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
      caption: 'Gourmet Chocolate Drips'
    },
    {
      url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800&auto=format&fit=crop&q=80',
      caption: 'Exquisite Mocktails'
    },
    {
      url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80',
      caption: 'Fresh Fruit Pastries'
    }
  ];

  return (
    <section className="py-5 bg-white position-relative" id="gallery-section">
      <div 
        ref={sectionRef}
        className="container py-4 scroll-reveal"
      >
        
        {/* Header Block */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: 'var(--color-cream) !important', 
              color: 'var(--color-primary-light)', 
              fontWeight: 700, 
              fontSize: '0.75rem',
              letterSpacing: '1.5px'
            }}
          >
            Visual Pleasures
          </span>
          <h2 className="display-fluid-2 fw-bold font-serif mb-2 text-gradient">
            Our Gallery
          </h2>
          <p className="text-muted-custom fs-5 mx-auto" style={{ maxWidth: '600px', fontWeight: 400 }}>
            A visual showcase of our artisanal bakes and event spreads. Click an image to view in detail.
          </p>
        </div>

        {/* Responsive Grid with overlays */}
        <div className="row g-4">
          {images.map((img, index) => {
            const isImgLoaded = loadedImages[index] || false;

            return (
              <div className="col-12 col-sm-6 col-md-4" key={index}>
                <button
                  type="button"
                  className="gallery-item w-100 p-0 border-0 bg-transparent"
                  onClick={() => setActiveImage(img)}
                  aria-label={`Open photo lightbox: ${img.caption}`}
                  style={{ display: 'block', cursor: 'zoom-in' }}
                >
                  <img 
                    src={isImgLoaded ? img.url : `${img.url}&w=20&q=20`} 
                    onLoad={() => handleImageLoad(index)}
                    alt={`APTAGIRI ROYAL Caterers & Events Gallery: ${img.caption}`} 
                    className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="gallery-overlay">
                    <span className="fw-bold text-white text-uppercase tracking-wider font-sans" style={{ fontSize: '0.8rem', letterSpacing: '1.5px', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                      {img.caption}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* React-driven Bootstrap 5 Modal Image Lightbox */}
      {activeImage && (
        <>
          <div 
            className="modal fade show d-block" 
            style={{ zIndex: 1050 }} 
            tabIndex={-1} 
            role="dialog" 
            aria-labelledby="galleryModalLabel" 
            aria-modal="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content modal-content-custom border-0 shadow-lg">
                <div className="modal-header border-bottom border-light px-4">
                  <h5 className="modal-title font-serif fw-bold text-dark fs-5" id="galleryModalLabel">
                    {activeImage.caption}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setActiveImage(null)} 
                    aria-label="Close image preview dialog"
                  ></button>
                </div>
                <div className="modal-body p-0 text-center bg-black overflow-hidden" style={{ borderBottomLeftRadius: 'var(--radius-card)', borderBottomRightRadius: 'var(--radius-card)' }}>
                  <img 
                    src={activeImage.url} 
                    className="img-fluid" 
                    alt={`Enlarged view of APTAGIRI ROYAL Caterers & Events ${activeImage.caption}`} 
                    style={{ maxHeight: '75vh', width: '100%', objectFit: 'contain' }} 
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Modal blurred backdrop */}
          <div 
            className="modal-backdrop fade show modal-backdrop-custom" 
            onClick={() => setActiveImage(null)}
          ></div>
        </>
      )}

      {/* Sticky Floating "Order Now" Action Button */}
      <Link
        to="/shop"
        className="btn btn-accent-custom btn-pulse btn-floating-order rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2"
        aria-label="Sticky Order Now button"
        style={{
          boxShadow: '0 8px 32px rgba(232, 162, 180, 0.4)'
        }}
      >
        🍰 Order Now
      </Link>

    </section>
  );
};
