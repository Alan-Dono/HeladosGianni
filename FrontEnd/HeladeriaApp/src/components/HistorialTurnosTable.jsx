import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';

const HistorialTurnosTable = ({ turnos }) => {
    console.log("log data", turnos);

    const columns = [
        { field: 'fechaInicio', headerName: 'Fecha Inicio', width: 180 },
        { field: 'fechaFin', headerName: 'Fecha Fin', width: 180 },
        { field: 'responsableInicial', headerName: 'Responsable Inicial', width: 200 },
        { field: 'responsableFinal', headerName: 'Responsable Final', width: 200 },
        { field: 'totalVentas', headerName: 'Total Ventas', width: 150, valueFormatter: ({ value }) => `$${value ? value.toFixed(2) : 'N/A'}` },
        { field: 'cierresParciales', headerName: 'Cierres Parciales', width: 140 }, //valueGetter: (params) => params.row.cierresParciales ? params.row.cierresParciales.length : 'Sin cierres parciales' },
        { field: 'detalles', headerName: 'Detalles', width: 150, renderCell: () => <button>Ver detalles</button> },
    ];

    const rows = turnos.map((turno, index) => ({
        id: index,  // Cada fila debe tener un 'id' único
        fechaInicio: new Date(turno.fechaInicio).toLocaleString(),
        fechaFin: new Date(turno.fechaFin).toLocaleString(),
        responsableInicial: `${turno.empleado.nombreEmpleado} ${turno.empleado.apellidoEmpleado}`,
        responsableFinal: turno.empleado.nombreEmpleado, // cambiar por responsable actual
        totalVentas: 100, // cambiar por datos
        cierresParciales: 5, // igual que arriba
    }));

    return (
        <Paper style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
            />
        </Paper>
    );
};

export default HistorialTurnosTable;
