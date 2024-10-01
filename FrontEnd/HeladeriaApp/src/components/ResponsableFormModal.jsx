import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ResponsableFormModal = ({ open, onClose, onCambiarResponsable }) => {
    const [nuevoResponsable, setNuevoResponsable] = useState('');

    const handleSubmit = () => {
        onCambiarResponsable(nuevoResponsable);
        setNuevoResponsable('');
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Cambiar Responsable</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Nuevo Responsable"
                    fullWidth
                    value={nuevoResponsable}
                    onChange={(e) => setNuevoResponsable(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit}>Cambiar Responsable</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResponsableFormModal;