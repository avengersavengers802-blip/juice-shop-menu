/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfileModal.css';

const ProfileModal = () => {
    const { user, isProfileModalOpen, setIsProfileModalOpen, updateProfile, logout } = useAuth();
    const { t } = useLanguage();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Pre-fill fields when modal opens
    useEffect(() => {
        if (isProfileModalOpen && user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setEmail(user.email || '');
            setError('');
            setSuccessMessage('');
        }
    }, [isProfileModalOpen, user]);

    if (!isProfileModalOpen || !user) return null;

    const handleClose = () => {
        setIsProfileModalOpen(false);
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        setError('');

        if (!name.trim()) {
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

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        updateProfile({
            name,
            phone,
            email
        });

        setSuccessMessage(t('profileUpdateSuccess'));
        setTimeout(() => {
            handleClose();
        }, 1200);
    };

    return (
        <div className="profile-overlay" onClick={handleClose}>
            <div className="profile-card" onClick={(e) => e.stopPropagation()}>
                <button className="profile-close-btn" onClick={handleClose} aria-label="Close modal">
                    &times;
                </button>

                <div className="profile-header">
                    <h2>{t('editProfile')}</h2>
                    <p>Modify your account information below 👤</p>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    {error && <div className="profile-error-msg">{error}</div>}
                    {successMessage && <div className="profile-success-msg">{successMessage}</div>}

                    <div className="form-group">
                        <label htmlFor="profile-name">{t('fullName')}</label>
                        <input
                            id="profile-name"
                            type="text"
                            placeholder={t('fullName')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profile-phone">{t('phone')}</label>
                        <input
                            id="profile-phone"
                            type="tel"
                            placeholder={t('phone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profile-email">{t('email')} (Optional)</label>
                        <input
                            id="profile-email"
                            type="email"
                            placeholder={t('email')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="profile-save-btn">
                            💾 {t('saveChanges')}
                        </button>
                        <button type="button" className="profile-logout-btn" onClick={logout}>
                            🚪 {t('logout')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
