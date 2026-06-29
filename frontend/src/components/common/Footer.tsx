import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#FAF8F5',
      borderTop: '1px solid var(--color-border)',
      padding: '40px 0',
      color: 'var(--color-text-muted)',
      fontSize: '14px',
      marginTop: '60px'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '24px'
      }}>
        <div>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--color-primary)'
          }}>
            APTAGIRI ROYAL <br />
CATERERS & EVENTS
          </span>
          <p style={{ marginTop: '8px' }}>Crafting premium artisanal cakes for your special moments.</p>
        </div>
        <div>
          <p>© {new Date().getFullYear()} APTAGIRI ROYAL
CATERERS & EVENTS  Cake Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
