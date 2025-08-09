// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

document.addEventListener('DOMContentLoaded', function() {
  console.log('Listado.js cargado - iniciando carga de datos');
  
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
      
      confirmaciones.forEach((c, index) => {
        console.log('Procesando confirmación:', c); // Debug
        const tr = document.createElement('tr');
        
        // Usar _id o index como fallback
        const identificador = c._id || c.id || index;
        const nombreSeguro = (c.nombre || 'Sin nombre').replace(/'/g, "&apos;");
        
        console.log('ID:', identificador, 'Nombre:', nombreSeguro); // Debug adicional
        
        // Crear celdas individualmente para evitar problemas con innerHTML
        const tdNombre = document.createElement('td');
        tdNombre.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        tdNombre.textContent = c.nombre || 'Sin nombre';
        
        const tdAsistentes = document.createElement('td');
        tdAsistentes.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        tdAsistentes.textContent = c.asistentes || 0;
        
        const tdConfirma = document.createElement('td');
        tdConfirma.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        tdConfirma.textContent = c.confirmado ? 'Asistiré' : 'No asistiré';
        
        const tdAcciones = document.createElement('td');
        tdAcciones.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center;';
        
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = '🗑️ Eliminar';
        btnEliminar.style.cssText = 'background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;';
        btnEliminar.title = `Eliminar confirmación de ${c.nombre || 'Sin nombre'}`;
        btnEliminar.onclick = function() {
          eliminarConfirmacion(identificador, c.nombre || 'Sin nombre');
        };
        
        tdAcciones.appendChild(btnEliminar);
        
        tr.appendChild(tdNombre);
        tr.appendChild(tdAsistentes);
        tr.appendChild(tdConfirma);
        tr.appendChild(tdAcciones);
        
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
