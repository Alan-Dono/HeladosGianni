-- Crear la base de datos
CREATE DATABASE HELADERIA__GIANNI;
GO

-- Usar la base de datos creada
USE HELADERIA__GIANNI;
GO

-- Crear las tablas
CREATE TABLE Categorias (
    CategoriaID INT PRIMARY KEY IDENTITY(1,1),
    NombreCategoria VARCHAR(50) NOT NULL
);

CREATE TABLE Productos (
    ProductoID INT PRIMARY KEY IDENTITY(1,1),
    NombreProducto VARCHAR(100) NOT NULL,
    CategoriaID INT FOREIGN KEY REFERENCES Categorias(CategoriaID),
    Precio DECIMAL(10, 2) NOT NULL,
    Descripcion VARCHAR(255)
);

CREATE TABLE Empleados (
    EmpleadoID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Celular VARCHAR(20) NOT NULL,  -- Nuevo campo agregado
    FechaContratacion DATE NOT NULL
);

CREATE TABLE Turnos (
    TurnoID INT PRIMARY KEY IDENTITY(1,1),
    EmpleadoID INT FOREIGN KEY REFERENCES Empleados(EmpleadoID),
    FechaInicio DATETIME NOT NULL,
    FechaFin DATETIME NOT NULL
);

CREATE TABLE Ventas (
    VentaID INT PRIMARY KEY IDENTITY(1,1),
    FechaVenta DATETIME NOT NULL,
    EmpleadoID INT FOREIGN KEY REFERENCES Empleados(EmpleadoID),
    TotalVenta DECIMAL(10, 2) NOT NULL
);

CREATE TABLE DetallesVenta (
    DetalleVentaID INT PRIMARY KEY IDENTITY(1,1),
    VentaID INT FOREIGN KEY REFERENCES Ventas(VentaID),
    ProductoID INT FOREIGN KEY REFERENCES Productos(ProductoID),
    Cantidad INT NOT NULL,
    PrecioUnitario DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL
);

-- Insertar categor�as
INSERT INTO Categorias (NombreCategoria) VALUES 
('Helader�a'), ('Cafeter�a'), ('Gaseosas');

-- Insertar productos de helader�a
INSERT INTO Productos (NombreProducto, CategoriaID, Precio, Descripcion) VALUES 
('Helado de Vainilla', 1, 5.99, 'Helado cremoso de vainilla'),
('Helado de Chocolate', 1, 6.99, 'Rico helado de chocolate belga'),
('Helado de Fresa', 1, 5.99, 'Helado de fresa con trozos de fruta'),
('Helado de Menta', 1, 6.50, 'Refrescante helado de menta con chispas de chocolate'),
('Helado de Pistacho', 1, 7.50, 'Exquisito helado de pistacho'),
('Sundae de Caramelo', 1, 8.99, 'Sundae con helado de vainilla y salsa de caramelo'),
('Banana Split', 1, 9.99, 'Cl�sico postre con helado y pl�tano'),
('Milkshake de Oreo', 1, 7.50, 'Batido cremoso con trozos de galleta Oreo');

-- Insertar productos de cafeter�a
INSERT INTO Productos (NombreProducto, CategoriaID, Precio, Descripcion) VALUES 
('Caf� Americano', 2, 2.50, 'Caf� negro cl�sico'),
('Cappuccino', 2, 3.50, 'Caf� con espuma de leche'),
('Latte', 2, 3.75, 'Caf� con leche cremosa'),
('Espresso', 2, 2.25, 'Shot de caf� concentrado'),
('Mocha', 2, 4.00, 'Caf� con chocolate y leche'),
('Caf� con Leche', 2, 3.25, 'Caf� suave con leche'),
('Macchiato', 2, 3.50, 'Espresso con una peque�a cantidad de leche'),
('Affogato', 2, 5.50, 'Postre de caf� con helado de vainilla');

-- Insertar productos de gaseosas
INSERT INTO Productos (NombreProducto, CategoriaID, Precio, Descripcion) VALUES 
('Coca-Cola', 3, 1.99, 'Refresco de cola 355ml'),
('Pepsi', 3, 1.99, 'Refresco de cola alternativo 355ml'),
('Sprite', 3, 1.99, 'Refresco de lima-lim�n 355ml'),
('Fanta', 3, 1.99, 'Refresco de naranja 355ml'),
('7-Up', 3, 1.99, 'Refresco de lima-lim�n alternativo 355ml'),
('Mountain Dew', 3, 2.25, 'Refresco c�trico energizante 355ml'),
('Dr Pepper', 3, 2.25, 'Refresco de sabor �nico 355ml'),
('Schweppes T�nica', 3, 2.50, 'Agua t�nica 355ml');

-- Insertar empleados (ahora con n�mero de celular)
INSERT INTO Empleados (Nombre, Apellido, Celular, FechaContratacion) VALUES 
('Juan', 'P�rez', '555-0101', '2023-01-15'),
('Mar�a', 'Gonz�lez', '555-0202', '2023-03-01'),
('Carlos', 'Rodr�guez', '555-0303', '2023-05-10');