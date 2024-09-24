import React, { useState } from 'react';
import ProductCategories from '../components/Productos/ProductCategories';
import OrderSummary from '../components/Ventas/OrderSumary';
import { Box } from '@mui/material';

const VentasPage = () => {
    const [orderItems, setOrderItems] = useState([
        { name: 'Chocolate', price: 2.5, quantity: 2 },
        { name: 'Café Americano', price: 3.0, quantity: 1 }
    ]);

    const categories = [
        {
            name: "Helados",
            products: [{ name: "Helado de Vainilla", price: 2.5 }, { name: "Helado de Chocolate", price: 3.0 }]
        },
        {
            name: "Cafeteria",
            products: [{ name: "Café Americano", price: 1.5 }, { name: "Cappuccino", price: 2.0 }]
        },
        {
            name: "Chocolates",
            products: [{ name: "Chocolate Oscuro", price: 1.2 }, { name: "Chocolate con Leche", price: 1.5 }]
        }
    ];


    const handleAddProduct = (product) => {
        const existingProduct = orderItems.find(item => item.name === product.name);
        if (existingProduct) {
            setOrderItems(orderItems.map(item =>
                item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setOrderItems([...orderItems, { ...product, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (item) => {
        setOrderItems(orderItems.map(orderItem =>
            orderItem.name === item.name ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        ));
    };

    const handleDecreaseQuantity = (item) => {
        if (item.quantity > 1) {
            setOrderItems(orderItems.map(orderItem =>
                orderItem.name === item.name ? { ...orderItem, quantity: orderItem.quantity - 1 } : orderItem
            ));
        } else {
            handleRemoveItem(item);
        }
    };

    const handleRemoveItem = (item) => {
        setOrderItems(orderItems.filter(orderItem => orderItem.name !== item.name));
    };

    const total = {
        subtotal: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        total: orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };

    return (
        <Box display="flex">
            <Box flex="3">
                <ProductCategories categories={categories} onAddProduct={handleAddProduct} />
            </Box>
            <Box flex="1">
                <OrderSummary
                    orderItems={orderItems}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    onRemoveItem={handleRemoveItem}
                    total={total}
                />
            </Box>
        </Box>
    );
};

export default VentasPage;
