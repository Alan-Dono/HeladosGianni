import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Formik, Form, Field } from 'formik';
import { employeeValidationSchema } from '../validations/EmployeeValidation';
import es from 'date-fns/locale/es'; // Importar el locale español

const EmpleadoFormModal = ({ open, handleClose, empleado, handleSave }) => {
    const initialValues = {
        id: empleado?.id || '',
        nombreEmpleado: empleado?.nombreEmpleado || '',
        apellidoEmpleado: empleado?.apellidoEmpleado || '',
        celular: empleado?.celular || '',
        fechaContratacion: empleado?.fechaContratacion ? new Date(empleado.fechaContratacion) : null
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{empleado ? 'Editar Empleado' : 'Nuevo Empleado'}</DialogTitle>
            <Formik
                initialValues={initialValues}
                validationSchema={employeeValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const empleadoData = {
                        ...values,
                        fechaContratacion: values.fechaContratacion
                            ? values.fechaContratacion.toISOString().split('T')[0]
                            : null
                    };
                    handleSave(empleadoData);
                    setSubmitting(false);
                    handleClose();
                }}
            >
                {({ errors, touched, setFieldValue, values }) => (
                    <Form>
                        <DialogContent>
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                name="nombreEmpleado"
                                label="Nombre"
                                value={values.nombreEmpleado}
                                onChange={(e) =>
                                    setFieldValue('nombreEmpleado', e.target.value.toUpperCase())
                                }
                                error={touched.nombreEmpleado && Boolean(errors.nombreEmpleado)}
                                helperText={touched.nombreEmpleado && errors.nombreEmpleado}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                name="apellidoEmpleado"
                                label="Apellido"
                                value={values.apellidoEmpleado}
                                onChange={(e) =>
                                    setFieldValue('apellidoEmpleado', e.target.value.toUpperCase())
                                }
                                error={touched.apellidoEmpleado && Boolean(errors.apellidoEmpleado)}
                                helperText={touched.apellidoEmpleado && errors.apellidoEmpleado}
                            />
                            <Field
                                as={TextField}
                                fullWidth
                                margin="dense"
                                name="celular"
                                label="Celular"
                                error={touched.celular && Boolean(errors.celular)}
                                helperText={touched.celular && errors.celular}
                            />
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                <DatePicker
                                    label="Fecha de Contratación"
                                    value={values.fechaContratacion}
                                    onChange={(date) => setFieldValue('fechaContratacion', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            margin="dense"
                                            error={touched.fechaContratacion && Boolean(errors.fechaContratacion)}
                                            helperText={touched.fechaContratacion && errors.fechaContratacion}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancelar</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Guardar
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default EmpleadoFormModal;
