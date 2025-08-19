import React from 'react';
import { Box, CircularProgress, Typography, keyframes, styled } from '@mui/material';
import { Fade, Zoom } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessAnimation = ({ open }) => (
  <Fade in={open} timeout={300}>
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)'
    }}>
      <CheckCircleIcon sx={{
        fontSize: 120,
        color: '#4CAF50',
        filter: 'drop-shadow(0 0 10px rgba(76, 175, 80, 0.7))',
        animation: 'pulse 1s infinite alternate',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)', opacity: 0.9 },
          '100%': { transform: 'scale(1.1)', opacity: 1 }
        }
      }} />
    </Box>
  </Fade>
);

const LoadingOverlay = ({ open, message = "Procesando venta...", success = false }) => {
  return (
    <Fade in={open} timeout={800} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Animación de éxito */}
        {success && <SuccessAnimation open={success} />}

        <Zoom in={open} style={{ transitionDelay: '300ms' }}>
          <Box sx={{
            position: 'relative',
            textAlign: 'center',
            zIndex: 1,
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            opacity: success ? 0.7 : 1,
            transition: 'opacity 0.5s ease'
          }}>
            <CircularProgress
              size={100}
              thickness={2}
              sx={{
                color: success ? '#4CAF50' : 'primary.main',
                transition: 'color 0.5s ease',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                  animationDuration: '2s',
                }
              }}
            />

            <Typography
              variant="h5"
              sx={{
                mt: 3,
                color: 'white',
                fontWeight: 600,
                textShadow: '0 0 8px rgba(100, 149, 237, 0.8)',
                letterSpacing: '1px'
              }}
            >
              {message}
            </Typography>
          </Box>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default LoadingOverlay;