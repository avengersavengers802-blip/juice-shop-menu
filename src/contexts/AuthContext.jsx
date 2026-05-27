/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('fizztaa_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState('menu'); // 'menu' | 'history' | 'admin'
    const [authActionCallback, setAuthActionCallback] = useState(null); // callback to run after successful login

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('fizztaa_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
        if (authActionCallback) {
            authActionCallback();
            setAuthActionCallback(null);
        }
    };

    const signup = (userData) => {
        setUser(userData);
        localStorage.setItem('fizztaa_user', JSON.stringify(userData));
        setIsAuthModalOpen(false);
        if (authActionCallback) {
            authActionCallback();
            setAuthActionCallback(null);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fizztaa_user');
        setIsProfileModalOpen(false);
    };

    const updateProfile = (newUserData) => {
        const oldPhone = user?.phone;
        const newPhone = newUserData.phone;
        if (oldPhone && newPhone && oldPhone !== newPhone) {
            const oldOrdersKey = `fizztaa_orders_${oldPhone}`;
            const newOrdersKey = `fizztaa_orders_${newPhone}`;
            const savedOrders = localStorage.getItem(oldOrdersKey);
            if (savedOrders) {
                localStorage.setItem(newOrdersKey, savedOrders);
                localStorage.removeItem(oldOrdersKey);
            }
        }
        setUser(newUserData);
        localStorage.setItem('fizztaa_user', JSON.stringify(newUserData));
    };

    const runWithAuth = (callback) => {
        if (user) {
            callback();
        } else {
            setAuthActionCallback(() => callback);
            setIsAuthModalOpen(true);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, login, signup, logout, 
            isAuthModalOpen, setIsAuthModalOpen, 
            isProfileModalOpen, setIsProfileModalOpen,
            updateProfile,
            runWithAuth,
            currentView,
            setCurrentView
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
