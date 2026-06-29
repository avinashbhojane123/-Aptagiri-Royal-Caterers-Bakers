import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { cakeApi } from '../../services/api';
import { Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';

export const ManageCakes: React.FC = () => {
  const [cakes, setCakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [flavor, setFlavor] = useState('');
  const [size, setSize] = useState('medium');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const response = await cakeApi.getCakes({ limit: 100 }); // Fetch all for management
      setCakes(response.data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const openAddModal = () => {
    setSelectedCake(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setFlavor('');
    setSize('medium');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (cake: any) => {
    setSelectedCake(cake);
    setName(cake.name);
    setDescription(cake.description);
    setPrice(String(cake.price));
    setStock(String(cake.stock));
    setImageUrl(cake.imageUrl);
    setFlavor(cake.flavor);
    setSize(cake.size);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cake from the catalog?')) {
      return;
    }

    try {
      await cakeApi.deleteCake(id);
      fetchCakes();
    } catch (err) {
      console.error('Error deleting cake:', err);
      alert('Failed to delete cake.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !stock || !imageUrl || !flavor || !size) {
      setFormError('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      imageUrl,
      flavor,
      size,
    };

    try {
      if (selectedCake) {
        await cakeApi.updateCake(selectedCake.id, payload);
      } else {
        await cakeApi.createCake(payload);
      }
      setModalOpen(false);
      fetchCakes();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message?.[0] || err.response?.data?.message || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />
      
      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Manage Cakes</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Add, update, or remove cakes from your store catalog.</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add New Cake
          </button>
        </div>

        {/* Catalog Table */}
        <div className="card" style={{ padding: '24px' }}>
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          ) : cakes.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No cakes in catalog. Create one to get started!</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Cake Info</th>
                    <th>Flavor</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cakes.map((cake) => (
                    <tr key={cake.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={cake.imageUrl} alt={cake.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 600 }}>{cake.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cake.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{cake.flavor}</span>
                      </td>
                      <td style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 700 }}>{cake.size}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{Number(cake.price).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${cake.stock === 0 ? 'badge-danger' : cake.stock < 5 ? 'badge-warning' : 'badge-success'}`}>
                          {cake.stock} left
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(cake)} style={{ border: 'none', backgroundColor: '#F3EFE9', color: 'var(--color-primary)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(cake.id)} style={{ border: 'none', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit/Add Overlay Modal */}
        {modalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ width: '90%', maxWidth: '520px', padding: '32px', position: 'relative', overflowY: 'auto', maxHeight: '90vh' }}>
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
              
              <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>
                {selectedCake ? 'Edit Cake Details' : 'Create Catalog Entry'}
              </h3>

              {formError && (
                <div style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Cake Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required placeholder="Chocolate Mousse Deluxe" />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows={3} required placeholder="Detail the layers, frostings, toppings..." />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Price (₹)</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" required placeholder="24.99" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Stock Level</label>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="form-control" required placeholder="10" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Flavor</label>
                    <input type="text" value={flavor} onChange={(e) => setFlavor(e.target.value)} className="form-control" required placeholder="Chocolate, Vanilla, Lemon" />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Size Option</label>
                    <select value={size} onChange={(e) => setSize(e.target.value)} className="form-control" required>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-control" required placeholder="https://images.unsplash.com/..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '30px', marginTop: '12px' }}>
                  {isSubmitting ? 'Submitting...' : selectedCake ? 'Save Changes' : 'Create Cake'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
