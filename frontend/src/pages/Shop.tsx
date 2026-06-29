// FILE: Shop.tsx
// CHANGES: Overhauls the baking catalog view using glassmorphic search controls, premium button groups, and grid-based category layouts.
// BS5 COMPONENTS USED: Container, Row, Col, Card, Badge, Button Group, Spinner

import React, { useEffect, useState } from 'react';
import { cakeApi } from '../services/api';
import { CakeCard } from '../components/shop/CakeCard';
import { Search } from 'lucide-react';

export const Shop: React.FC = () => {
  const [cakes, setCakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [flavor, setFlavor] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const limit = 6;

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const response = await cakeApi.getCakes({
        search: search || undefined,
        flavor: flavor || undefined,
        page,
        limit,
      });
      setCakes(response.data);
      setTotal(response.total);
    } catch (err) {
      console.error('Error fetching cakes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, [search, flavor, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFlavorSelect = (selectedFlavor: string) => {
    setFlavor(selectedFlavor);
    setPage(1);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const totalPages = Math.ceil(total / limit);

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

        {/* Header Section */}
        <div className="mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: 'var(--color-cream) !important', 
              color: 'var(--color-primary-light)', 
              fontWeight: 700, 
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          >
            Artisan Baking
          </span>
          <h2 className="display-fluid-2 fw-bold font-serif mb-2 text-gradient">
            Our Baking Catalog
          </h2>
          <p className="text-muted-custom font-sans fs-6" style={{ fontWeight: 400 }}>
            Browse our freshly baked goods and select your custom treats.
          </p>
        </div>

        {/* Glassmorphic Filter Controls */}
        <div 
          className="glass-panel p-4 mb-5 d-flex flex-column flex-lg-row gap-4 align-items-lg-center justify-content-between"
          style={{
            borderRadius: 'var(--radius-card)',
            border: '1px solid rgba(255,255,255,0.6)'
          }}
        >
          {/* Search Box */}
          <div className="position-relative" style={{ maxWidth: '360px', width: '100%' }}>
            <input
              type="text"
              placeholder="Search cakes..."
              value={search}
              onChange={handleSearchChange}
              className="form-control font-sans py-2 pe-4"
              style={{ paddingLeft: '44px', borderRadius: '30px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              aria-label="Search cakes in catalog"
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

          {/* Flavor Filters Button Group */}
          <div className="d-flex flex-wrap gap-2">
            <button
              onClick={() => handleFlavorSelect('')}
              className={`btn rounded-pill px-3 py-2 btn-modern font-sans fw-semibold ${flavor === '' ? 'btn-primary-custom text-white' : 'btn-outline-primary-custom'}`}
              style={{ fontSize: '0.8rem' }}
            >
              All Flavors
            </button>
            {['Chocolate', 'Red Velvet', 'Vanilla', 'Strawberry', 'Lemon'].map((flv) => (
              <button
                key={flv}
                onClick={() => handleFlavorSelect(flv)}
                className={`btn rounded-pill px-3 py-2 btn-modern font-sans fw-semibold ${flavor === flv ? 'btn-primary-custom text-white' : 'btn-outline-primary-custom'}`}
                style={{ fontSize: '0.8rem' }}
              >
                {flv}
              </button>
            ))}
          </div>
        </div>

        {/* Cake Grid Layout */}
        {loading ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {[1, 2, 3].map((n) => (
              <div className="col" key={n}>
                <div className="premium-card p-0" style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="skeleton w-100" style={{ height: '200px' }}></div>
                  <div className="p-4 d-flex flex-column gap-2 flex-grow-1 justify-content-between">
                    <div>
                      <div className="skeleton w-75" style={{ height: '24px' }}></div>
                      <div className="skeleton w-100 mt-3" style={{ height: '50px' }}></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="skeleton" style={{ width: '60px', height: '28px' }}></div>
                      <div className="skeleton rounded-pill" style={{ width: '100px', height: '36px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cakes.length === 0 ? (
          <div className="text-center py-5 bg-white border border-light" style={{ borderRadius: 'var(--radius-card)', borderStyle: 'dashed !important' }}>
            <p className="text-muted-custom font-sans fs-6 mb-0">No cakes matching your filter were found.</p>
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {cakes.map((cake) => (
                <div className="col" key={cake.id}>
                  <CakeCard cake={cake} onAddToCartSuccess={showToast} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-3 mt-5">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="btn btn-outline-primary-custom rounded-pill btn-modern px-4 py-2"
                  style={{ opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                >
                  Previous
                </button>
                <span className="font-sans fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="btn btn-outline-primary-custom rounded-pill btn-modern px-4 py-2"
                  style={{ opacity: page === totalPages ? 0.5 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
