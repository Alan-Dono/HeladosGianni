import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faBox, faCalendarAlt, faUserCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css'; // Asegúrate de que la ruta sea correcta

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`sidebar ${isOpen ? 'open' : 'closed'}`}
            onMouseEnter={toggleSidebar}
            onMouseLeave={toggleSidebar}
        >
            <div className="sidebar-content">
                <Link to="/ventas" className="menu-item">
                    <FontAwesomeIcon icon={faChartBar} size="lg" />
                    {isOpen && <span>Ventas</span>}
                </Link>
                <Link to="/productos" className="menu-item">
                    <FontAwesomeIcon icon={faBox} size="lg" />
                    {isOpen && <span>Productos</span>}
                </Link>
                <Link to="/turnos" className="menu-item">
                    <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
                    {isOpen && <span>Turnos</span>}
                </Link>
                <Link to="/proveedores" className="menu-item">
                    <FontAwesomeIcon icon={faUserCog} size="lg" />
                    {isOpen && <span>Proveedores</span>}
                </Link>
                <Link to="/empleados" className="menu-item">
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                    {isOpen && <span>Empleados</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
