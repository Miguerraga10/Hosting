// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

document.addEventListener('DOMContentLoaded', function() {
  // Listado de confirmaciones
  let url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  
  console.log('Intentando cargar desde:', url);
  
  fetch(url)
    .then(res => {
      console.log('Respuesta recibida:', res.status, res.statusText);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(confirmaciones => {
      console.log('Datos recibidos:', confirmaciones);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = '';
      
      // Verificar si es un array válido
      if (!Array.isArray(confirmaciones)) {
        console.error('Los datos no son un array:', confirmaciones);
        tbody.innerHTML = `<tr><td colspan="4">Error: Los datos recibidos no son válidos.<br>${confirmaciones.error || 'Formato incorrecto'}</td></tr>`;
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      if (confirmaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">Aún no hay confirmaciones.</td></tr>';
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      let totalSi = 0;
      let totalNo = 0;
      
      confirmaciones.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.nombre || 'Sin nombre'}</td>
          <td>${c.asistentes || 0}</td>
          <td>${c.confirmado ? 'Asistiré' : 'No asistiré'}</td>
          <td>
            <button onclick="eliminarConfirmacion('${c._id}', '${c.nombre || 'Sin nombre'}')" 
                    style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              🗑️ Eliminar
            </button>
          </td>
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
      
      console.log('Tabla actualizada con', confirmaciones.length, 'registros');
    })
    .catch((err) => {
      console.error('Error completo:', err);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = `<tr><td colspan="4">Error de conexión.<br>${err.message}<br><small>Verifica que el backend esté funcionando.</small></td></tr>`;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
});

// Función para eliminar una confirmación
function eliminarConfirmacion(id, nombre) {
  if (!confirm(`¿Estás seguro de que quieres eliminar la confirmación de "${nombre}"?`)) {
    return;
  }
  
  console.log('Eliminando confirmación con ID:', id);
  
  fetch(`https://nicol15-backend.onrender.com/api/confirmaciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  })
  .then(result => {
    console.log('Eliminación exitosa:', result);
    alert(`Confirmación de "${nombre}" eliminada correctamente.`);
    
    // Recargar la tabla
    location.reload();
  })
  .catch(err => {
    console.error('Error eliminando confirmación:', err);
    alert(`Error al eliminar la confirmación: ${err.message}`);
  });
}
