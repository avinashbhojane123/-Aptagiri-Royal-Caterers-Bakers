// FILE: Services.tsx
// CHANGES: Overhauls platform specialties/services grid using premium-card structures, custom zoom hover masks, progressive blur-ups, and scroll reveal hooks.
// BS5 COMPONENTS USED: Container, Row, Col, Card, Button, Badge

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
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

  const servicesList = [
    {
      title: 'Birthday Celebrations',
      description: 'Hand-crafted specialty cakes featuring customized themes, flavors, and letters to make your milestone birthdays absolutely unforgettable.',
      imageUrl: 'https://images.unsplash.com/photo-1530101121876-66298efd5df7?w=600&auto=format&fit=crop&q=80',
      linkUrl: '/shop',
      buttonText: 'View Cake Selection'
    },
    {
      title: 'Wedding Packages',
      description: 'Elegant multi-tiered custom wedding cakes, matching dessert buffets, and full-service dining menus tailored to your beautiful wedding vision.',
      imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80',
      linkUrl: '/caterers',
      buttonText: 'Explore Wedding Menu'
    },
    {
      title: 'Corporate Events & Parties',
      description: 'Gourmet appetizer trays, buffet counters, welcome mocktails, and customized logo cakes to perfectly cater your next business meeting or party.',
      imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      linkUrl: '/caterers',
      buttonText: 'Check Corporate Catering'
    }
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FAF8F5' }}>
      <div 
        ref={sectionRef}
        className="container py-4 scroll-reveal"
      >
        
        {/* Title Block */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: 'rgba(139, 94, 60, 0.08)', 
              color: 'var(--color-primary)', 
              fontWeight: 700, 
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          >
            Artisan Quality
          </span>
          <h2 className="display-fluid-2 fw-bold font-serif mb-2 text-gradient">
            Our Specialties
          </h2>
          <p className="text-muted-custom fs-5 mx-auto" style={{ maxWidth: '600px', fontWeight: 400 }}>
            We bring passion, premium ingredients, and exquisite culinary design to every celebration.
          </p>
        </div>

        {/* Responsive Grid list of Services */}
        <div className="row g-4 justify-content-center">
          {servicesList.map((service, index) => {
            const isImgLoaded = loadedImages[index] || false;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="premium-card h-100">
                  
                  {/* Progressive blur-up and image zoom frame */}
                  <div className="hover-zoom" style={{ height: '230px' }}>
                    <img 
                      src={isImgLoaded ? service.imageUrl : `${service.imageUrl}&w=20&q=20`} 
                      onLoad={() => handleImageLoad(index)}
                      alt={`APTAGIRI ROYAL Caterers & Events Service: ${service.title}`} 
                      className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  {/* Card description details */}
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h3 className="h4 fw-bold mb-3 font-serif" style={{ color: 'var(--color-text)' }}>
                        {service.title}
                      </h3>
                      <p className="text-muted-custom font-sans mb-4" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        {service.description}
                      </p>
                    </div>
                    <Link 
                      to={service.linkUrl} 
                      className="btn btn-outline-primary-custom rounded-pill w-100 py-2 fw-semibold btn-modern"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {service.buttonText}
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
