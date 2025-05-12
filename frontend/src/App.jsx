import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Conversation from './pages/Conversation';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import './App.css';
// Import Material UI icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import logo from './assets/logo.png';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ mr: 1 }} /> },
  { name: 'Chat', path: '/chat', icon: <ChatBubbleOutlineIcon sx={{ mr: 1 }} /> },
  { name: 'Conversation', path: '/conversation', icon: <ForumIcon sx={{ mr: 1 }} /> },
  { name: 'Settings', path: '/settings', icon: <SettingsIcon sx={{ mr: 1 }} /> },
];

function Sidebar({ onHover, onLeave }) {
  const location = useLocation();
  return (
    <nav className="sidebar" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <div className="sidebar-logo-container">
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>
      {navLinks.map((link) => {
        const selected = location.pathname === link.path;
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`button sidebar-link${selected ? ' selected' : ''}`}
          >
            {link.icon}
            <span className="sidebar-label">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppLayout({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  return (
    <div className={`app-layout${sidebarExpanded ? ' sidebar-expanded' : ''}`}> 
      <Sidebar onHover={() => setSidebarExpanded(true)} onLeave={() => setSidebarExpanded(false)} />
      <div className="page-container app-main-container">
        <main className="app-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
