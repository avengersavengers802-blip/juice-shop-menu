/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartTab, setCartTab] = useState('cart'); // 'cart' | 'history'
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart_items');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart_items', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item, sizeIndex, sizeLabel, price) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(
                i => i.id === item.id && i.sizeIndex === sizeIndex
            );

            if (existingItemIndex > -1) {
                // Item exists, increase quantity
                const newItems = [...prev];
                newItems[existingItemIndex].quantity += 1;
                return newItems;
            } else {
                // New item
                return [...prev, {
                    cartId: `${item.id}_${sizeIndex}`,
                    id: item.id,
                    name: item.name,
                    color: item.color,
                    image: item.image,
                    emoji: item.emoji,
                    sizeIndex,
                    sizeLabel,
                    price,
                    quantity: 1
                }];
            }
        });
        
        // Optionally open cart when adding
        // setIsCartOpen(true);
    };

    const removeFromCart = (cartId) => {
        setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item.cartId === cartId) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            cartTab,
            setCartTab,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
