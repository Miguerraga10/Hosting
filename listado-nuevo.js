// Script limpio para el listado de confirmaciones - versión simplificada

document.addEventListener('DOMContentLoaded', function() {
  console.log('Cargando listado de confirmaciones...');
  
  fetch('https://nicol15-backend.onrender.com/api/confirmaciones')
    .then(res => res.json())
    .then(confirmaciones => {
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
        const fila = document.createElement('tr');
        
        // Solo 3 columnas: Nombre, Confirma, Acciones
        fila.innerHTML = `
          <td style="border: 1px solid #ddd; padding: 8px;">${confirmacion.nombre || 'Sin nombre'}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${confirmacion.confirmado ? 'Asistiré' : 'No asistiré'}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
            <button onclick="eliminarConfirmacion('${confirmacion._id || confirmacion.id || index}', '${confirmacion.nombre || 'Sin nombre'}')"
                    style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
              🗑️ Eliminar
            </button>
          </td>
        `;
        
        tbody.appendChild(fila);
        
        // Contar confirmaciones
        if (confirmacion.confirmado) {
          totalSi++;
        } else {
          totalNo++;
        }
      });
      
      document.getElementById('totalSi').textContent = totalSi;
      document.getElementById('totalNo').textContent = totalNo;
    })
    .catch(err => {
      console.error('Error:', err);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = `<tr><td colspan="3">Error de conexión: ${err.message}</td></tr>`;
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
