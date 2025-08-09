// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

// Función para cargar confirmaciones
function cargarConfirmaciones() {
  const estadoConexion = document.getElementById('estadoConexion');
  estadoConexion.textContent = 'Conectando al servidor...';
  estadoConexion.style.background = '#fef3c7';
  
  // Detectar URL del backend
  let url;
  if (window.location.hostname === 'miguerraga10.github.io' || window.location.hostname.includes('github.io')) {
    url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  } else if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  } else {
    url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  }
  
  console.log('Cargando confirmaciones desde:', url);
  console.log('Ubicación actual:', window.location.href);
  
  fetch(url)
    .then(res => {
      console.log('Respuesta del servidor:', res.status, res.statusText);
      estadoConexion.textContent = `Respuesta del servidor: ${res.status}`;
      
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} - ${res.statusText}`);
      }
      return res.json();
    })
    .then(confirmaciones => {
      console.log('Confirmaciones recibidas:', confirmaciones);
      estadoConexion.textContent = `✅ Datos cargados correctamente (${confirmaciones.length} registros)`;
      estadoConexion.style.background = '#d1fae5';
      
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = '';
      
      if (!Array.isArray(confirmaciones)) {
        tbody.innerHTML = `<tr><td colspan="5">Error en los datos recibidos.<br>${confirmaciones.error || 'Formato de respuesta incorrecto'}</td></tr>`;
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      if (confirmaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Aún no hay confirmaciones registradas.</td></tr>';
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      let totalSi = 0;
      let totalNo = 0;
      
      confirmaciones.forEach(c => {
        const tr = document.createElement('tr');
        const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString() : 'N/A';
        tr.innerHTML = `
          <td>${c.nombre || 'Sin nombre'}</td>
          <td>${c.asistentes || 0}</td>
          <td style="color: ${c.confirmado ? 'green' : 'red'}">
            ${c.confirmado ? '✅ Asistiré' : '❌ No asistiré'}
          </td>
          <td>${c.mensaje || 'Sin mensaje'}</td>
          <td>${fecha}</td>
        `;
        tbody.appendChild(tr);
        
        const asistentes = parseInt(c.asistentes) || 0;
        if (c.confirmado) {
          totalSi += asistentes;
        } else {
          totalNo += asistentes;
        }
      });
      
      document.getElementById('totalSi').textContent = totalSi;
      document.getElementById('totalNo').textContent = totalNo;
    })
    .catch((err) => {
      console.error('Error cargando confirmaciones:', err);
      estadoConexion.textContent = `❌ Error de conexión: ${err.message}`;
      estadoConexion.style.background = '#fecaca';
      
      document.querySelector('#tablaConfirmaciones tbody').innerHTML = `
        <tr><td colspan="5">
          <strong>Error al cargar confirmaciones</strong><br>
          Detalles: ${err.message}<br>
          <small>Verifica que el backend esté funcionando en: <br>
          <a href="https://nicol15-backend.onrender.com/health" target="_blank">
            https://nicol15-backend.onrender.com/health
          </a></small>
        </td></tr>
      `;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
}

document.addEventListener('DOMContentLoaded', function() {
  // Cargar datos al inicio
  cargarConfirmaciones();
  
  // Configurar botón de actualizar
  const btnActualizar = document.getElementById('btnActualizar');
  if (btnActualizar) {
    btnActualizar.addEventListener('click', cargarConfirmaciones);
  }
});
