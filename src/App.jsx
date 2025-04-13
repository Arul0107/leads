import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AddUser from './pages/adduser';
import Bill from './pages/bill';
import Invoice from './pages/invoice';
import Opportunity from './pages/opportunity';
import './App.css';
import Account from './pages/Account';
import Quotation from './pages/Quotation';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true); 
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated ? (
          <div style={{ display: 'flex' }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1, marginLeft: '200px' }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/adduser" element={<AddUser />} />
                <Route path="/bill" element={<Bill />} />
                <Route path="/accounts" element={<Account />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/quotation" element={<Quotation />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
}

export default App; 