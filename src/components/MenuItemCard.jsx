import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import './MenuItemCard.css';

import { useAuth } from '../contexts/AuthContext';

const SIZE_LABELS_MAP = {
  regular:  ['S', 'M', 'L', 'XL'],
  special:  ['Reg', 'Lrg'],
  mojito:   ['Reg', 'Lrg'],
  sheng:    ['Reg', 'Lrg'],
  moctail:  ['S', 'M', 'L', 'XL'],
  short:    ['Reg'],
  icecream: ['Reg'],
  softy:    ['Reg'],
  coffee:   ['Reg'],
};

const MenuItemCard = ({ item, index }) => {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { runWithAuth } = useAuth();
    const labels = SIZE_LABELS_MAP[item.categoryId] || ['Reg'];
    const [selectedSize, setSelectedSize] = useState(0);
    const [added, setAdded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleAdd = () => {
        runWithAuth(() => {
            const sizeLabel = labels[selectedSize] || `S${selectedSize + 1}`;
            const price = item.prices[selectedSize];
            addToCart(item, selectedSize, sizeLabel, price);
            
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        });
    };

    const isMultiSize = item.prices.length > 1;

    return (
        <div className="menu-card" style={{ animationDelay: `${index * 0.04}s` }}>
            {/* Colored top accent bar */}
            <div
                className="card-accent-bar"
                style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
            />

            {/* Image or emoji fallback */}
            <div
                className="card-image-wrapper"
                style={{ background: `linear-gradient(135deg, ${item.color}18, ${item.color}08)` }}
            >
                {item.image && !imgError ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="card-image"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="card-emoji-tile">
                        <span className="card-emoji">{item.emoji}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="card-content">
                <h3 className="card-title">{t(item.name)}</h3>

                {isMultiSize ? (
                    <div className="size-selector">
                        {item.prices.map((price, i) => (
                            <button
                                key={i}
                                className={`size-btn ${selectedSize === i ? 'active' : ''}`}
                                style={
                                    selectedSize === i
                                        ? { background: item.color, color: '#fff', borderColor: item.color }
                                        : { borderColor: `${item.color}99`, color: item.color }
                                }
                                onClick={() => setSelectedSize(i)}
                            >
                                <span className="size-label">{labels[i] || `S${i + 1}`}</span>
                                <span className="size-price">₹{price}</span>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="card-single-price" style={{ color: item.color }}>
                        ₹{item.prices[0]}
                    </div>
                )}

                <button
                    className="add-to-cart-btn"
                    onClick={handleAdd}
                    style={{
                        background: added
                            ? `linear-gradient(135deg, #06d6a0, #00b4d8)`
                            : `linear-gradient(135deg, ${item.color}, ${item.color}bb)`
                    }}
                >
                    {added ? t('added') : t('addOrder')}
                </button>
            </div>
        </div>
    );
};

export default MenuItemCard;
