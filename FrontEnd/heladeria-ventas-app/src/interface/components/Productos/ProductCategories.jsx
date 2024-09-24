import React from 'react';
import './ProductCategories.css';

const ProductCategories = ({ categories, onAddProduct }) => {
    return (
        <div className="product-categories-container">
            {categories.map((category, index) => {
                const categoryClass = category.name.toLowerCase().replace(/\s+/g, '-');
                console.log(`category-class: ${categoryClass}`); // Verifica la clase generada
                return (
                    <div key={index} className={`category-card ${categoryClass}`}>
                        <h3>{category.name}</h3>
                        <div className="product-cards">
                            {category.products.map((product, idx) => (
                                <button
                                    key={idx}
                                    className="product-card"
                                    onClick={() => onAddProduct(product)}
                                >
                                    <div className="product-card-text">{product.name}</div>
                                    <div className="product-card-price">${product.price.toFixed(2)}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductCategories;
