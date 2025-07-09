import * as Yup from "yup";

export const employeeValidationSchema = Yup.object().shape({
  nombreEmpleado: Yup.string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres"),
  apellidoEmpleado: Yup.string()
    .required("El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(20, "El apellido no puede tener más de 20 caracteres"),
  celular: Yup.string()
    .nullable()
    .matches(/^[0-9]*$/, "El celular solo debe contener números")
    .min(10, "El celular debe tener al menos 10 dígitos")
    .max(15, "El celular no puede tener más de 15 dígitos"),
  fechaContratacion: Yup.date()
    .nullable()
    .max(new Date(), "La fecha de contratación no puede ser futura")
    .typeError("Fecha inválida"),
});
