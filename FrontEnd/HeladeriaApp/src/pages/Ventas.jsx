import React, { useState, useEffect } from 'react';
import Categoria from '../components/Categoria';
import OrdenCompra from '../components/OrdenCompra';
import { Box } from '@mui/material';
import { useTheme } from '@emotion/react';

const Ventas = () => {
    const [carrito, setCarrito] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [categorias, setCategorias] = useState([]);

    const theme = useTheme();

    // Simulación de datos obtenidos de la base de datos
    const productos = {
        heladeria: [
            { id: 101, nombre: '1/8 kg', precio: 1500 },
            { id: 102, nombre: '1/4 kg', precio: 3000 },
            { id: 103, nombre: '1/2 kg', precio: 5000 },
            { id: 104, nombre: '1 kg', precio: 12000 },
            { id: 105, nombre: 'Cono Chico', precio: 1200 },
            { id: 106, nombre: 'Cono Mediano', precio: 1600 },
            { id: 107, nombre: 'Cono Grande', precio: 2000 },
            { id: 108, nombre: 'Copita Pequeña', precio: 1400 },
            { id: 109, nombre: 'Copita Grande', precio: 1800 },
            { id: 110, nombre: 'Paleta', precio: 1200 },
            { id: 111, nombre: 'Batido', precio: 1800 },
            { id: 112, nombre: 'Sundae Pequeño', precio: 2400 },
            { id: 113, nombre: 'Sundae Grande', precio: 3000 },
            { id: 114, nombre: 'Torta (porción)', precio: 2000 },
            { id: 115, nombre: 'Yogur (1/4 kg)', precio: 2200 },
        ],
        cafeteria: [
            { id: 201, nombre: 'Café Espresso', precio: 700 },
            { id: 202, nombre: 'Café Americano', precio: 600 },
            { id: 203, nombre: 'Café con Leche', precio: 800 },
            { id: 204, nombre: 'Café Frío', precio: 900 },
            { id: 205, nombre: 'Té', precio: 500 },
            { id: 206, nombre: 'Chocolate Caliente', precio: 1000 },
            { id: 207, nombre: 'Gaseosa (350ml)', precio: 500 },
            { id: 208, nombre: 'Gaseosa (1.5L)', precio: 1200 },
            { id: 209, nombre: 'Agua Mineral', precio: 400 },
            { id: 210, nombre: 'Jugo Natural (250ml)', precio: 700 },
            { id: 211, nombre: 'Smoothie', precio: 1200 },
            { id: 212, nombre: 'Pastelito', precio: 800 },
            { id: 213, nombre: 'Croissant', precio: 900 },
            { id: 214, nombre: 'Galleta', precio: 300 },
            { id: 215, nombre: 'Torta (porción)', precio: 1000 },
            { id: 216, nombre: 'Café Cortado', precio: 750 },
            { id: 217, nombre: 'Café Mocca', precio: 950 },
            { id: 218, nombre: 'Capuchino', precio: 850 },
            { id: 219, nombre: 'Frappuccino', precio: 1100 },
            { id: 220, nombre: 'Té Helado', precio: 600 },
            { id: 221, nombre: 'Limonada', precio: 500 },
            { id: 222, nombre: 'Gaseosa (500ml)', precio: 700 },
            { id: 223, nombre: 'Cerveza', precio: 1500 },
            { id: 224, nombre: 'Batido de Frutas', precio: 900 },
            { id: 225, nombre: 'Brownie', precio: 700 },
            { id: 226, nombre: 'Tarta de Frutas', precio: 1200 },
            { id: 227, nombre: 'Gelatina', precio: 400 },
            { id: 228, nombre: 'Palito de Queso', precio: 500 },
            { id: 229, nombre: 'Galleta de Avena', precio: 350 },
            { id: 230, nombre: 'Café Descafeinado', precio: 800 },
        ],
        chocolateria: [
            { id: 301, nombre: 'Barra (100g)', precio: 500 },
            { id: 302, nombre: 'Con Almendras (100g)', precio: 550 },
            { id: 303, nombre: 'Negro (70% cacao, 100g)', precio: 600 },
            { id: 304, nombre: 'Con Leche (100g)', precio: 550 },
            { id: 305, nombre: 'Bombones Variados (Caja 200g)', precio: 1200 },
            { id: 306, nombre: 'Trufas (Caja 100g)', precio: 800 },
            { id: 307, nombre: 'En Polvo (250g)', precio: 400 },
            { id: 308, nombre: 'A la Taza (250g)', precio: 700 },
            { id: 309, nombre: 'Blanco (100g)', precio: 650 },
            { id: 310, nombre: 'Relleno (barra 100g)', precio: 700 },
            { id: 311, nombre: 'Galletas (Paquete 200g)', precio: 900 },
            { id: 312, nombre: 'Con Menta (100g)', precio: 650 },
        ],
    };


    useEffect(() => {
        const fetchCategorias = () => {
            const categoriasData = Object.keys(productos).map(key => ({
                id: key,
                nombre: key.charAt(0).toUpperCase() + key.slice(1),
                productos: productos[key],
            }));
            setCategorias(categoriasData);
        };
        fetchCategorias();
    }, []);

    // Lógica de carrito
    const agregarProducto = (producto) => {
        const productoExistente = carrito.find((item) => item.id === producto.id);

        if (productoExistente) {
            setCarrito(
                carrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const restarProducto = (id) => {
        setCarrito(prevCarrito => prevCarrito
            .map(item => item.id === id && item.cantidad > 1 ?
                { ...item, cantidad: item.cantidad - 1 } : item)
            .filter(item => item.cantidad > 0)
        );
    };

    const eliminarProducto = (id) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    };

    // Cálculo de subtotal y total
    const subtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);

    const total = subtotal - descuento;

    return (
        <Box sx={{ display: 'flex', height: '100vh', p: 2 }}>
            <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {categorias.map(categoria => (
                    <Box key={categoria.id} sx={{
                        backgroundColor: theme.palette.background.paper,
                        flex: 1,
                        margin: '0.2rem 0.2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '4px',
                    }}>
                        <Categoria
                            nombreCategoria={categoria.nombre}
                            productos={categoria.productos}
                            agregar={agregarProducto}
                            restar={restarProducto}
                        />
                    </Box>
                ))}
            </Box>
            <Box sx={{ width: '30%', padding: 0.5 }}>
                <OrdenCompra
                    carrito={carrito}
                    subtotal={subtotal}
                    descuento={descuento}
                    total={total}
                    setDescuento={setDescuento}
                    agregar={agregarProducto}
                    restar={restarProducto}
                    eliminar={eliminarProducto}
                />
            </Box>
        </Box>
    );
};

export default Ventas;
