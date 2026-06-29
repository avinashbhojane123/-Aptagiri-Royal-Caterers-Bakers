import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { caterersApi } from '../../services/api';
import { Plus, Edit, Trash2, X, AlertCircle } from 'lucide-react';

export const ManageCaterers: React.FC = () => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Form Fields
  const [category, setCategory] = useState('Welcome Drinks');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const data = await caterersApi.getCaterersMenu();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching admin catering menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setSelectedItem(null);
    setCategory('Welcome Drinks');
    setItemName('');
    setDescription('');
    setPrice('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setSelectedItem(item);
    setCategory(item.category);
    setItemName(item.itemName);
    setDescription(item.description || '');
    setPrice(item.price ? String(item.price) : '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from the catering menu?')) {
      return;
    }

    try {
      await caterersApi.deleteCatererItem(id);
      fetchMenu();
    } catch (err) {
      console.error('Error deleting catering item:', err);
      alert('Failed to delete catering item.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !itemName) {
      setFormError('Category and Item Name are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      category,
      itemName,
      description,
      price: price === '' ? undefined : parseFloat(price),
    };

    try {
      if (selectedItem) {
        await caterersApi.updateCatererItem(selectedItem.id, payload);
      } else {
        await caterersApi.createCatererItem(payload);
      }
      setModalOpen(false);
      fetchMenu();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.message?.[0] || err.response?.data?.message || 'Action failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Categories list for form selection & filter
  const categoriesList = [
    'Welcome Drinks',
    'Veg Starters',
    'Veg Soups',
    'Indian Bread',
    'Main Course',
    'Flavoured Rice',
    'Desserts',
  ];

  // Filter items in memory
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />
      
      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)' }}>Manage Catering Menu</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Add, update, or remove dishes from the Royal Caterers menu catalog.</p>
          </div>
          <button onClick={openAddModal} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Add Catering Item
          </button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          backgroundColor: 'white',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flexGrow: 1 }}>
            {/* Search */}
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ width: '260px', borderRadius: '20px', padding: '8px 16px', fontSize: '14px' }}
            />
            {/* Category select filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control"
              style={{ width: '200px', borderRadius: '20px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            Showing {filteredItems.length} of {menuItems.length} items
          </div>
        </div>

        {/* Catalog Table */}
        <div className="card" style={{ padding: '24px' }}>
          {loading ? (
            <div className="skeleton" style={{ width: '100%', height: '200px' }}></div>
          ) : filteredItems.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>No catering items match your filters.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Dish Details</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '15px' }}>{item.itemName}</div>
                          {item.description && (
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ textTransform: 'capitalize' }}>{item.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {item.price ? `₹${Number(item.price).toFixed(2)}` : 'No price (Quote basis)'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openEditModal(item)} style={{ border: 'none', backgroundColor: '#F3EFE9', color: 'var(--color-primary)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(item.id)} style={{ border: 'none', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {/* Modal form overlay */}
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
            <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
              <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
              
              <h3 style={{ fontSize: '24px', marginBottom: '24px' }}>
                {selectedItem ? 'Edit Catering Dish' : 'Add Catering Item'}
              </h3>

              {formError && (
                <div style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                  <AlertCircle size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Dish Name</label>
                  <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} className="form-control" required placeholder="Gobi Manchurian" />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="form-control" required>
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price per plate (₹) - Optional</label>
                  <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="form-control" placeholder="6.99 (Leave blank for custom quote)" />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows={3} placeholder="Crispy fried cauliflowers tossed in sweet and tangy Chinese sauce..." />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '30px', marginTop: '12px' }}>
                  {isSubmitting ? 'Submitting...' : selectedItem ? 'Save Changes' : 'Create Item'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
