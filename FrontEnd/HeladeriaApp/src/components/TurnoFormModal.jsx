import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const TurnoFormModal = ({ open, onClose, onIniciarTurno, empleados }) => {
    const [responsableInicialId, setResponsableInicialId] = useState('');

    const handleSubmit = () => {
        onIniciarTurno({
            responsableInicial: responsableInicialId,
            fechaInicio: new Date(),
            cierresParciales: []
        });
        setResponsableInicialId('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Iniciar Nuevo Turno</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Responsable Inicial</InputLabel>
                    <Select
                        value={responsableInicialId}
                        onChange={(e) => setResponsableInicialId(e.target.value)}
                    >
                        {empleados.map((empleado) => (
                            <MenuItem key={empleado.id} value={empleado.id}>
                                {empleado.nombreEmpleado + ' ' + empleado.apellidoEmpleado}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} disabled={!responsableInicialId}>Iniciar Turno</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TurnoFormModal;
