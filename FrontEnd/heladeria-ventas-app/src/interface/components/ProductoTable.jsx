// src/components/ProductoTable.jsx
import React, { useEffect, useState } from 'react';
import { obtenerProductos } from '../../application/services/ProductoService';
import './ProductoTable.css';

const ProductoTable = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await obtenerProductos();
                setProductos(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    if (loading) {
        return <p>Cargando productos...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Lista de Productos</h2>
            <table className="producto-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.nombreProducto}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.productoCategoriaDtoRes.nombreCategoria}</td> {/* Asumiendo que el DTO tiene la relación con categoría */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductoTable;
