// src/components/ProductFormModal.js
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Slide, Grow, Fade } from '@mui/material';


const categories = ['Helados', 'Café', 'Chocolates']; // Opciones de categorías

const ProductFormModal = ({ open, onClose, product, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: '',
    });

    // Actualiza el formulario cuando el producto cambia (para editar)
    useEffect(() => {
        if (product) {
            setFormData(product);
        } else {
            setFormData({
                nombre: '',
                categoria: '',
                descripcion: '',
                precio: '',
            });
        }
    }, [product]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Guardar cambios
    const handleSubmit = () => {
        if (formData.nombre && formData.categoria && formData.precio) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}
            TransitionComponent={Slide}
            
                >
            <DialogTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    select
                    label="Categoría"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                            {category}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Precio"
                    name="precio"
                    type="number"
                    value={formData.precio}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancelar</Button>
                <Button onClick={handleSubmit} color="primary">{product ? 'Guardar Cambios' : 'Agregar'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductFormModal;
