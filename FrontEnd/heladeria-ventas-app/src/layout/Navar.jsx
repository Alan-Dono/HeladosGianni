import React from 'react'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { Box, Divider, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { NavLink } from 'react-router-dom';



export const Navar = () => {
    return (
        <Box sx={{ width: 200, bgcolor: '#e9f0fe', height: '100vh' }}>
            <Stack direction='row'>
                <List>
                    <ListItem disablePadding>
                        <Link component={Link}
                                to={'/ventas'}
                                sx={{flexGrow: 1, 
                                    textDecoration: 'none',
                                    color:'black'
                                }}
                                >
                            <ListItemButton>
                                <ListItemIcon >
                                    <AddShoppingCartOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='VENTAS'>
                                </ListItemText>
                            </ListItemButton>
                        </Link>
                        <Divider/>
                        <Link component={Link}
                            to={'/ventas'}
                            sx={{
                                flexGrow: 1,
                                textDecoration: 'none',
                                color: 'black'
                            }}
                        >
                            <ListItemButton>
                                <ListItemIcon >
                                    <AddShoppingCartOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary='VENTAS'>
                                </ListItemText>
                            </ListItemButton>
                        </Link>
                        <Divider />
                        
                    </ListItem>
                </List>
            </Stack>

        </Box>

    )
}
