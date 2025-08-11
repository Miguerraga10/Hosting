// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

// Polyfill para addEventListener en navegadores más antiguos
if (!Element.prototype.addEventListener) {
  Element.prototype.addEventListener = function(event, fn) {
    return this.attachEvent('on' + event, fn);
  };
}

// Polyfill para asegurar que fetch esté disponible
if (!window.fetch) {
  console.error('Fetch no está disponible en este navegador');
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('Listado.js cargado - iniciando carga de datos');
  
  // Listado de confirmaciones
  let url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  
  console.log('Intentando cargar desde:', url);
  
  fetch(url)
    .then(function(res) {
      console.log('Respuesta recibida:', res.status, res.statusText);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then(function(confirmaciones) {
      console.log('Datos recibidos:', confirmaciones);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = '';
      
      // Verificar si es un array válido
      if (!Array.isArray(confirmaciones)) {
        console.error('Los datos no son un array:', confirmaciones);
        tbody.innerHTML = `<tr><td colspan="3">Error: Los datos recibidos no son válidos.<br>${confirmaciones.error || 'Formato incorrecto'}</td></tr>`;
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      if (confirmaciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Aún no hay confirmaciones.</td></tr>';
        document.getElementById('totalSi').textContent = 0;
        document.getElementById('totalNo').textContent = 0;
        return;
      }
      
      let totalSi = 0;
      let totalNo = 0;
      
      confirmaciones.forEach(function(c, index) {
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
        
        const tdConfirma = document.createElement('td');
        tdConfirma.style.cssText = 'border: 1px solid #ddd; padding: 8px;';
        tdConfirma.textContent = c.confirmado ? 'Asistiré' : 'No asistiré';
        
        const tdAcciones = document.createElement('td');
        tdAcciones.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: center;';
        
        // Método principal para crear el botón
        try {
          const btnEliminar = document.createElement('button');
          btnEliminar.textContent = '🗑️ Eliminar';
          btnEliminar.style.cssText = 'background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;';
          btnEliminar.title = `Eliminar confirmación de ${c.nombre || 'Sin nombre'}`;
          btnEliminar.setAttribute('data-id', identificador);
          btnEliminar.setAttribute('data-nombre', c.nombre || 'Sin nombre');
          btnEliminar.type = 'button'; // Especificar tipo explícitamente
          
          // Usar addEventListener en lugar de onclick para mejor compatibilidad
          btnEliminar.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            const id = this.getAttribute('data-id');
            const nombre = this.getAttribute('data-nombre');
            eliminarConfirmacion(id, nombre);
          });
          
          tdAcciones.appendChild(btnEliminar);
        } catch (error) {
          console.error('Error creando botón principal, usando método alternativo:', error);
          // Método alternativo si hay problemas
          tdAcciones.innerHTML = `<button onclick="eliminarConfirmacion('${identificador}', '${nombreSeguro}')" 
                                   style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                   title="Eliminar confirmación de ${c.nombre || 'Sin nombre'}">
                                   🗑️ Eliminar
                                 </button>`;
        }
        
        tr.appendChild(tdNombre);
        tr.appendChild(tdConfirma);
        tr.appendChild(tdAcciones);
        
        tbody.appendChild(tr);
        
        // Contar solo las confirmaciones (1 por registro), no los asistentes
        if (c.confirmado) {
          totalSi += 1;
        } else {
          totalNo += 1;
        }
      });
      
      document.getElementById('totalSi').textContent = totalSi;
      document.getElementById('totalNo').textContent = totalNo;
      
      console.log('Tabla actualizada con', confirmaciones.length, 'registros');
    })
    .catch(function(err) {
      console.error('Error completo:', err);
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = `<tr><td colspan="3">Error de conexión.<br>${err.message}<br><small>Verifica que el backend esté funcionando.</small></td></tr>`;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
});

// Función para eliminar una confirmación
function eliminarConfirmacion(id, nombre) {
  // Usar window.confirm para mejor compatibilidad
  if (!window.confirm(`¿Estás seguro de que quieres eliminar la confirmación de "${nombre}"?`)) {
    return;
  }
  
  console.log('Eliminando confirmación con ID:', id);
  
  // Crear objeto de configuración más explícito para fetch
  var fetchConfig = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    mode: 'cors',
    cache: 'no-cache'
  };
  
  fetch(`https://nicol15-backend.onrender.com/api/confirmaciones/${id}`, fetchConfig)
  .then(function(res) {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  })
  .then(function(result) {
    console.log('Eliminación exitosa:', result);
    window.alert(`Confirmación de "${nombre}" eliminada correctamente.`);
    
    // Recargar la tabla usando window.location para mayor compatibilidad
    window.location.reload();
  })
  .catch(function(err) {
    console.error('Error eliminando confirmación:', err);
    window.alert(`Error al eliminar la confirmación: ${err.message}`);
  });
}
