import React, { useState } from 'react';
import Slide from '@mui/material/Slide';
import { TextField, Typography, Box, Button, Snackbar } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import ProductTiket from './ProductTiket';
import { useTheme } from '@emotion/react';
import MuiAlert from '@mui/material/Alert';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VentaService from '../services/VentaService';

const OrdenCompra = ({ carrito, setCarrito, subtotal, setSubtotal, descuento, setDescuento, agregar, restar, eliminar, cierreActivo, aclaracionCafeteria, setAclaracionCafeteria, aclaracionHeladeria, setAclaracionHeladeria }) => {

    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [mostrarDescuento, setMostrarDescuento] = useState(false);
    const [descuentoValor, setDescuentoValor] = useState(0);
    const [descuentosHabilitados, setDescuentosHabilitados] = useState(false);
    const [snackbarAbierto, setSnackbarAbierto] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState("");
    const [tipoAlerta, setTipoAlerta] = useState("error");
    const [confirmarVentaAbierto, setConfirmarVentaAbierto] = useState(false);



    const theme = useTheme();

    const descuentosValidos = {
        "helado": true,
        "cafe": true,
        "chocolate": true
    };

    const aplicarDescuentoAleatorio = () => {
        if (!descuentosValidos[codigoDescuento]) {
            setMensajeSnackbar("Cupón inválido");
            setTipoAlerta("error");
            setSnackbarAbierto(true);
            return;
        }

        setMensajeSnackbar("");
        let nuevoDescuento = 0;

        if (subtotal >= 1 && subtotal <= 10000) {
            nuevoDescuento = Math.floor(Math.random() * (15 - 10 + 1)) + 10;
        } else if (subtotal > 10000 && subtotal <= 40000) {
            nuevoDescuento = Math.floor(Math.random() * (9 - 6 + 1)) + 6;
        } else if (subtotal > 40000 && subtotal <= 60000) {
            nuevoDescuento = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
        } else if (subtotal > 60000) {
            nuevoDescuento = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        }

        aplicarDescuento(nuevoDescuento);
    };

    const aplicarDescuento = (valor) => {
        setDescuento(valor);
        setDescuentoValor(valor);
        setMostrarDescuento(true);
        setDescuentosHabilitados(false);
        setMensajeSnackbar(`Descuento de ${valor}% aplicado!`);
        setTipoAlerta("success");
        setSnackbarAbierto(true);
        console.log('montoDescuento', descuento);
        console.log('descuentoValor', descuentoValor);


    };

    const toggleDescuentos = () => {
        setDescuentosHabilitados(prev => !prev);
    };

    const totalConDescuento = subtotal - (subtotal * descuentoValor) / 100;
    const montoDescuento = (subtotal * descuentoValor) / 100;

    const manejarFinalizarVenta = () => {
        if (carrito.length === 0) {
            setTipoAlerta("error");
            setMensajeSnackbar("No hay productos seleccionados.");
            setSnackbarAbierto(true);
            return;
        }
        setConfirmarVentaAbierto(true);
    };
    const manejarTiketFiscal = () => {
        if (carrito.length === 0) {
            setTipoAlerta("error");
            setMensajeSnackbar("No hay productos seleccionados.");
            setSnackbarAbierto(true);
            return;
        }
        setConfirmarVentaAbierto(true);
    };

    const confirmarVenta = async () => {
        try {
            // Crear objeto de venta con la estructura necesaria
            const ventaData = {
                totalVenta: totalConDescuento,          // Total de la venta
                Descuentos: montoDescuento || 0,        // Descuentos aplicados (default a 0 si no se proporciona)
                IdCierreCaja: cierreActivo.id,                     // Puedes asignar el ID del cierre de caja aquí si es necesario
                detallesVentas: carrito.map((producto) => ({
                    productoId: producto.id,            // ID del producto en el carrito
                    cantidad: producto.cantidad,        // Cantidad del producto
                    precioUnitario: producto.precio,    // Precio del producto
                })),
                AclaracionCafeteria: aclaracionCafeteria,
                AclaracionHeladeria: aclaracionHeladeria
            };
            console.log("ventaData", ventaData);

            // Llamar a la función del servicio para registrar la venta
            const response = await VentaService.registrarVenta(ventaData);
            // Limpiar los estados y mostrar mensaje de éxito
            setCarrito([]);
            setSubtotal(0);
            setCodigoDescuento('');
            setMostrarDescuento(false);
            setDescuentoValor(0);
            setDescuentosHabilitados(false);
            setMensajeSnackbar('Venta realizada con éxito!');
            setTipoAlerta("success");
            setSnackbarAbierto(true);
            setConfirmarVentaAbierto(false);
            setAclaracionCafeteria('');
            setAclaracionHeladeria('');

        } catch (error) {
            setTipoAlerta("error");
            setMensajeSnackbar("Error al registrar la venta. Por favor, intente nuevamente.");
            setSnackbarAbierto(true);
        }
    };





    const cerrarAlerta = () => {
        setSnackbarAbierto(false);
    };

    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Orden de Compra</Typography>
            <Box sx={{ flex: 1, overflowY: 'auto', marginBottom: 2 }}>
                {carrito.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">Tu carrito está vacío.</Typography>
                ) : (
                    carrito.map(producto => (
                        <ProductTiket
                            key={producto.id}
                            producto={producto}
                            agregar={agregar}
                            restar={restar}
                            eliminar={eliminar}
                        />
                    ))
                )}
            </Box>



            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <TextField
                    label="Cupón de Descuento"
                    variant="outlined"
                    value={codigoDescuento}
                    onChange={(e) => setCodigoDescuento(e.target.value)}
                    size="small"
                    sx={{ flex: 1, marginRight: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        if (subtotal > 0) {
                            aplicarDescuentoAleatorio();
                        }
                    }}
                    size="medium"
                >
                    Aplicar
                </Button>
            </Box>



            <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>
                {mostrarDescuento && (
                    <Typography variant="h6">Descuento: ${montoDescuento.toFixed(2)}</Typography>
                )}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => aplicarDescuento(5)}
                    disabled={!descuentosHabilitados}
                >
                    5%
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => aplicarDescuento(10)}
                    disabled={!descuentosHabilitados}
                >
                    10%
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => aplicarDescuento(15)}
                    disabled={!descuentosHabilitados}
                >
                    15%
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => aplicarDescuento(20)}
                    disabled={!descuentosHabilitados}
                >
                    20%
                </Button>
                <Box
                    component="span"
                    onClick={() => {
                        if (subtotal > 0) { // Verifica si el subtotal es mayor a 0
                            toggleDescuentos();
                        }
                    }}
                    sx={{
                        cursor: subtotal > 0 ? 'pointer' : 'not-allowed', // Cambia el cursor según la condición
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        color: subtotal > 0 ? 'inherit' : 'gray', // Cambia el color si no está habilitado
                    }}
                >
                    {descuentosHabilitados ? (
                        <LockOpen sx={{ fontSize: 20 }} />
                    ) : (
                        <Lock sx={{ fontSize: 20 }} />
                    )}
                </Box>

            </Box>
            <Typography variant="h6">Total: ${totalConDescuento.toFixed(2)}</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ flex: 1, marginRight: 1 }}
                    onClick={manejarTiketFiscal}
                >
                    Tiket Fiscal
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    sx={{ flex: 2 }}
                    onClick={manejarFinalizarVenta}
                >
                    Finalizar Venta
                </Button>
            </Box>

            <Snackbar
                open={snackbarAbierto}
                autoHideDuration={3000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                TransitionComponent={Slide} // Aquí se usa la animación Slide
            >
                <MuiAlert
                    onClose={cerrarAlerta}
                    severity={tipoAlerta}
                    sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                    {tipoAlerta === "success" && (
                        <IconButton size="small" color="inherit">
                            <CheckCircleIcon fontSize="small" />
                        </IconButton>
                    )}
                    {mensajeSnackbar}
                </MuiAlert>
            </Snackbar>



            <Dialog
                open={confirmarVentaAbierto}
                onClose={() => setConfirmarVentaAbierto(false)}
                TransitionComponent={Slide}
                sx={{
                    '& .MuiDialog-paper': {
                        borderRadius: '10px', // Bordes redondeados
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Sombra sutil
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    Confirmar Venta
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', padding: '20px' }}>
                    <Typography variant="body1" color="textSecondary">
                        ¿Está seguro de que desea finalizar la venta?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', padding: '20px' }}>
                    <Button
                        onClick={() => setConfirmarVentaAbierto(false)}
                        color="default" // Color por defecto
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            marginRight: '10px', // Espaciado
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={confirmarVenta}
                        variant="contained"
                        color="primary"
                        sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                        }}
                    >
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrdenCompra;
