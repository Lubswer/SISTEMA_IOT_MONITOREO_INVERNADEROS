#  GreenHOUSE  - Sistema de Monitoreo y Gestión Agrónoma de Invernaderos

**GreenHOUSE** es una plataforma web integral desarrollada bajo la arquitectura **MERN Stack** (MongoDB, Express, React, Node.js), diseñada para la automatización, control y monitoreo inteligente de cultivos en invernaderos. La plataforma integra asistencia agrónoma automatizada mediante Inteligencia Artificial (Groq API), chat de soporte en tiempo real (Socket.IO) y una infraestructura resiliente desplegada en la nube.

---

##  Tabla de Contenidos
1. [Contexto del Proyecto](#-contexto-del-proyecto)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Arquitectura del Sistema](#-arquitectura-del-sistema)
4. [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
5. [Despliegue e Infraestructura Cloud (DevOps)](#-despliegue-e-infraestructura-cloud-devops)
   - [Backend en Azure VM](#1-backend-en-azure-virtual-machine-ubuntu)
   - [Seguridad SSL/HTTPS con Nginx y Let's Encrypt](#2-configuración-de-reverse-proxy-y-sslhttps)
   - [Mantenimiento del Servicio Activo (PM2)](#3-mantenimiento-del-servicio-activo-pm2)
   - [Frontend en Vercel](#4-frontend-en-vercel)
6. [Instalación Local](#-instalación-local)

---

##  Contexto del Proyecto

En la agricultura moderna e invernaderos automatizados, el control preciso de variables ambientales (temperatura, humedad, riego y luz) es determinante para maximizar el rendimiento de los cultivos y prevenir plagas. 

**GreenHOUSE** resuelve esta necesidad proporcionando:
- **Gestión centralizada de cultivos**: Registro y seguimiento del ciclo de vida de plantas por usuario.
- **Tratamientos y automatizaciones**: Programación de riegos y ventilación según parámetros del cultivo.
- **Asistente Virtual Agrónomo**: Asistencia inteligente basada en el modelo de lenguaje de ultra baja latencia **Groq Llama 3**, capaz de responder consultas técnicas agrícolas al instante.
- **Soporte Técnico en Vivo**: Comunicación bidireccional inmediata vía **Socket.IO** entre los administradores y los usuarios.

---

## 🛠️ Stack Tecnológico

### **Backend (Servidor & API REST)**
* **Node.js**: Entorno de ejecución asíncrono para JavaScript.
* **Express.js**: Framework web para la construcción de API RESTful.
* **MongoDB Atlas**: Base de datos NoSQL basada en la nube.
* **Mongoose**: ODM para modelado estructurado de colecciones y esquemas.
* **Socket.IO**: Protocolo de comunicación bidireccional en tiempo real mediante WebSockets.
* **Groq SDK**: Integración con el motor de IA de alta velocidad (Groq LLM).
* **Cloudinary & Express-FileUpload**: Gestión y almacenamiento en la nube de imágenes de perfil y cultivos.
* **Nodemailer**: Servicio de envío automatizado de correos electrónicos para confirmaciones y recuperación de credenciales.
* **JWT & Bcryptjs**: Autenticación basada en Tokens JSON e historial de contraseñas encriptadas.

### **Frontend (Cliente)**
* **React**: Biblioteca de UI basada en componentes.
* **Vite**: Bundler de nueva generación ultra rápido.
* **TailwindCSS**: CSS utilities para un diseño moderno, responsivo y estético.
* **Framer Motion & Lucide/React-Icons**: Transiciones suaves, animaciones fluidas y micro-interacciones.
* **Zustand**: Gestión del estado global (Autenticación y Perfiles).
* **Axios**: Cliente de peticiones HTTP.

---

##  Arquitectura del Sistema

```
  ┌─────────────────────────────────────────────────────────┐
  │                 CLIENTE (Frontend)                      │
  │           React + Vite (Desplegado en Vercel)           │
  │           https://plantitafront.vercel.app              │
  └──────────────────────────┬──────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            │  PETICIONES HTTPS (SSL / TLS)   │
            │  & WEBSOCKETS (Socket.IO WSS)   │
            └────────────────┬────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │              SERVIDOR BACKEND (Azure VM)                │
  │    Ubuntu Server + Nginx Reverse Proxy (Puerto 443/80)   │
  │     https://gplantita.chilecentral.cloudapp.azure.com   │
  │                                                         │
  │  ┌───────────────────────────────────────────────────┐  │
  │  │         Proceso Node.js (PM2 Daemon)              │  │
  │  │               Puerto Local: 3000                  │  │
  │  └──────────────┬──────────────────┬─────────────────┘  │
  └─────────────────┼──────────────────┼────────────────────┘
                    │                  │
                    ▼                  ▼
        ┌──────────────────────┐  ┌──────────────────────┐
        │ Cluster MongoDB      │  │  Servicios Externos  │
        │ Atlas (Base Datos)   │  │  - Groq AI (Llama 3) │
        └──────────────────────┘  │  - Cloudinary Media  │
                                  │  - Gmail SMTP        │
                                  └──────────────────────┘
```

---

##  Módulos y Funcionalidades

1. **Autenticación y Roles**:
   * Registro con verificación de correo electrónico vía token.
   * Recuperación y cambio de contraseña seguras.
   * Distinción de roles: **Administrador** (Gestión global de usuarios y chat de soporte) y **Usuario** (Gestión de sus cultivos).

2. **Panel de Gestión de Cultivos**:
   * CRUD completo de cultivos (Nombre, tipo de planta, fechas, imágenes).
   * Monitoreo de estado (activo/salida) y claves individuales por cultivo.

3. **Módulo de Tratamientos y Automatizaciones**:
   * Registro de controles de temperatura, humedad y horas de luz.

4. **Centro de Chat e Inteligencia Artificial**:
   * **Chat IA Agrónomo**: Consultas de agronomía procesadas al instante mediante la API de Groq.
   * **Soporte en Vivo**: Canal de comunicación directo vía Socket.IO con el Administrador.

---

## Despliegue e Infraestructura Cloud

Toda la aplicación se encuentra desplegada en producción utilizando arquitecturas en la nube desacopladas y de alta disponibilidad:

### 1. Backend en Azure (Virtual Machine Ubuntu)
* Se configuró una Máquina Virtual Linux Ubuntu en **Microsoft Azure** (IP Pública asignada y dominio DNS `gplantita.chilecentral.cloudapp.azure.com`).
* El backend corre como un servicio internamente en el puerto `3000`.

### 2. Configuración de Reverse Proxy y SSL/HTTPS
* **Nginx**: Se instaló Nginx como servidor web y Proxy Inverso. Recibe el tráfico web en los puertos públicos `80` (HTTP) y `443` (HTTPS) y redirige las solicitudes de manera segura hacia la aplicación Node.js en el puerto local `3000`.
* **Certbot & Let's Encrypt**: Se generó e instaló un certificado de seguridad SSL gratis y autorrenovable, otorgando cifrado `HTTPS` a todo el backend para evitar bloqueos de contenido mixto (*Mixed Content*) en navegadores web modernos.

### 3. Mantenimiento del Servicio Activo (PM2)
Para garantizar que el servidor Node.js **se mantenga activo 24/7 de forma ininterrumpida**, se utiliza el gestor de procesos en segundo plano **PM2**:
* **Resiliencia ante fallos**: Si ocurre un error no controlado o la app colapsa, PM2 la reinicia automáticamente en milisegundos.
* **Auto-Arranque en Reinicios**: Se configuró PM2 como un demonio del sistema operativo (`pm2 startup` y `pm2 save`), permitiendo que el servidor backend vuelva a levantarse solo, incluso si la máquina virtual de Azure se reinicia o sufre un mantenimiento.

Comandos de gestión en Azure:
```bash
# Ver estado del servicio
pm2 status

# Ver logs de ejecución en tiempo real
pm2 logs 0

# Reiniciar el backend
pm2 restart 0
```

### 4. Frontend en Vercel
* El cliente React + Vite está alojado en la plataforma **Vercel** enlazado directamente con el repositorio de GitHub para Integración Continua (CI/CD).
* **SPA Routing**: Se configuró `vercel.json` con reescritura de rutas (`rewrites`) apuntando a `/index.html` para evitar errores `404 Not Found` en recargas del navegador.
* **Variables de Entorno**: La variable `VITE_BACKEND_URL` apunta de forma segura al endpoint HTTPS en Azure:
  `VITE_BACKEND_URL=https://gplantita.chilecentral.cloudapp.azure.com/api`

---

##  Instalación Local

Si deseas clonar y ejecutar el proyecto localmente:

### Prerrequisitos
* Node.js (v18 o superior)
* npm o pnpm
* Cuenta en MongoDB Atlas (o MongoDB Local)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/gabrielt007/TIC__Gplantita.git
cd TIC__Gplantita
```

### 2. Configuración del Backend
```bash
cd backend
pnpm install
```

Crear un archivo `.env` dentro de `backend/`:
```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
URL_BACKEND=http://localhost:3000/api/
JWT_SECRET=tu_clave_jwt_secreta
URL_FRONTEND=http://localhost:5173/

HOST_GMAIL=smtp.gmail.com
PORT_GMAIL=465
USER_GMAIL=tu_correo@gmail.com
PASS_GMAIL=tu_password_de_aplicacion

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

GROQ_API_KEY=tu_groq_api_key
```

Iniciar el backend en desarrollo:
```bash
pnpm run dev
```

### 3. Configuración del Frontend
```bash
cd ../frontend
npm install
```

Crear un archivo `.env` dentro de `frontend/`:
```env
VITE_BACKEND_URL=http://localhost:3000/api
```

Iniciar el frontend en desarrollo:
```bash
npm run dev
```

Abre tu navegador en `http://localhost:5173` .
