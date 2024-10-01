import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Slide, Box } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { productValidationSchema } from '../validations/ProductValidation';
import { getProductosCategorias } from '../api/ApiCategoriasProductos';

const ProductFormModal = ({ open, onClose, product, onSave }) => {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const data = await getProductosCategorias();
            setCategories(data); // Asegúrate de que 'data' sea un array con id y nombreCategoria
        } catch (error) {
            console.error("Error al obtener categorias", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const initialValues = product ? {
        nombre: product.nombreProducto,
        categoria: product.productoCategoriaDtoRes.id, // Cambiado a id
        descripcion: product.descripcion,
        precio: product.precio,
    } : {
        nombre: '',
        categoria: '',
        descripcion: '',
        precio: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        // Crea un objeto solo con los campos necesarios
        const producto = {
            categoria: values.categoria, // Asegúrate de que esto sea un ID válido
            descripcion: values.descripcion,
            nombre: values.nombre,
            precio: values.precio
        };

        try {
            await onSave(producto);
            setSubmitting(false);
            onClose();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            setSubmitting(false);
        }
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
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.nombreCategoria} {/* Mostrar el nombre de la categoría */}
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
