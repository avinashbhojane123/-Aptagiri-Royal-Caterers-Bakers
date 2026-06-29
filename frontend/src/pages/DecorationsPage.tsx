import React from 'react';
import { Link } from 'react-router-dom';

export const DecorationsPage: React.FC = () => {
  const packages = [
    {
      title: 'Stage Floral Setup',
      description: 'Create a grand focal point for your reception or wedding stage with our masterfully arranged fresh flowers and structural arches.',
      price: 'From INR 15,000',
      imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
      features: [
        'Custom fresh flower selection (roses, marigolds, orchids)',
        'Heavy-duty stage arch frame setup',
        'Traditional and modern drapery matching your color theme',
        '4x LED spotlights and stage carpet pathway',
        'On-site manager, delivery, setup, and dismantle included'
      ]
    },
    {
      title: 'Banquet Table Styling',
      description: 'Elevate your guest dining experience. We transform ordinary tables into luxurious banquets with premium tablecloths, cutlery, and centerpieces.',
      price: 'INR 350 / Table',
      imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&auto=format&fit=crop&q=80',
      features: [
        'Premium satin/linen overlays and table runners',
        'Custom ceramic dinnerware and silver cutlery placement',
        'Botanical and floral centerpieces matching stage colors',
        'Aromatic candles and name placeholder cards',
        'Setup coordination matching guest count seating charts'
      ]
    },
    {
      title: 'Fairytale Lighting & Canopies',
      description: 'Enchant your guests with outdoor warm canopies of fairy lights and pathway lanterns, creating a magical evening ambiance.',
      price: 'From INR 8,000',
      imageUrl: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&auto=format&fit=crop&q=80',
      features: [
        'Fairytale hanging string light canopy layout',
        'Warm pathway post-lanterns and candle jars',
        'Custom neon letter name backdrop signs',
        'Safety-insured heavy weather-proof wiring installation',
        'Speed controller and dimmer packs included'
      ]
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '90vh', padding: '60px 0' }}>
      <div className="container">
        {/* Page Title */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2" 
            style={{ 
              backgroundColor: 'var(--color-accent-light)', 
              color: 'var(--color-accent)', 
              fontWeight: 700, 
              fontSize: '12px' 
            }}
          >
            Aesthetics & Design
          </span>
          <h1 className="display-4 fw-bold font-serif mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
            Royal Event Decorations
          </h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '650px' }}>
            We design breathtaking stages, banquet halls, and outdoor gardens to match your custom celebration themes.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="row g-4 mb-5 justify-content-center">
          {packages.map((pkg, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div 
                className="card border-0 shadow-sm h-100 overflow-hidden" 
                style={{ borderRadius: 'var(--radius-md)', backgroundColor: 'white' }}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img 
                    src={pkg.imageUrl} 
                    alt={pkg.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 fw-bold mb-0 font-serif" style={{ color: 'var(--color-text-main)', fontFamily: 'var(--font-serif)' }}>
                        {pkg.title}
                      </h3>
                      <span className="badge bg-success-light text-success fw-bold py-2" style={{ backgroundColor: '#ECFDF5', fontSize: '12px' }}>
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-muted small mb-4" style={{ lineHeight: '1.5' }}>
                      {pkg.description}
                    </p>
                    <h4 className="h6 fw-bold mb-2 text-dark font-serif" style={{ fontFamily: 'var(--font-serif)' }}>Included Features:</h4>
                    <ul className="list-unstyled mb-4 small text-muted">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="mb-2 d-flex align-items-start gap-2">
                          <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link 
                    to="/contact" 
                    className="btn btn-outline-primary rounded-pill w-100 py-2 fw-semibold"
                    style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary)', transition: 'all 0.2s' }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                  >
                    Enquire Package
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Theme CTA Banner */}
        <div 
          className="text-center p-5 text-white shadow" 
          style={{ 
            background: 'linear-gradient(135deg, #8C6239 0%, #5C3D24 100%)', 
            borderRadius: 'var(--radius-lg)' 
          }}
        >
          <h3 className="h2 fw-bold mb-3 font-serif">Have a Custom Theme in Mind?</h3>
          <p className="fs-5 mb-4 mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }}>
            Our event styling directors will meet you to sketch out and draft custom floral arches, ceiling decorations, and pathway lanterns.
          </p>
          <Link 
            to="/contact" 
            className="btn btn-light btn-lg rounded-pill px-5 py-3 fw-bold shadow"
            style={{ color: '#5C3D24', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Request Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
};
