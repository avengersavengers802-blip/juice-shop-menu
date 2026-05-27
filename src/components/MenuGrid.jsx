import React, { useState } from 'react';
import { menuData } from '../data/menu';
import MenuItemCard from './MenuItemCard';
import { useLanguage } from '../contexts/LanguageContext';
import './MenuGrid.css';

const MenuGrid = ({ searchQuery }) => {
    const { t } = useLanguage();
    const [activeCategory, setActiveCategory] = useState('regular');

    const filtered = menuData.items
        .filter(i => i.categoryId === activeCategory)
        .filter(i => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase().trim();
            const nameEn = i.name.toLowerCase();
            const nameTranslated = t(i.name).toLowerCase();
            return nameEn.includes(query) || nameTranslated.includes(query);
        })
        .sort((a, b) => a.prices[0] - b.prices[0]);

    return (
        <section id="menu">
            {/* Wave top */}
            <div className="menu-wave-top">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" style={{ fill: 'var(--color-bg2)', transition: 'fill var(--transition-normal)' }} />
                </svg>
            </div>

            <div className="menu-blob-left"></div>
            <div className="menu-blob-right"></div>

            <div className="container">
                <div className="menu-header">
                    <span className="section-label">{t('whatWeOffer')}</span>
                    <h2>{t('ourMenuTitle1')}<span>{t('ourMenuTitle2')}</span></h2>
                    <p className="menu-subtitle">{t('menuSubtitle')}</p>
                </div>
            </div>

            <div className="category-tabs">
                <div className="category-tabs-inner">
                    {menuData.categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            <span className="category-emoji">{cat.emoji}</span> {t(cat.name)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container">
                <div className="menu-grid">
                    {filtered.length === 0 ? (
                        <div className="menu-empty">{t('noItems')}</div>
                    ) : (
                        filtered.map((item, index) => (
                            <MenuItemCard key={item.id} item={item} index={index} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default MenuGrid;

