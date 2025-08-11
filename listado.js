// Script limpio para el listado de confirmaciones - versión simplificada
// Versión de depuración que ignora completamente cualquier campo de asistentes

document.addEventListener('DOMContentLoaded', function() {
  console.log('Cargando listado de confirmaciones...');
  
  fetch('https://nicol15-backend.onrender.com/api/confirmaciones')
    .then(res => res.json())
    .then(confirmaciones => {
      console.log('Datos del backend:', confirmaciones); // Debug
      
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = '';
      
      if (!Array.isArray(confirmaciones) || confirmaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No hay confirmaciones.</td></tr>';
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      let totalSi = 0;
      let totalNo = 0;
      
      confirmaciones.forEach((confirmacion, index) => {
        console.log(`Procesando registro ${index}:`, confirmacion); // Debug
        
        const fila = document.createElement('tr');
        
        // SOLO 3 columnas - ignorar completamente cualquier dato de asistentes
        const nombreCelda = document.createElement('td');
        nombreCelda.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        nombreCelda.textContent = confirmacion.nombre || 'Sin nombre';
        
        const confirmaCelda = document.createElement('td');
        confirmaCelda.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        confirmaCelda.textContent = confirmacion.confirmado ? 'Asistiré' : 'No asistiré';
        
        const accionesCelda = document.createElement('td');
        accionesCelda.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center;';
        accionesCelda.innerHTML = `
          <button onclick="eliminarConfirmacion('${confirmacion._id || confirmacion.id || index}', '${(confirmacion.nombre || 'Sin nombre').replace(/'/g, "&apos;")}')"
                  style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
            🗑️ Eliminar
          </button>
        `;
        
        // Agregar solo estas 3 celdas
        fila.appendChild(nombreCelda);
        fila.appendChild(confirmaCelda);
        fila.appendChild(accionesCelda);
        
        tbody.appendChild(fila);
        
        // Contar confirmaciones (no asistentes)
        if (confirmacion.confirmado) {
          totalSi++;
        } else {
          totalNo++;
        }
      });
      
      document.getElementById('totalSi').textContent = totalSi;
      document.getElementById('totalNo').textContent = totalNo;
      
      console.log(`Tabla completada: ${confirmaciones.length} registros, ${totalSi} confirman, ${totalNo} no confirman`);
    })
    .catch(err => {
      console.error('Error:', err);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = `<tr><td colspan="3">Error de conexión: ${err.message}</td></tr>`;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
});

function eliminarConfirmacion(id, nombre) {
  if (!confirm(`¿Eliminar confirmación de "${nombre}"?`)) return;
  
  fetch(`https://nicol15-backend.onrender.com/api/confirmaciones/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(result => {
    alert(`Confirmación de "${nombre}" eliminada.`);
    location.reload();
  })
  .catch(err => {
    alert(`Error: ${err.message}`);
  });
}
