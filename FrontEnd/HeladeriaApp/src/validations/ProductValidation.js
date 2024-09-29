// src/validations/ProductValidation.js
import * as Yup from "yup";

export const productValidationSchema = Yup.object().shape({
    
    nombre: Yup.string().required("El nombre es obligatorio"),
    categoria: Yup.string().required("La categoría es obligatoria"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
    precio: Yup.number()
        .required("El precio es obligatorio")
        .positive("El precio debe ser un número positivo")
        .min(0.01, "El precio debe ser mayor que cero"),
});
