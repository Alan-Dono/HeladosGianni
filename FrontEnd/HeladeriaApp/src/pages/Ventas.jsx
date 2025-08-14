import React, { useState, useEffect } from 'react';
import ProductoCard from '../components/ProductoCard';
import OrdenCompra from '../components/OrdenCompra';
import { Box, Button, Slide, Snackbar, Typography, CircularProgress, Fade } from '@mui/material';
import { useTheme } from '@emotion/react';
import CategoriaProductoService from '../services/CategoriaProductoService';
import CierreCajaService from '../services/CierreCajaService';
import ProductoService from '../services/ProductoService';
import MuiAlert from '@mui/material/Alert';
import AclaracionModal from '../components/AclaracionModal';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import ModalVarios from '../components/ModalVarios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const Ventas = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [descuento, setDescuento] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [cierreActivo, setCierreActivo] = useState(null);
    const [vistaActual, setVistaActual] = useState('favoritos');
    const [cargando, setCargando] = useState(true);
    const [snackbarAbierto, setSnackbarAbierto] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    const [aclaracionCafeteria, setAclaracionCafeteria] = useState("");
    const [aclaracionHeladeria, setAclaracionHeladeria] = useState("");
    const [modalCafeteriaOpen, setModalCafeteriaOpen] = useState(false);
    const [modalHeladeriaOpen, setModalHeladeriaOpen] = useState(false);
    const [modalVariosOpen, setModalVariosOpen] = useState(false);

    // Funciones para abrir modales
    const abrirModalCafeteria = () => setModalCafeteriaOpen(true);
    const abrirModalHeladeria = () => setModalHeladeriaOpen(true);
    const abrirModalVarios = () => setModalVariosOpen(true);


    // Funciones para cerrar modales (con limpieza)
    const cerrarModalCafeteria = () => {
        setModalCafeteriaOpen(false);
    };

    const cerrarModalHeladeria = () => {
        setModalHeladeriaOpen(false);
    };
    const cerrarModalVarios = () => setModalVariosOpen(false);

    // Funciones para guardar las aclaraciones
    const handleSaveCafeteria = (aclaracion) => {
        setAclaracionCafeteria(aclaracion); // Guardar directamente
        cerrarModalCafeteria();
    };

    const handleSaveHeladeria = (aclaracion) => {
        setAclaracionHeladeria(aclaracion); // Guardar directamente
        cerrarModalHeladeria();
    };

    const handleSaveVarios = (productoVario) => {
        agregarProducto(productoVario);
        cerrarModalVarios();
    };

    // Funciones de cancelación específicas (para usar en el modal)
    const handleCancelCafeteria = () => {
        setAclaracionCafeteria("");
    };

    const handleCancelHeladeria = () => {
        setAclaracionHeladeria("");
    };

    const moveProduct = async (dragIndex, hoverIndex) => {
         console.log(`Moviendo producto de posición ${dragIndex} a ${hoverIndex}`);
    
        setProductos(prev => {
            const newProductos = {...prev};
            const categoria = vistaActual;
            const draggedItem = newProductos[categoria][dragIndex];
            
            // Elimina el elemento arrastrado
            const remainingItems = newProductos[categoria].filter((_, idx) => idx !== dragIndex);
            
            // Inserta el elemento en la nueva posición
            const newItems = [
                ...remainingItems.slice(0, hoverIndex),
                draggedItem,
                ...remainingItems.slice(hoverIndex)
            ];
            
            // Crear diccionario con el nuevo orden
            const ordenProductos = {};
            newItems.forEach((producto, index) => {
                ordenProductos[producto.id] = index;
            });

            // Actualizar el orden en el backend
            ProductoService.actualizarOrdenProductos(ordenProductos)
                .catch(error => {
                    console.error("Error al actualizar el orden:", error);
                    setMensajeSnackbar("Error al guardar el orden");
                    setTipoAlerta("error");
                    setSnackbarAbierto(true);
                });

            return {
                ...newProductos,
                [categoria]: newItems
            };
        });
    };


    const [productos, setProductos] = useState({
        favoritos: [],
        cafeteria: [],
        heladeria: [],
        confiteria: [],
        promociones: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setCargando(true);
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
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    const cerrarAlerta = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarAbierto(false);
    };

    const agregarProducto = (producto) => {
        if (!producto || (!producto.id && !producto.esVario)) return;

        const productoExistente = carrito.find((item) =>
            item.esVario
                ? item.nombre === producto.nombre
                : item.id === producto.id
        );

        if (productoExistente) {
            setCarrito(carrito.map((item) =>
                (item.esVario && item.nombre === producto.nombre) ||
                    (!item.esVario && item.id === producto.id)
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ));
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };
    {/*   const agregarProducto = (producto) => {
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
    }; */}


    const toggleFavorito = async (producto) => {
        if (!producto?.id) {
            console.error("Producto no válido:", producto);
            return;
        }

        try {
            // Optimización: Usar `prevProductos` para evitar dependencias externas
            setProductos((prevProductos) => {
                const esFavorito = prevProductos.favoritos.some(fav => fav.id === producto.id);

                // Llamada a la API (debe ser await, pero dentro de una función async aparte)
                const actualizarFavoritos = async () => {
                    if (esFavorito) {
                        await ProductoService.eliminarDeFavoritos(producto.id);
                    } else {
                        await ProductoService.agregarAFavoritos(producto.id);
                    }
                };

                // Ejecutar la actualización sin bloquear la UI
                actualizarFavoritos().catch(console.error);

                // Feedback visual inmediato (optimista)
                setMensajeSnackbar(
                    esFavorito
                        ? "Eliminado de favoritos"
                        : "Agregado a favoritos"
                );
                setTipoAlerta(esFavorito ? "warning" : "success");
                setSnackbarAbierto(true);

                return {
                    ...prevProductos,
                    favoritos: esFavorito
                        ? prevProductos.favoritos.filter(fav => fav.id !== producto.id)
                        : [...prevProductos.favoritos, producto]
                };
            });
        } catch (error) {
            console.error("Error al actualizar favoritos:", error);
            setMensajeSnackbar("Error al actualizar favoritos");
            setTipoAlerta("error");
            setSnackbarAbierto(true);
        }
    };

    // Función para restar productos (actualizada)
    const restarProducto = (productoOrId) => {
        setCarrito(prevCarrito => {
            // Si es un producto vario (objeto completo)
            if (typeof productoOrId === 'object' && productoOrId.esVario) {
                return prevCarrito
                    .map(item =>
                        item.esVario && item.nombre === productoOrId.nombre
                            ? { ...item, cantidad: item.cantidad - 1 }
                            : item
                    )
                    .filter(item => item.cantidad > 0);
            }
            // Si es un ID (producto normal)
            else {
                return prevCarrito
                    .map(item =>
                        !item.esVario && item.id === productoOrId
                            ? { ...item, cantidad: item.cantidad - 1 }
                            : item
                    )
                    .filter(item => item.cantidad > 0);
            }
        });
    };

    // Función para eliminar productos (actualizada)
    const eliminarProducto = (productoOrId) => {
        setCarrito(prevCarrito => {
            // Si es un producto vario (objeto completo)
            if (typeof productoOrId === 'object' && productoOrId.esVario) {
                return prevCarrito.filter(item =>
                    !(item.esVario && item.nombre === productoOrId.nombre)
                );
            }
            // Si es un ID (producto normal)
            else {
                return prevCarrito.filter(item =>
                    !(!item.esVario && item.id === productoOrId)
                );
            }
        });
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
                {productosActuales.map((producto, index) => (
                    <Box key={producto.id} sx={{
                        aspectRatio: '1/1',
                        minHeight: 0,
                        minWidth: 0
                    }}>
                        <ProductoCard
                            producto={producto}
                            index={index}
                            agregar={agregarProducto}
                            toggleFavorito={toggleFavorito}
                            moveProduct={moveProduct}
                        />
                    </Box>
                ))}
            </Box>
        );
    };


    const reiniciarAclaraciones = () => {
        setAclaracionCafeteria("");
        setAclaracionHeladeria("");
    };

    return (
        <DndProvider backend={HTML5Backend}>
        <Box sx={{
            display: 'flex',
            height: '100vh',
            p: 1,
            gap: 1,
            position: 'relative'
        }}>
            {/* 1. Estado de carga */}
            <Fade in={cargando} timeout={{ enter: 300, exit: 200 }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 2000,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <CircularProgress size={80} color="primary" />
                </Box>
            </Fade>

            {/* 2. Estado sin cierre activo */}
            {!cargando && !cierreActivo && (
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    gap: 3,
                    p: 4,
                    textAlign: 'center'
                }}>
                    <Box sx={{
                        bgcolor: 'error.main',
                        p: 2,
                        borderRadius: '50%',
                        mb: 2
                    }}>
                        <WarningIcon sx={{ fontSize: 60 }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Turno no iniciado
                    </Typography>
                    <Typography variant="h6">
                        No se pueden registrar ventas sin un turno activo
                    </Typography>
                    <Typography sx={{ mb: 3 }}>
                        Por favor, inicie un nuevo turno en el Panel de Caja
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        color="warning"
                        onClick={() => navigate('/turnos')}
                        sx={{
                            fontSize: '1.2rem',
                            px: 4,
                            py: 1.5,
                            fontWeight: 'bold'
                        }}
                    >
                        Ir a Panel de Cierre
                    </Button>
                </Box>
            )}

            {/* 3. Estado con contenido */}
            {!cargando && cierreActivo && (
                <>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        gap: 1,
                        opacity: cargando ? 0 : 1,
                        transition: 'opacity 0.5s ease'
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
                            gridTemplateColumns: 'repeat(8, 1fr)',
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
                                        fontSize: { xs: '0.7rem', sm: '1rem' },
                                        fontWeight: 'medium',
                                        borderRadius: '4px',
                                        textTransform: 'capitalize',
                                        padding: { xs: '2px', sm: '6px' },
                                    }}
                                >
                                    {categoria}
                                </Button>
                            ))}
                            <Button
                                variant='contained'
                                sx={{
                                    height: '100%',
                                    fontSize: { xs: '0.7rem', sm: '1rem' },
                                    fontWeight: 'medium',
                                    borderRadius: '4px',
                                    textTransform: 'capitalize',
                                    padding: { xs: '2px', sm: '6px' },
                                    backgroundColor: theme.palette.warning.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.warning.dark || theme.palette.warning.main,
                                    }
                                }}
                                onClick={() => abrirModalCafeteria()}
                            >
                                Nota Cafe
                            </Button>
                            <Button
                                variant='contained'
                                sx={{
                                    height: '100%',
                                    fontSize: { xs: '0.7rem', sm: '1rem' },
                                    fontWeight: 'medium',
                                    borderRadius: '4px',
                                    textTransform: 'capitalize',
                                    padding: { xs: '2px', sm: '6px' },
                                    backgroundColor: theme.palette.warning.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.warning.dark || theme.palette.warning.main,
                                    }
                                }}
                                onClick={() => abrirModalHeladeria()}
                            >
                                Nota Helados
                            </Button>
                            <Button
                                variant='contained'
                                sx={{
                                    height: '100%',
                                    fontSize: { xs: '0.7rem', sm: '1rem' },
                                    fontWeight: 'medium',
                                    borderRadius: '4px',
                                    textTransform: 'capitalize',
                                    padding: { xs: '2px', sm: '6px' },
                                    backgroundColor: theme.palette.error.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.error.dark || theme.palette.error.main,
                                    }
                                }}
                                onClick={abrirModalVarios}
                            >
                                Varios
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{
                        width: '30%',
                        opacity: cargando ? 0 : 1,
                        transition: 'opacity 0.5s ease'
                    }}>
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
                            aclaracionCafeteria={aclaracionCafeteria}
                            setAclaracionCafeteria={setAclaracionCafeteria}
                            aclaracionHeladeria={aclaracionHeladeria}
                            setAclaracionHeladeria={setAclaracionHeladeria}
                            reiniciarAclaraciones={reiniciarAclaraciones}
                        />
                    </Box>
                </>
            )}

            {/* Snackbar y modales */}
            <Snackbar
                open={snackbarAbierto}
                autoHideDuration={3000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={Slide}
            >
                <MuiAlert
                    onClose={cerrarAlerta}
                    severity={tipoAlerta}
                    sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                    {mensajeSnackbar}
                </MuiAlert>
            </Snackbar>


            <AclaracionModal
                open={modalCafeteriaOpen}
                onClose={cerrarModalCafeteria}
                onSave={handleSaveCafeteria}
                onCancel={handleCancelCafeteria}
                tipo="cafeteria"
            />

            <AclaracionModal
                open={modalHeladeriaOpen}
                onClose={cerrarModalHeladeria}
                onSave={handleSaveHeladeria}
                onCancel={handleCancelHeladeria}
                tipo="heladeria"
            />

            <ModalVarios
                open={modalVariosOpen}
                onClose={cerrarModalVarios}
                onSave={handleSaveVarios}
            />
        </Box>
        </DndProvider>
    );
};

export default Ventas;