import React from 'react';
import { Box, CircularProgress, Typography, keyframes, styled } from '@mui/material';
import { Fade, Zoom } from '@mui/material';

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
`;

const Particle = styled('div')(({ theme, delay, size, left }) => ({
  position: 'absolute',
  background: 'rgba(255,255,255,0.6)',
  borderRadius: '50%',
  width: size,
  height: size,
  left: `${left}%`,
  top: '120%',
  animation: `${floatAnimation} 3s ease-out ${delay}s infinite`,
}));

const LoadingOverlay = ({ open, message = "Procesando venta..." }) => {
  const particles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    delay: Math.random() * 2,
    size: `${Math.random() * 10 + 5}px`,
    left: Math.random() * 100,
  }));

  return (
    <Fade in={open} timeout={500} unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Zoom in={open} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            {/* Partículas flotantes */}
            {particles.map((particle) => (
              <Particle
                key={particle.id}
                delay={particle.delay}
                size={particle.size}
                left={particle.left}
              />
            ))}

            {/* Spinner con gradiente */}
            <CircularProgress
              size={80}
              thickness={4}
              sx={{
                background: 'conic-gradient(from 180deg at 50% 50%, #00FFE0 0deg, #7233FF 360deg)',
                borderRadius: '50%',
                padding: '4px',
                boxShadow: '0 0 20px rgba(114, 51, 255, 0.5)',
              }}
            />

            {/* Texto */}
            <Typography
              variant="h6"
              sx={{
                mt: 3,
                color: 'white',
                fontWeight: 500,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {message}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                color: 'rgba(255,255,255,0.7)',
                fontStyle: 'italic',
              }}
            >
              Por favor, espere un momento...
            </Typography>
          </Box>
        </Zoom>
      </Box>
    </Fade>
  );
};

export default LoadingOverlay;