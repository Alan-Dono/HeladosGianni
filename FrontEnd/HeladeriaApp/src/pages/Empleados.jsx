import React, { useEffect, useState, useCallback } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Snackbar, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
    TextField, TablePagination,
    Typography,
    Grid
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import EmpleadoFormModal from '../components/EmpleadoFormModal';
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } from '../api/ApiEmpleado';


const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchEmpleados = useCallback(async () => {
        try {
            const empleadosData = await getEmpleados();
            setEmpleados(empleadosData);
        } catch (error) {
            console.error("Error al obtener empleados", error);
            showSnackbar('Error al cargar los empleados', 'error');
        }
    }, []);

    useEffect(() => {
        fetchEmpleados();
    }, [fetchEmpleados]);

    const handleOpenModal = () => {
        setSelectedEmpleado(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveEmpleado = async (empleado) => {
        try {
            let updatedEmpleado;
            if (empleado.id) {
                updatedEmpleado = await updateEmpleado(empleado.id, empleado);
                setEmpleados((prevEmpleados) =>
                    prevEmpleados.map((e) => (e.id === updatedEmpleado.id ? updatedEmpleado : e))
                );
                showSnackbar('Empleado actualizado con éxito', 'success');
            } else {
                updatedEmpleado = await createEmpleado(empleado);
                setEmpleados((prevEmpleados) => [...prevEmpleados, updatedEmpleado]);
                showSnackbar('Empleado añadido con éxito', 'success');
            }
            handleCloseModal();
            fetchEmpleados();
        } catch (error) {
            console.error("Error al guardar el empleado", error);
            showSnackbar('Error al guardar el empleado', 'error');
        }
    };

    const handleEditEmpleado = (empleado) => {
        setSelectedEmpleado(empleado);
        setOpenModal(true);
    };

    const handleDeleteEmpleado = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const confirmDelete = async () => {
        try {
            await deleteEmpleado(deleteConfirm.id);
            setEmpleados((prevEmpleados) => prevEmpleados.filter((e) => e.id !== deleteConfirm.id));
            showSnackbar('Empleado eliminado con éxito', 'success');
            fetchEmpleados();
        } catch (error) {
            console.error(`Error al eliminar el empleado con ID ${deleteConfirm.id}`, error);
            showSnackbar('Error al eliminar el empleado', 'error');
        } finally {
            setDeleteConfirm({ open: false, id: null });
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const filteredEmpleados = empleados.filter(
        (empleado) =>
            empleado.nombreEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empleado.apellidoEmpleado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedEmpleados = filteredEmpleados.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{
            padding: 2,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Asegura que no haya scroll en el contenedor principal
        }}>
            <Typography variant="h4" mb={2}>Gestión de Empleados</Typography>

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
                            onClick={handleOpenModal}
                            size="large"
                        >
                            Agregar Empleado
                        </Button>
                    </Box>
                </Grid>
            </Grid>

        
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Apellido</TableCell>
                            <TableCell>Celular</TableCell>
                            <TableCell>Fecha de Contratación</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedEmpleados.map((empleado) => (
                            <TableRow key={empleado.id}>
                                <TableCell>{empleado.id}</TableCell>
                                <TableCell>{empleado.nombreEmpleado}</TableCell>
                                <TableCell>{empleado.apellidoEmpleado}</TableCell>
                                <TableCell>{empleado.celular || 'N/A'}</TableCell>
                                <TableCell>
                                    {empleado.fechaContratacion
                                        ? new Date(empleado.fechaContratacion).toLocaleDateString()
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditEmpleado(empleado)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteEmpleado(empleado.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredEmpleados.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <EmpleadoFormModal
                open={openModal}
                handleClose={handleCloseModal}
                empleado={selectedEmpleado}
                handleSave={handleSaveEmpleado}
            />

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>

            <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: null })}>
                <DialogTitle>¿Eliminar empleado?</DialogTitle>
                <DialogContent>
                    ¿Está seguro de que desea eliminar este empleado? Esta acción no se puede deshacer.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Empleados;
