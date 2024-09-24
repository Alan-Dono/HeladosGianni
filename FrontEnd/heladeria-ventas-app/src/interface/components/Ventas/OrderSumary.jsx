import React from 'react';
import './OrderSummary.css';
import OrderSummaryItem from './OrderSummaryItem';  // Componente separado para cada ítem

const OrderSummary = ({ orderItems, onIncreaseQuantity, onDecreaseQuantity, onRemoveItem, total, onApplyDiscount }) => {
    const [discountCode, setDiscountCode] = React.useState('');

    const handleApplyDiscount = () => {
        onApplyDiscount(discountCode);  // Ejecuta la función pasada como prop con el código de descuento
    };

    return (
        <div className="order-summary-container">
            <h2>Pedido</h2>
            {orderItems.map((item, index) => (
                <OrderSummaryItem
                    key={index}
                    item={item}
                    onIncreaseQuantity={onIncreaseQuantity}
                    onDecreaseQuantity={onDecreaseQuantity}
                    onRemoveItem={onRemoveItem}
                />
            ))}
            <div className="order-summary-total">
                <input
                    type="text"
                    className="discount-input"
                    placeholder="Cupón de descuento"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}  // Actualiza el código de descuento
                />
                <button
                    className="apply-discount-button"
                    onClick={handleApplyDiscount}
                >
                    Apply
                </button>
            </div>

            {/* Los subtotales y totales debajo del cupón */}
            <h3>Subtotal: ${total.subtotal.toFixed(2)}</h3>
            <h2>Total: ${total.total.toFixed(2)}</h2>
        </div>
    );
};

export default OrderSummary;
