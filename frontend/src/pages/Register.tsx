import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password checklist evaluation
  const criteria = {
    length: password.length >= 6,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#EFEBE4' };
    
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 2) {
      return { score: 33, label: 'Weak', color: '#dc2626' }; // Red
    } else if (score <= 4) {
      return { score: 66, label: 'Medium', color: '#d97706' }; // Orange/Yellow
    } else {
      return { score: 100, label: 'Strong', color: '#16a34a' }; // Green
    }
  };

  const strengthInfo = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!criteria.length) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({ name, email, password, phoneNumber });
      
      const savedUser = localStorage.getItem('cake_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/shop');
        }
      } else {
        navigate('/shop');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Email registration failed. The email might already be in use.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '14px', marginBottom: '24px' }}>
            Register to start ordering cakes.
          </p>

          {error && (
            <div style={{
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              border: '1px solid #fee2e2',
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 919019592695"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="form-control"
              />
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Include country code without + or spaces (e.g. 91 for India).
              </span>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control pe-5"
                  style={{ paddingRight: '44px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Dynamic Password Strength & Criteria Check */}
            {password && (
              <div style={{
                backgroundColor: '#FAF8F5',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  <span>STRENGTH</span>
                  <span style={{ color: strengthInfo.color, fontWeight: 800 }}>{strengthInfo.label.toUpperCase()}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#EFEBE4', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${strengthInfo.score}%`, height: '100%', backgroundColor: strengthInfo.color, transition: 'width 0.3s ease' }}></div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: criteria.length ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: criteria.length ? 700 : 400 }}>{criteria.length ? '✓' : '•'}</span>
                    <span>At least 6 characters</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: criteria.hasUpper ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: criteria.hasUpper ? 700 : 400 }}>{criteria.hasUpper ? '✓' : '•'}</span>
                    <span>At least 1 uppercase letter</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: criteria.hasNumber ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: criteria.hasNumber ? 700 : 400 }}>{criteria.hasNumber ? '✓' : '•'}</span>
                    <span>At least 1 number</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: criteria.hasSpecial ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: criteria.hasSpecial ? 700 : 400 }}>{criteria.hasSpecial ? '✓' : '•'}</span>
                    <span>At least 1 special character</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '30px', marginTop: '4px' }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '28px', color: 'var(--color-text-muted)', marginBottom: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
