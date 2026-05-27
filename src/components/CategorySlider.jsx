import React from 'react';
import './CategorySlider.css';
import { menuData } from '../data/menu';

const CategorySlider = ({ activeCategory, setActiveCategory }) => {
    return (
        <div className="category-container">
            <div className="category-scroll">
                {menuData.categories.map((cat, index) => (
                    <button
                        key={cat.id}
                        className={`category-btn glass ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat.id)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySlider;
