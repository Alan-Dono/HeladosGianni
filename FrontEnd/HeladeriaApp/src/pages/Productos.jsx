import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Snackbar, Slide, Grow } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ProductFormModal from '../components/ProductFormModal'; // Componente para el formulario de productos
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';


const initialProducts = [
    { id: 1, nombre: 'Helado de Fresa', categoria: 'Helados', descripcion: 'Delicioso helado de fresa', precio: 3.50 },
    { id: 2, nombre: 'Café Expreso', categoria: 'Café', descripcion: 'Café intenso y aromático', precio: 2.00 },
    // Agrega más productos aquí si lo deseas
];

const Productos = () => {
    const [productos, setProductos] = useState(initialProducts);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openCreateModal, setOpenCreateModal] = useState(false);

    // Estados para el Snackbar
    const [snackbarAbierto, setSnackbarAbierto] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');

    // Columnas del DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 }, // Ancho fijo para ID
        { field: 'nombre', headerName: 'Nombre', flex: 1 }, // Flex para que ocupe parte del ancho
        { field: 'categoria', headerName: 'Categoría', flex: 1 }, // Flex para Categoría
        { field: 'descripcion', headerName: 'Descripción', flex: 2 }, // Flex más alto para Descripción
        {
            field: 'precio',
            headerName: 'Precio',
            flex: 0.5, // Ancho más pequeño para Precio
            valueFormatter: (params) => {
                const value = params.value;
                return value ? value.toFixed(2) : 'N/A';
            }
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            flex: 0.5, // Ancho para Acciones
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditClick(params.row)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(params.row)}
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];


    // Función para abrir el modal de edición
    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setOpenEditModal(true);
    };

    // Función para abrir el dialog de confirmación de eliminación
    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setOpenDeleteDialog(true);
    };

    // Confirmar eliminación de producto
    const confirmDelete = () => {
        setProductos(productos.filter((product) => product.id !== selectedProduct.id));
        setOpenDeleteDialog(false);
        abrirAlerta('Producto eliminado exitosamente', 'success');
    };

    // Abrir el Snackbar con mensaje
    const abrirAlerta = (mensaje, tipo) => {
        setMensajeSnackbar(mensaje);
        setTipoAlerta(tipo);
        setSnackbarAbierto(true);
    };

    // Cerrar el Snackbar
    const cerrarAlerta = () => {
        setSnackbarAbierto(false);
    };

    return (
        <Box sx={{ padding: 3, height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h4">Gestión de Productos</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => setOpenCreateModal(true)}
                >
                    Agregar Producto
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                <DataGrid
                    rows={productos}
                    columns={columns}
                    pageSize={5}
                    sx={{ height: '100%' }}
                />
            </Box>

            {/* Modal para Editar Producto */}
            <ProductFormModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                product={selectedProduct}
                onSave={(updatedProduct) => {
                    setProductos(productos.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod)));
                    setOpenEditModal(false);
                    abrirAlerta('Producto editado exitosamente', 'success');
                }}
            />

            {/* Modal para Crear Producto */}
            <ProductFormModal
                open={openCreateModal}
                
                onClose={() => setOpenCreateModal(false)}
                onSave={(newProduct) => {
                    setProductos([...productos, { ...newProduct, id: productos.length + 1 }]);
                    setOpenCreateModal(false);
                    abrirAlerta('Producto creado exitosamente', 'success');
                }}
            />

            {/* Dialog de confirmación de eliminación */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                TransitionComponent={Grow}
            >
                <DialogTitle>¿Eliminar Producto?</DialogTitle>
                <DialogContent>
                    <Typography>¿Está seguro de que desea eliminar el producto "{selectedProduct?.nombre}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary">Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
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
                    {tipoAlerta === "success" && (
                        <IconButton size="small" color="inherit">
                        </IconButton>
                    )}
                    {mensajeSnackbar}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default Productos;
