import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Snackbar, TextField, Grid } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import ProductFormModal from '../components/ProductFormModal';
import { productValidationSchema } from '../validations/ProductValidation';
import ProductoService from '../services/ProductoService'; // Asegúrate de que la ruta sea correcta

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbarInfo, setSnackbarInfo] = useState({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            const productosObtenidos = await ProductoService.obtenerProductos();
            setProductos(productosObtenidos);
        } catch (error) {
            console.error("Error al obtener productos", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSaveProduct = async (newProduct) => {
        const productAction = selectedProduct ? ProductoService.editarProducto : ProductoService.registrarProducto;
        const actionMessage = selectedProduct ? 'actualizado' : 'creado';

        try {
            const productoResponse = selectedProduct
                ? await productAction(selectedProduct.id, newProduct)
                : await productAction(newProduct);
            setProductos(prevProducts => {
                if (selectedProduct) {
                    return prevProducts.map(p => (p.id === selectedProduct.id ? { ...p, ...newProduct } : p));
                } else {
                    return [...prevProducts, productoResponse]; // Agrega el nuevo producto a la lista
                }
            });
            abrirAlerta(`Producto ${actionMessage} exitosamente`, 'success');
        } catch (error) {
            console.error(`Error al ${actionMessage} el producto`, error);
            abrirAlerta(`Error al ${actionMessage} el producto`, 'error');
        } finally {
            fetchProductos();
            setOpenModal(false);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await ProductoService.eliminar(selectedProduct.id);
            setProductos(productos.filter(prod => prod.id !== selectedProduct.id));
            abrirAlerta('Producto eliminado exitosamente', 'success');
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            abrirAlerta('Error al eliminar el producto', 'error');
        } finally {
            fetchProductos();
            setOpenDeleteDialog(false);
        }
    };

    const abrirAlerta = (mensaje, tipo) => {
        setSnackbarInfo({ open: true, message: mensaje, severity: tipo });
    };

    const cerrarAlerta = () => {
        setSnackbarInfo({ ...snackbarInfo, open: false });
    };

    const filteredRows = productos.filter(product => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            product.nombreProducto.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.precio.toString().includes(searchTerm) ||
            product.descripcion.toLowerCase().includes(lowerCaseSearchTerm) ||
            product.productoCategoriaDtoRes.nombreCategoria.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'nombreProducto', headerName: 'Nombre', flex: 1 },
        {
            field: 'productoCategoriaDtoRes',
            headerName: 'Categoría',
            flex: 1,
            valueGetter: (params)  => params.nombreCategoria || 'N/A', 
        },
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        {
            field: 'precio',
            headerName: 'Precio',
            flex: 0.5,
            renderCell: (params) => `$${params.value.toFixed(2)}`,
        },
        {
            field: 'acciones',
            headerName: 'Acciones',
            flex: 0.5,
            renderCell: (params) => (
                <>
                    <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
                        <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(params.row)}>
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{
            padding: 2,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Typography variant="h4" mb={2}>Gestión de Productos</Typography>

            <Grid container spacing={2} alignItems="center" mb={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        variant="outlined"
                        placeholder="Buscar producto"
                        fullWidth
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => { setSelectedProduct(null); setOpenModal(true); }}
                            size="large"
                        >
                            Agregar Producto
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ flexGrow: 1, height: 'calc(100% - 120px)', width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 15, 25, 50]}
                    pagination
                    autoHeight={false}
                    sx={{
                        '& .MuiDataGrid-root': { border: 'none' },
                        '& .MuiDataGrid-cell': { borderBottom: 'none' },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: 'background.neutral',
                            borderBottom: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: 'background.paper',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                            backgroundColor: 'background.neutral',
                        },
                    }}
                />
            </Box>

            <ProductFormModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                product={selectedProduct}
                onSave={handleSaveProduct}
                formikProps={{
                    initialValues: selectedProduct || { nombre: '', categoria: '', descripcion: '', precio: '' },
                    validationSchema: productValidationSchema,
                    enableReinitialize: true,
                }}
            />

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar este producto?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
                    <Button color="error" onClick={confirmDelete}>Eliminar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarInfo.open}
                autoHideDuration={3000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert elevation={6} variant="filled" severity={snackbarInfo.severity} onClose={cerrarAlerta}>
                    {snackbarInfo.message}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default Productos;
