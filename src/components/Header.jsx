import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = ({ theme, toggleTheme, searchQuery, setSearchQuery }) => {
    const { t, language, setLanguage } = useLanguage();
    const { getCartCount, setIsCartOpen } = useCart();
    const { user, logout, setIsAuthModalOpen, setIsProfileModalOpen, currentView, setCurrentView, runWithAuth } = useAuth();
    const headerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                document.documentElement.style.setProperty('--header-height', `${headerRef.current.offsetHeight}px`);
            }
        };
        updateHeaderHeight();
        window.addEventListener('resize', updateHeaderHeight);
        const timer = setTimeout(updateHeaderHeight, 100);
        return () => {
            window.removeEventListener('resize', updateHeaderHeight);
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="header" ref={headerRef}>
            <div className="container header-container">
                <div className="header-top">
                    <div className="logo" onClick={() => setCurrentView('menu')} style={{ cursor: 'pointer' }}>
                        <span className="logo-icon">🥤</span>
                        <span className="logo-text">Fizztaa</span>
                    </div>
                    <div className="header-actions">
                        <select 
                            className="lang-select" 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                            aria-label="Select language"
                        >
                            <option value="en">English (EN)</option>
                            <option value="hi">हिंदी (HI)</option>
                            <option value="mr">मराठी (MR)</option>
                        </select>
                        {user ? (
                            <div className="profile-dropdown-container" ref={dropdownRef}>
                                <button 
                                    className="auth-btn logged-in" 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    title={t('editProfile')}
                                >
                                    👤 {user.name} ▾
                                </button>
                                {isDropdownOpen && (
                                    <div className="profile-dropdown-menu">
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => {
                                                setIsProfileModalOpen(true);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            👤 {t('editProfile')}
                                        </button>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={() => {
                                                setCurrentView('history');
                                                setIsDropdownOpen(false);
                                                setIsCartOpen(false);
                                            }}
                                        >
                                            📜 {t('orderHistory')}
                                        </button>
                                        <button 
                                            className="dropdown-item logout" 
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            🚪 {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="auth-btn" onClick={() => setIsAuthModalOpen(true)}>
                                👤 {t('signIn')}
                            </button>
                        )}
                        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button className="cart-btn" onClick={() => runWithAuth(() => setIsCartOpen(true))}>
                            <span>📋 {t('order')}</span>
                            {getCartCount() > 0 && (
                                <div className="cart-badge">{getCartCount()}</div>
                            )}
                        </button>
                    </div>
                </div>
                <nav className="nav-links">
                    <a 
                        href="#menu" 
                        className={`nav-link ${currentView === 'menu' ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentView('menu');
                            const element = document.getElementById('menu');
                            if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        {t('menu')}
                    </a>
                    <a 
                        href="#about" 
                        className="nav-link"
                        onClick={() => setCurrentView('menu')}
                    >
                        {t('ourStory')}
                    </a>
                    <a 
                        href="#locations" 
                        className="nav-link"
                        onClick={() => setCurrentView('menu')}
                    >
                        {t('visitUs')}
                    </a>
                    <a
                        href="#admin"
                        className="nav-link nav-link-admin"
                        onClick={(e) => { e.preventDefault(); setCurrentView('admin'); }}
                    >
                        🔧 Admin
                    </a>
                </nav>
                <div className="header-search">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder={t('order') + '...'} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            className="search-clear-btn" 
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                        >
                            &times;
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
