# 🧦 SOCKS CBA - Sistema de Gestión de Ventas

Sistema integral de gestión comercial desarrollado para el control de inventarios, ventas y finanzas de un emprendimiento de medias y canilleras deportivas.

## 📋 Descripción

**SOCKS CBA** es una aplicación web completa que permite gestionar de manera eficiente las operaciones comerciales diarias, desde el registro de productos hasta el análisis financiero detallado. Diseñada específicamente para pequeños y medianos comercios del rubro textil.

## ✨ Funcionalidades Principales

### 🏪 Gestión de Productos
- ✅ Cargar nuevos productos con categorías predefinidas
- ✅ Editar información de productos existentes
- ✅ Eliminar productos del inventario
- ✅ Organización por categorías (Canilleras, Medias Antideslizantes, Pantorrilleras, etc.)

### 💰 Control de Ventas
- ✅ Registro de ventas con múltiples productos
- ✅ Selección de productos y cantidades
- ✅ Cálculo automático de totales
- ✅ Historial completo de ventas
- ✅ Edición y eliminación de ventas registradas
- ✅ Filtrado de ventas por fecha

### 💸 Gestión de Gastos
- ✅ Registro de gastos operativos
- ✅ Categorización por fecha y descripción
- ✅ Control total de egresos
- ✅ Edición y eliminación de gastos

### 📊 Análisis Financiero
- ✅ **Dashboard de resumen** con métricas clave
- ✅ **Ventas diarias y mensuales** con visualización
- ✅ **Ganancia neta del mes** (Ventas - Gastos)
- ✅ **Gráficos de ventas** de últimos 7 días
- ✅ **Producto más vendido** del mes
- ✅ **Promedio de ventas diarias**

### 🔐 Autenticación y Seguridad
- ✅ Sistema de login con JWT
- ✅ Registro de nuevos usuarios
- ✅ Rutas protegidas
- ✅ Gestión de sesiones

## 🏗️ Arquitectura del Sistema

```
SOCKSCBA/
├── 🖥️ Frontend/           # Aplicación React
│   └── socks/
│       ├── src/
│       │   ├── components/     # Componentes reutilizables
│       │   │   ├── NavBar.jsx
│       │   │   ├── PrivateRoute.jsx
│       │   │   └── ActionButtons.jsx
│       │   ├── pages/          # Páginas principales
│       │   │   ├── Login.jsx
│       │   │   ├── Registro.jsx
│       │   │   ├── Home.jsx
│       │   │   ├── CargarProductos.jsx
│       │   │   ├── RealizarVenta.jsx
│       │   │   ├── RegistrarGastos.jsx
│       │   │   └── ResumenFinanciero.jsx
│       │   ├── services/       # Servicios API
│       │   ├── context/        # Context API (Auth)
│       │   ├── hooks/          # Custom Hooks
│       │   └── utils/          # Utilidades
│       └── package.json
│
├── 🔧 Backend/            # API REST Node.js
│   ├── Controladores/     # Controllers MVC
│   │   ├── AuthController.js
│   │   ├── ProductosController.js
│   │   ├── VentasController.js
│   │   ├── GastosController.js
│   │   └── DashboardController.js
│   ├── Modelos/          # Modelos de datos
│   ├── Servicios/        # Lógica de negocio
│   ├── Validaciones/     # Validadores
│   ├── Config/           # Configuración DB
│   ├── app.js           # Servidor principal
│   └── package.json
│
└── 📚 README.md          # Este archivo
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación SPA
- **Tailwind CSS** - Framework CSS
- **Chart.js** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hashing de passwords
- **express-validator** - Validación de datos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- MySQL Server
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd SOCKSCBA
```

### 2. Configurar Backend
```bash
cd Backend
npm install

# Crear archivo .env con las variables:
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=sockscba
JWT_SECRET=tu_jwt_secret
PORT=3000
```

### 3. Configurar Frontend
```bash
cd Frontend/socks
npm install
```

### 4. Base de Datos
```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE sockscba;

# Ejecutar migraciones si existen
# Las tablas se crean automáticamente al iniciar la app
```

## 🎯 Uso del Sistema

### Desarrollo
```bash
# Desde Frontend/socks - Inicia AMBOS servicios
npm run dev

# O por separado:
npm run frontend  # Solo React (puerto 5173)
npm run backend   # Solo API (puerto 3000)
```

### Acceso
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Login**: Crear usuario desde /registro

## 📱 Características Técnicas

### Responsividad
- ✅ **Diseño móvil-first**
- ✅ **Adaptable a tablets y desktop**
- ✅ **Componentes responsivos**

### Performance
- ✅ **Lazy loading de componentes**
- ✅ **Optimización de re-renders**
- ✅ **Caching de datos**

### UX/UI
- ✅ **Interfaz intuitiva**
- ✅ **Feedback visual inmediato**
- ✅ **Estados de carga**
- ✅ **Validación en tiempo real**

## 👤 Autor

**Mauro Pardo**  
Desarrollador Full Stack

