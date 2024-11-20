# 📊 Fitracking

**Fitracking** es una aplicación web para gestionar y realizar seguimiento de rutinas de ejercicios. Ofrece a los usuarios una plataforma sencilla donde pueden crear, editar y gestionar rutinas personalizadas. La aplicación también incluye gestión de usuarios y roles de administrador para controlar el acceso y la administración de datos.

## 🛠️ Tecnologías utilizadas

- **Frontend**: React
- **Backend**: Django REST Framework
- **Autenticación**: JWT (JSON Web Token)
- **Base de datos**: MySQL
- **Despliegue**: Railway
- **Servidor de producción**: Gunicorn

## 🚀 Características

- Autenticación y registro de usuarios
- Gestión de usuarios para administradores
- Creación, edición y eliminación de ejercicios
- Creación, edición y eliminación de rutinas de ejercicios
- Protección de rutas para usuarios autenticados y administradores
- Interfaz de usuario amigable y responsiva

## 📦 Instalación local

Sigue estos pasos para configurar el proyecto localmente.

### Prerrequisitos

- **Python 3.11**
- **Node.js y npm**
- **MySQL**

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/JuanAlvarezP/Fitracking.git
cd Fitracking
```
### 2️⃣ Configurar el backend
Crear un entorno virtual e instalar dependencias:

```bash

python -m venv env
source env/bin/activate  # En Windows usa env\Scripts\activate
pip install -r requirements.txt
```
Configurar el archivo .env en el directorio raíz del proyecto Django:

```bash
SECRET_KEY=tu_secreto
DEBUG=True
DATABASE_NAME=fitracking
DATABASE_USER=root
DATABASE_PASSWORD=tu_contraseña
DATABASE_HOST=localhost
DATABASE_PORT=3306
```
Ejecutar migraciones y recopilar archivos estáticos:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
Iniciar el servidor de desarrollo:
```
```bash
python manage.py runserver
```
3️⃣ Configurar el frontend
Navegar al directorio del frontend:


cd frontend
Instalar dependencias:


npm install
Iniciar la aplicación React:


npm start
La aplicación estará disponible en http://localhost:3000.
