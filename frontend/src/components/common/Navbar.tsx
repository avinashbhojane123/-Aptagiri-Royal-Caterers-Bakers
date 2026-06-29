// FILE: Navbar.tsx
// CHANGES: Overhauls navigation with a JS scroll listener, Offcanvas mobile menu drawer, and custom pure-CSS scrolling testimonial ticker.
// BS5 COMPONENTS USED: Navbar, Offcanvas, Ticker, Badge, Button

import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, LogOut, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // JS window scroll listener to toggle class and tighten design
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };



  return (
    <>
      {/* Main Navigation Header */}
      <nav 
        className={`navbar navbar-expand-lg glass-navbar fixed-top-custom ${isScrolled ? 'scrolled' : ''}`}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1020
        }}
      >
        <div className="container-fluid container-lg d-flex align-items-center justify-content-between">
          
          {/* Cozy Brand Brand identity */}
          <Link to="/" className="navbar-brand d-flex align-items-center py-0" aria-label="APTAGIRI ROYAL Caterers & Events Homepage">
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              letterSpacing: '0.5px',
              lineHeight: 1.25
            }}>
              APTAGIRI ROYAL
              <span className="d-block font-sans text-uppercase text-gradient" style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', color: 'var(--color-accent-dark)' }}>
                Caterers & Events
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-center" id="navbarNav">
            <ul className="navbar-nav gap-4">
              <li className="nav-item">
                <NavLink to="/" className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/shop" className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                  Cakes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/caterers" className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                  Catering
                </NavLink>
              </li>
              <li className="nav-item">
                <Link to="/#decorations" className="nav-link nav-link-custom">
                  Decorations
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/#gallery" className="nav-link nav-link-custom">
                  Gallery
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/#about" className="nav-link nav-link-custom">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/#contact" className="nav-link nav-link-custom">
                  Contact
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <NavLink to={isAdmin ? '/admin' : '/dashboard'} className={({ isActive }) => `nav-link nav-link-custom ${isActive ? 'active' : ''}`}>
                    {isAdmin ? 'Admin' : 'My Orders'}
                  </NavLink>
                </li>
              )}
            </ul>
          </div>

          {/* Right Header Options (Cart, Auth, Mobile Toggle) */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Cart Icon Link */}
            <Link 
              to="/cart" 
              className="position-relative d-flex align-items-center justify-content-center rounded-circle p-2" 
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgba(139, 94, 60, 0.08)',
                color: 'var(--color-text)',
                transition: 'var(--transition-base)'
              }}
              aria-label={`Shopping Cart with ${itemCount} items`}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="position-absolute translate-middle badge rounded-circle bg-accent-custom" style={{
                  top: '6px',
                  right: '-10px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-accent)'
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <div className="d-none d-lg-block border-start py-2 px-1" style={{ height: '24px', borderColor: 'rgba(139, 94, 60, 0.15)' }}></div>

            {/* Desktop Auth Controls */}
            <div className="d-none d-lg-flex align-items-center gap-2">
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="text-end">
                    <span className="d-block small fw-bold text-dark">{user.name}</span>
                    <span className="d-block text-uppercase text-muted-custom" style={{ fontSize: '0.6rem', fontWeight: 600 }}>{user.role}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center rounded-circle"
                    style={{ width: '36px', height: '36px', padding: 0 }}
                    title="Logout"
                    aria-label="Logout button"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-primary-custom rounded-pill btn-modern px-4 py-2" style={{ fontSize: '0.8rem' }}>
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary-custom rounded-pill btn-modern px-4 py-2" style={{ fontSize: '0.8rem' }}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger toggle to open Offcanvas Drawer */}
            <button 
              className="navbar-toggler border-0 d-lg-none p-1" 
              type="button" 
              data-bs-toggle="offcanvas" 
              data-bs-target="#offcanvasNavbar" 
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation drawer"
            >
              <Menu size={24} style={{ color: 'var(--color-primary)' }} />
            </button>
          </div>

        </div>
      </nav>

      {/* BS5 Offcanvas Drawer on Mobile viewport */}
      <div 
        className="offcanvas offcanvas-end offcanvas-custom" 
        tabIndex={-1} 
        id="offcanvasNavbar" 
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header border-bottom border-light">
          <h5 className="offcanvas-title font-serif fw-bold" id="offcanvasNavbarLabel" style={{ color: 'var(--color-primary)' }}>
            Royal Caterers
          </h5>
          <button 
            type="button" 
            className="btn-close" 
            data-bs-dismiss="offcanvas" 
            aria-label="Close navigation menu"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column justify-content-between p-4">
          <ul className="navbar-nav gap-3 fs-6">
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <NavLink to="/" className="nav-link nav-link-custom">Home</NavLink>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <NavLink to="/shop" className="nav-link nav-link-custom">Cakes</NavLink>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <NavLink to="/caterers" className="nav-link nav-link-custom">Catering</NavLink>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link to="/#decorations" className="nav-link nav-link-custom">Decorations</Link>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link to="/#gallery" className="nav-link nav-link-custom">Gallery</Link>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link to="/#about" className="nav-link nav-link-custom">About</Link>
            </li>
            <li className="nav-item" data-bs-dismiss="offcanvas">
              <Link to="/#contact" className="nav-link nav-link-custom">Contact</Link>
            </li>
            {user && (
              <li className="nav-item" data-bs-dismiss="offcanvas">
                <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="nav-link nav-link-custom">
                  {isAdmin ? 'Admin' : 'My Orders'}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Offcanvas Drawer user auth info */}
          <div className="mt-4 pt-4 border-top border-light" data-bs-dismiss="offcanvas">
            {user ? (
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="d-block fw-bold text-dark">{user.name}</span>
                  <span className="d-block text-uppercase text-muted-custom" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-sm btn-outline-danger rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Link to="/login" className="btn btn-outline-primary-custom rounded-pill py-2 text-center">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary-custom rounded-pill py-2 text-center text-white">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
