import React from 'react';

export const About: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '90vh', padding: '60px 0' }}>
      <div className="container">
        {/* Hero Header */}
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
            Our Story
          </span>
          <h1 className="display-4 fw-bold font-serif mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
            Aptagiri Royal Caterers & Bakers
          </h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '650px' }}>
            ನಿಮ್ಮ ವಿಶೇಷ ದಿನಗಳನ್ನು ಆರ್ಗ್ಯಾನಿಕ್ ಸಿಹಿತಿಂಡಿಗಳೊಂದಿಗೆ ಸಿಹಿಮಯಗೊಳಿಸಿ, ಗೌರ್ಮೆಟ್ ಕ್ಯಾಟರಿಂಗ್ ಮೂಲಕ ಉತ್ಸವವನ್ನು ಉನ್ನತಮಟ್ಟಕ್ಕೆ ಏರಿಸಿ
          </p>
        </div>

        {/* Narrative Section */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-lg-6">
            <div style={{ height: '380px', overflow: 'hidden', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}>
              <img 
                src="https://www.joonsquare.com/usermanage/image/business/royal-caterer-and-planner-pvt-ltd-bathinda-37872/royal-caterer-and-planner-pvt-ltd-bathinda-logo.png" 
                alt="Rustic Bakery" 
                className="w-100 h-100" 
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          <div className="col-lg-6">
            <h2 className="display-6 fw-bold font-serif mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
              A Heritage of Culinary Perfection
            </h2>
            <p className="text-muted fs-6 mb-3" style={{ lineHeight: '1.6' }}>
              What started as a boutique pastry workshop in Bengaluru has blossomed into a full-scale premium event catering and design firm. Our mission has remained constant: to pair exquisite flavors with stunning visual presentation.
            </p>
            <p className="text-muted fs-6 mb-4" style={{ lineHeight: '1.6' }}>
              We specialize in 100% vegetarian culinary preparation. We select only farm-fresh local organic vegetables, premium dairy products, and imported chocolate to ensure that every single item on our menu is a masterwork.
            </p>
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 bg-white shadow-sm border border-light" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <h3 className="h4 fw-bold text-primary mb-1" style={{ color: 'var(--color-primary)' }}>New </h3>
                  <span className="text-muted small"> Experience</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white shadow-sm border border-light" style={{ borderRadius: 'var(--radius-sm)' }}>
                  <h3 className="h4 fw-bold text-primary mb-1" style={{ color: 'var(--color-primary)' }}>1k</h3>
                  <span className="text-muted small">Events Catered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="row g-4 mb-5 text-center">
          <div className="col-md-4">
            <div className="premium-card h-100 p-4">
              <div className="mb-3">
                <i className="bi bi-heart-fill fs-2" style={{ color: 'var(--color-accent)' }}></i>
              </div>
              <h3 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text-main)' }}>Quality First</h3>
              <p className="text-muted small mb-0">We use only organic flour, unrefined sugars, and fresh country milk. No artificial preservatives or flavorings are added.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="premium-card h-100 p-4">
              <div className="mb-3">
                <i className="bi bi-award-fill fs-2" style={{ color: 'var(--color-primary)' }}></i>
              </div>
              <h3 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text-main)' }}>Master Artisans</h3>
              <p className="text-muted small mb-0">Our kitchen comprises trained chefs who bring unmatched precision to multi-tiered cake styling and spice blending.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="premium-card h-100 p-4">
              <div className="mb-3">
                <i className="bi bi-patch-check-fill fs-2" style={{ color: 'var(--color-success)' }}></i>
              </div>
              <h3 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text-main)' }}>100% Vegetarian</h3>
              <p className="text-muted small mb-0">Our entire facility is strictly eggless and vegetarian, ensuring pristine purity and adherence to traditional food standards.</p>
            </div>
          </div>
        </div>

        {/* Chefs / Leaders Profiles */}
        <div>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold font-serif" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
              Meet Our Culinary Masters
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
              The creative professionals responsible for crafting your sweet treats and dining events.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Chef 1 */}
            <div className="col-sm-6 col-md-4">
              <div className="premium-card text-center p-4">
                <div 
                  className="mx-auto mb-3 overflow-hidden" 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--color-border)' }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=300&auto=format&fit=crop&q=80" 
                    alt="Chef Rajan" 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h4 className="fw-bold font-serif mb-1" style={{ color: 'var(--color-text-main)' }}>Chef Rajan K.</h4>
                <span className="badge mb-3 rounded-pill bg-light text-dark text-uppercase small" style={{ fontSize: '10px' }}>
                  Head Pastry Chef
                </span>
                <p className="text-muted small mb-0">With 12 years in baking, Rajan curates our unique cake recipes, flavor pairings, and fondant details.</p>
              </div>
            </div>

            {/* Chef 2 */}
            <div className="col-sm-6 col-md-4">
              <div className="premium-card text-center p-4">
                <div 
                  className="mx-auto mb-3 overflow-hidden" 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--color-border)' }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&auto=format&fit=crop&q=80" 
                    alt="Chef Meera" 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h4 className="fw-bold font-serif mb-1" style={{ color: 'var(--color-text-main)' }}>Chef Meera Prasad</h4>
                <span className="badge mb-3 rounded-pill bg-light text-dark text-uppercase small" style={{ fontSize: '10px' }}>
                  Indian Culinary Director
                </span>
                <p className="text-muted small mb-0">Meera oversees our catering kitchens, preparing delicious welcome mocktails, starters, and rich curries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
