import React, { useEffect, useState } from 'react';
import { orderApi } from '../../services/api';
import { ShoppingBag, Calendar, MapPin } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'processing': return 'badge-info';
      case 'shipped': return 'badge-info';
      case 'delivered': return 'badge-success';
      case 'cancelled': return 'badge-danger';
      default: return 'badge-outline';
    }
  };

  return (
    <div style={{ padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>My Orders</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Track and check the status of your sweet purchases.
        </p>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2].map((n) => (
              <div className="card" key={n} style={{ height: '140px' }}>
                <div className="skeleton" style={{ width: '30%', height: '24px', marginBottom: '16px' }}></div>
                <div className="skeleton" style={{ width: '80%', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '50%', height: '16px' }}></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 0',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'white'
          }}>
            <ShoppingBag size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>No orders found</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              You haven't placed any orders yet. Visit our shop to find delicious options!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => (
              <div className="card" key={order.id} style={{ padding: '24px' }}>
                {/* Order Header Info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>ORDER ID</span>
                    <div style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 600 }}>{order.id}</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                      <Calendar size={15} />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ textTransform: 'capitalize', fontSize: '13px', padding: '6px 12px' }}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items Ordered List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {order.orderItems?.map((item: any) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '4px',
                          backgroundColor: '#F3EFE9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          color: 'var(--color-primary)'
                        }}>
                          {item.quantity}x
                        </span>
                        <span style={{ fontWeight: 500 }}>{item.cake?.name || 'Deleted Cake'}</span>
                      </div>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        ₹{Number(item.pricePerUnit).toFixed(2)} each
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address & Payment Info */}
                <div style={{
                  backgroundColor: '#FAF8F5',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '13px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', maxWidth: '60%' }}>
                    <MapPin size={16} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.deliveryAddress}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Payment: </span>
                      <span style={{
                        fontWeight: 600,
                        color: order.payment?.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)'
                      }}>
                        {order.payment?.status === 'completed' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    
                    <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--color-primary)' }}>
                      Total: ₹{Number(order.totalPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
