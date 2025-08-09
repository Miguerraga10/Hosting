// Configuración de la API
const API_CONFIG = {
  // URL base del backend
  BASE_URL: 'https://nicol15-backend.onrender.com',
  
  // Endpoints disponibles
  ENDPOINTS: {
    RSVP: '/api/rsvp',
    CONFIRMACIONES: '/api/confirmaciones',
    HEALTH: '/health'
  },
  
  // Función helper para obtener la URL completa
  getURL: function(endpoint) {
    return this.BASE_URL + endpoint;
  }
};

// Para uso futuro, puedes usar:
// fetch(API_CONFIG.getURL(API_CONFIG.ENDPOINTS.RSVP))
// en lugar de hardcodear las URLs

console.log('🔧 API configurada para:', API_CONFIG.BASE_URL);
