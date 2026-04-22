import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, UploadCloud, AlertTriangle, List, BrainCircuit, LogOut, FileText, CheckCircle, Lock, User, Zap, Shield, TrendingUp, Clock, FileSearch, XCircle } from 'lucide-react';

interface UserData {
  name: string;
  id: string;
  init: string;
}

interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  merchant: string;
  timestamp: string;
  status: 'SAFE' | 'SUSPICIOUS' | 'FRAUDULENT';
  riskScore: number;
}

const LoginPage = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0],
        id: 'USR-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        init: email[0].toUpperCase()
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">F</div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access FinShield Analytics</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper">
              <User className="input-icon" size={18} />
              <input
                type="email"
                className="form-input with-icon"
                placeholder="analyst@finshield.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                className="form-input with-icon"
                placeholder="Enter your password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [analysisRan, setAnalysisRan] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [aiText, setAiText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const backendUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5002/api' 
    : 'https://finshield-analytics.onrender.com/api';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-account-id': user?.id || 'anonymous'
  });

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${backendUrl}/transactions`, { headers: getHeaders() });
      const resData = await res.json();
      if (resData.success) setTransactions(resData.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchTransactions();
  }, [isAuthenticated]);

  useEffect(() => {
    if (analysisRan) {
      setLoadingAi(true);
      fetch(`${backendUrl}/ai-insights`, { headers: getHeaders() })
        .then(r => r.json())
        .then(d => setAiText(d.success ? d.insight : 'Analysis unavailable.'))
        .catch(() => setAiText('AI Service Offline.'))
        .finally(() => setLoadingAi(false));
    }
  }, [analysisRan]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setFileError('');
    try {
      await fetch(`${backendUrl}/transactions`, { method: 'DELETE', headers: getHeaders() });
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        headers: { 'x-account-id': user!.id },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisRan(false);
        await fetchTransactions();
        setActiveTab('Run Analysis');
      } else {
        setFileError('Upload failed: ' + data.message);
      }
    } catch (err) {
      setFileError('Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const sampleDataList = [
    { merchant: 'Starbucks Delhi', amount: 450, currency: 'INR' },
    { merchant: 'Zomato Order', amount: 850, currency: 'INR' },
    { merchant: 'Apple Store BKC', amount: 149900, currency: 'INR' },
    { merchant: 'HP Petrol Pump', amount: 3500, currency: 'INR' },
    { merchant: 'Unknown Crypto Exchange', amount: 850000, currency: 'INR' },
    { merchant: 'Reliance Digital', amount: 45000, currency: 'INR' },
    { merchant: 'Indigo Airlines', amount: 12500, currency: 'INR' },
    { merchant: 'Uber India', amount: 420, currency: 'INR' },
    { merchant: 'Offshore Casino', amount: 1200000, currency: 'INR' },
    { merchant: 'Swiggy Instamart', amount: 230, currency: 'INR' },
    { merchant: 'Amazon India', amount: 1200, currency: 'INR' },
    { merchant: 'PVR Cinemas', amount: 1800, currency: 'INR' },
    { merchant: 'Bulk Transfer Wire', amount: 950000, currency: 'INR' },
    { merchant: 'Tata Cliq', amount: 3400, currency: 'INR' },
    { merchant: 'BigBasket', amount: 900, currency: 'INR' },
    { merchant: 'H&M Store', amount: 4500, currency: 'INR' },
    { merchant: 'Shell Offshore Ltd', amount: 780000, currency: 'INR' },
    { merchant: 'OYO Rooms', amount: 2500, currency: 'INR' },
    { merchant: 'Blue Tokai', amount: 350, currency: 'INR' },
    { merchant: 'Zara Men', amount: 8900, currency: 'INR' },
    { merchant: 'Unknown Betting Site', amount: 250000, currency: 'INR' },
    { merchant: 'Blinkit', amount: 150, currency: 'INR' },
    { merchant: 'Shoppers Stop', amount: 6700, currency: 'INR' },
    { merchant: 'Decathlon', amount: 3200, currency: 'INR' },
    { merchant: 'MakeMyTrip', amount: 45000, currency: 'INR' },
    { merchant: 'Nykaa', amount: 2100, currency: 'INR' },
    { merchant: 'Haldirams', amount: 1200, currency: 'INR' },
    { merchant: 'High Value Wire Out', amount: 1500000, currency: 'INR' },
    { merchant: 'Apollo Pharmacy', amount: 450, currency: 'INR' },
    { merchant: 'BookMyShow', amount: 700, currency: 'INR' },
    { merchant: 'Myntra', amount: 5600, currency: 'INR' },
    { merchant: 'Jio Recharge', amount: 499, currency: 'INR' },
    { merchant: 'Darkweb Vendor IX', amount: 90000, currency: 'INR' },
    { merchant: 'Chai Point', amount: 120, currency: 'INR' },
    { merchant: 'Croma Electronics', amount: 25000, currency: 'INR' },
    { merchant: 'Nike India', amount: 12000, currency: 'INR' },
    { merchant: 'FabIndia Store', amount: 4500, currency: 'INR' },
    { merchant: 'Urban Company', amount: 2200, currency: 'INR' },
    { merchant: 'Senco Gold', amount: 85000, currency: 'INR' },
    { merchant: 'Blue Dart', amount: 450, currency: 'INR' },
    { merchant: 'Pizza Hut Outlet', amount: 1500, currency: 'INR' }
  ];

  const injectSampleData = async () => {
    setLoading(true);
    try {
      await fetch(`${backendUrl}/transactions`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(sampleDataList)
      });
      setAnalysisRan(false);
      await fetchTransactions();
      setActiveTab('Run Analysis');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    setLoading(true);
    await fetch(`${backendUrl}/transactions`, { method: 'DELETE', headers: getHeaders() });
    setAnalysisRan(false);
    await fetchTransactions();
    setLoading(false);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 75) return 'high';
    if (score >= 45) return 'medium';
    return 'low';
  };

  const stats = {
    total: transactions.length,
    safe: transactions.filter(t => t.status === 'SAFE').length,
    suspicious: transactions.filter(t => t.status === 'SUSPICIOUS').length,
    fraudulent: transactions.filter(t => t.status === 'FRAUDULENT').length,
    anomalies: transactions.filter(t => t.riskScore >= 45).length,
    totalSpend: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    avgRisk: transactions.length ? transactions.reduce((s, t) => s + t.riskScore, 0) / transactions.length : 0
  };

  const pieData = [
    { name: 'Safe', value: stats.safe, color: '#22c55e' },
    { name: 'Suspicious', value: stats.suspicious, color: '#f59e0b' },
    { name: 'Fraudulent', value: stats.fraudulent, color: '#ef4444' }
  ].filter(d => d.value > 0);

  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: Activity },
    { id: 'Upload', label: 'Upload Data', icon: UploadCloud },
    { id: 'Analysis', label: 'Run Analysis', icon: FileSearch },
    { id: 'Flagged', label: 'Flagged Items', icon: AlertTriangle },
    { id: 'Insights', label: 'AI Insights', icon: BrainCircuit }
  ];

  if (!isAuthenticated) {
    return <LoginPage onLogin={(u) => { setUser(u); setIsAuthenticated(true); }} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar slide-in">
        <div className="brand-header">
          <div className="brand-icon">F</div>
          <h1 className="brand-title">FinShield</h1>
        </div>
        <nav className="nav-section">
          <div className="nav-label">Main Menu</div>
          <ul className="nav-menu">
            {navItems.map(item => (
              <li
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon size={18} />
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
        <div className="user-footer">
          <div className="user-card">
            <div className="user-avatar">{user!.init}</div>
            <div className="user-info">
              <div className="user-name">{user!.name}</div>
              <div className="user-role">Risk Analyst</div>
            </div>
            <div className="logout-btn" onClick={() => window.location.reload()}>
              <LogOut size={18} />
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'Dashboard' && (
          <div className="fade-in">
            <div className="page-header">
              <h1 className="page-title">Dashboard Overview</h1>
              <p className="page-subtitle">Real-time fraud detection analytics for session {user!.id}</p>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Total Transactions</span>
                  <div className="metric-icon primary"><Activity size={20} /></div>
                </div>
                <div className="metric-value">{stats.total}</div>
                <div className="metric-change">Processed this session</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Anomalies Detected</span>
                  <div className="metric-icon warning"><AlertTriangle size={20} /></div>
                </div>
                <div className={`metric-value ${stats.anomalies > 0 ? 'danger' : ''}`}>{stats.anomalies}</div>
                <div className="metric-change">Require investigation</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Total Volume</span>
                  <div className="metric-icon info"><TrendingUp size={20} /></div>
                </div>
                <div className="metric-value">₹{(stats.totalSpend / 100000).toFixed(2)}L</div>
                <div className="metric-change">Gross transaction value</div>
              </div>
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Avg Risk Score</span>
                  <div className="metric-icon danger"><Shield size={20} /></div>
                </div>
                <div className={`metric-value ${stats.avgRisk > 50 ? 'warning' : ''}`}>{stats.avgRisk.toFixed(1)}%</div>
                <div className="metric-change">Across all transactions</div>
              </div>
            </div>

            <div className="content-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Transaction Volume</h3>
                </div>
                <div className="card-body">
                  {transactions.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={transactions.slice(0, 15)}>
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon"><TrendingUp size={32} /></div>
                      <p className="empty-state-text">No transaction data available</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Risk Distribution</h3>
                </div>
                <div className="card-body">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon"><Shield size={32} /></div>
                      <p className="empty-state-text">No risk data to display</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Upload' && (
          <div className="fade-in">
            <div className="page-header">
              <h1 className="page-title">Data Upload</h1>
              <p className="page-subtitle">Import transaction data via file upload or simulation</p>
            </div>

            <div className="content-grid">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Simulate Data</h3>
                </div>
                <div className="card-body">
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Generate sample transaction data for testing. This will create 40 realistic transactions with varying risk profiles.
                  </p>
                  <button className="btn btn-primary" onClick={injectSampleData} disabled={loading}>
                    {loading ? (
                      <span className="loading-spinner"><span className="spinner"></span>Generating...</span>
                    ) : (<><Zap size={18} /> Generate Sample Data</>)}
                  </button>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">File Upload</h3>
                </div>
                <div className="card-body">
                  <div className="upload-zone">
                    <div className="upload-icon"><FileText size={32} /></div>
                    <p className="upload-text">{loading ? 'Processing...' : 'Click to upload or drag files here'}</p>
                    <p className="upload-hint">Supports CSV and PDF formats</p>
                    <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} disabled={loading} />
                  </div>
                  {fileError && <p className="error-message">{fileError}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Analysis' && (
          <div className="fade-in">
            <div className="page-header">
              <h1 className="page-title">Transaction Analysis</h1>
              <p className="page-subtitle">Review AI-powered risk assessment results</p>
            </div>

            {!analysisRan ? (
              <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
                <div className="empty-state-icon"><BrainCircuit size={40} /></div>
                <h3 className="empty-state-title">Ready to Analyze</h3>
                <p className="empty-state-text" style={{ marginBottom: '32px' }}>
                  {transactions.length} transactions loaded for session {user!.id}. Run the hybrid AI + rule-based analysis engine.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setLoading(true); setTimeout(() => { setAnalysisRan(true); setLoading(false); }, 1500); }}
                  disabled={loading || transactions.length === 0}
                >
                  {loading ? (
                    <span className="loading-spinner"><span className="spinner"></span>Running Analysis...</span>
                  ) : (<><FileSearch size={18} /> Run Analysis</>)}
                </button>
              </div>
            ) : (
              <div className="card">
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Merchant</th>
                        <th>Amount</th>
                        <th>Risk Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.sort((a, b) => b.riskScore - a.riskScore).map(tx => (
                        <tr key={tx.id}>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tx.id}</td>
                          <td>{tx.merchant}</td>
                          <td>₹{tx.amount.toLocaleString()}</td>
                          <td>
                            <span className={`risk-score ${getRiskLevel(tx.riskScore)}`}>{tx.riskScore}%</span>
                          </td>
                          <td><span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {transactions.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon"><XCircle size={32} /></div>
                    <p className="empty-state-text">No transactions to analyze</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Flagged' && (
          <div className="fade-in">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="page-title">Flagged Transactions</h1>
                <p className="page-subtitle">High-risk items requiring manual review</p>
              </div>
              <button className="btn btn-danger" onClick={clearHistory}>
                <XCircle size={18} /> Clear All
              </button>
            </div>

            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Merchant</th>
                      <th>Amount</th>
                      <th>Risk Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.filter(t => t.riskScore >= 45).sort((a, b) => b.riskScore - a.riskScore).map(tx => (
                      <tr key={tx.id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>{tx.id}</td>
                        <td style={{ fontWeight: 600 }}>{tx.merchant}</td>
                        <td style={{ fontWeight: 600 }}>₹{tx.amount.toLocaleString()}</td>
                        <td><span className="risk-score high">{tx.riskScore}%</span></td>
                        <td><span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {transactions.filter(t => t.riskScore >= 45).length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="empty-state-title">All Clear</h3>
                  <p className="empty-state-text">No flagged transactions found for this session.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Insights' && (
          <div className="fade-in">
            <div className="page-header">
              <h1 className="page-title">AI Insights</h1>
              <p className="page-subtitle">Cognitive analysis powered by Groq LLM</p>
            </div>

            <div className="card">
              <div className="card-body">
                {loadingAi ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><span className="spinner" style={{ width: 32, height: 32 }}></span></div>
                    <h3 className="empty-state-title">Analyzing Patterns</h3>
                    <p className="empty-state-text">Processing transaction data with AI models...</p>
                  </div>
                ) : aiText ? (
                  <div className="ai-insight-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <BrainCircuit size={24} color="#10b981" />
                      <span style={{ fontWeight: 600, color: '#10b981' }}>Analysis Summary</span>
                    </div>
                    {aiText}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon"><Clock size={32} /></div>
                    <h3 className="empty-state-title">No Analysis Yet</h3>
                    <p className="empty-state-text">Run the analysis first to generate AI-powered insights.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
