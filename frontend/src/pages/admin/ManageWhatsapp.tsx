import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { whatsappApi } from '../../services/api';
import { MessageCircle, RefreshCw, Send, Smartphone, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export const ManageWhatsapp: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Test message form state
  const [testTo, setTestTo] = useState<string>('');
  const [testMsg, setTestMsg] = useState<string>('Hello! This is a test notification from APTAGIRI ROYAL Caterers & Events.');
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Session action state
  const [restarting, setRestarting] = useState<boolean>(false);

  const fetchStatus = async (showLoading = false) => {
    if (showLoading) setLoadingStatus(true);
    try {
      const data = await whatsappApi.getStatus();
      setStatusData(data);
      setErrorStatus(null);
    } catch (err: any) {
      console.error('Error loading WhatsApp status:', err);
      setErrorStatus(err.response?.data?.message || 'Failed to fetch WhatsApp gateway status. Make sure the backend is active.');
    } finally {
      if (showLoading) setLoadingStatus(false);
    }
  };

  // Poll status when in setup modes to auto-detect connection
  useEffect(() => {
    fetchStatus(true);

    const interval = setInterval(() => {
      // Auto refresh every 5 seconds if not connected
      setStatusData((prev: any) => {
        if (!prev || prev.status !== 'ready') {
          fetchStatus(false);
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTo.trim() || !testMsg.trim()) return;

    setSendingTest(true);
    setTestResult(null);
    try {
      await whatsappApi.sendTestMessage({ to: testTo, message: testMsg });
      setTestResult({ success: true, message: 'WhatsApp message sent successfully!' });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || 'Failed to deliver message. Make sure the WhatsApp gateway is active.',
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleRestart = async () => {
    if (!window.confirm('Are you sure you want to restart the WhatsApp session? This will disconnect current actions temporarily.')) {
      return;
    }
    setRestarting(true);
    try {
      await whatsappApi.restartSession();
      alert('WhatsApp session restart initiated. Waiting for re-initialization...');
      fetchStatus(true);
    } catch (err: any) {
      alert('Failed to restart session: ' + (err.response?.data?.message || err.message));
    } finally {
      setRestarting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
      case 'connected':
        return (
          <span
            className="badge badge-success"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#D1E7DD',
              color: '#0F5132',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#198754',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            ></span>
            Online / Connected
          </span>
        );
      case 'qr_ready':
        return (
          <span
            className="badge"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFF3CD',
              color: '#664D03',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#FFC107',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            ></span>
            Awaiting QR Scan
          </span>
        );
      case 'initializing':
      case 'authenticating':
        return (
          <span
            className="badge"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#CFF4FC',
              color: '#055160',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#0DCAF0',
                display: 'inline-block',
                animation: 'pulse 1.5s infinite',
              }}
            ></span>
            Starting...
          </span>
        );
      default:
        return (
          <span
            className="badge"
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#F8D7DA',
              color: '#842029',
              fontWeight: 600,
            }}
          >
            Disconnected
          </span>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
      <Sidebar />

      <main style={{ flexGrow: 1, padding: '40px', backgroundColor: '#FAF8F5' }}>
        {/* Style tag for animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
          }
        `}} />

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MessageCircle size={32} style={{ color: '#25D366' }} /> WhatsApp Notification Settings
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>
              Configure and test the OpenWA gateway to automate notification deliveries for orders and payments.
            </p>
          </div>
          <button
            onClick={() => fetchStatus(true)}
            className="btn btn-outline"
            style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px' }}
          >
            <RefreshCw size={14} className={loadingStatus ? 'spin' : ''} style={{ animation: loadingStatus ? 'spin 1s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>

        {errorStatus && (
          <div className="alert alert-danger" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '32px', backgroundColor: '#F8D7DA', color: '#842029', border: '1px solid #F5C2C7' }}>
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>Connection Error</h5>
              <p style={{ margin: 0, fontSize: '14px' }}>{errorStatus}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '32px' }}>
          {/* Section 1: Session Status Card */}
          <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', margin: 0 }}>Gateway Status</h3>
              {statusData && getStatusBadge(statusData.status)}
            </div>

            {statusData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Session Name</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{statusData.name}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Session ID</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{statusData.id || 'N/A'}</span>
                </div>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Connected Number</span>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{statusData.phone ? `+${statusData.phone.replace('@c.us', '')}` : 'Not connected'}</span>
                </div>
                {statusData.pushName && (
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>WhatsApp Nickname</span>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{statusData.pushName}</span>
                  </div>
                )}
                {statusData.connectedAt && (
                  <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>Connected Since</span>
                    <span style={{ fontSize: '14px' }}>{new Date(statusData.connectedAt).toLocaleString()}</span>
                  </div>
                )}

                {/* Session controls */}
                <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                  <button
                    onClick={handleRestart}
                    disabled={restarting}
                    className="btn btn-outline"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 600,
                    }}
                  >
                    <RefreshCw size={16} className={restarting ? 'spin' : ''} />
                    {restarting ? 'Restarting...' : 'Restart Session'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                {loadingStatus ? 'Loading gateway parameters...' : 'No session data retrieved.'}
              </div>
            )}
          </div>

          {/* Section 2: QR Authentication Card */}
          {statusData && statusData.status === 'qr_ready' && (
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', border: '1px solid #FFE69C', backgroundColor: '#FFFDF5' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', color: '#664D03', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Smartphone size={22} /> Link WhatsApp Account
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '6px' }}>
                  Open WhatsApp on your mobile device, tap <strong>Linked Devices</strong>, and scan the QR code below.
                </p>
              </div>

              {statusData.qrCode ? (
                <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #EAEAEA' }}>
                  <img
                    src={statusData.qrCode}
                    alt="WhatsApp Pairing QR Code"
                    style={{ width: '240px', height: '240px', display: 'block' }}
                  />
                </div>
              ) : (
                <div style={{ width: '240px', height: '240px', borderRadius: '16px', border: '2px dashed #D3D3D3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite', marginBottom: '12px' }} />
                  <span>Loading QR code...</span>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 16px', borderRadius: '8px', backgroundColor: '#FFF3CD', border: '1px solid #FFE69C', width: '100%' }}>
                <Info size={16} style={{ color: '#664D03', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#664D03', lineHeight: '1.4' }}>
                  The QR code updates periodically. The dashboard will automatically detect authentication once linked.
                </span>
              </div>
            </div>
          )}

          {/* Section 3: Connected State Information */}
          {statusData && statusData.status === 'ready' && (
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', border: '1px solid #BADBCC', backgroundColor: '#F4FAF7' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1E7DD', color: '#198754', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={36} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '20px', color: '#0F5132', margin: 0 }}>Gateway Active</h3>
                <p style={{ color: '#198754', fontSize: '14px', marginTop: '6px', fontWeight: 600 }}>
                  Ready to dispatch WhatsApp alerts
                </p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '12px', maxWidth: '300px', margin: '12px auto 0' }}>
                  All order creations, custom catering booking inquiries, and customer transaction approvals will route messages automatically to clients.
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Send Test Message Card */}
          <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={18} /> Test Message Dispatcher
            </h3>

            <form onSubmit={handleSendTest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 919019592695"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  disabled={statusData?.status !== 'ready' || sendingTest}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '14px',
                    backgroundColor: statusData?.status !== 'ready' ? '#EAEAEA' : 'white',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                  Include country code (e.g. 91 for India) without '+' or spaces.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Message Content
                </label>
                <textarea
                  rows={3}
                  value={testMsg}
                  onChange={(e) => setTestMsg(e.target.value)}
                  disabled={statusData?.status !== 'ready' || sendingTest}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    fontSize: '14px',
                    resize: 'none',
                    backgroundColor: statusData?.status !== 'ready' ? '#EAEAEA' : 'white',
                  }}
                />
              </div>

              {testResult && (
                <div
                  className={`alert ${testResult.success ? 'alert-success' : 'alert-danger'}`}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: testResult.success ? '#D1E7DD' : '#F8D7DA',
                    color: testResult.success ? '#0F5132' : '#842029',
                    border: `1px solid ${testResult.success ? '#BADBCC' : '#F5C2C7'}`,
                  }}
                >
                  {testResult.message}
                </div>
              )}

              <button
                type="submit"
                disabled={statusData?.status !== 'ready' || sendingTest}
                className="btn btn-primary"
                style={{
                  padding: '12px',
                  borderRadius: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  width: '100%',
                  background: statusData?.status !== 'ready' ? '#CCCCCC' : 'var(--color-primary)',
                  border: 'none',
                  color: 'white',
                  cursor: statusData?.status !== 'ready' ? 'not-allowed' : 'pointer',
                }}
              >
                {sendingTest ? (
                  <>
                    <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Test Notification
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
