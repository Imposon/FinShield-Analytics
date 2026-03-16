import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, UploadCloud, AlertTriangle, List, BrainCircuit, LogOut, FileText, CheckCircle } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileError, setFileError] = useState("");
  const [analysisRan, setAnalysisRan] = useState(false);
  const [user, setUser] = useState({ name: 'Admin', id: 'usr_891xP', init: 'AS' });

  const backendUrl = 'http://localhost:5002/api';

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${backendUrl}/transactions`);
      const resData = await res.json();
      if (resData.success) {
        setTransactions(resData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true); setFileError("");
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${backendUrl}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
         setAnalysisRan(false); 
         await fetchTransactions();
         setActiveTab('Run Analysis');
      } else {
         setFileError("Upload failed: " + data.message);
      }
    } catch (err) {
      setFileError("Communication error.");
    } finally {
      setLoading(false);
    }
  };

  const uploadSampleData = async () => {
      setLoading(true);
      const sample = [
          { accountId: user.id, merchant: "Swiggy Delivery", amount: 450, timestamp: "2025-01-02T10:15:00Z" },
          { accountId: user.id, merchant: "Uber Rides", amount: 280, timestamp: "2025-01-03T08:30:00Z" },
          { accountId: user.id, merchant: "Offshore Shell LLC", amount: 85000, timestamp: "2025-01-19T03:15:00Z" },
          { accountId: user.id, merchant: "Amazon Core", amount: 1540, timestamp: "2025-01-20T14:00:00Z" }
      ];
      try {
        await fetch(`${backendUrl}/transactions`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sample)
        });
        setAnalysisRan(false);
        await fetchTransactions();
        setActiveTab('Run Analysis');
      } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const clearHistory = async () => {
    setLoading(true);
    try {
      await fetch(`${backendUrl}/transactions`, { method: 'DELETE' });
      setAnalysisRan(false);
      await fetchTransactions();
    } catch(err) {} finally { setLoading(false); }
  };

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalysisRan(true);
      setLoading(false);
    }, 1800); 
  };

  const renderSidebar = () => (
    <div className="sidebar">
      <div className="brand-section">
        <div className="brand-logo">F</div>
        <h1 className="brand-title">FinShield</h1>
      </div>

      <ul className="nav-menu">
        {[
          { name: 'Dashboard', icon: <Activity size={18} /> },
          { name: 'Upload Statement', icon: <UploadCloud size={18} /> },
          { name: 'Run Analysis', icon: <AlertTriangle size={18} /> },
          { name: 'Transactions', icon: <List size={18} /> },
          { name: 'AI Insights', icon: <BrainCircuit size={18} /> }
        ].map(item => (
          <li 
            key={item.name} 
            className={activeTab === item.name ? 'active' : ''} 
            onClick={() => setActiveTab(item.name)}
          >
            {item.icon} {item.name}
          </li>
        ))}
      </ul>

      <div className="user-card">
          <div className="user-avatar">{user.init}</div>
          <div style={{flex: 1}}>
            <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>{user.id}</p>
          </div>
          <LogOut size={16} color="#888" style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );

  const getStats = () => {
    const total = transactions.length;
    const anomalies = transactions.filter(t => t.riskScore >= 45).length;
    const totalSpend = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const avg = total > 0 ? totalSpend / total : 0;
    return { total, anomalies, totalSpend, avg };
  };

  const stats = getStats();

  return (
    <div className="app-layout">
        {renderSidebar()}
        <div className="main-content">
            {activeTab === 'Dashboard' && (
              <div className="fade-in">
                  <div className="page-header">
                      <div>
                         <h2 className="main-title">Intelligence</h2>
                         <p className="page-subtitle">Real-time isolation forest heuristics.</p>
                      </div>
                  </div>
                  {transactions.length > 0 ? (
                      <div className="bento-grid">
                          <div className="bento-grid bento-grid-4">
                              <div className="metric-card"><p>Total Volume</p><h3>{stats.total}</h3></div>
                              <div className="metric-card"><p>Anomalies</p><h3>{stats.anomalies}</h3></div>
                              <div className="metric-card"><p>Gross Value</p><h3>${stats.totalSpend.toLocaleString()}</h3></div>
                              <div className="metric-card"><p>Median Vector</p><h3>${stats.avg.toFixed(2)}</h3></div>
                          </div>
                      </div>
                  ) : (<div className="glass-panel">No active feeds.</div>)}
              </div>
            )}
            {activeTab === 'Upload Statement' && (
              <div className="fade-in">
                  <h2 className="main-title">Data Ingestion</h2>
                  <div className="bento-grid bento-grid-2">
                    <div className="glass-panel">
                        <h3>Simulation</h3>
                        <button className="btn-secondary" onClick={uploadSampleData}>Inject Matrix</button>
                    </div>
                    <div className="glass-panel">
                        <h3>Upload File</h3>
                        <input type="file" accept=".csv, .pdf" onChange={handleFileUpload} />
                    </div>
                  </div>
              </div>
            )}
            {activeTab === 'Run Analysis' && (
              <div className="fade-in">
                   <h2 className="main-title">Analysis</h2>
                   {!analysisRan ? (
                     <div className="glass-panel"><button className="btn-primary" onClick={runAnalysis}>Execute Full Analysis</button></div>
                   ) : (
                     <div className="table-container">
                        <table>
                          <thead><tr><th>Trace ID</th><th>Merchant</th><th>Draw</th><th>Score</th><th>Status</th></tr></thead>
                          <tbody>
                            {transactions.filter(t => t.riskScore >= 45).map(tx => (
                                <tr key={tx.id}><td>{tx.id}</td><td>{tx.merchant}</td><td>${tx.amount}</td><td>{tx.riskScore}</td><td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td></tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                   )}
              </div>
            )}
            {activeTab === 'Transactions' && (
              <div className="fade-in">
                  <h2 className="main-title">Ledger</h2>
                  <button className="btn-danger" onClick={clearHistory}>Purge Data</button>
                  <div className="table-container">
                    <table>
                      <thead><tr><th>ID</th><th>Counterparty</th><th>Value</th><th>Status</th></tr></thead>
                      <tbody>
                        {transactions.map(tx => (
                            <tr key={tx.id}><td>{tx.id}</td><td>{tx.merchant}</td><td>${tx.amount}</td><td><span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
            )}
            {activeTab === 'AI Insights' && (
              <div className="fade-in">
                  <h2 className="main-title">Insights</h2>
                  <div className="glass-panel">Avg Portfolio Risk: <b>{(transactions.reduce((a,b)=>a+b.riskScore,0)/(transactions.length||1)).toFixed(1)}</b></div>
              </div>
            )}
        </div>
    </div>
  );
}

export default App;
