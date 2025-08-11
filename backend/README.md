# Backend - Invitación 15 años Nicol

Backend para el sistema de confirmaciones de la invitación de 15 años de Nicol.

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copia el archivo `.env.example` como `.env` y completa con tus valores:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
PORT=4000
MONGODB_URI=tu_cadena_de_conexion_mongodb
DB_NAME=invitacion15sNicolFranco
COLLECTION_NAME=Confirmaciones
CORS_ORIGIN=*
NODE_ENV=development
```

### 3. Ejecutar el servidor

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm start
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | 4000 |
| `MONGODB_URI` | Cadena de conexión a MongoDB | Requerido |
| `DB_NAME` | Nombre de la base de datos | invitacion15sNicolFranco |
| `COLLECTION_NAME` | Nombre de la colección | Confirmaciones |
| `CORS_ORIGIN` | Origen permitido para CORS | * |
| `NODE_ENV` | Entorno de ejecución | development |

## Endpoints

### POST /api/rsvp
Guarda una nueva confirmación

**Body:**
```json
{
  "nombre": "string",
  "asistentes": "number",
  "mensaje": "string",
  "confirmado": "boolean"
}
```

### GET /api/confirmaciones
Obtiene todas las confirmaciones

### GET /health
Endpoint de salud del servidor

## Estructura del proyecto

```
backend/
├── server.js          # Servidor principal
├── package.json       # Dependencias y scripts
├── .env               # Variables de entorno (no incluido en git)
├── .env.example       # Ejemplo de variables de entorno
├── .gitignore         # Archivos ignorados por git
└── README.md          # Este archivo
```

## Seguridad

- Las variables de entorno sensibles están protegidas en el archivo `.env`
- El archivo `.env` está incluido en `.gitignore` para evitar commits accidentales
- CORS está configurado para controlar el acceso desde diferentes orígenes

## Despliegue en Render

### Opción 1: Usando render.yaml (automático)

1. Sube tu código a un repositorio de GitHub
2. Conecta tu repositorio a Render
3. Render detectará automáticamente el archivo `render.yaml` en la raíz del proyecto
4. Configura manualmente la variable `MONGODB_URI` en el dashboard de Render:
   - Ve a tu servicio en Render
   - Environment → Add Environment Variable
   - Agrega `MONGODB_URI` con tu cadena de conexión de MongoDB Atlas

### Opción 2: Configuración manual

1. Crea un nuevo Web Service en Render
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
4. Agrega las variables de entorno necesarias:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   DB_NAME=invitacion15sNicolFranco
   COLLECTION_NAME=Confirmaciones
   CORS_ORIGIN=*
   ```

### Variables de entorno en producción

Para Render, las variables de entorno se configuran en el dashboard:
- `MONGODB_URI`: Tu cadena de conexión completa de MongoDB Atlas
- `PORT`: Render asigna automáticamente, pero usa 10000 por defecto
- Otras variables según necesites

### Health Check

El endpoint `/health` está disponible para monitoreo del estado del servidor.
