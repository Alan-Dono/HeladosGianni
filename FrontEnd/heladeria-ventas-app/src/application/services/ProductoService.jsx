// src/services/productoService.js
export const obtenerProductos = async () => {
    try {
        const response = await fetch('https://localhost:7266/api/productos'); // URL del backend
        if (!response.ok) {          
            throw new Error('Error al obtener productos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
