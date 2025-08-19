import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { GitHub, LinkedIn, Icecream, Favorite } from '@mui/icons-material';

const Home = () => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    // Elementos de helado mejorados con más variedad
    const iceCreamFlavors = [
        { color: '#FF6B8B', name: 'Fresa', topping: '🍓', shadow: '#FF1493' },
        { color: '#7FFFD4', name: 'Menta', topping: '🍃', shadow: '#00FA9A' },
        { color: '#FFD700', name: 'Vainilla', topping: '⭐', shadow: '#FFA500' },
        { color: '#BA55D3', name: 'Frambuesa', topping: '🫐', shadow: '#8A2BE2' },
        { color: '#FF8C00', name: 'Naranja', topping: '🍊', shadow: '#FF4500' },
        { color: '#98FB98', name: 'Pistacho', topping: '🌰', shadow: '#3CB371' }
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                margin: 0,
                padding: 0,
                backgroundColor: isDarkMode ? '#121212' : '#FFF5F5',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Fondo con gradiente animado */}
            <motion.div
                style={{
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    background: isDarkMode
                        ? 'linear-gradient(45deg, #121212, #1E1E3F, #2D1B3D, #121212)'
                        : 'linear-gradient(45deg, #FFF5F5, #FFEEF8, #F0F8FF, #FFF5F5)',
                    zIndex: 0
                }}
                animate={{
                    x: [0, -50],
                    y: [0, -50]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />

            {/* Confeti animado */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: [
                            '#FF6B8B', '#7FFFD4', '#FFD700',
                            '#BA55D3', '#FF8C00', '#98FB98'
                        ][Math.floor(Math.random() * 6)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        zIndex: 1
                    }}
                    initial={{
                        x: `${Math.random() * 100}vw`,
                        y: `${-Math.random() * 50}vh`,
                        rotate: 0
                    }}
                    animate={{
                        y: '100vh',
                        rotate: 360,
                        opacity: [1, 0.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: 'linear'
                    }}
                />
            ))}

            {/* Productos flotando independientes */}
            {[
                { emoji: '☕', count: 10 },
                { emoji: '🍫', count: 8 },
                { emoji: '🥐', count: 6 },
                { emoji: '🍪', count: 6 },
                { emoji: '🥛', count: 5 },
                { emoji: '🍦', count: 10 }
            ].map(({ emoji, count }) =>
                [...Array(count)].map((_, i) => (
                    <motion.div
                        key={`${emoji}-${i}`}
                        style={{
                            position: 'absolute',
                            top: `${Math.random() * 100}vh`,
                            left: `${Math.random() * 100}vw`,
                            fontSize: '2rem',
                            cursor: 'pointer',
                            zIndex: 1
                        }}
                        animate={{
                            y: [0, Math.random() > 0.5 ? -30 : 30, 0],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 3
                        }}
                        whileTap={{
                            scale: 1.3,
                            filter: 'drop-shadow(0 0 12px gold)',
                            transition: { duration: 0.3 }
                        }}
                    >
                        {emoji}
                    </motion.div>
                ))
            )}




            {/* Representación mejorada de helados */}
            <Box sx={{
                position: 'absolute',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '40px',
                zIndex: 2,
                maxWidth: '800px'
            }}>
                {iceCreamFlavors.map((flavor, i) => (
                    <motion.div
                        key={flavor.name}
                        initial={{ y: 100, opacity: 0, rotate: -10 }}
                        animate={{
                            opacity: 1,
                            rotate: [0, 5, -5, 0],
                            y: [0, -20, 0]
                        }}
                        transition={{
                            delay: i * 0.2,
                            duration: 0.8,
                            rotate: {
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            },
                            y: {
                                duration: 4 + i,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }
                        }}
                        whileHover={{ scale: 1.1 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {/* Copa de helado mejorada */}
                        <div style={{
                            width: '80px',
                            height: '100px',
                            background: `linear-gradient(to bottom, ${flavor.color}, ${flavor.shadow})`,
                            borderTopLeftRadius: '40px',
                            borderTopRightRadius: '40px',
                            borderBottomLeftRadius: '15px',
                            borderBottomRightRadius: '15px',
                            position: 'relative',
                            boxShadow: `0 8px 16px ${flavor.shadow}80`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Toppings animados */}
                            <motion.div
                                style={{
                                    fontSize: '24px',
                                    position: 'absolute',
                                    top: '-15px'
                                }}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 20, -20, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            >
                                {flavor.topping}
                            </motion.div>

                            {/* Goteo de helado */}
                            <motion.div
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    width: '10px',
                                    height: '10px',
                                    background: flavor.color,
                                    borderRadius: '50%'
                                }}
                                animate={{
                                    y: [0, 5, 0],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 2 + i * 0.5,
                                    repeat: Infinity
                                }}
                            />
                        </div>
                        {/* Cono mejorado */}
                        <div style={{
                            width: '60px',
                            height: '40px',
                            background: 'linear-gradient(to bottom, #F4A460, #D2691E)',
                            clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }} />
                        {/* Nombre del sabor con animación */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.2 + 0.8 }}
                            style={{
                                marginTop: '15px',
                                color: theme.palette.text.primary,
                                fontWeight: 'bold',
                                fontSize: '16px',
                                textShadow: `0 2px 4px ${flavor.shadow}`
                            }}
                        >
                            {flavor.name}
                        </motion.div>
                    </motion.div>
                ))}
            </Box>

            {/* Texto principal mejorado */}
            <motion.div
                style={{
                    position: 'relative',
                    zIndex: 3,
                    marginTop: '300px',
                    textAlign: 'center'
                }}
            >
                <Typography
                    variant="h1"
                    component="div"
                    sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 'bold',
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        textShadow: isDarkMode
                            ? `0 2px 10px rgba(255,255,255,0.5)`
                            : `0 2px 10px rgba(0,0,0,0.3)`,
                        marginBottom: '20px'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        ¡Gianni es Familia!
                        <motion.div
                            style={{ display: 'inline-block', marginLeft: '10px' }}
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: 1.5
                            }}
                        >
                            <Favorite sx={{
                                color: '#FF6B8B',
                                fontSize: '1.2em',
                                verticalAlign: 'middle'
                            }} />
                        </motion.div>
                    </motion.div>
                </Typography>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: theme.palette.text.secondary,
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Donde cada sabor es una experiencia única y cada visita se siente como en casa.
                    </Typography>
                </motion.div>
            </motion.div>

            {/* Redes sociales mejoradas */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '20px',
                    zIndex: 3,
                }}
            >
                {[
                    {
                        icon: <GitHub sx={{ fontSize: '2rem' }} />,
                        url: 'https://github.com/Alan-Dono',
                        color: isDarkMode ? '#6e5494' : '#333'
                    },
                    {
                        icon: <LinkedIn sx={{ fontSize: '2rem' }} />,
                        url: 'https://www.linkedin.com/in/alan-nicolas-dono/',
                        color: isDarkMode ? '#0077b5' : '#0A66C2'
                    },
                    {
                        icon: <Icecream sx={{ fontSize: '2rem' }} />,
                        url: '#',
                        color: isDarkMode ? '#FF6B8B' : '#BA55D3'
                    }
                ].map((social, i) => (
                    <motion.div
                        key={i}
                        whileHover={{
                            scale: 1.2,
                            rotate: [0, 10, -10, 0],
                            transition: { duration: 0.5 }
                        }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Link href={social.url} target="_blank" rel="noopener noreferrer">
                            <IconButton sx={{
                                color: 'white',
                                backgroundColor: social.color,
                                '&:hover': {
                                    backgroundColor: `${social.color}CC`
                                },
                                transition: 'all 0.3s',
                                boxShadow: `0 4px 8px ${social.color}80`
                            }}>
                                {social.icon}
                            </IconButton>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </Box>
    );
};

export default Home;