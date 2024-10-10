import React, { useState } from 'react';
import { Modal, Box, Button, Typography, TextField } from '@mui/material';

const ResponsableFormModal = ({ open, onClose, onCambiarResponsable, empleados }) => {
    const [responsable, setResponsable] = useState('');

    const handleSubmit = () => {
        onCambiarResponsable(responsable);
        setResponsable('');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6">Cambiar Responsable</Typography>
                <TextField
                    select
                    label="Seleccione un Responsable"
                    value={responsable}
                    onChange={(e) => setResponsable(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {empleados.map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                            {empleado.nombreEmpleado + " " + empleado.apellidoEmpleado}
                        </option>
                    ))}
                </TextField>
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                    Cambiar Responsable
                </Button>
            </Box>
        </Modal>
    );
};

export default ResponsableFormModal;
