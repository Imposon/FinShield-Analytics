import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, UploadCloud, AlertTriangle, List, BrainCircuit, LogOut, FileText, CheckCircle, Lock, User as UserIcon, Zap } from 'lucide-react';

// --- LOGIN COMPONENT ---
const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin({ name: email.split('@')[0], id: 'usr_' + Math.random().toString(36).substr(2, 5).toUpperCase(), init: email[0].toUpperCase() });
  };
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <div className="glass-panel" style={{ width: '400px', textAlign: 'center' }}>
        <div className="brand-logo" style={{ margin: '0 auto 24px auto' }}>F</div>
        <h2 className="main-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Security Access</h2>
        <p style={{ color: '#888', marginBottom: '32px' }}>Authorized sessions are isolated via Account-ID.</p>
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label className="label">Access Key (Email)</label>
            <div style={{ position: 'relative' }}>
              <UserIcon className="input-icon" size={18}/><input type="email" placeholder="agent@shield.ai" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
            </div>
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label className="label">Secret</label>
            <div style={{ position: 'relative' }}>
              <Lock className="input-icon" size={18}/><input type="password" placeholder="••••••••" required value={pass} onChange={e => setPass(e.target.value)} className="input-field" />
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} type="submit">Initialize Session</button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const [analysisRan, setAnalysisRan] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [aiText, setAiText] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const backendUrl = window.location.hostname === 'localhost' ? 'http://localhost:5002/api' : 'https://finshield-analytics.onrender.com/api';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-account-id': user?.id || 'anonymous'
  });

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${backendUrl}/transactions`, { headers: getHeaders() });
      const resData = await res.json();
      if (resData.success) setTransactions(resData.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { if (isAuthenticated) fetchTransactions(); }, [isAuthenticated]);

  useEffect(() => {
    if (analysisRan) {
        setLoadingAi(true);
        fetch(`${backendUrl}/ai-insights`, { headers: getHeaders() })
            .then(r => r.json()).then(d => setAiText(d.success ? d.insight : "Analysis unavailable."))
            .catch(() => setAiText("AI Service Offline.")).finally(() => setLoadingAi(false));
    }
  }, [analysisRan]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true); setFileError("");
    try {
      // Step 1: Wipe session history for this specific user
      await fetch(`${backendUrl}/transactions`, { method: 'DELETE', headers: getHeaders() });
      
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${backendUrl}/upload`, { 
        method: 'POST', 
        headers: { 'x-account-id': user.id }, // No Content-Type for FormData
        body: formData 
      });
      const data = await res.json();
      if (data.success) {
         setAnalysisRan(false); await fetchTransactions(); setActiveTab('Run Analysis');
         alert(`Success: ${data.data.length} transactions isolated for your session.`);
      } else setFileError("Upload failed: " + data.message);
    } catch (err) { setFileError("Upload failed."); } finally { setLoading(false); }
  };

  const sampleDataList = [
    { merchant: "Starbucks Delhi", amount: 450, currency: "INR" },
    { merchant: "Zomato Order", amount: 850, currency: "INR" },
    { merchant: "Apple Store BKC", amount: 149900, currency: "INR" },
    { merchant: "HP Petrol Pump", amount: 3500, currency: "INR" },
    { merchant: "Unknown Crypto Exchange", amount: 850000, currency: "INR" },
    { merchant: "Reliance Digital", amount: 45000, currency: "INR" },
    { merchant: "Indigo Airlines", amount: 12500, currency: "INR" },
    { merchant: "Uber India", amount: 420, currency: "INR" },
    { merchant: "Offshore Casino Gmbh", amount: 1200000, currency: "INR" },
    { merchant: "Swiggy Instamart", amount: 230, currency: "INR" },
    { merchant: "Amazon India", amount: 1200, currency: "INR" },
    { merchant: "PVR Cinemas", amount: 1800, currency: "INR" },
    { merchant: "Bulk Transfer Wire", amount: 950000, currency: "INR" },
    { merchant: "Tata Cliq", amount: 3400, currency: "INR" },
    { merchant: "BigBasket", amount: 900, currency: "INR" },
    { merchant: "H&M Store", amount: 4500, currency: "INR" },
    { merchant: "Shell Offshore Ltd", amount: 780000, currency: "INR" },
    { merchant: "OYO Rooms", amount: 2500, currency: "INR" },
    { merchant: "Blue Tokai", amount: 350, currency: "INR" },
    { merchant: "Zara Men", amount: 8900, currency: "INR" },
    { merchant: "Unknown Betting Site", amount: 250000, currency: "INR" },
    { merchant: "Blinkit", amount: 150, currency: "INR" },
    { merchant: "Shoppers Stop", amount: 6700, currency: "INR" },
    { merchant: "Decathlon", amount: 3200, currency: "INR" },
    { merchant: "MakeMyTrip", amount: 45000, currency: "INR" },
    { merchant: "Nykaa", amount: 2100, currency: "INR" },
    { merchant: "Haldirams", amount: 1200, currency: "INR" },
    { merchant: "High Value Wire Out", amount: 1500000, currency: "INR" },
    { merchant: "Apollo Pharmacy", amount: 450, currency: "INR" },
    { merchant: "BookMyShow", amount: 700, currency: "INR" },
    { merchant: "Myntra", amount: 5600, currency: "INR" },
    { merchant: "Jio Recharge", amount: 499, currency: "INR" },
    { merchant: "Darkweb Vendor IX", amount: 90000, currency: "INR" },
    { merchant: "Chai Point", amount: 120, currency: "INR" },
    { merchant: "Croma Electronics", amount: 25000, currency: "INR" },
    { merchant: "Nike India", amount: 12000, currency: "INR" },
    { merchant: "FabIndia Store", amount: 4500, currency: "INR" },
    { merchant: "Urban Company", amount: 2200, currency: "INR" },
    { merchant: "Senco Gold", amount: 85000, currency: "INR" },
    { merchant: "Blue Dart", amount: 450, currency: "INR" },
    { merchant: "Pizza Hut Outlet", amount: 1500, currency: "INR" }
  ];

  const injectSampleData = async () => {
    setLoading(true);
    try {
      await fetch(`${backendUrl}/transactions`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(sampleDataList)
      });
      setAnalysisRan(false); await fetchTransactions(); setActiveTab('Run Analysis');
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const clearHistory = async () => {
    setLoading(true);
    await fetch(`${backendUrl}/transactions`, { method: 'DELETE', headers: getHeaders() });
    setAnalysisRan(false); await fetchTransactions(); setLoading(false);
  };

  if (!isAuthenticated) return <LoginPage onLogin={(u) => { setUser(u); setIsAuthenticated(true); }} />;

  const stats = {
    total: transactions.length,
    anomalies: transactions.filter(t => t.riskScore >= 45).length,
    totalSpend: transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0),
    avgRisk: transactions.length ? transactions.reduce((s,t) => s + t.riskScore, 0) / transactions.length : 0
  };

  return (
    <div className="app-layout">
        <div className="sidebar">
          <div className="brand-section"><div className="brand-logo">F</div><h1 className="brand-title">FinShield</h1></div>
          <ul className="nav-menu">
            {['Dashboard', 'Upload Statement', 'Run Analysis', 'Flagged Transactions', 'AI Insights'].map(tab => (
              <li key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {tab === 'Dashboard' && <Activity size={18}/>}{tab === 'Upload Statement' && <UploadCloud size={18}/>}{tab === 'Run Analysis' && <AlertTriangle size={18}/>}{tab === 'Flagged Transactions' && <List size={18}/>}{tab === 'AI Insights' && <BrainCircuit size={18}/>}{tab}
              </li>
            ))}
          </ul>
          <div className="user-card"><div className="user-avatar">{user.init}</div><div style={{flex: 1}}><p style={{ margin: 0, fontWeight: 700, color: '#fff' }}>{user.name}</p></div><LogOut size={16} color="#888" style={{ cursor: 'pointer' }} onClick={() => window.location.reload()}/></div>
        </div>

        <div className="main-content">
            {activeTab === 'Dashboard' && (
              <div className="fade-in">
                  <h2 className="main-title">Intelligence Overview</h2>
                  <div className="bento-grid bento-grid-4" style={{ marginBottom: '32px' }}>
                      <div className="metric-card"><p>Total Assets Scanned</p><h3>{stats.total}</h3></div>
                      <div className="metric-card"><p>Anomalies Detected</p><h3 style={{ color: stats.anomalies > 0 ? '#FF4A4A' : '' }}>{stats.anomalies}</h3></div>
                      <div className="metric-card"><p>Gross Volume</p><h3>₹{stats.totalSpend.toLocaleString()}</h3></div>
                      <div className="metric-card"><p>Risk Threshold</p><h3>{stats.avgRisk.toFixed(1)}%</h3></div>
                  </div>
                  {transactions.length > 0 && (
                    <div className="glass-panel" style={{ height: '300px' }}>
                        <p style={{ color: '#888', fontWeight: 600, marginBottom: '20px' }}>Transaction Volume Vector (₹)</p>
                        <ResponsiveContainer width="100%" height="80%"><BarChart data={transactions.slice(0, 15)}><Tooltip cursor={{fill: '#111'}} contentStyle={{ background: '#000', border: '1px solid #222'}} /><Bar dataKey="amount" fill="#E2FF32" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
                    </div>
                  )}
              </div>
            )}

            {activeTab === 'Upload Statement' && (
              <div className="fade-in">
                  <h2 className="main-title">Data Ingestion</h2>
                  <div className="bento-grid bento-grid-2">
                    <div className="glass-panel">
                        <h3>simulation</h3>
                        <p style={{ color: '#888', marginBottom: '8px' }}>Authorized Session ID: <b style={{color: '#E2FF32'}}>{user.id}</b></p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                           <button className="btn-primary" onClick={injectSampleData} disabled={loading}><Zap size={16} style={{marginRight: '8px'}}/> {loading ? 'Injecting...' : 'Auto-Inject Matrix'}</button>
                        </div>
                    </div>
                    <div className="glass-panel">
                        <h3>Direct Upload</h3>
                        <div className="file-upload-wrapper" style={{ padding: '2rem' }}>
                            <FileText size={32} color="#E2FF32" style={{ marginBottom: '16px' }}/>
                            <p style={{ fontWeight: 600, margin: 0 }}>{loading ? "Parsing..." : "Click to select Ledger"}</p>
                            <input type="file" accept=".csv, .pdf" onChange={handleFileUpload} disabled={loading} />
                        </div>
                        {fileError && <p style={{ color: '#FF4A4A', marginTop: '16px' }}>{fileError}</p>}
                    </div>
                  </div>
              </div>
            )}

            {activeTab === 'Run Analysis' && (
              <div className="fade-in">
                   <h2 className="main-title">Hybrid Engine Analysis</h2>
                   {!analysisRan ? (
                     <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
                        <BrainCircuit size={48} color="#E2FF32" style={{ marginBottom: '24px' }}/>
                        <p style={{ color: '#888', marginBottom: '32px' }}>{transactions.length} items isolated for <b>{user.id}</b>. Running Statistical & LLM Vector Checks.</p>
                        <button className="btn-primary" onClick={() => { setLoading(true); setTimeout(() => { setAnalysisRan(true); setLoading(false); }, 2000); }}>Engage Neural Pipeline</button>
                     </div>
                   ) : (
                     <div className="fade-in">
                         <div className="table-container">
                            <table>
                              <thead><tr><th>Trace ID</th><th>Counterparty</th><th>Value</th><th>Risk</th><th>Verdict</th></tr></thead>
                              <tbody>
                                {transactions.sort((a,b) => b.riskScore - a.riskScore).map(tx => (
                                    <tr key={tx.id}>
                                      <td style={{ color: '#888', fontFamily: 'monospace' }}>{tx.id}</td>
                                      <td>{tx.merchant}</td>
                                      <td>₹{tx.amount.toLocaleString()}</td>
                                      <td style={{ fontWeight: 800, color: tx.riskScore > 40 ? '#FF4A4A' : '#32E278' }}>{tx.riskScore}</td>
                                      <td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                                    </tr>
                                ))}
                              </tbody>
                            </table>
                         </div>
                     </div>
                   )}
              </div>
            )}

            {activeTab === 'Flagged Transactions' && (
              <div className="fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                    <div><h2 className="main-title" style={{ margin: 0 }}>High-Risk Vectors</h2><p style={{ color: '#888', marginTop: '8px' }}>Drill-down for Session: {user.id}</p></div>
                    <button className="btn-danger" onClick={clearHistory}>Reset Environment</button>
                  </div>
                  <div className="table-container">
                    <table>
                      <thead><tr><th>Trace ID</th><th>Narration</th><th>Amount (₹)</th><th>Risk Factor</th><th>Policy Verdict</th></tr></thead>
                      <tbody>
                        {transactions.filter(t => t.riskScore >= 45).sort((a,b) => b.riskScore - a.riskScore).map(tx => (
                            <tr key={tx.id}>
                              <td style={{ color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>{tx.id}</td>
                              <td style={{ fontWeight: 700 }}>{tx.merchant}</td>
                              <td style={{ fontSize: '1.1rem' }}>₹{parseFloat(tx.amount).toLocaleString()}</td>
                              <td style={{ fontWeight: 800, color: '#FF4A4A' }}>{tx.riskScore}%</td>
                              <td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {transactions.filter(t => t.riskScore >= 45).length === 0 && (
                    <div className="glass-panel" style={{ textAlign: 'center', marginTop: '20px' }}><CheckCircle size={32} color="#32E278" style={{ marginBottom: '16px' }} /><p style={{ color: '#888' }}>No anomalies detected for this session.</p></div>
                  )}
              </div>
            )}

            {activeTab === 'AI Insights' && (
              <div className="fade-in">
                  <h2 className="main-title">Cognitive Insights</h2>
                  <div className="glass-panel">
                      <h4 style={{ margin: '0 0 16px 0', color: '#E2FF32' }}>Strategy Summary (Session: {user.id})</h4>
                      <div style={{ lineHeight: 1.8, color: '#DDD', whiteSpace: 'pre-wrap', fontSize: '1.05rem', fontWeight: 500 }}>{loadingAi ? "Analyzing isolated patterns via Groq..." : aiText || "Execute Analysis first to parse AI insights."}</div>
                  </div>
              </div>
            )}
        </div>
    </div>
  );
}

export default App;
