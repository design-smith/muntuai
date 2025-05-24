import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Conversation from './pages/Conversation';
import Settings from './pages/Settings';
import Chat from './pages/Chat';
import TemplateEditor from './components/TemplateEditor';
import './App.css';
// Import Material UI icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ForumIcon from '@mui/icons-material/Forum';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import logo from './assets/logo.png';
import { supabase } from './supabaseClient';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';

export const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

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

function TemplateEditorWrapper() {
  const location = useLocation();
  const template = location.state?.template;
  
  if (!template) {
    return <Navigate to="/settings" replace />;
  }

  return <TemplateEditor template={template} />;
}

function App() {
  const [user, setUser] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App loading...');
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.access_token) {
        // Call /auth/sync_user with JWT
        try {
          console.log('Calling /auth/sync_user...');
          const res = await fetch('http://localhost:8000/auth/sync_user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata || {},
            }),
          });
          const data = await res.json();
          console.log('sync_user response:', data);
          setIsFirstLogin(data.is_first_login);
        } catch (e) {
          console.error('sync_user error:', e);
          setIsFirstLogin(false);
        }
      } else {
        setIsFirstLogin(false);
      }
      setLoading(false);
      console.log('App loading finished.');
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.access_token) {
        try {
          console.log('Calling /auth/sync_user (onAuthStateChange)...');
          const res = await fetch('http://localhost:8000/auth/sync_user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata || {},
            }),
          });
          const data = await res.json();
          console.log('sync_user response (onAuthStateChange):', data);
          setIsFirstLogin(data.is_first_login);
        } catch (e) {
          console.error('sync_user error (onAuthStateChange):', e);
          setIsFirstLogin(false);
        }
      } else {
        setIsFirstLogin(false);
      }
      setLoading(false);
      console.log('App loading finished (onAuthStateChange).');
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    console.log('App is in loading state...');
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, supabase, isFirstLogin, setIsFirstLogin }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/onboarding" element={user && isFirstLogin ? <Onboarding /> : <Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              user ? (
                isFirstLogin ? (
                  <Navigate to="/onboarding" replace />
                ) : (
                  <AppLayout>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/conversation" element={<Conversation />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/templates/edit/:id" element={<TemplateEditorWrapper />} />
                    </Routes>
                  </AppLayout>
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
