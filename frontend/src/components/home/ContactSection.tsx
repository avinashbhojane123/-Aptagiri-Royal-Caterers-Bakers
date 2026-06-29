import React from 'react';

export const ContactSection: React.FC = () => {
  return (
    <section className="py-5 bg-light" id="contact">
      <div className="container py-4">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold font-serif mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)' }}>
            Visit or Contact Us
          </h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            We'd love to host you or discuss catering plans for your next special event.
          </p>
        </div>

        <div className="row g-5 align-items-stretch">
          {/* Left Column: Contact Cards & WhatsApp */}
          <div className="col-lg-5 d-flex flex-column justify-content-between">
            <div className="d-flex flex-column gap-3">
              {/* Phone Card */}
              <div className="card shadow-sm border-0 p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--color-accent-light)', 
                      color: 'var(--color-accent)' 
                    }}
                  >
                    <i className="bi bi-telephone-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Phone Support</h4>
                    <span className="text-muted small">+91 90190 12345 / +91 80230 54321</span>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="card shadow-sm border-0 p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ECFDF5', 
                      color: 'var(--color-success)' 
                    }}
                  >
                    <i className="bi bi-envelope-heart-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Email Us</h4>
                    <span className="text-muted small">orders@royal-caterers.com</span>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="card shadow-sm border-0 p-3" style={{ borderRadius: 'var(--radius-md)' }}>
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center" 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '50%', 
                      backgroundColor: '#FEF3C7', 
                      color: 'var(--color-warning)' 
                    }}
                  >
                    <i className="bi bi-geo-alt-fill fs-5"></i>
                  </div>
                  <div>
                    <h4 className="h6 fw-bold mb-1 font-serif text-dark" style={{ fontFamily: 'var(--font-serif)' }}>Our Address</h4>
                    <span className="text-muted small">Aptagiri Palace Grounds, Bengaluru, KA 560001</span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Block */}
            <div 
              className="p-4 text-white shadow-sm mt-4 d-flex flex-column justify-content-center text-center text-sm-start" 
              style={{ 
                background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)', 
                borderRadius: 'var(--radius-md)' 
              }}
            >
              <h4 className="fw-bold font-serif mb-2">Direct WhatsApp Chat</h4>
              <p className="small mb-3" style={{ opacity: 0.9 }}>
                Instantly connect with our wedding planner and catering coordinator to schedule food tasting slots.
              </p>
              <a 
                href="https://wa.me/919019012345?text=Hello%20Royal%20Caterers,%20I%20would%20like%20to%20inquire%20about%20your%20services." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-light btn-sm rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 align-self-sm-start mx-auto mx-sm-0 shadow"
                style={{ color: '#075E54' }}
              >
                <i className="bi bi-whatsapp fs-6"></i> Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Frame */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 p-2 h-100 overflow-hidden" style={{ borderRadius: 'var(--radius-md)' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9254823297127!2d77.59239841123987!3d12.976593587282877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1672c1012c5f%3A0xf6de5c102a0a2df3!2sBengaluru%20Palace!5e0!3m2!1sen!2sin!4v1719000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '350px', borderRadius: 'var(--radius-sm)' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Aptagiri Royal Caterers Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
