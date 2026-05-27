import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="footer">
            {/* Wave top */}
            <div className="footer-wave-top">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,40 C480,80 960,0 1440,40 L1440,0 L0,0 Z" style={{ fill: 'var(--color-bg)', transition: 'fill var(--transition-normal)' }} />
                </svg>
            </div>

            {/* Background blobs */}
            <div className="footer-blob-1"></div>
            <div className="footer-blob-2"></div>

            <div className="container">
                {/* Promise section */}
                <div className="footer-promise">
                    <h2>{t('ourPromise1')}<span>{t('ourPromise2')}</span></h2>
                    <p>
                        {t('promiseText')}
                    </p>
                    <button className="footer-promise-btn">{t('getToKnowUs')}</button>
                </div>

                <hr className="footer-divider" />

                {/* Links */}
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="logo-wrap">
                            <span className="brand-icon">🥤</span>
                            <span className="brand-name">Fizztaa</span>
                        </div>
                        <p>{t('footerSubtitle')}</p>
                        <div className="footer-socials">
                            <div className="social-icon">📸</div>
                            <div className="social-icon">🐦</div>
                            <div className="social-icon">📘</div>
                            <div className="social-icon">▶️</div>
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>{t('menu')}</h4>
                        <ul>
                            <li><a href="#">{t('Regular Soda')}</a></li>
                            <li><a href="#">{t('Special Soda')}</a></li>
                            <li><a href="#">{t('Mojito')}</a></li>
                            <li><a href="#">{t('Moctails')}</a></li>
                            <li><a href="#">{t('Ice Cream Soda')}</a></li>
                            <li><a href="#">{t('Cold Coffee')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>{t('info')}</h4>
                        <ul>
                            <li><a href="#">{t('ourStory')}</a></li>
                            <li><a href="#">{t('visitUs')}</a></li>
                            <li><a href="#">{t('franchise')}</a></li>
                            <li><a href="#">{t('contact')}</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p>{t('copyright')}</p>
                    <div className="footer-bottom-links">
                        <a href="#">{t('privacyPolicy')}</a>
                        <a href="#">{t('termsOfUse')}</a>
                        <a href="#">{t('fssaiInfo')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
