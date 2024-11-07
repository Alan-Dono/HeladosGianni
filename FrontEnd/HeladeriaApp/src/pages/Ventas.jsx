import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import OrdenCompra from '../components/OrdenCompra';
import { Box, Button, Slide, Snackbar } from '@mui/material';
import { useTheme } from '@emotion/react';
import CategoriaProductoService from '../services/CategoriaProductoService';
import CierreCajaService from '../services/CierreCajaService';
import ProductoService from '../services/ProductoService';
import MuiAlert from '@mui/material/Alert';

const Ventas = () => {
    const [carrito, setCarrito] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [cierreActivo, setCierreActivo] = useState(null);
    const [vistaActual, setVistaActual] = useState('favoritos');

    const [snackbarAbierto, setSnackbarAbierto] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');


    const [productos, setProductos] = useState({
        favoritos: [],
        cafeteria: [],
        heladeria: [],
        confiteria: [],
        promociones: []
    });

    // Función para cerrar la alerta
    const cerrarAlerta = (event, reason) => {
        // Evitar el cierre del Snackbar si se cierra debido a un clic fuera del Snackbar
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarAbierto(false);
    };



    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriasData, cierre, favoritosData] = await Promise.all([
                    CategoriaProductoService.obtenerCategoriasConProductos(),
                    CierreCajaService.obtenerActivo(),
                    ProductoService.obtenerFavoritos()
                ]);

                setCategorias(categoriasData);
                setCierreActivo(cierre);

                const productosPorCategoria = {
                    favoritos: favoritosData,
                    cafeteria: [],
                    heladeria: [],
                    confiteria: [],
                    promociones: []
                };

                categoriasData.forEach(categoria => {
                    categoria.productos.forEach(producto => {
                        const categoriaNombre = categoria.nombreCategoria.toLowerCase();
                        if (productosPorCategoria[categoriaNombre]) {
                            productosPorCategoria[categoriaNombre].push(producto);
                        }
                    });
                });

                setProductos(productosPorCategoria);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log("Productos favoritos actualizados:", productos.favoritos);
    }, [productos.favoritos]);

    const agregarProducto = (producto) => {
        if (!producto || !producto.id) return;
        const productoExistente = carrito.find((item) => item.id === producto.id);
        if (productoExistente) {
            setCarrito(carrito.map((item) =>
                item.id === producto.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    const toggleFavorito = async (producto) => {
        if (!producto || !producto.id) {
            console.error("Producto no válido:", producto);
            return;
        }

        setProductos((prevProductos) => {
            const favoritos = [...prevProductos.favoritos];
            const productoExistente = favoritos.find((fav) => fav?.id === producto.id);

            if (productoExistente) {
                ProductoService.eliminarDeFavoritos(producto.id);
                // Configurar mensaje y tipo de alerta
                setMensajeSnackbar(`Eliminado de favoritos.`);
                setTipoAlerta('warning'); // Puedes usar 'warning' para un color naranja
                setSnackbarAbierto(true);
                return {
                    ...prevProductos,
                    favoritos: favoritos.filter((fav) => fav?.id !== producto.id),
                };
            } else {
                ProductoService.agregarAFavoritos(producto.id);
                setMensajeSnackbar(`Agregado a favoritos`);
                setTipoAlerta('success'); // Puedes usar 'success' o 'info'
                setSnackbarAbierto(true);
                return {
                    ...prevProductos,
                    favoritos: [...favoritos, producto],
                };
            }
   
        });
    };

    const restarProducto = (id) => {
        setCarrito(prevCarrito =>
            prevCarrito
                .map(item => item.id === id && item.cantidad > 1 ?
                    { ...item, cantidad: item.cantidad - 1 } : item)
                .filter(item => item.cantidad > 0)
        );
    };

    const eliminarProducto = (id) => {
        setCarrito(prevCarrito => prevCarrito.filter(item => item.id !== id));
    };

    useEffect(() => {
        const newSubtotal = carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
        setSubtotal(newSubtotal);
        setTotal(newSubtotal - (newSubtotal * descuento / 100));
    }, [carrito, descuento]);

    const obtenerProductosVista = () => {
        return productos[vistaActual] || [];
    };

    const renderizarVistaActual = () => {
        const productosActuales = obtenerProductosVista();

        return (
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(6, 1fr)',
                gap: '4px',
                padding: '4px',
                height: '100%',
                overflow: 'hidden',
            }}>
                {productosActuales.map((producto) => (
                    <Box key={producto.id} sx={{
                        aspectRatio: '1/1',
                        minHeight: 0,
                        minWidth: 0
                    }}>
                        <ProductoCard
                            producto={producto}
                            agregar={agregarProducto}
                            toggleFavorito={toggleFavorito}
                        />
                    </Box>
                ))}
            </Box>
        );
    };


    return (
        <Box sx={{
            display: 'flex',
            height: '100vh',
            p: 1,
            gap: 1
        }}>
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                gap: 1
            }}>
                <Box sx={{
                    flex: 1,
                    backgroundColor: 'background.paper',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {renderizarVistaActual()}
                </Box>

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px',
                    p: 1,
                    backgroundColor: 'background.paper',
                    borderRadius: '4px',
                    height: '60px'
                }}>
                    {['favoritos', 'cafeteria', 'heladeria', 'confiteria', 'promociones'].map((categoria) => (
                        <Button
                            key={categoria}
                            variant={vistaActual === categoria ? 'contained' : 'outlined'}
                            onClick={() => setVistaActual(categoria)}
                            sx={{
                                height: '100%',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                        </Button>
                    ))}
                </Box>
            </Box>

            <Box sx={{ width: '30%' }}>
                <OrdenCompra
                    carrito={carrito}
                    setCarrito={setCarrito}
                    subtotal={subtotal}
                    setSubtotal={setSubtotal}
                    descuento={descuento}
                    total={total}
                    setTotal={setTotal}
                    setDescuento={setDescuento}
                    agregar={agregarProducto}
                    restar={restarProducto}
                    eliminar={eliminarProducto}
                    cierreActivo={cierreActivo}
                />
            </Box>

            {/* Snackbar para la alerta de favoritos */}
            <Snackbar
                open={snackbarAbierto}
                autoHideDuration={3000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={Slide} // Animación de deslizamiento
            >
                <MuiAlert
                    onClose={cerrarAlerta}
                    severity={tipoAlerta}
                    sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                    {mensajeSnackbar}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default Ventas;
