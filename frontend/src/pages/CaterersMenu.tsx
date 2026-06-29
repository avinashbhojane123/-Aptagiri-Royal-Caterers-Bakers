// FILE: CaterersMenu.tsx
// CHANGES: Overhauls the catering dining catalog using warm radial backdrops, glassmorphic filters, custom item cards, and progressive blur-up image loaders.
// BS5 COMPONENTS USED: Container, Row, Col, Card, Badge, Button Group, Spinner

import React, { useEffect, useState } from 'react';
import { caterersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Utensils } from 'lucide-react';

export const CaterersMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addToCart } = useCart();

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await caterersApi.getCaterersMenu();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching caterers menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (item: any) => {
    const cartProduct = {
      id: item.id,
      name: item.itemName,
      price: Number(item.price || 5.0),
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
    };
    addToCart(cartProduct);
    showToast(`Added "${item.itemName}" to your catering order!`);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Group items by category for tabs and listings
  const categories = ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  // Filter items based on active category and search text
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Group filtered items dynamically for rendering
  const groupedFilteredItems = filteredItems.reduce((acc: any, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg)', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Toast Popup Notification */}
        {toastMessage && (
          <div className="toast-container">
            <div className="toast show" style={{ borderLeft: '4px solid var(--color-accent)', borderRadius: '8px' }} role="alert" aria-live="polite" aria-atomic="true">
              <div className="d-flex align-items-center gap-2">
                <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>✓</span>
                <span>{toastMessage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section 
          className="p-5 text-center mb-5 position-relative overflow-hidden" 
          style={{
            background: 'linear-gradient(135deg, rgba(245,230,211,0.5) 0%, rgba(253,250,247,0.8) 100%)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid rgba(139, 94, 60, 0.12)'
          }}
        >
          {/* Backdrop glow */}
          <div 
            className="position-absolute rounded-circle opacity-10" 
            style={{
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
              top: '-50px',
              left: '-50px'
            }}
          ></div>

          <div className="d-inline-flex p-3 bg-white shadow-sm rounded-circle text-gradient mb-3" style={{ color: 'var(--color-primary)' }}>
            <Utensils size={32} />
          </div>
          
          <h2 className="display-fluid-2 fw-bold font-serif mb-3 text-gradient">
            Royal Caterers Dining Menu
          </h2>
          <p className="text-muted-custom font-sans fs-6 mx-auto mb-0" style={{ maxWidth: '650px', fontWeight: 400 }}>
            Premium event catering offering delicious vegetarian options. Select items to add to your cart or compile a custom menu list for your event.
          </p>
        </section>

        {/* Glassmorphic Filter Controls */}
        <div 
          className="glass-panel p-4 mb-5 d-flex flex-column gap-4"
          style={{
            borderRadius: 'var(--radius-card)',
            border: '1px solid rgba(255,255,255,0.6)'
          }}
        >
          {/* Search Box */}
          <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <input
              type="text"
              placeholder="Search catering items (e.g. Gobi, Paneer)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control font-sans py-2 pe-4"
              style={{ paddingLeft: '44px', borderRadius: '30px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              aria-label="Search catering menu items"
            />
            <Search 
              size={16} 
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)'
              }} 
            />
          </div>

          {/* Category Tabs Button Group */}
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn rounded-pill px-3 py-2 btn-modern font-sans fw-semibold ${activeCategory === cat ? 'btn-primary-custom text-white' : 'btn-outline-primary-custom'}`}
                style={{ fontSize: '0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Listings */}
        {loading ? (
          <div className="d-flex flex-column gap-5">
            {[1, 2].map((n) => (
              <div key={n}>
                <div className="skeleton mb-3" style={{ width: '180px', height: '32px' }}></div>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {[1, 2, 3].map((x) => (
                    <div className="col" key={x}>
                      <div className="premium-card p-0" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div className="skeleton w-100" style={{ height: '160px' }}></div>
                        <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                          <div className="skeleton w-70" style={{ height: '20px' }}></div>
                          <div className="skeleton w-95 mt-2" style={{ height: '40px' }}></div>
                          <div className="d-flex justify-content-between mt-3">
                            <div className="skeleton w-30" style={{ height: '24px' }}></div>
                            <div className="skeleton rounded-pill w-40" style={{ height: '30px' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-5 bg-white border border-light" style={{ borderRadius: 'var(--radius-card)', borderStyle: 'dashed !important' }}>
            <p className="text-muted-custom font-sans fs-6 mb-0">No items match your search or filter tags.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-5">
            {Object.keys(groupedFilteredItems).map((categoryName) => (
              <div key={categoryName}>
                
                {/* Category Header Separator */}
                <h3 className="h4 fw-bold font-serif mb-4 text-gradient d-flex align-items-center gap-2 pb-2 border-bottom border-light">
                  <span className="d-inline-block rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-accent)' }}></span>
                  {categoryName}
                </h3>

                {/* Category Items Grid */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                  {groupedFilteredItems[categoryName].map((item: any) => {
                    const isImgLoaded = loadedImages[item.id] || false;
                    const fallBackUrl = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80';

                    return (
                      <div className="col" key={item.id}>
                        <div className="premium-card h-100 d-flex flex-column justify-content-between p-0">
                          
                          <div>
                            {/* Progressive Image Frame */}
                            <div className="hover-zoom" style={{ height: '180px', borderBottom: '1px solid rgba(139, 94, 60, 0.08)' }}>
                              <img
                                src={isImgLoaded ? (item.imageUrl || fallBackUrl) : `${item.imageUrl || fallBackUrl}&w=20&q=20`}
                                onLoad={() => handleImageLoad(item.id)}
                                alt={`APTAGIRI ROYAL Caterers & Events Catering: ${item.itemName}`}
                                className={`w-100 h-100 img-blur-up ${isImgLoaded ? 'loaded' : ''}`}
                                style={{ objectFit: 'cover' }}
                              />
                            </div>

                            {/* Details panel */}
                            <div className="p-4">
                              <h4 className="h5 fw-bold font-serif mb-2" style={{ color: 'var(--color-text)' }}>
                                {item.itemName}
                              </h4>
                              <p 
                                className="text-muted-custom font-sans mb-0" 
                                style={{
                                  fontSize: '0.825rem',
                                  lineHeight: '1.5',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  height: '56px'
                                }}
                              >
                                {item.description || 'Premium recipe prepared fresh by our head chefs.'}
                              </p>
                            </div>
                          </div>

                          {/* Pricing & call-to-action */}
                          <div className="px-4 pb-4 pt-0 d-flex justify-content-between align-items-center">
                            {item.price && (
                              <div>
                                <span className="d-block text-muted-custom font-sans" style={{ fontSize: '0.7rem', lineHeight: 1, marginBottom: '2px' }}>Price</span>
                                <span className="font-serif fw-bold text-gradient fs-5" style={{ color: 'var(--color-primary)' }}>
                                  ₹{Number(item.price).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="btn btn-outline-primary-custom rounded-pill px-3 py-2 font-sans fw-semibold btn-modern d-flex align-items-center gap-1"
                              style={{ fontSize: '0.75rem', marginLeft: 'auto' }}
                              aria-label={`Add ${item.itemName} to your event catering menu`}
                            >
                              <ShoppingBag size={13} /> Add to Order
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
