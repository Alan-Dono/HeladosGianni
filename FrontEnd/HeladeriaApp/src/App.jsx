import React from 'react';
import { Button, Typography, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { motion } from 'framer-motion';

function App() {
  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGrid', col2: 'Rocks' },
    { id: 3, col1: 'Material-UI', col2: 'Awesome' },
  ];

  const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My App with MUI and DataGrid
      </Typography>

      <motion.div animate={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
        <Button variant="contained" color="primary">
          Press Me
        </Button>
      </motion.div>

      <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>
    </Container>
  );
}

export default App;
