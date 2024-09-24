import React from 'react';
import { IconButton } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import './OrderSummaryItem.css';

const OrderSummaryItem = ({ item, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem }) => (
    <div className="order-item">
        {/* Sección 1: Botón de eliminar, imagen, nombre y precio */}
        <div className="order-item-details">
            <IconButton onClick={() => onRemoveItem(item)} className="delete-button">
                <Delete />
            </IconButton>
            {/*<img src={item.image} alt={item.name} className="order-item-image" />*/ }
            <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p className="item-price">${item.price.toFixed(2)}</p>
            </div>
        </div>

        {/* Sección 2: Botones de aumentar/disminuir cantidad */}
        <div className="order-item-controls">
            <IconButton onClick={() => onDecreaseQuantity(item)}>
                <Remove />
            </IconButton>
            <p className="item-quantity">{item.quantity}</p>
            <IconButton onClick={() => onIncreaseQuantity(item)}>
                <Add />
            </IconButton>
        </div>

        {/* Sección 3: Subtotal */}
        <div className="order-item-subtotal">
            <p>Subtotal    ${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    </div>
);

export default OrderSummaryItem;
