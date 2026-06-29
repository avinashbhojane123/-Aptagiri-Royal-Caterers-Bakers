import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { analyticsApi, orderApi } from '../../services/api';
import { IndianRupee, ClipboardList, AlertTriangle, RefreshCw } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    outOfStockCakes: 0,
    pendingOrders: 0,
    processingOrders: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, ordersData] = await Promise.all([
        analyticsApi.getStats(),
        orderApi.getAllOrders(),
      ]);
      setStats(statsData);
      setOrders(ordersData.slice(0, 5)); // Keep only 5 recent orders
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />
      
      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Overview Dashboard</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Quick performance summary of your cake shop.</p>
          </div>
          <button onClick={loadData} className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-4" style={{ marginBottom: '40px' }}>
          {/* Card 1: Revenue */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IndianRupee size={24} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL REVENUE</span>
              <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: 'var(--color-primary)' }}>
                ₹{stats.totalRevenue.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL ORDERS</span>
              <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>
                {stats.totalOrders}
              </div>
            </div>
          </div>

          {/* Card 3: Stock Warning */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>STOCK WARNINGS</span>
              <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px', color: stats.outOfStockCakes > 0 ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                {stats.outOfStockCakes} Out
              </div>
            </div>
          </div>

          {/* Card 4: Processing */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>PREPARING ORDERS</span>
              <div style={{ fontSize: '24px', fontWeight: 700, marginTop: '4px' }}>
                {stats.processingOrders} Active
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Panel */}
        <div className="card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>Recent Orders</h3>

          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          ) : orders.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No customer transactions recorded yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Address</th>
                    <th>Total Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.id.slice(0, 8)}...</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.deliveryAddress}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{Number(order.totalPrice).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${
                          order.status === 'delivered' ? 'badge-success' :
                          order.status === 'cancelled' ? 'badge-danger' :
                          'badge-warning'
                        }`} style={{ textTransform: 'capitalize' }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
