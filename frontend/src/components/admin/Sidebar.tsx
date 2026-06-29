import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Database, ShoppingCart, Home, Utensils, MessageCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <div style={{
      width: '240px',
      backgroundColor: 'white',
      borderRight: '1px solid var(--color-border)',
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      height: 'calc(100vh - 70px)',
      position: 'sticky',
      top: '70px',
      flexShrink: 0
    }}>
      <div style={{ padding: '0 24px', marginBottom: '16px' }}>
        <h4 style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
          Management Console
        </h4>
      </div>

      <NavLink
        to="/admin"
        end
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <Home size={18} />
        Overview
      </NavLink>

      <NavLink
        to="/admin/cakes"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <Database size={18} />
        Manage Cakes
      </NavLink>

      <NavLink
        to="/admin/caterers"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <Utensils size={18} />
        Manage Caterers
      </NavLink>

      <NavLink
        to="/admin/orders"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <ShoppingCart size={18} />
        Manage Orders
      </NavLink>

      <NavLink
        to="/admin/analytics"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <BarChart3 size={18} />
        Sales Report
      </NavLink>

      <NavLink
        to="/admin/whatsapp"
        style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          fontWeight: 600,
          fontSize: '14px',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
          borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
        })}
      >
        <MessageCircle size={18} />
        WhatsApp Settings
      </NavLink>
    </div>
  );
};
