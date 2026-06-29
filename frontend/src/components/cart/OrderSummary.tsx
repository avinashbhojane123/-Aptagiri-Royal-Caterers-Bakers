import React from 'react';
import { useCart } from '../../context/CartContext';
import { CreditCard } from 'lucide-react';

interface OrderSummaryProps {
  showCheckoutBtn?: boolean;
  onCheckoutClick?: () => void;
  isSubmitting?: boolean;
  checkoutBtnText?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  showCheckoutBtn = false,
  onCheckoutClick,
  isSubmitting = false,
  checkoutBtnText = 'Proceed to Checkout',
}) => {
  const { totalAmount, deliveryFee, grandTotal } = useCart();
  const freeShippingThreshold = 50.0;
  const progressToFreeShipping = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - totalAmount;

  return (
    <div className="card" style={{ backgroundColor: '#FAF8F5' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        Order Summary
      </h3>

      {/* Free Shipping Progression */}
      {totalAmount > 0 && remainingForFreeShipping > 0 ? (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            Add <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>₹{remainingForFreeShipping.toFixed(2)}</span> more for <span style={{ fontWeight: 700, color: 'var(--color-success)' }}>FREE Shipping!</span>
          </p>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#EFEBE4', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressToFreeShipping}%`, height: '100%', backgroundColor: 'var(--color-accent)', transition: 'var(--transition)' }}></div>
          </div>
        </div>
      ) : totalAmount >= freeShippingThreshold ? (
        <div style={{ marginBottom: '20px', backgroundColor: 'var(--color-success-light)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid #dcfce7' }}>
          <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: 600 }}>
            🎉 Your order qualifies for free delivery!
          </p>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
          <span>Subtotal</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee.toFixed(2)}`}</span>
        </div>

        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '8px 0' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
          <span>Total</span>
          <span style={{ color: 'var(--color-primary)' }}>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutBtn && onCheckoutClick && (
        <button
          onClick={onCheckoutClick}
          disabled={totalAmount === 0 || isSubmitting}
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', borderRadius: '30px' }}
        >
          <CreditCard size={18} />
          {isSubmitting ? 'Processing...' : checkoutBtnText}
        </button>
      )}
    </div>
  );
};
