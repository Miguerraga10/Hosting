// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

document.addEventListener('DOMContentLoaded', function() {
  // Listado de confirmaciones
  let url = 'https://nicol15-backend.onrender.com/api/confirmaciones';
  
  fetch(url)
    .then(res => res.json())
    .then(confirmaciones => {
      const tbody = document.querySelector('#tablaConfirmaciones tbody');
      tbody.innerHTML = '';
      // Si la respuesta es error
      if (!Array.isArray(confirmaciones)) {
        tbody.innerHTML = `<tr><td colspan="3">No se pudo cargar el listado.<br>${confirmaciones.error ? confirmaciones.error : ''}</td></tr>`;
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
      confirmaciones.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${c.nombre}</td>
          <td>${c.asistentes}</td>
          <td>${c.confirmado ? 'Asistiré' : 'No asistiré'}</td>
        `;
        tbody.appendChild(tr);
        if (c.confirmado) totalSi += c.asistentes;
        else totalNo += c.asistentes;
      });
      document.getElementById('totalSi').textContent = totalSi;
      document.getElementById('totalNo').textContent = totalNo;
    })
    .catch((err) => {
      document.querySelector('#tablaConfirmaciones tbody').innerHTML = `<tr><td colspan="3">No se pudo cargar el listado.</td></tr>`;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
});
