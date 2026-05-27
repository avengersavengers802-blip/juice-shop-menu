import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './AuthModal.css';

const AuthModal = () => {
    const { isAuthModalOpen, setIsAuthModalOpen, login, signup } = useAuth();
    const { t } = useLanguage();
    
    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
    
    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!isAuthModalOpen) return null;

    const handleClose = () => {
        setIsAuthModalOpen(false);
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        setError('');
        
        if (activeTab === 'signup' && !name.trim()) {
            setError(t('fullName') + ' is required');
            return false;
        }
        
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setError('Enter a valid 10-digit mobile number starting with 6-9');
            return false;
        }
        
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            setError('Enter a valid email address');
            return false;
        }
        
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (activeTab === 'login') {
            // Mock login
            const userData = {
                name: name || phone.substring(0, 5),
                phone,
                email
            };
            setSuccessMessage(t('loginSuccess'));
            setTimeout(() => {
                login(userData);
                handleClose();
            }, 1000);
        } else {
            // Mock signup
            const userData = {
                name,
                phone,
                email
            };
            setSuccessMessage(t('signupSuccess'));
            setTimeout(() => {
                signup(userData);
                handleClose();
            }, 1000);
        }
    };

    return (
        <div className="auth-overlay" onClick={handleClose}>
            <div className="auth-card" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close-btn" onClick={handleClose} aria-label="Close modal">
                    &times;
                </button>
                
                <div className="auth-header">
                    <h2>{t('signToOrder')}</h2>
                    <p>Enter your details to proceed with your fizzy order 🥤</p>
                </div>

                <div className="auth-tabs">
                    <button 
                        className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('login'); setError(''); }}
                    >
                        {t('signIn')}
                    </button>
                    <button 
                        className={`auth-tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('signup'); setError(''); }}
                    >
                        {t('signUp')}
                    </button>
                    <div className={`auth-tab-indicator ${activeTab}`} />
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && <div className="auth-error-msg">{error}</div>}
                    {successMessage && <div className="auth-success-msg">{successMessage}</div>}

                    {activeTab === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="auth-name">{t('fullName')}</label>
                            <input 
                                id="auth-name"
                                type="text" 
                                placeholder={t('fullName')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="auth-phone">{t('phone')}</label>
                        <input 
                            id="auth-phone"
                            type="tel" 
                            placeholder={t('phone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auth-email">{t('email')} (Optional)</label>
                        <input 
                            id="auth-email"
                            type="email" 
                            placeholder={t('email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="auth-password">{t('password')}</label>
                        <input 
                            id="auth-password"
                            type="password" 
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-submit-btn">
                        {activeTab === 'login' ? t('signIn') : t('createAccount')}
                    </button>
                </form>

                <div className="auth-footer">
                    {activeTab === 'login' ? (
                        <p>
                            {t('dontHaveAccount')}{' '}
                            <button className="auth-toggle-link" onClick={() => { setActiveTab('signup'); setError(''); }}>
                                {t('signUp')}
                            </button>
                        </p>
                    ) : (
                        <p>
                            {t('alreadyHaveAccount')}{' '}
                            <button className="auth-toggle-link" onClick={() => { setActiveTab('login'); setError(''); }}>
                                {t('signIn')}
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
