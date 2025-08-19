import React from 'react';
import { Button, CircularProgress, keyframes, styled } from '@mui/material';

const rainbowAnimation = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const StyledButton = styled(Button)(({ theme, loading }) => ({
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  transform: loading ? 'scale(0.98)' : 'scale(1)',
  fontWeight: 600,
  letterSpacing: '0.5px',

  '&:hover': {
    transform: loading ? 'scale(0.98)' : 'scale(1.05)',
    boxShadow: loading ? theme.shadows[0] : theme.shadows[6],
  },

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: loading
      ? `linear-gradient(90deg, 
         ${theme.palette.primary.main}, 
         ${theme.palette.secondary.main}, 
         ${theme.palette.info.main}, 
         ${theme.palette.primary.main})`
      : 'transparent',
    backgroundSize: '300% 100%',
    animation: loading ? `${rainbowAnimation} 2s linear infinite` : 'none',
    opacity: 0.7,
    zIndex: 0,
  },

  '& > *': {
    position: 'relative',
    zIndex: 1,
  },

  '& .MuiCircularProgress-root': {
    marginRight: theme.spacing(1.5),
    color: 'white',
  }
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
          <CircularProgress size={20} thickness={4} />
          {children}
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default LoadingButton;