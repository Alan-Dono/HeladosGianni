import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Slide } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field } from 'formik';
import { employeeValidationSchema } from '../validations/EmployeeValidation';

const EmpleadoFormModal = ({ open, handleClose, empleado, handleSave }) => {
    const initialValues = {
        id: empleado?.id || '',
        nombre: empleado?.nombre || '',
        apellido: empleado?.apellido || '',
        celular: empleado?.celular || '',
        fechaContratacion: empleado?.fechaContratacion || null
    };

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Slide}>
            <DialogTitle>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={employeeValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    handleSave(values);
                    setSubmitting(false);
                    handleClose();
                }}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                as={TextField}
                                margin="dense"
                                name="nombre"
                                label="Nombre"
                                type="text"
                                fullWidth
                                variant="outlined"
                                error={touched.nombre && errors.nombre}
                                helperText={touched.nombre && errors.nombre}
                            />
                            <Field
                                as={TextField}
                                margin="dense"
                                name="apellido"
                                label="Apellido"
                                type="text"
                                fullWidth
                                variant="outlined"
                                error={touched.apellido && errors.apellido}
                                helperText={touched.apellido && errors.apellido}
                            />
                            <Field
                                as={TextField}
                                margin="dense"
                                name="celular"
                                label="Celular"
                                type="tel"
                                fullWidth
                                variant="outlined"
                                error={touched.celular && errors.celular}
                                helperText={touched.celular && errors.celular}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Fecha de Contratación"
                                    value={values.fechaContratacion}
                                    onChange={(date) => setFieldValue('fechaContratacion', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            margin="dense"
                                            error={touched.fechaContratacion && errors.fechaContratacion}
                                            helperText={touched.fechaContratacion && errors.fechaContratacion}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="submit">Guardar</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default EmpleadoFormModal;