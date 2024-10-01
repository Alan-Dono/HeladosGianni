import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const TurnoFormModal = ({ open, onClose, onIniciarTurno }) => {
    const [responsableInicial, setResponsableInicial] = useState('');

    const handleSubmit = () => {
        onIniciarTurno({
            responsableInicial,
            fechaInicio: new Date(),
            cierresParciales: []
        });
        setResponsableInicial('');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Iniciar Nuevo Turno</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Responsable Inicial"
                    fullWidth
                    value={responsableInicial}
                    onChange={(e) => setResponsableInicial(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Iniciar Turno</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TurnoFormModal;