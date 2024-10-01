import React, { useState } from 'react';
import {
    Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    Grow
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import EmpleadoFormModal from '../components/EmpleadoFormModal';



const Empleados = () => {
    const [empleados, setEmpleados] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmpleado, setSelectedEmpleado] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

    const handleOpenModal = () => {
        setSelectedEmpleado(null);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveEmpleado = (empleado) => {
        if (empleado.id) {
            // Actualizar empleado existente
            setEmpleados(prevEmpleados =>
                prevEmpleados.map(e => e.id === empleado.id ? empleado : e)
            );
            showSnackbar('Empleado actualizado con éxito', 'success');
        } else {
            // Agregar nuevo empleado
            const newEmpleado = { ...empleado, id: Date.now().toString() };
            setEmpleados(prevEmpleados => [...prevEmpleados, newEmpleado]);
            showSnackbar('Empleado añadido con éxito', 'success');
        }
    };

    const handleEditEmpleado = (empleado) => {
        setSelectedEmpleado(empleado);
        setOpenModal(true);
    };

    const handleDeleteEmpleado = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const confirmDelete = () => {
        setEmpleados(prevEmpleados => prevEmpleados.filter(e => e.id !== deleteConfirm.id));
        setDeleteConfirm({ open: false, id: null });
        showSnackbar('Empleado eliminado con éxito', 'success');
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>
                Agregar Empleado
            </Button>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                        {empleados.map((empleado) => (
                            <TableRow key={empleado.id}>
                                <TableCell>{empleado.id}</TableCell>
                                <TableCell>{empleado.nombre}</TableCell>
                                <TableCell>{empleado.apellido}</TableCell>
                                <TableCell>{empleado.celular || 'N/A'}</TableCell>
                                <TableCell>{empleado.fechaContratacion ? new Date(empleado.fechaContratacion).toLocaleDateString() : 'N/A'}</TableCell>
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
            <Dialog
                open={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                TransitionComponent={Grow}
            >
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Está seguro de que desea eliminar este empleado?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm({ open: false, id: null })}>Cancelar</Button>
                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Empleados;