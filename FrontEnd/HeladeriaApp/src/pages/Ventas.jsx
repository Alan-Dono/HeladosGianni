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
            { id: 1, nombre: '1/8 kg', precio: 50 },
            { id: 2, nombre: '1/4 kg', precio: 100 },
            { id: 3, nombre: '1/2 kg', precio: 180 },
            { id: 4, nombre: '1 kg', precio: 350 },
            { id: 5, nombre: 'Cono Chico', precio: 60 },
            { id: 6, nombre: 'Cono Mediano', precio: 80 },
            { id: 7, nombre: 'Cono Grande', precio: 100 },
            { id: 8, nombre: 'Copita Pequeña', precio: 70 },
            { id: 9, nombre: 'Copita Grande', precio: 90 },
            { id: 10, nombre: 'Paleta', precio: 50 },
            { id: 11, nombre: 'Batido', precio: 90 },
            { id: 12, nombre: 'Sundae Pequeño', precio: 120 },
            { id: 13, nombre: 'Sundae Grande', precio: 150 },
            { id: 14, nombre: 'Torta (porción)', precio: 100 },
            { id: 15, nombre: 'Yogur (1/4 kg)', precio: 110 },

        ],
        cafeteria: [
            { id: 1, nombre: 'Café Espresso', precio: 70 },
            { id: 2, nombre: 'Café Americano', precio: 60 },
            { id: 3, nombre: 'Café con Leche', precio: 80 },
            { id: 4, nombre: 'Café Frío', precio: 90 },
            { id: 5, nombre: 'Té', precio: 50 },
            { id: 6, nombre: 'Chocolate Caliente', precio: 100 },
            { id: 7, nombre: 'Gaseosa (350ml)', precio: 50 },
            { id: 8, nombre: 'Gaseosa (1.5L)', precio: 120 },
            { id: 9, nombre: 'Agua Mineral', precio: 40 },
            { id: 10, nombre: 'Jugo Natural (250ml)', precio: 70 },
            { id: 11, nombre: 'Smoothie', precio: 120 },
            { id: 12, nombre: 'Pastelito', precio: 80 },
            { id: 13, nombre: 'Croissant', precio: 90 },
            { id: 14, nombre: 'Galleta', precio: 30 },
            { id: 15, nombre: 'Torta (porción)', precio: 100 },
            { id: 16, nombre: 'Café Cortado', precio: 75 },
            { id: 17, nombre: 'Café Mocca', precio: 95 },
            { id: 18, nombre: 'Capuchino', precio: 85 },
            { id: 19, nombre: 'Frappuccino', precio: 110 },
            { id: 20, nombre: 'Té Helado', precio: 60 },
            { id: 21, nombre: 'Limonada', precio: 50 },
            { id: 22, nombre: 'Gaseosa (500ml)', precio: 70 },
            { id: 23, nombre: 'Cerveza', precio: 150 },
            { id: 24, nombre: 'Batido de Frutas', precio: 90 },
            { id: 25, nombre: 'Brownie', precio: 70 },
            { id: 26, nombre: 'Tarta de Frutas', precio: 120 },
            { id: 27, nombre: 'Gelatina', precio: 40 },
            { id: 28, nombre: 'Palito de Queso', precio: 50 },
            { id: 29, nombre: 'Galleta de Avena', precio: 35 },
            { id: 30, nombre: 'Café Descafeinado', precio: 80 },

        ],
        chocolateria: [
            { id: 1, nombre: 'Barra (100g)', precio: 50 },
            { id: 2, nombre: 'Con Almendras (100g)', precio: 55 },
            { id: 3, nombre: 'Negro (70% cacao, 100g)', precio: 60 },
            { id: 4, nombre: 'Con Leche (100g)', precio: 55 },
            { id: 5, nombre: 'Bombones Variados (Caja 200g)', precio: 120 },
            { id: 6, nombre: 'Trufas (Caja 100g)', precio: 80 },
            { id: 7, nombre: 'En Polvo (250g)', precio: 40 },
            { id: 8, nombre: 'A la Taza (250g)', precio: 70 },
            { id: 9, nombre: 'Blanco (100g)', precio: 65 },
            { id: 10, nombre: 'Relleno (barra 100g)', precio: 70 },
            { id: 11, nombre: 'Galletas (Paquete 200g)', precio: 90 },
            { id: 12, nombre: 'Con Menta (100g)', precio: 65 },
        ],
    };

    useEffect(() => {
        // Simulando una llamada al backend para obtener las categorías
        const fetchCategorias = () => {
            const categoriasData = Object.keys(productos).map((key) => ({
                id: key,
                nombre: key.charAt(0).toUpperCase() + key.slice(1), // Capitaliza la primera letra
                productos: productos[key],
            }));
            setCategorias(categoriasData);
        };

        fetchCategorias();
    }, []);


    const agregarProducto = (producto) => {
        setCarrito(prevCarrito => {
            const existeProducto = prevCarrito.find(item => item.id === producto.id);
            if (existeProducto) {
                return prevCarrito.map(item =>
                    item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            } else {
                return [...prevCarrito, { ...producto, cantidad: 1 }];
            }
        });
    };

    const restarProducto = (id) => {
        setCarrito(prevCarrito => prevCarrito.map(item =>
            item.id === id && item.cantidad > 0 ? { ...item, cantidad: item.cantidad - 1 } : item
        ).filter(item => item.cantidad > 0));
    };

    const eliminarProducto = (id) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    };

    const subtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
    const total = subtotal - descuento;

    return (
        <Box sx={{ display: 'flex', height: '100vh', p:2}}>
            <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {categorias.map(categoria => (
                    <Box key={categoria.id} sx={{ 
                        backgroundColor: theme.palette.background.paper,
                        flex: 1, // Cada categoría ocupará el mismo espacio
                        margin: '0.2rem 0.2rem', // Margen entre categorías
                        display: 'flex',
                        //padding: '0.1rem',
                        flexDirection: 'column',
                        justifyContent: 'center', // Centrar contenido verticalmente
                        alignItems: 'center', // Centrar contenido horizontalmente
                        borderRadius: '4px', // Opcional: redondear las esquinas
                        
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
            <Box sx={{ width: '30%', padding: 1 }}>
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
