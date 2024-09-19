import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'


export const AppLayaout = () => {
    return (
        <div>
            <Nav position="sticky" sx={{ width: "100%"}} /> 
            <Outlet/>
        </div>
    )
}
