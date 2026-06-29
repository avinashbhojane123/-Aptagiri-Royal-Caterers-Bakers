import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { orderApi } from '../../services/api';
import { Calendar, User, CreditCard, RefreshCw } from 'lucide-react';

export const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const [deliveryOtpOrderId, setDeliveryOtpOrderId] = useState<string | null>(null);
  const [deliveryOtp, setDeliveryOtp] = useState<string>('');
  const [deliveryVerifying, setDeliveryVerifying] = useState<boolean>(false);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: string, enteredOtp?: string) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, status, enteredOtp);
      if (response && response.otpRequired) {
        setDeliveryOtpOrderId(orderId);
        setDeliveryOtp('');
        setDeliveryError(null);
      } else {
        setDeliveryOtpOrderId(null);
        fetchOrders();
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      const errMsg = err.response?.data?.message || 'Failed to update status. Check backend logs.';
      if (enteredOtp) {
        setDeliveryError(errMsg);
      } else {
        alert(errMsg);
      }
    }
  };

  const handleVerifyDeliveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryOtpOrderId || !deliveryOtp.trim()) return;

    setDeliveryVerifying(true);
    setDeliveryError(null);
    try {
      await handleStatusChange(deliveryOtpOrderId, 'delivered', deliveryOtp.trim());
    } finally {
      setDeliveryVerifying(false);
    }
  };

  const getStatusRowBorder = (status: string) => {
    switch (status) {
      case 'pending': return '4px solid var(--color-warning)';
      case 'processing': return '4px solid var(--color-primary-light)';
      case 'shipped': return '4px solid var(--color-accent)';
      case 'delivered': return '4px solid var(--color-success)';
      case 'cancelled': return '4px solid var(--color-danger)';
      default: return '1px solid var(--color-border)';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      {deliveryOtpOrderId && (
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
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '12px' }}>Confirm Delivery OTP</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              A 6-digit confirmation code was sent to the customer's WhatsApp. Please retrieve and input it to complete the delivery.
            </p>

            <form onSubmit={handleVerifyDeliveryOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                value={deliveryOtp}
                onChange={(e) => setDeliveryOtp(e.target.value.replace(/\D/g, ''))}
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

              {deliveryError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '13px', backgroundColor: 'var(--color-danger-light)', padding: '10px', borderRadius: '8px', border: '1px solid var(--color-danger-border)', marginTop: '8px' }}>
                  {deliveryError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setDeliveryOtpOrderId(null)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '12px', borderRadius: '30px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deliveryVerifying}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '12px', borderRadius: '30px', background: 'var(--color-primary)', color: 'white', border: 'none', fontWeight: 600 }}
                >
                  {deliveryVerifying ? 'Confirming...' : 'Verify Delivery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Sidebar />
      
      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Manage Orders</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Process dispatch queues and edit customer purchase statuses.</p>
          </div>
          <button onClick={fetchOrders} className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Orders List Container */}
        {loading ? (
          <div className="skeleton" style={{ width: '100%', height: '300px' }}></div>
        ) : orders.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No customer orders found in the database.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{
                padding: '24px',
                borderLeft: getStatusRowBorder(order.status)
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '16px', gap: '16px' }}>
                  {/* Left Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>ORDER ID:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600 }}>{order.id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} /> {order.user?.name} ({order.user?.email})
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="form-control"
                      style={{ padding: '8px 12px', fontSize: '13px', borderRadius: '20px', cursor: 'pointer' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Middle items grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <div>
                        <strong style={{ color: 'var(--color-primary)' }}>{item.quantity}x</strong> {item.cake?.name || 'Deleted Cake'}
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '12px', marginLeft: '8px' }}>
                          (₹{Number(item.pricePerUnit).toFixed(2)} each)
                        </span>
                      </div>
                      <span style={{ fontWeight: 600 }}>
                        ₹{(Number(item.pricePerUnit) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Billing Details */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '16px', fontSize: '13px', gap: '12px' }}>
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    <strong>Address:</strong> {order.deliveryAddress}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CreditCard size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span style={{ textTransform: 'capitalize' }}>Method: {order.payment?.paymentMethod}</span>
                      <span>({order.payment?.status})</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                      Total: ₹{Number(order.totalPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
