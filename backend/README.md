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
