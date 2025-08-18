import React from 'react';
import { Button, CircularProgress, keyframes, styled } from '@mui/material';

const shineAnimation = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
`;

const StyledButton = styled(Button)(({ theme, loading }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: loading ? 'none' : 'translateY(-2px)',
    boxShadow: loading ? 'none' : theme.shadows[4],
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: loading
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
      : 'none',
    animation: loading ? `${shineAnimation} 1.5s infinite` : 'none',
  },
}));

const LoadingButton = ({ loading, children, ...props }) => {
  return (
    <StyledButton
      loading={loading ? 1 : 0}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={24}
            color="inherit"
            sx={{ mr: 1 }}
          />
          Procesando...
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default LoadingButton;