# Sistema de Gestion de Citas Medicas

Sistema web para gestionar citas medicas usando Flask (backend) y React (frontend).

## Funcionalidades

- Login de usuarios (Admin, Doctor, Paciente)
- Dashboard segun tipo de usuario
- Crear citas medicas (solo pacientes)
- Ver mis citas (solo pacientes)
- APIs REST completas
- Frontend React
- Despliegue con Docker

## Usuarios de Prueba

Admin: admin@hospital.com / password123
Doctor: doctor@hospital.com / password123
Paciente: paciente@email.com / password123

## Estructura del Proyecto

medical-system/
├── backend/                    # Flask API
│   ├── app.py                 # Aplicacion principal Flask
│   ├── setup_data.py          # Script para datos de prueba
│   ├── requirements.txt       # Dependencias Python
│   └── Dockerfile            # Docker para backend
├── frontend/                  # React App
│   ├── public/               # Archivos publicos
│   ├── src/                  # Codigo fuente React
│   │   ├── components/       # Componentes React
│   │   │   ├── Login.js     # Componente de login
│   │   │   ├── Dashboard.js # Dashboard principal
│   │   │   ├── NuevaCita.js # Formulario nueva cita
│   │   │   └── MisCitas.js  # Lista de citas
│   │   ├── App.js           # Aplicacion principal
│   │   └── index.js         # Punto de entrada
│   ├── package.json         # Dependencias Node.js
│   └── Dockerfile          # Docker para frontend
├── docker-compose.yml       # Orquestacion completa
├── .gitignore              # Archivos a ignorar
└── README.md               # Este archivo

## Instalacion Local

### Prerequisitos
- Python 3.9+
- Node.js 18+
- MySQL/MariaDB (XAMPP)

### Backend (Flask)

1. Instalar dependencias:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configurar base de datos (asegurate de que XAMPP este corriendo):
   ```bash
   python setup_data.py
   ```

3. Ejecutar backend:
   ```bash
   python app.py
   ```
   Backend disponible en: http://localhost:5000

### Frontend (React)

1. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```

2. Ejecutar frontend:
   ```bash
   npm start
   ```
   Frontend disponible en: http://localhost:3000

## Instalacion con Docker

### Prerequisitos
- Docker
- Docker Compose

### Comandos

1. Construir y ejecutar todo:
   ```bash
   docker-compose up -d
   ```

2. Ver logs:
   ```bash
   docker-compose logs -f
   ```

3. Detener:
   ```bash
   docker-compose down
   ```

4. Limpiar todo:
   ```bash
   docker-compose down -v
   docker system prune -a
   ```

## Base de Datos

### Tablas principales:
- usuarios - Autenticacion
- pacientes - Datos de pacientes  
- doctores - Datos de medicos
- especialidades - Especialidades medicas
- citas - Citas programadas
- administradores - Administradores del sistema

### Especialidades disponibles:
- Medicina General
- Cardiologia
- Dermatologia  
- Pediatria

## APIs Disponibles

Endpoint            | Metodo | Descripcion
--------------------|--------|-------------
/api/login          | POST   | Autenticacion
/api/especialidades | GET    | Listar especialidades
/api/doctores/<id>  | GET    | Doctores por especialidad
/api/citas          | POST   | Crear cita
/api/mis-citas/<id> | GET    | Citas del usuario

## Despliegue en AWS

### 1. Crear instancia EC2
- Ubuntu 22.04 LTS
- t2.micro (free tier)
- Security Group: puertos 22, 80, 3000, 5000

### 2. Conectar por SSH
```bash
ssh -i "tu-key.pem" ubuntu@tu-ip-publica
```

### 3. Instalar Docker
```bash
# Actualizar sistema
sudo apt update

# Instalar dependencias
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# Agregar clave GPG de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Agregar repositorio
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"

# Instalar Docker
sudo apt update
sudo apt install docker-ce

# Instalar Docker Compose
sudo apt install docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker ${USER}
su - ${USER}
```

### 4. Desplegar aplicacion
```bash
# Clonar proyecto
git clone https://github.com/adroreo/medical-system.git
cd medical-system

# Ejecutar con Docker
docker-compose up -d

# Verificar
docker ps
```

### 5. Acceder
- Frontend: http://tu-ip-publica:3000
- Backend API: http://tu-ip-publica:5000

## Probar la Aplicacion

1. Ir a http://localhost:3000
2. Login con paciente@email.com / password123
3. Crear una cita:
   - Seleccionar especialidad
   - Seleccionar doctor
   - Elegir fecha y hora
   - Agregar motivo
4. Ver citas creadas

## Comandos Utiles

### Docker
```bash
# Ver logs del backend
docker-compose logs backend

# Ver logs del frontend  
docker-compose logs frontend

# Reiniciar servicios
docker-compose restart

# Entrar al contenedor
docker exec -it medical_backend bash
```

### Base de datos
```bash
# Conectar a MySQL en Docker
docker exec -it medical_mysql mysql -u root -p

# Ver tablas
SHOW TABLES;

# Ver usuarios
SELECT * FROM usuarios;
```
