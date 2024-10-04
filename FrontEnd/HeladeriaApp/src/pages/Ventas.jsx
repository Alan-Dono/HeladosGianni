import React, { useState, useEffect } from 'react';
import Categoria from '../components/Categoria';
import OrdenCompra from '../components/OrdenCompra';
import { Box } from '@mui/material';
import { useTheme } from '@emotion/react';
import CategoriaProductoService from '../services/CategoriaProductoService';

const Ventas = () => {

    const [carrito, setCarrito] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [subtotal, setSubtotal] = useState(0); // Estado para subtotal
    const [total, setTotal] = useState(0); // Estado para total
    const theme = useTheme();


    // Función para obtener todas las categorías y productos
    useEffect(() => {
        const fetchCategoriasConProductos = async () => {
            try {
                const categorias = await CategoriaProductoService.obtenerCategoriasConProductos();
                setCategorias(categorias);
            } catch (error) {
                console.error('Error al obtener las categorías y productos', error);
            }
        };
        fetchCategoriasConProductos();
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

    // Calcular subtotal y total
    useEffect(() => {
        const newSubtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal - (newSubtotal * descuento / 100)); // Actualiza el total basado en el descuento
    }, [carrito, descuento]); // Dependencias para recalcular subtotal y total


    return (
        <Box sx={{ display: 'flex', height: '100vh', p: 1 }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {categorias.map(categoria => (
                    <Box key={categoria.id} sx={{
                        backgroundColor: theme.palette.background.paper,
                        flex: 1,
                        margin: '0.2rem 0.1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '4px',
                    }}>
                        <Categoria
                            nombreCategoria={categoria.nombreCategoria}
                            productos={categoria.productos}
                            agregar={agregarProducto}
                        />
                    </Box>
                ))}
            </Box>
            <Box sx={{ width: '30%', padding: 0.5 }}>
                <OrdenCompra
                    carrito={carrito}
                    setCarrito={setCarrito}
                    subtotal={subtotal}
                    setSubtotal={setSubtotal} // Puedes pasar esto si necesitas actualizarlo desde OrdenCompra
                    descuento={descuento}
                    total={total}
                    setTotal={setTotal} // Pasar el setter de total
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
