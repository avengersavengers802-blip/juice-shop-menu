import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { LanguageProvider } from './contexts/LanguageContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import OrderHistoryPage from './components/OrderHistoryPage';
import AdminPage from './components/AdminPage';
import './App.css';

const AppContent = ({ theme, toggleTheme, searchQuery, setSearchQuery }) => {
  const { currentView, setCurrentView } = useAuth();

  // Admin view is full-page — no header/footer/cart
  if (currentView === 'admin') {
    return <AdminPage onExit={() => setCurrentView('menu')} />;
  }

  return (
    <div className="app-wrapper">
      <Header theme={theme} toggleTheme={toggleTheme} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main>
        {currentView === 'history' ? (
          <OrderHistoryPage />
        ) : (
          <MenuGrid searchQuery={searchQuery} />
        )}
      </main>
      <Footer />
      <Cart />
      <AuthModal />
      <ProfileModal />
    </div>
  );
};

function App() {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent 
            theme={theme} 
            toggleTheme={toggleTheme} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
