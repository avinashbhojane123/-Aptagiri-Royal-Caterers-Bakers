// FILE: HeroBanner.tsx
// CHANGES: Implements a premium full-width hero header featuring a cozy, warm parchment radial gradient, floating glassmorphic container, and scroll-reveal triggers.
// BS5 COMPONENTS USED: Container, Row, Col, Badge, Button

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const HeroBanner: React.FC = () => {
  const revealRef = useRef<HTMLDivElement>(null);

  // Intersection Observer scroll reveal hook
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (revealRef.current) {
      observer.observe(revealRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      className="position-relative overflow-hidden w-100 gradient-cream-radial d-flex align-items-center justify-content-center"
      style={{
        minHeight: '85vh',
        padding: '6rem 1rem'
      }}
    >
      {/* Decorative Warm Backlighting Glow */}
      <div 
        className="position-absolute rounded-circle opacity-25" 
        style={{
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, var(--color-accent) 0%, rgba(253, 250, 247, 0) 70%)',
          top: '-10%',
          right: '-5%',
          pointerEvents: 'none'
        }}
      ></div>
      <div 
        className="position-absolute rounded-circle opacity-20" 
        style={{
          width: '35vw',
          height: '35vw',
          background: 'radial-gradient(circle, var(--color-primary-light) 0%, rgba(253, 250, 247, 0) 75%)',
          bottom: '-5%',
          left: '-5%',
          pointerEvents: 'none'
        }}
      ></div>

      {/* Main Responsive Grid Layout */}
      <div className="container position-relative z-1">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10 text-center">
            
            {/* Glassmorphic card overlay with float animations */}
            <div 
              ref={revealRef}
              className="scroll-reveal p-4 p-md-5 glass-panel animate-float"
              style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid rgba(255, 255, 255, 0.55)',
                boxShadow: '0 20px 50px rgba(139, 94, 60, 0.08)'
              }}
            >
              {/* Cozy ribbon accent */}
              <span 
                className="badge text-uppercase mb-3 px-3 py-2 badge-glow font-sans"
                style={{
                  background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  borderRadius: '30px'
                }}
              >
                🧁 Royal Caterers & Bakers
              </span>

              {/* Serif Display Heading with clamp spacing */}
              <h1 
                className="display-fluid-1 fw-bold mb-4 font-serif text-dark"
                style={{
                  textShadow: '0 2px 8px rgba(44, 24, 16, 0.04)'
                }}
              >
                Crafting Extraordinary Flavors for Unforgettable Moments
              </h1>

              {/* Body Text */}
              <p 
                className="lead fs-5 mb-5 mx-auto text-muted-custom font-sans"
                style={{
                  maxWidth: '750px',
                  fontWeight: 400,
                  lineHeight: 1.75
                }}
              >
                Indulge in artisanal vegetarian cakes made from scratch and premium event catering, tailored to sweeten your special celebrations in Bengaluru.
              </p>

              {/* Action Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                <Link 
                  to="/shop" 
                  className="btn btn-accent-custom btn-lg rounded-pill px-5 py-3 fw-bold btn-modern shadow-lg"
                  aria-label="Order cakes from our online catalog"
                >
                  Order Now
                </Link>
                <Link 
                  to="/caterers" 
                  className="btn btn-outline-primary-custom btn-lg rounded-pill px-5 py-3 fw-bold btn-modern"
                  aria-label="Browse our vegetarian catering options"
                >
                  Explore Catering Menu
                </Link>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
