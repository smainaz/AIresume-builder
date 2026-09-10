import React, { useState, useContext, createContext, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import DownloadPDF from './components/DownloadPDF';
import TemplateSelector from './components/TemplateSelector';
import TemplateGallery from './components/TemplateGallery';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useColorMode } from './index';
import { useTheme } from '@mui/material/styles';

// Auth context for demo
const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const login = (userObj) => { setUser(userObj); localStorage.setItem('user', JSON.stringify(userObj)); };
  const logout = () => { setUser(null); localStorage.removeItem('user'); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const colorMode = useColorMode();
  const theme = useTheme();
  return (
    <header className="main-header">
      <Link to="/" className="logo">AI Resume Builder</Link>
      <nav>
        <Link to="/templates">Templates</Link>
        <Link to="/builder">Builder</Link>
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">Log In</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
      <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </header>
  );
}

function ResumeBuilderPage() {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState({});
  const [template, setTemplate] = useState('classic');
  
  // Load selected template from localStorage
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
    }
  }, []);
  
  if (!user) return <div className="locked-msg">Please <Link to="/login">log in</Link> to build and download your resume.</div>;
  return (
    <div className="main-content">
      <ResumeForm setResumeData={setResumeData} />
      <div>
        <TemplateSelector value={template} onChange={setTemplate} />
        <ResumePreview resumeData={resumeData} template={template} />
        <DownloadPDF resumeData={resumeData} template={template} />
      </div>
    </div>
  );
}

function App() {
  const colorMode = useColorMode();
  const theme = useTheme();
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/templates" element={<TemplateGallery />} />
        <Route path="/builder" element={<ResumeBuilderPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App; 