import React, { useState } from 'react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: 'Cakes',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in Name, Email, and Phone fields.');
      return;
    }

    showToast(`Thank you, ${formData.name}! Your inquiry for ${formData.eventType} on ${formData.eventDate || 'soon'} has been received. Our manager will call you back shortly.`);
    
    // Clear form
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventDate: '',
      eventType: 'Cakes',
      message: ''
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '90vh', padding: '60px 0' }}>
      <div className="container">
        {/* Toast Popup */}
        {toastMessage && (
          <div className="toast-container">
            <div className="toast" style={{ borderLeftColor: 'var(--color-success)', maxWidth: '400px' }}>
              <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-5">
          <span 
            className="badge text-uppercase mb-2 px-3 py-2 badge-glow" 
            style={{ 
              backgroundColor: 'var(--color-accent-light)', 
              color: 'var(--color-accent)', 
              fontWeight: 700, 
              fontSize: '12px' 
            }}
          >
            Connect
          </span>
          <h1 className="display-4 fw-bold font-serif mb-3 text-gradient" style={{ fontFamily: 'var(--font-serif)' }}>
            Plan Your Event
          </h1>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '650px', fontWeight: 300 }}>
            Have a custom cake inquiry or coordinating event catering? Fill in details and our event manager will call you back.
          </p>
        </div>

        {/* 2-Column layout */}
        <div className="row g-5 mb-5 align-items-stretch">
          {/* Left Side: Contact Cards */}
          <div className="col-lg-5 d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              {/* Phone Card */}
              <div className="premium-card p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                    <i className="bi bi-telephone-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Phone Support</h4>
                    <span className="text-muted small">+91 80882 85818</span>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="premium-card p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: 'var(--color-success)' }}>
                    <i className="bi bi-envelope-heart-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Email Us</h4>
                    <span className="text-muted small">rohanapatagiri12@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="premium-card p-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FEF3C7', color: 'var(--color-warning)' }}>
                    <i className="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Our Location</h4>
                    <span className="text-muted small">Kanagala, Hukkeri, Belagavi, Karnataka 591225</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="p-4 text-white shadow-sm mt-4 d-flex flex-column justify-content-center text-center text-sm-start" style={{ background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)', borderRadius: 'var(--radius-md)' }}>
              <h4 className="fw-bold font-serif mb-2">WhatsApp Catering Coordinator</h4>
              <p className="small mb-3" style={{ opacity: 0.9 }}>
                Direct message our catering coordinator for custom budget-friendly menus or flavor testing slots.
              </p>
              <a 
                href="https://wa.me/918088285818?text=Hello%20Royal%20Caterers,%20I%20would%20like%20to%20inquire%20about%20your%20services." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-light btn-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 align-self-sm-start mx-auto mx-sm-0 shadow"
                style={{ color: '#075E54' }}
              >
                <i className="bi bi-whatsapp fs-6"></i> WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Right Side: Inquiry Form */}
          <div className="col-lg-7">
            <div className="premium-card p-4 h-100">
              <h2 className="h4 fw-bold font-serif mb-4 text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Booking & Inquiry Form</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6 form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="e.g. Avinash " 
                      required 
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="e.g. avinash@example.com" 
                      required 
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="form-control" 
                      placeholder="e.g. +91 90190 12345" 
                      required 
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label className="form-label">Event Date (Optional)</label>
                    <input 
                      type="date" 
                      name="eventDate" 
                      value={formData.eventDate} 
                      onChange={handleChange} 
                      className="form-control" 
                    />
                  </div>
                  <div className="col-12 form-group">
                    <label className="form-label">Service Type</label>
                    <select 
                      name="eventType" 
                      value={formData.eventType} 
                      onChange={handleChange} 
                      className="form-control"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Cakes">Artisanal Custom Cakes</option>
                      <option value="Catering">Event Dining & Catering</option>
                      <option value="Decorations">Stage & Venue Decorations</option>
                      <option value="Full Package">Full Catering + Decoration + Cake Package</option>
                    </select>
                  </div>
                  <div className="col-12 form-group">
                    <label className="form-label">Message / Details</label>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      className="form-control" 
                      rows={4} 
                      placeholder="Detail your requirements (e.g. cake flavor, head count, welcome drink choices)..."
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill w-100 py-3 fw-bold btn-modern"
                      style={{ backgroundColor: 'var(--color-primary)', border: 'none' }}
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Full-width Map Card */}
        <div className="card shadow-sm border-0 p-2 overflow-hidden" style={{ borderRadius: 'var(--radius-md)', height: '400px' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!4v1782308004411!6m8!1m7!1sba_zVt2QwggYLO7oVyP9Bw!2m2!1d16.31888487720672!2d74.42917633700534!3f354.67906370010695!4f-12.377890584654253!5f0.7820865974627469" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Aptagiri Royal Caterers Location Map Full View"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
