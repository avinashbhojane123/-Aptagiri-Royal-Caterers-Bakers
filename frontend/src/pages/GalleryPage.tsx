import React, { useState } from 'react';

interface GalleryItem {
  url: string;
  caption: string;
  category: 'Cakes' | 'Catering' | 'Decorations';
  description: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const galleryItems: GalleryItem[] = [
    {
      url: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=600&auto=format&fit=crop&q=80',
      caption: 'Luxury Wedding Cake',
      category: 'Cakes',
      description: 'Elegant three-tiered floral-themed vanilla buttercream cake.'
    },
    {
      url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80',
      caption: 'Milestone Cupcakes & Macarons',
      category: 'Cakes',
      description: 'Gourmet selection of colorful French macarons and pastel cupcakes.'
    },
    {
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      caption: 'Anniversary Chocolate Drip',
      category: 'Cakes',
      description: 'Rich dark chocolate cake decorated with gold dust and berries.'
    },
    {
      url: 'https://images.unsplash.com/photo-1530101121876-66298efd5df7?w=600&auto=format&fit=crop&q=80',
      caption: 'Themed Birthday Special',
      category: 'Cakes',
      description: 'Fun and colorful double-tiered birthday cake customized to order.'
    },
    {
      url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
      caption: 'Premium Buffet Display',
      category: 'Catering',
      description: 'Warm buffet settings with gourmet Indian starters and fresh rolls.'
    },
    {
      url: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&auto=format&fit=crop&q=80',
      caption: 'Royal Welcome Drinks',
      category: 'Catering',
      description: 'Refreshing colorful mocktail blends with fresh fruit garnishes.'
    },
    {
      url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=600&auto=format&fit=crop&q=80',
      caption: 'Gourmet Indian Appetizers',
      category: 'Catering',
      description: 'Deep-fried vegetable skewers, paneer, and mini samosa trays.'
    },
    {
      url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80',
      caption: 'Grand Reception Stage Decor',
      category: 'Decorations',
      description: 'Traditional floral backdrops with modern crystal chandeliers.'
    },
    {
      url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&auto=format&fit=crop&q=80',
      caption: 'Elegant Banquet Table Setting',
      category: 'Decorations',
      description: 'Premium linen tablecloths, fine cutlery, and botanical centerpieces.'
    },
    {
      url: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=600&auto=format&fit=crop&q=80',
      caption: 'Fairytale String Lights Setup',
      category: 'Decorations',
      description: 'Enchanting outdoor hanging fairy lights and warm candles.'
    }
  ];

  const categories = ['All', 'Cakes', 'Catering', 'Decorations'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '90vh', padding: '60px 0' }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <span 
            className="badge bg-primary-light text-uppercase mb-2 px-3 py-2" 
            style={{ 
              backgroundColor: 'var(--color-accent-light) !important', 
              color: 'var(--color-accent)', 
              fontWeight: 700, 
              fontSize: '12px' 
            }}
          >
            Visual Catalog
          </span>
          <h1 className="display-4 fw-bold font-serif mb-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
            Our Gallery
          </h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '650px' }}>
            Browse through our portfolio of custom-baked masterworks, event catering setups, and elegant venue decorations.
          </p>
        </div>

        {/* Categories Tab */}
        <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn px-4 py-2 rounded-pill fw-semibold shadow-sm ${activeCategory === cat ? 'btn-primary' : 'btn-outline-dark'}`}
              style={{
                backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'white',
                borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                color: activeCategory === cat ? 'white' : 'var(--color-text-main)',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              {cat === 'Catering' ? 'Catering Setup' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="row g-4">
          {filteredItems.map((item, idx) => (
            <div className="col-sm-6 col-lg-4" key={idx}>
              <div 
                className="card shadow-sm border-0 h-100 overflow-hidden"
                style={{ 
                  borderRadius: 'var(--radius-md)', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={item.url} 
                    alt={item.caption} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <span 
                    className="position-absolute top-3 right-3 badge shadow" 
                    style={{
                      top: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: 'var(--color-primary-dark)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '10px'
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="card-body p-4">
                  <h3 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text-main)', fontFamily: 'var(--font-serif)' }}>
                    {item.caption}
                  </h3>
                  <p className="text-muted fs-7 mb-0" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted fs-5">No items found matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
