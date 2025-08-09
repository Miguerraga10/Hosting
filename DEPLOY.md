# Guía de Despliegue en Render

## Preparación

1. **Asegúrate de que tu código esté en GitHub**
   ```bash
   git add .
   git commit -m "Backend configurado para producción"
   git push origin main
   ```

2. **Ten lista tu cadena de conexión de MongoDB Atlas**
   - Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

## Despliegue Automático con render.yaml

### Paso 1: Crear cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub

### Paso 2: Conectar repositorio
1. Dashboard → "New" → "Web Service"
2. Conecta tu repositorio de GitHub
3. Selecciona el repositorio del proyecto

### Paso 3: Configuración automática
- Render detectará el archivo `render.yaml`
- La configuración se aplicará automáticamente
- **Importante**: Debes agregar manualmente `MONGODB_URI`

### Paso 4: Configurar MONGODB_URI
1. Una vez creado el servicio, ve a "Environment"
2. Click "Add Environment Variable"
3. Agrega:
   - **Key**: `MONGODB_URI`
   - **Value**: Tu cadena de conexión completa de MongoDB Atlas

### Paso 5: Deploy
- El despliegue iniciará automáticamente
- Monitorea los logs para verificar que todo funcione
- Tu API estará disponible en: `https://nicol15-backend.onrender.com`

## Verificación

### Probar endpoints:
```bash
# Health check
curl https://nicol15-backend.onrender.com/health

# Obtener confirmaciones
curl https://nicol15-backend.onrender.com/api/confirmaciones

# Enviar confirmación (POST)
curl -X POST https://nicol15-backend.onrender.com/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","asistentes":2,"confirmado":true}'
```

## Configuración del Frontend

Una vez desplegado el backend, actualiza la URL en tu frontend:

```javascript
// En rsvp-nuevo.js o donde hagas las llamadas API
const API_URL = 'https://nicol15-backend.onrender.com';
```

## Troubleshooting

### Error de conexión a MongoDB
- Verifica que `MONGODB_URI` esté correctamente configurada
- Asegúrate de que la IP de Render esté permitida en MongoDB Atlas (usa 0.0.0.0/0 para permitir todas)

### Service no inicia
- Revisa los logs en el dashboard de Render
- Verifica que todas las variables de entorno estén configuradas
- Comprueba que el `package.json` tenga los scripts correctos

### CORS errors
- Verifica que `CORS_ORIGIN` permita tu dominio frontend
- Para desarrollo, puedes usar `*`

## Archivos importantes

- `render.yaml`: Configuración principal de Render
- `render-simple.yaml`: Configuración alternativa simplificada
- `.env.example`: Plantilla de variables de entorno
- `server.js`: Servidor principal con health check incluido
