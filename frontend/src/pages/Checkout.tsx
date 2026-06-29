import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi, paymentApi } from '../services/api';
import { OrderSummary } from '../components/cart/OrderSummary';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cartItems, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Razorpay Order State
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);
  const [purchasedItems, setPurchasedItems] = useState<any[]>([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        // Safe check if script was already unmounted
      }
    };
  }, []);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  if (cartItems.length === 0 && !successOrder) {
    return <Navigate to="/shop" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError('Please provide a delivery address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create order on the backend
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          cakeId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: address,
      };

      const orderResponse = await orderApi.createOrder(orderPayload);
      setCreatedOrder(orderResponse);
      setShowOtpModal(true);
      setIsSubmitting(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Please check stock levels and try again.');
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdOrder || !otpCode.trim()) return;

    setOtpVerifying(true);
    setOtpError(null);
    try {
      await orderApi.confirmOrder(createdOrder.id, otpCode.trim());
      setShowOtpModal(false);
      await handleInitiateRazorpayPayment(createdOrder.id);
    } catch (err: any) {
      setOtpError(err.response?.data?.message || 'Invalid OTP code. Please check the WhatsApp message sent to you.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleInitiateRazorpayPayment = async (orderId: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const paymentInfo = await paymentApi.createOrder(orderId);

      let userPrefill = { name: '', email: '', contact: '' };
      const savedUser = localStorage.getItem('cake_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          userPrefill = {
            name: parsed.name || '',
            email: parsed.email || '',
            contact: parsed.phoneNumber || '',
          };
        } catch (e) {
          console.error('Error parsing user data for Razorpay prefill:', e);
        }
      }

      const options = {
        key: paymentInfo.keyId,
        amount: paymentInfo.amount,
        currency: paymentInfo.currency,
        name: 'APTAGIRI ROYAL Caterers & Events',
        description: 'Cake Shop Order Payment',
        order_id: paymentInfo.id,
        handler: async function (response: any) {
          setIsSubmitting(true);
          try {
            const paymentResponse = await paymentApi.processPayment({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            setPurchasedItems([...cartItems]);

            setSuccessOrder({
              orderId,
              total: Number(grandTotal),
              transactionId: paymentResponse.transactionId,
            });

            clearCart();
          } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Payment signature verification failed.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: userPrefill,
        theme: {
          color: '#8b5e3c',
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to initiate Razorpay payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const WHATSAPP_ADMIN_NUMBER = '919019592695';

  const getWhatsAppUrl = () => {
    if (!successOrder) return '';
    
    let message = `*🍰 APTAGIRI ROYAL Caterers & Events - New Order Confirmed!*\n\n`;
    message += `*Order ID:* \`${successOrder.orderId}\`\n`;
    message += `*Transaction ID:* \`${successOrder.transactionId}\`\n`;
    message += `*Delivery Address:* ${address}\n`;
    message += `*Total Amount:* ₹${Number(successOrder.total).toFixed(2)}\n\n`;
    
    message += `*Items Ordered:*\n`;
    purchasedItems.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} (${item.quantity}x) - ₹${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n🧑‍🍳 Ready to prepare APTAGIRI ROYAL Caterers & Events treats!`;
    
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_ADMIN_NUMBER}&text=${encodeURIComponent(message)}`;
  };

  if (successOrder) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="card" style={{ padding: '40px' }}>
            <div style={{ color: 'var(--color-success)', marginBottom: '24px' }}>
              <CheckCircle size={64} style={{ display: 'inline-block' }} />
            </div>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Thank you for shopping with APTAGIRI ROYAL Caterers & Events. Your order has been placed and is currently being prepared.
            </p>
            
            <div style={{
              backgroundColor: '#FAF8F5',
              padding: '20px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              textAlign: 'left',
              marginBottom: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: '14px'
            }}>
              <div><strong>Order ID:</strong> <span style={{ fontFamily: 'monospace' }}>{successOrder.orderId}</span></div>
              <div><strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace' }}>{successOrder.transactionId}</span></div>
              <div><strong>Amount Paid:</strong> ₹{Number(successOrder.total).toFixed(2)}</div>
            </div>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                width: '100%',
                borderRadius: '30px',
                padding: '12px',
                backgroundColor: '#25D366',
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.859-4.42 9.863-9.864.002-2.637-1.03-5.115-2.905-6.99C16.555 1.875 14.09 .843 11.458.841 6.022.841 1.6 5.263 1.597 10.7c-.001 1.702.464 3.367 1.346 4.837L1.93 20.316l4.717-1.162zM17.472 14.382c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.724.16-.214.32-.8.99-.981 1.19-.18.2-.36.22-.68.06-2.044-1.023-3.373-2.073-4.723-4.393-.36-.62-.06-.96.24-1.26.27-.27.6-.7.9-1.05.3-.35.4-.59.6-.99.2-.4.1-.75-.05-1.06-.15-.31-1.33-3.2-1.825-4.4-.484-1.167-.978-.997-1.348-1.016-.3-.015-.65-.015-.99-.015-.34 0-.88.13-1.34.63-.46.5-1.76 1.72-1.76 4.18s1.8 4.84 2.05 5.18c.25.34 3.54 5.397 8.6 7.575 1.203.518 2.143.827 2.877 1.06 1.208.382 2.307.33 3.178.2.97-.145 2.185-.893 2.493-1.758.308-.865.308-1.61.215-1.76-.092-.15-.34-.24-.66-.4z"/>
              </svg>
              Confirm Order via WhatsApp
            </a>

            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
              style={{ width: '100%', borderRadius: '30px' }}
            >
              Track Order Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '40px 0' }}>
        <div className="container">
        <h2 style={{ fontSize: '36px', marginBottom: '32px' }}>Checkout</h2>

        {error && (
          <div style={{
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            border: '1px solid #fee2e2',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* Checkout Info Form */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Shipping Details */}
            <div className="card">
              <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                Delivery Details
              </h3>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea
                  placeholder="Enter full street address, apartment number, city, zip code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  rows={3}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            {/* Payment Details */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '4px' }}>
                Payment Method
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#FAF8F5',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '18px'
                }}>
                  ₹
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Razorpay Checkout</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Secure instant transfer via UPI, Credit/Debit cards, Net Banking, or Wallets.
                  </p>
                </div>
              </div>
              
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                Upon clicking "Place Order", the Razorpay payment window will open to securely process your transaction.
              </p>
            </div>
          </div>

          {/* Checkout Totals Summary Sidebar */}
          <div style={{ flex: '0 0 350px' }}>
            <OrderSummary
              showCheckoutBtn={true}
              checkoutBtnText={isSubmitting ? 'Processing Payment...' : `Pay ₹${grandTotal.toFixed(2)}`}
              isSubmitting={isSubmitting}
              onCheckoutClick={() => {}} // Will be handled by the form submit
            />
            
            {/* We trigger order form submit programmatically or embed the checkout button as type submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '30px', marginTop: '16px' }}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>

    {showOtpModal && createdOrder && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{
          width: '420px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>Verify Order OTP</h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            We've sent a 6-digit confirmation code to your WhatsApp number. Please enter it below to confirm your order placement.
          </p>

          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              required
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                letterSpacing: '4px',
                outline: 'none'
              }}
            />

            {otpError && (
              <div style={{ color: 'var(--color-danger)', fontSize: '13px', backgroundColor: 'var(--color-danger-light)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-danger-border)', marginTop: '8px' }}>
                {otpError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '12px', borderRadius: '30px' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={otpVerifying}
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px', borderRadius: '30px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 600 }}
              >
                {otpVerifying ? 'Verifying...' : 'Verify & Pay'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}


    </>
  );
};
