import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { t } = useLanguage();
    const { user, setCurrentView } = useAuth();
    
    const [isCheckoutMock, setIsCheckoutMock] = useState(false);
    const [checkoutComplete, setCheckoutComplete] = useState(false);

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCheckoutMock(true);
    };

    const processMockPayment = () => {
        // Simulate payment gateway delay
        setTimeout(() => {
            const newOrder = {
                id: `FZT-${Math.floor(100000 + Math.random() * 900000)}`,
                timestamp: new Date().toISOString(),
                items: [...cartItems],
                total: getCartTotal()
            };
            
            // Save to current user's database partition
            const userOrdersKey = `fizztaa_orders_${user.phone}`;
            const currentOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
            const updatedOrders = [newOrder, ...currentOrders];
            localStorage.setItem(userOrdersKey, JSON.stringify(updatedOrders));
            
            setCheckoutComplete(true);
            clearCart();
        }, 1500);
    };

    const closeCart = () => {
        setIsCartOpen(false);
        setTimeout(() => {
            setIsCheckoutMock(false);
            setCheckoutComplete(false);
        }, 300);
    };

    const goToOrderHistory = () => {
        closeCart();
        setTimeout(() => {
            setCurrentView('history');
        }, 350);
    };

    return (
        <div className="cart-overlay" onClick={closeCart}>
            <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
                <div className="cart-header">
                    <h2>🛒 {t('myCart')}</h2>
                    <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart">&times;</button>
                </div>

                {cartItems.length === 0 && !checkoutComplete ? (
                    <div className="cart-empty">
                        <span className="cart-empty-emoji">🛒</span>
                        <p>{t('Your cart is empty')}</p>
                        <button className="cart-continue-btn" onClick={closeCart}>{t('Continue Shopping')}</button>
                    </div>
                ) : checkoutComplete ? (
                    <div className="cart-success">
                        <div className="success-checkmark">✓</div>
                        <h3>{t('Payment Successful!')}</h3>
                        <p>{t('Your order has been placed.')}</p>
                        <button 
                            className="cart-continue-btn" 
                            onClick={goToOrderHistory}
                        >
                            📜 {t('orderHistory')}
                        </button>
                        <button 
                            className="cart-back-btn" 
                            onClick={closeCart}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {t('Continue Shopping')}
                        </button>
                    </div>
                ) : isCheckoutMock ? (
                    <div className="cart-checkout-mock">
                        <h3>{t('Mock Payment Gateway')}</h3>
                        <p>{t('Pay')} ₹{getCartTotal()}</p>
                        <div className="mock-payment-options">
                            <button className="mock-pay-btn upi" onClick={processMockPayment}>{t('Pay via UPI')}</button>
                            <button className="mock-pay-btn card" onClick={processMockPayment}>{t('Pay via Card')}</button>
                        </div>
                        <button className="cart-back-btn" onClick={() => setIsCheckoutMock(false)}>{t('Back to Cart')}</button>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.cartId} className="cart-item">
                                    <div className="cart-item-preview" style={{ background: `${item.color}22` }}>
                                        {item.image ? (
                                            <img src={item.image} alt={t(item.name)} loading="lazy" />
                                        ) : (
                                            <span>{item.emoji}</span>
                                        )}
                                    </div>
                                    <div className="cart-item-details">
                                        <h4>{t(item.name)}</h4>
                                        <div className="cart-item-meta">
                                            <span className="item-size">{item.sizeLabel}</span>
                                            <span className="item-price">₹{item.price}</span>
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.cartId, -1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.cartId, 1)}>+</button>
                                            </div>
                                            <button className="item-remove-btn" onClick={() => removeFromCart(item.cartId)}>
                                                {t('Remove')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="cart-item-row-total">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="cart-footer">
                            <div className="cart-subtotal">
                                <span>{t('Total')}</span>
                                <span>₹{getCartTotal()}</span>
                            </div>
                            <button className="cart-checkout-btn" onClick={handleCheckout}>
                                {t('Proceed to Checkout')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
