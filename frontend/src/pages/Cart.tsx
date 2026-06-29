import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container">
        <h2 style={{ fontSize: '36px', marginBottom: '32px' }}>Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'white'
          }}>
            <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>Your cart is empty</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Looks like you haven't added any sweet treats to your cart yet.
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ borderRadius: '30px' }}>
              Explore Cakes
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Cart Items List */}
            <div style={{ flex: '1 1 600px', backgroundColor: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '13px', textTransform: 'uppercase' }}>
                <span>Product</span>
                <span style={{ marginRight: '140px' }}>Quantity</span>
                <span style={{ marginRight: '40px' }}>Subtotal</span>
              </div>
              
              <div>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              <div style={{ marginTop: '24px' }}>
                <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '14px' }}>
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div style={{ flex: '0 0 350px' }}>
              <OrderSummary showCheckoutBtn={true} onCheckoutClick={handleCheckoutClick} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
