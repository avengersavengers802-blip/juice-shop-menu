import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
    const { user, setCurrentView } = useAuth();
    const { t } = useLanguage();
    const [orders, setOrders] = useState([]);
    const [now, setNow] = useState(() => Date.now());

    // Load orders from user database partition
    useEffect(() => {
        if (user) {
            const userOrdersKey = `fizztaa_orders_${user.phone}`;
            const saved = localStorage.getItem(userOrdersKey);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOrders(saved ? JSON.parse(saved) : []);
        } else {
            setOrders([]);
        }
    }, [user]);

    // Live status tick
    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            setNow(Date.now());
        }, 5000);
        return () => clearInterval(interval);
    }, [user]);

    if (!user) {
        return (
            <div className="container history-page-empty">
                <span className="empty-emoji">🔒</span>
                <h2>{t('signToOrder')}</h2>
                <p>Please sign in to view your order history.</p>
                <button className="back-menu-btn" onClick={() => setCurrentView('menu')}>
                    ← {t('Continue Shopping')}
                </button>
            </div>
        );
    }

    // Calculate live status based on elapsed time since order timestamp
    const getOrderStatus = (order) => {
        const orderTime = new Date(order.timestamp).getTime();
        const elapsedSec = (now - orderTime) / 1000;

        if (elapsedSec < 15) {
            return { step: 0, text: t('orderReceived'), color: '#3a86c8', icon: '📝' };
        } else if (elapsedSec < 45) {
            return { step: 1, text: t('preparing'), color: '#ffb703', icon: '🍋' };
        } else if (elapsedSec < 90) {
            return { step: 2, text: t('outForDelivery'), color: '#fb8500', icon: '🛵' };
        } else {
            return { step: 3, text: t('delivered'), color: '#2a9d8f', icon: '🎉' };
        }
    };

    return (
        <div className="history-page-wrapper">
            <div className="container">
                <div className="history-page-header">
                    <button className="back-menu-btn" onClick={() => setCurrentView('menu')}>
                        ← {t('myCart') === 'My Cart' ? 'Back to Menu' : 'मेनूवर परत जा'}
                    </button>
                    <h1>{t('orderHistory')}</h1>
                </div>

                <div className="history-page-content">
                    {/* User profile card */}
                    <div className="history-profile-card">
                        <div className="profile-avatar">👤</div>
                        <div className="profile-info">
                            <h3>{user.name}</h3>
                            <p>📞 {user.phone}</p>
                            {user.email && <p>✉️ {user.email}</p>}
                        </div>
                    </div>

                    {/* Orders listing */}
                    <div className="history-orders-section">
                        {orders.length === 0 ? (
                            <div className="no-orders-card">
                                <span className="no-orders-emoji">🥤</span>
                                <h3>{t('noOrdersYet')}</h3>
                                <p>You haven't ordered any delicious fizzy drinks yet.</p>
                                <button className="order-now-btn" onClick={() => setCurrentView('menu')}>
                                    Order Now
                                </button>
                            </div>
                        ) : (
                            <div className="orders-timeline">
                                {orders.map(order => {
                                    const statusInfo = getOrderStatus(order);
                                    const formattedDate = new Date(order.timestamp).toLocaleDateString([], {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });

                                    return (
                                        <div key={order.id} className="history-order-item">
                                            <div className="order-item-header">
                                                <div>
                                                    <span className="order-id-label">{t('orderId')}: <strong>{order.id}</strong></span>
                                                    <span className="order-time-label">{formattedDate}</span>
                                                </div>
                                                <div className="order-status-badge" style={{ backgroundColor: `${statusInfo.color}15`, color: statusInfo.color }}>
                                                    {statusInfo.icon} {statusInfo.text}
                                                </div>
                                            </div>

                                            {/* Visual Progress Steps */}
                                            <div className="order-progress-tracker">
                                                <div className={`progress-step ${statusInfo.step >= 0 ? 'active' : ''}`}>
                                                    <div className="step-bullet">1</div>
                                                    <span className="step-label">{t('orderReceived')}</span>
                                                </div>
                                                <div className={`progress-line ${statusInfo.step >= 1 ? 'active' : ''}`} />
                                                <div className={`progress-step ${statusInfo.step >= 1 ? 'active' : ''}`}>
                                                    <div className="step-bullet">2</div>
                                                    <span className="step-label">{t('preparing')}</span>
                                                </div>
                                                <div className={`progress-line ${statusInfo.step >= 2 ? 'active' : ''}`} />
                                                <div className={`progress-step ${statusInfo.step >= 2 ? 'active' : ''}`}>
                                                    <div className="step-bullet">3</div>
                                                    <span className="step-label">{t('outForDelivery')}</span>
                                                </div>
                                                <div className={`progress-line ${statusInfo.step >= 3 ? 'active' : ''}`} />
                                                <div className={`progress-step ${statusInfo.step >= 3 ? 'active' : ''}`}>
                                                    <div className="step-bullet">4</div>
                                                    <span className="step-label">{t('delivered')}</span>
                                                </div>
                                            </div>

                                            <div className="order-item-details">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="order-item-detail-row">
                                                        <div className="item-detail-left">
                                                            <span className="item-detail-emoji">{item.emoji}</span>
                                                            <div className="item-detail-text">
                                                                <h4>{t(item.name)}</h4>
                                                                <span>Size: {item.sizeLabel} × {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                        <span className="item-detail-price">₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-item-footer">
                                                <span>{t('Total')}</span>
                                                <span className="order-total-price">₹{order.total}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
