import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Snackbar, TextField, Grid } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import ProductFormModal from '../components/ProductFormModal';
import { productValidationSchema } from '../validations/ProductValidation'; // Asegúrate de que la ruta es correcta
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../api/ApiProducto";

const Productos = () => {

    const [productos, setProductos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [snackbarAbierto, setSnackbarAbierto] = useState(false);
    const [mensajeSnackbar, setMensajeSnackbar] = useState('');
    const [tipoAlerta, setTipoAlerta] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    // Obtener todos los productos al cargar el componente
    useEffect(() => {
        fetchProductos();
    }, []);


    const fetchProductos = async () => {
        try {
            const productosObtenidos = await getProductos();
            setProductos(productosObtenidos);
        } catch (error) {
            console.error("Error al obtener productos", error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Método asincrónico para guardar el producto
    const handleSaveProduct = async (newProduct) => {
        if (selectedProduct) {
            try {
                // Editar producto existente
                await actualizarProducto(selectedProduct.id, newProduct);
                setProductos(prevProducts =>
                    prevProducts.map(p => (p.id === selectedProduct.id ? { ...p, ...newProduct } : p))
                );
                abrirAlerta('Producto actualizado exitosamente', 'success');
            } catch (error) {
                console.error("Error al actualizar el producto", error);
                abrirAlerta('Error al actualizar el producto', 'error');
            }
        } else {
            // Crear nuevo producto
            try {
                console.log('estamos aca', newProduct);

                const productoCreado = await crearProducto(newProduct);
                setProductos([...productos, productoCreado]); // Agrega el nuevo producto a la lista
                abrirAlerta('Producto creado exitosamente', 'success');
            } catch (error) {
                console.error("Error al crear el producto", error);
                abrirAlerta('Error al crear el producto', 'error');
            }
        }
        fetchProductos();
        setOpenModal(false);
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
            await eliminarProducto(selectedProduct.id);
            console.log('log', selectedProduct);

            setProductos(productos.filter((prod) => prod.id !== selectedProduct.id)); // Remueve el producto de la lista
            abrirAlerta('Producto eliminado exitosamente', 'success');
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            abrirAlerta('Error al eliminar el producto', 'error');
        }
        fetchProductos();
        setOpenDeleteDialog(false);
    };

    const abrirAlerta = (mensaje, tipo) => {
        setMensajeSnackbar(mensaje);
        setTipoAlerta(tipo);
        setSnackbarAbierto(true);
    };

    const cerrarAlerta = () => {
        setSnackbarAbierto(false);
    };

    const rows = productos.filter(product => {
        return (
            product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.precio.toString().includes(searchTerm) ||
            product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.productoCategoriaDtoRes.nombreCategoria.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });


    const colums = [
        { field: 'id', headerName: 'ID', flex: 0.2 },
        { field: 'nombreProducto', headerName: 'Nombre', flex: 1 },
        //{ field: 'nombreCategoria', headerName: 'Categoría', flex: 1 },
        {
            field: 'productoCategoriaDtoRes',
            headerName: 'Categoría',
            flex: 1,
            valueGetter: (params) => {
                return params.nombreCategoria || 'N/A'; // Usando optional chaining
            }
        }, // Mapea correctamente
        { field: 'descripcion', headerName: 'Descripción', flex: 2 },
        {
            field: 'precio',
            headerName: 'Precio',
            flex: 0.5,
            renderCell: (params) => {
                return `$${params.value.toFixed(2)}`;
            },
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
    ]


    return (
        <Box sx={{
            padding: 2,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Asegura que no haya scroll en el contenedor principal
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

            <Box sx={{ flexGrow: 1, height: 'calc(100% - 120px)', width: '100%' }}> {/* Ajusta la altura para ocupar el espacio restante */}
                <DataGrid
                    rows={rows}
                    columns={colums}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 15, 25, 50]}
                    pagination
                    autoHeight={false}
                    sx={{
                        '& .MuiDataGrid-root': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: 'none',
                        },
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

            {/* Modal para Crear/Editar Producto */}
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

            {/* Diálogo de Confirmación de Eliminación */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
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
                open={snackbarAbierto}
                autoHideDuration={3000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Posicionar arriba a la derecha
            >
                <MuiAlert elevation={6} variant="filled" severity={tipoAlerta} onClose={cerrarAlerta}>
                    {mensajeSnackbar}
                </MuiAlert>
            </Snackbar>

        </Box>
    );
};

export default Productos;
