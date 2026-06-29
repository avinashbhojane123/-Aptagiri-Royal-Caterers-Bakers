import React from 'react';
import { useCart } from '../../context/CartContext';
import type { CartItem as CartItemType } from '../../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid var(--color-border)'
    }}>
      {/* Thumbnail */}
      <img
        src={item.imageUrl}
        alt={item.name}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: 'var(--radius-sm)',
          objectFit: 'cover',
          backgroundColor: '#FAF8F5'
        }}
      />

      {/* Info */}
      <div style={{ flexGrow: 1 }}>
        <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{item.name}</h4>
        <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginTop: '4px' }}>
          ₹{item.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Adjuster */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        padding: '2px 8px',
        gap: '12px',
        backgroundColor: 'white'
      }}>
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Minus size={14} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600, width: '20px', textAlign: 'center' }}>
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div style={{ width: '80px', textAlign: 'right', fontWeight: 700 }}>
        ₹{(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Delete Trigger */}
      <button
        onClick={() => removeFromCart(item.id)}
        style={{
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          padding: '8px',
          transition: 'var(--transition)'
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
        onMouseOut={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};
