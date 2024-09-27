import React, { useState } from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material'; // Importar iconos
import ProductTiket from './ProductTiket';
import { useTheme } from '@emotion/react';


const OrdenCompra = ({ carrito, subtotal, setDescuento, agregar, restar, eliminar }) => {
    const [codigoDescuento, setCodigoDescuento] = useState('');
    const [mostrarDescuento, setMostrarDescuento] = useState(false);
    const [descuentoValor, setDescuentoValor] = useState(0);
    const [descuentosHabilitados, setDescuentosHabilitados] = useState(false);

    const theme = useTheme();
    const aplicarDescuentoAleatorio = () => {
        let nuevoDescuento = 0;

        if (subtotal >= 1 && subtotal <= 10000) {
            nuevoDescuento = Math.floor(Math.random() * (15 - 10 + 1)) + 10; // 10% a 15%
        } else if (subtotal > 10000 && subtotal <= 40000) {
            nuevoDescuento = Math.floor(Math.random() * (9 - 6 + 1)) + 6; // 6% a 9%
        } else if (subtotal > 40000 && subtotal <= 60000) {
            nuevoDescuento = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // 3% a 5%
        } else if (subtotal > 60000) {
            nuevoDescuento = Math.floor(Math.random() * (3 - 1 + 1)) + 1; // 1% a 3%
        }

        aplicarDescuento(nuevoDescuento);
    };

    const aplicarDescuento = (valor) => {
        setDescuento(valor);
        setDescuentoValor(valor);
        setMostrarDescuento(true);
        setDescuentosHabilitados(false); // Deshabilitar botones de descuento al aplicar uno
    };

    const toggleDescuentos = () => {
        setDescuentosHabilitados(prev => !prev);
    };

    // Calcular el total con el descuento
    const totalConDescuento = subtotal - (subtotal * descuentoValor) / 100;
    const montoDescuento = (subtotal * descuentoValor) / 100;

    return (
        <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                    label="Cupón  de Descuento"
                    variant="outlined"
                    value={codigoDescuento}
                    onChange={(e) => setCodigoDescuento(e.target.value)}
                    size="small"
                    sx={{ flex: 1, marginRight: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={aplicarDescuentoAleatorio} // Aplicar descuento aleatorio
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
                    onClick={toggleDescuentos}
                    sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 1 }}
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
                    color="primary" // Cambia "secondary" a "primary" para que tenga el mismo color
                    sx={{ borderColor: 'primary.main' }} // Esto asegura que el borde sea del mismo color
                >
                    Tiket Fiscal
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ flex: 1, marginLeft: 1 }}
                >
                    Finalizar Venta
                </Button>
            </Box>

        </Box>
    );
};

export default OrdenCompra;
