import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <section className="hero">
            {/* Wave decorations */}
            <div className="hero-wave-top">
                <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" fill="rgba(255,140,0,0.10)" />
                </svg>
            </div>

            {/* Background blobs */}
            <div className="hero-blob hero-blob-1"></div>
            <div className="hero-blob hero-blob-2"></div>
            <div className="hero-blob hero-blob-3"></div>

            <div className="hero-inner">
                {/* Text side */}
                <div className="hero-content">
                    <div className="hero-badge animate-fade-in">
                        <span className="hero-badge-dot"></span>
                        {t('heroBadgeText')}
                    </div>

                    <h1 className="hero-title animate-slide-up">
                        {t('heroTitle1')}<span className="highlight">{t('heroTitleHighlight')}</span><br />
                        {t('heroTitle2')}
                    </h1>

                    <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {t('heroSubtitle')}
                    </p>

                    <div className="hero-actions animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <button className="cta-btn" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>
                            🥤 {t('exploreMenu')}
                        </button>
                        <button className="cta-btn-secondary">
                            ▶ {t('ourStory')}
                        </button>
                    </div>

                    <div className="hero-stats animate-fade-in" style={{ animationDelay: '0.6s' }}>
                        <div className="stat-item">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">{t('sodaRecipes')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">100%</span>
                            <span className="stat-label">{t('desiSpices')}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">4.9★</span>
                            <span className="stat-label">{t('rating')}</span>
                        </div>
                    </div>
                </div>

                {/* Visual side */}
                <div className="hero-visual animate-pop-in" style={{ animationDelay: '0.3s' }}>
                    <div className="hero-image-ring"></div>
                    <div className="hero-image-ring-2"></div>

                    <span className="fruit-chip">🍋</span>
                    <span className="fruit-chip">🌿</span>
                    <span className="fruit-chip">🥭</span>
                    <span className="fruit-chip">🌶️</span>

                    <img
                        src="/jal_jeera_soda.png"
                        alt="Jal Jeera Soda"
                        className="hero-main-image"
                    />

                    <div className="hero-mini-card hero-mini-card-1">
                        <span className="mini-card-icon">✅</span>
                        {t('handcraftedFresh')}
                    </div>
                    <div className="hero-mini-card hero-mini-card-2">
                        <span className="mini-card-icon">🌿</span>
                        {t('realIndianSpices')}
                    </div>
                </div>
            </div>

            <div className="hero-wave-bottom">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="#fff9f0" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
