// src/validations/employeeValidation.js
import * as Yup from "yup";

export const employeeValidationSchema = Yup.object({
  nombre: Yup.string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: Yup.string()
    .required("El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres"),
  celular: Yup.string()
    .nullable() // Permite que esté vacío
    .matches(/^[0-9]*$/, "El celular solo debe contener números"),
  fechaContratacion: Yup.date()
    .nullable() // Permite que esté vacío
    .max(new Date(), "La fecha de contratación no puede ser futura"),
});
 