// src/validations/ProductValidation.js
import * as Yup from "yup";

export const categoriaProducto = Yup.object().shape({
  nombre: Yup.string()
    .required("El nombre es obligatorio")
    .max(20, "El nombre debe tener un máximo de 20 caracteres"), // Validación de máximo 20 caracteres
});
