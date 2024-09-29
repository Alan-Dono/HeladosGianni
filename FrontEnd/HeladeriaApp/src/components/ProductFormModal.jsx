import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Slide, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { productValidationSchema } from '../validations/ProductValidation';

const categories = ['Helados', 'Café', 'Chocolates', 'Postres', 'Bebidas', 'Galletas']; // Opciones de categorías ampliadas

const ProductFormModal = ({ open, onClose, product, onSave }) => {

    const initialValues = product ? {
        nombre: product.nombre,
        categoria: product.categoria,
        descripcion: product.descripcion,
        precio: product.precio,
    } : {
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: '',
    };

    // Hacemos el método handleSubmit asincrónico
    const handleSubmit = async (values, { setSubmitting }) => {
        await onSave({ ...product, ...values }); // Agregar el id si es necesario
        setSubmitting(false);
        onClose();
    };


    
    return (
        <Dialog open={open} onClose={onClose} TransitionComponent={Slide} fullWidth maxWidth="sm">
            <DialogTitle>{product ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    label="Nombre"
                                    name="nombre"
                                    fullWidth
                                    error={touched.nombre && Boolean(errors.nombre)}
                                    helperText={touched.nombre && errors.nombre}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    label="Categoría"
                                    name="categoria"
                                    select
                                    fullWidth
                                    error={touched.categoria && Boolean(errors.categoria)}
                                    helperText={touched.categoria && errors.categoria}
                                >
                                    {categories.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    label="Descripción"
                                    name="descripcion"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    error={touched.descripcion && Boolean(errors.descripcion)}
                                    helperText={touched.descripcion && errors.descripcion}
                                />
                            </Box>
                            <Box mb={2}>
                                <Field
                                    as={TextField}
                                    label="Precio"
                                    name="precio"
                                    type="number"
                                    fullWidth
                                    error={touched.precio && Boolean(errors.precio)}
                                    helperText={touched.precio && errors.precio}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} color="primary">Cancelar</Button>
                            <Button type="submit" color="primary" disabled={isSubmitting}>
                                {product ? 'Guardar Cambios' : 'Agregar Producto'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default ProductFormModal;