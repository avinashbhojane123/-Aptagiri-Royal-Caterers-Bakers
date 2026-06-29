import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { analyticsApi } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, RefreshCw, ChefHat } from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [cakeData, setCakeData] = useState<any[]>([]);
  const [catererData, setCatererData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [cakes, caterers] = await Promise.all([
        analyticsApi.getTopSelling(),
        analyticsApi.getTopCaterersSelling(),
      ]);
      setCakeData(cakes);
      setCatererData(caterers);
    } catch (err) {
      console.error('Error fetching analytics reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />
      
      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Store Analytics</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Check the sales metrics and top popular items of your Cake Shop & Royal Caterers.</p>
          </div>
          <button onClick={fetchAnalytics} className="btn btn-outline" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Charts Side-by-Side */}
        <div className="grid grid-cols-2" style={{ marginBottom: '40px' }}>
          {/* Cake Chart */}
          <div className="card" style={{ padding: '24px', height: '400px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-accent)' }} /> Top Selling Cakes by Quantity
            </h3>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: '80%' }}></div>
            ) : cakeData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No transactions recorded.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={cakeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-text-muted)" tickLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-text-muted)" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  <Legend />
                  <Bar dataKey="totalSold" name="Qty Sold" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalRevenue" name="Revenue (₹)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Caterers Chart */}
          <div className="card" style={{ padding: '24px', height: '400px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ChefHat size={18} style={{ color: 'var(--color-primary-light)' }} /> Most Popular Catering Items
            </h3>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: '80%' }}></div>
            ) : catererData.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No items seeded in the database.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={catererData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                  <XAxis dataKey="name" fontSize={11} stroke="var(--color-text-muted)" tickLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-text-muted)" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                  <Legend />
                  <Bar dataKey="totalSold" name="Qty Ordered" fill="var(--color-primary-light)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalRevenue" name="Revenue (₹)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Detailed Stats Tables Grid */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Cakes Table */}
          <div className="card" style={{ flex: '1 1 400px', padding: '24px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Cakes Performance</h3>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: '150px' }}></div>
            ) : cakeData.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No statistics recorded.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Cake Name</th>
                      <th style={{ textAlign: 'center' }}>Sold</th>
                      <th style={{ textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cakeData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td style={{ textAlign: 'center' }}>{item.totalSold}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-success)' }}>
                          ₹{Number(item.totalRevenue).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Caterers Table */}
          <div className="card" style={{ flex: '1 1 400px', padding: '24px', backgroundColor: 'white' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Catering Popularity</h3>
            {loading ? (
              <div className="skeleton" style={{ width: '100%', height: '150px' }}></div>
            ) : catererData.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No statistics recorded.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Caterer Item</th>
                      <th style={{ textAlign: 'center' }}>Orders</th>
                      <th style={{ textAlign: 'right' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catererData.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 600 }}>{item.name}</td>
                        <td style={{ textAlign: 'center' }}>{item.totalSold}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-success)' }}>
                          ₹{Number(item.totalRevenue).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
