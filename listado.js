// Este script debe conectarse al backend para obtener los datos de confirmación
// Reemplaza la simulación por fetch real al backend

document.addEventListener('DOMContentLoaded', function() {
  // Temporizador
  const listadoSection = document.getElementById('listadoSection');
  function updateTimer() {
    const ahora = new Date();
    const evento = new Date(2025, 8, 26, 18, 0, 0); // 26 septiembre 2025 18:00
    let diff = evento - ahora;
    if (diff < 0) {
      document.getElementById('listadoTimer').textContent = '¡Ya comenzó la fiesta!';
      return;
    }
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= dias * (1000 * 60 * 60 * 24);
    const horas = Math.floor(diff / (1000 * 60 * 60));
    diff -= horas * (1000 * 60 * 60);
    const minutos = Math.floor(diff / (1000 * 60));
    diff -= minutos * (1000 * 60);
    const segundos = Math.floor(diff / 1000);
    document.getElementById('listadoTimer').textContent = `${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  // Listado de confirmaciones
  let url = '/api/confirmaciones';
  if (window.location.protocol === 'file:') {
    url = 'http://localhost:4000/api/confirmaciones';
  }
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
      document.querySelector('#tablaConfirmaciones tbody').innerHTML = `<tr><td colspan="3">No se pudo cargar el listado.<br>${err ? err : ''}</td></tr>`;
      document.getElementById('totalSi').textContent = 0;
      document.getElementById('totalNo').textContent = 0;
    });
});
