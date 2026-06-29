import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { Mail, MessageCircle, AlertCircle, CheckCircle, ShieldCheck, ArrowRight, Lock, KeyRound } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps: 1 = request OTP, 2 = reset password
  const [step, setStep] = useState<1 | 2>(1);

  // Form inputs
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [method, setMethod] = useState<'email' | 'whatsapp'>('whatsapp');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetCompleted, setResetCompleted] = useState(false);

  // Requesting the reset OTP code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or mobile number');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword({
        emailOrPhone: emailOrPhone.trim(),
        method,
      });
      setSuccessMsg(`Verification code sent to your registered ${method === 'email' ? 'email address' : 'WhatsApp number'}!`);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to request reset verification code. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  // Submitting OTP and changing password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword({
        emailOrPhone: emailOrPhone.trim(),
        otp: otp.trim(),
        newPassword,
      });
      setResetCompleted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to reset password. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center', backgroundColor: '#FAF8F5', minHeight: 'calc(100vh - 70px)' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '40px', borderRadius: '16px', border: '1px solid var(--color-border)', backgroundColor: 'white', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
          
          {resetCompleted ? (
            /* Success screen state */
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#D1E7DD', color: '#198754', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '12px' }}>Password Updated!</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '15px', lineHeight: 1.5, marginBottom: '24px' }}>
                Your password has been successfully reset. We are redirecting you to the log in page now...
              </p>
              <div className="spinner-border text-success" role="status" style={{ width: '24px', height: '24px', borderWidth: '3px' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            /* Forms wizard state */
            <>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'center', marginBottom: '8px' }}>
                Password Recovery
              </h2>
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '14px', marginBottom: '32px', lineHeight: 1.4 }}>
                {step === 1 
                  ? 'Request a secure verification code to reset your account password.' 
                  : 'Enter the code and specify a strong new password.'}
              </p>

              {error && (
                <div style={{
                  backgroundColor: '#F8D7DA',
                  color: '#842029',
                  border: '1px solid #F5C2C7',
                  padding: '14px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && step === 2 && (
                <div style={{
                  backgroundColor: '#D1E7DD',
                  color: '#0F5132',
                  border: '1px solid #BADBCC',
                  padding: '14px',
                  borderRadius: '8px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{successMsg}</span>
                </div>
              )}

              {step === 1 ? (
                /* Step 1: Request code */
                <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Email or Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. you@example.com or 919019592695"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="form-control"
                      style={{ padding: '12px 16px', borderRadius: '8px' }}
                      required
                    />
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px', display: 'block' }}>
                      Enter your account username (email) or linked WhatsApp number.
                    </span>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, marginBottom: '10px', display: 'block' }}>
                      Send Verification Code Via
                    </label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      {/* WhatsApp Pill option */}
                      <button
                        type="button"
                        onClick={() => setMethod('whatsapp')}
                        style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: '12px',
                          border: method === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--color-border)',
                          backgroundColor: method === 'whatsapp' ? '#E8FBEA' : 'white',
                          color: method === 'whatsapp' ? '#0F5132' : 'var(--color-text-main)',
                          fontWeight: 600,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <MessageCircle size={18} style={{ color: '#25D366' }} />
                        WhatsApp
                      </button>

                      {/* Email Pill option */}
                      <button
                        type="button"
                        onClick={() => setMethod('email')}
                        style={{
                          flex: 1,
                          padding: '16px',
                          borderRadius: '12px',
                          border: method === 'email' ? '2px solid #EA4335' : '1px solid var(--color-border)',
                          backgroundColor: method === 'email' ? '#FEECEB' : 'white',
                          color: method === 'email' ? '#842029' : 'var(--color-text-main)',
                          fontWeight: 600,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Mail size={18} style={{ color: '#EA4335' }} />
                        Email
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      marginTop: '12px',
                      background: 'var(--color-primary)',
                      border: 'none',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? 'Requesting OTP...' : 'Send Verification OTP'}
                    {!loading && <ArrowRight size={16} />}
                  </button>
                </form>
              ) : (
                /* Step 2: Input code and reset password */
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Verification OTP Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="form-control"
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        letterSpacing: '6px'
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        style={{ padding: '12px 16px 12px 44px', borderRadius: '8px' }}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600 }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                        style={{ padding: '12px 16px 12px 44px', borderRadius: '8px' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-outline"
                      style={{ flex: 1, padding: '12px', borderRadius: '30px' }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '30px',
                        background: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600
                      }}
                    >
                      {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                  </div>
                </form>
              )}

              <div style={{ textAlign: 'center', marginTop: '28px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                <Link to="/login" style={{ color: 'var(--color-text-muted)', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                  Back to Log In
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
