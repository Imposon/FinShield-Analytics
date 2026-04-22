import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, FileText, CheckCircle, Lock, User, Zap, Shield, TrendingUp, Clock, FileSearch, XCircle, Upload, AlertTriangle, BrainCircuit, ChevronDown } from 'lucide-react';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [analysisRan, setAnalysisRan] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [aiText, setAiText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollContentRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const flaggedRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const backendUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:5002/api' 
    : 'https://finshield-analytics.onrender.com/api';

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-account-id': user?.id || 'anonymous'
  });

  useEffect(() => {
    const scrollContent = scrollContentRef.current;
    if (!scrollContent) return;

    const handleScroll = () => {
      const scrollTop = scrollContent.scrollTop;
      const scrollHeight = scrollContent.scrollHeight - scrollContent.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    scrollContent.addEventListener('scroll', handleScroll);
    return () => scrollContent.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    const scrollContent = scrollContentRef.current;
    const target = ref.current;
    if (!scrollContent || !target) return;
    
    const targetPosition = target.offsetTop - 64;
    scrollContent.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
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

  if (!isAuthenticated) {
    return <LoginPage onLogin={(u) => { setUser(u); setIsAuthenticated(true); }} />;
  }

  return (
    <div className="scroll-layout">
      <div className="scroll-progress">
        <div className="scroll-progress-bar" style={{ height: `${scrollProgress}%` }} />
      </div>
      
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-icon-sm">F</div>
          <span className="brand-text">FinShield</span>
        </div>
        <div className="nav-links">
          <button onClick={() => scrollToSection(uploadRef)}>Upload</button>
          <button onClick={() => scrollToSection(analysisRef)}>Analysis</button>
          <button onClick={() => scrollToSection(flaggedRef)}>Flagged</button>
          <button onClick={() => scrollToSection(insightsRef)}>Insights</button>
          <button onClick={() => scrollToSection(dashboardRef)}>Dashboard</button>
        </div>
        <div className="nav-user">
          <span>{user!.name}</span>
          <button className="logout-icon" onClick={() => window.location.reload()}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main ref={scrollContentRef} className="scroll-content">
        <section ref={uploadRef} className="section upload-section">
          <div className="section-header">
            <h1 className="section-title">Upload Transaction Data</h1>
            <p className="section-subtitle">Import your data to begin fraud detection analysis</p>
            <ChevronDown className="scroll-hint" size={32} />
          </div>
          <div className="flash-cards">
            <div className="flash-card upload-card">
              <div className="flash-card-front">
                <div className="flash-icon"><Upload size={48} /></div>
                <h3>File Upload</h3>
                <p>Upload CSV or PDF bank statements</p>
              </div>
              <div className="flash-card-back">
                <div className="upload-zone-lg">
                  <FileText size={40} />
                  <p>Drop files here or click to browse</p>
                  <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} disabled={loading} />
                </div>
                {fileError && <p className="error-message">{fileError}</p>}
              </div>
            </div>
            <div className="flash-card simulate-card">
              <div className="flash-card-front">
                <div className="flash-icon"><Zap size={48} /></div>
                <h3>Simulate Data</h3>
                <p>Generate 40 sample transactions</p>
              </div>
              <div className="flash-card-back">
                <p className="simulate-text">Create realistic test data with mixed risk profiles for demonstration purposes.</p>
                <button className="btn btn-primary" onClick={injectSampleData} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Sample Data'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section ref={analysisRef} className="section">
          <div className="section-header">
            <h2 className="section-title">Transaction Analysis</h2>
            <p className="section-subtitle">AI-powered risk assessment results</p>
          </div>
          {!analysisRan ? (
            <div className="flash-card analysis-ready">
              <FileSearch size={64} />
              <h3>Ready to Analyze</h3>
              <p>{transactions.length} transactions loaded. Run the hybrid AI + rule-based engine.</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => { setLoading(true); setTimeout(() => { setAnalysisRan(true); setLoading(false); }, 1500); }}
                disabled={loading || transactions.length === 0}
              >
                {loading ? 'Running Analysis...' : 'Run Analysis'}
              </button>
            </div>
          ) : (
            <div className="data-table-card">
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
                      <td className="mono">{tx.id}</td>
                      <td>{tx.merchant}</td>
                      <td>₹{tx.amount.toLocaleString()}</td>
                      <td><span className={`risk-score ${getRiskLevel(tx.riskScore)}`}>{tx.riskScore}%</span></td>
                      <td><span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section ref={flaggedRef} className="section">
          <div className="section-header">
            <h2 className="section-title">Flagged Transactions</h2>
            <p className="section-subtitle">High-risk items requiring manual review</p>
          </div>
          <div className="data-table-card">
            <div className="table-header-actions">
              <span className="flagged-count">{transactions.filter(t => t.riskScore >= 45).length} items flagged</span>
              <button className="btn btn-danger" onClick={clearHistory}>
                <XCircle size={16} /> Clear All
              </button>
            </div>
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
                  <tr key={tx.id} className="flagged-row">
                    <td className="mono">{tx.id}</td>
                    <td className="fw-bold">{tx.merchant}</td>
                    <td className="fw-bold">₹{tx.amount.toLocaleString()}</td>
                    <td><span className="risk-score high">{tx.riskScore}%</span></td>
                    <td><span className={`status-badge ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {transactions.filter(t => t.riskScore >= 45).length === 0 && (
              <div className="all-clear">
                <CheckCircle size={64} color="#22c55e" />
                <h3>All Clear</h3>
                <p>No flagged transactions found.</p>
              </div>
            )}
          </div>
        </section>

        <section ref={insightsRef} className="section">
          <div className="section-header">
            <h2 className="section-title">AI Insights</h2>
            <p className="section-subtitle">Cognitive analysis powered by Groq LLM</p>
          </div>
          <div className="flash-card insight-card">
            {loadingAi ? (
              <div className="insight-loading">
                <span className="spinner-lg"></span>
                <p>Analyzing patterns...</p>
              </div>
            ) : aiText ? (
              <div className="insight-content">
                <div className="insight-header">
                  <BrainCircuit size={32} />
                  <h3>Strategic Analysis Summary</h3>
                </div>
                <div className="insight-body">{aiText}</div>
              </div>
            ) : (
              <div className="insight-empty">
                <Clock size={64} />
                <p>Run analysis first to generate AI-powered insights.</p>
              </div>
            )}
          </div>
        </section>

        <section ref={dashboardRef} className="section dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Dashboard Overview</h2>
            <p className="section-subtitle">Real-time fraud detection analytics</p>
          </div>
          <div className="metrics-flash-grid">
            <div className="flash-metric">
              <div className="metric-icon-bg primary"><TrendingUp size={28} /></div>
              <div className="metric-data">
                <span className="metric-value">{stats.total}</span>
                <span className="metric-label">Total Transactions</span>
              </div>
            </div>
            <div className="flash-metric">
              <div className="metric-icon-bg warning"><AlertTriangle size={28} /></div>
              <div className="metric-data">
                <span className={`metric-value ${stats.anomalies > 0 ? 'danger' : ''}`}>{stats.anomalies}</span>
                <span className="metric-label">Anomalies</span>
              </div>
            </div>
            <div className="flash-metric">
              <div className="metric-icon-bg info"><Shield size={28} /></div>
              <div className="metric-data">
                <span className="metric-value">₹{(stats.totalSpend / 100000).toFixed(2)}L</span>
                <span className="metric-label">Total Volume</span>
              </div>
            </div>
            <div className="flash-metric">
              <div className="metric-icon-bg danger"><TrendingUp size={28} /></div>
              <div className="metric-data">
                <span className={`metric-value ${stats.avgRisk > 50 ? 'warning' : ''}`}>{stats.avgRisk.toFixed(1)}%</span>
                <span className="metric-label">Avg Risk</span>
              </div>
            </div>
          </div>
          <div className="charts-grid">
            <div className="flash-card chart-card">
              <h4>Transaction Volume</h4>
              {transactions.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={transactions.slice(0, 15)}>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                    <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
            <div className="flash-card chart-card">
              <h4>Risk Distribution</h4>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
          </div>
        </section>

        <footer className="scroll-footer">
          <p>FinShield Analytics | Session: {user!.id}</p>
          <button className="scroll-top-btn" onClick={() => scrollContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to Top
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
