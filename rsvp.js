// Lógica frontend para RSVP y efectos mágicos
// Efecto de partículas mágicas
function crearParticulas() {
  const container = document.createElement('div');
  container.id = 'particulas';
  document.body.appendChild(container);
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particula';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (2 + Math.random() * 3) + 's';
    container.appendChild(p);
  }
}

// Transición tipo libro
function siguientePagina() {
  const slides = document.querySelectorAll('.slide');
  let actual = 0;
  function mostrarSiguiente() {
    if (actual > 0) slides[actual - 1].classList.remove('visible');
    if (actual < slides.length) {
      slides[actual].classList.add('visible');
      actual++;
      setTimeout(mostrarSiguiente, 2200);
    } else {
      document.getElementById('finalScreen').style.display = 'block';
    }
  }
  mostrarSiguiente();
}

function startPresentation() {
  // Oculta el video y muestra el contenido principal
  document.getElementById('intro').style.display = 'none';
  document.getElementById('content').style.display = 'flex';
  mostrarSlides();
}

function mostrarSlides() {
  const slides = document.querySelectorAll('.slide');
  const imagenes = [
    document.getElementById('chicaImagen'),
    document.getElementById('chicaImagen2'),
    document.getElementById('chicaImagen3')
  ];
  let actual = 0;
  slides.forEach(s => s.classList.remove('visible'));
  imagenes.forEach(img => img && img.classList.remove('visible'));
  document.getElementById('finalScreen').style.display = 'none';
  function mostrarSiguiente() {
    if (actual > 0) {
      slides[actual - 1].classList.remove('visible');
      if (imagenes[actual - 1]) imagenes[actual - 1].classList.remove('visible');
    }
    if (actual < slides.length) {
      slides[actual].classList.add('visible');
      if (imagenes[actual]) imagenes[actual].classList.add('visible');
      actual++;
      setTimeout(mostrarSiguiente, 2200);
    } else {
      slides[actual - 1].classList.remove('visible');
      imagenes.forEach(img => img && img.classList.remove('visible'));
      document.getElementById('finalScreen').style.display = 'block';
    }
  }
  mostrarSiguiente();
}

// Enviar RSVP
document.addEventListener('DOMContentLoaded', () => {
  crearParticulas();
  siguientePagina();

  // Modal de confirmación bonito
  function mostrarModal(mensaje, tipo = 'ok') {
    let modal = document.getElementById('modalConfirmacion');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalConfirmacion';
      modal.className = 'modal-superpuesto';
      modal.innerHTML = '<div class="modal-contenido"><span id="modalMensaje"></span></div>';
      document.body.appendChild(modal);
    }
    const contenido = modal.querySelector('.modal-contenido');
    contenido.className = 'modal-contenido ' + tipo;
    modal.style.display = 'flex';
    modal.querySelector('#modalMensaje').textContent = mensaje;
    setTimeout(() => {
      modal.classList.add('visible');
    }, 50);
    // Cierra al hacer clic en cualquier parte
    modal.onclick = () => {
      modal.classList.remove('visible');
      setTimeout(() => { modal.style.display = 'none'; }, 300);
    };
  }

  document.getElementById('formRSVP').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const asistentes = parseInt(document.getElementById('asistentes').value);
    const confirmado = document.querySelector('input[name="confirmado"]:checked');
    if (!nombre || !asistentes || !confirmado) {
      mostrarModal('Por favor completa todos los campos y selecciona si asistirás o no.', 'error');
      return;
    }
    // Verifica si el nombre ya existe
    let urlConfirmaciones = '/api/confirmaciones';
    if (window.location.protocol === 'file:') {
      urlConfirmaciones = 'http://localhost:4000/api/confirmaciones';
    }
    try {
      const resLista = await fetch(urlConfirmaciones);
      if (resLista.ok) {
        const lista = await resLista.json();
        if (lista.some(c => c.nombre.trim().toLowerCase() === nombre.toLowerCase())) {
          mostrarModal('Ya existe una confirmación con ese nombre. Por favor ingresa otro.', 'error');
          return;
        }
      }
    } catch {
      // Si no se puede verificar, permite continuar
    }
    const data = {
      nombre,
      asistentes,
      confirmado: confirmado.value === 'true'
    };
    let url = '/api/rsvp';
    if (window.location.protocol === 'file:') {
      url = 'http://localhost:4000/api/rsvp';
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        mostrarModal('¡Confirmación enviada!');
        document.getElementById('formRSVP').reset();
      } else {
        mostrarModal('Error al enviar la confirmación.', 'error');
      }
    } catch {
      mostrarModal('No se pudo conectar al servidor.', 'error');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const music = document.getElementById('backgroundMusic');
  // Intenta reproducir la música al cargar
  if (music) {
    const playMusic = () => {
      music.play().catch(() => {});
      document.removeEventListener('click', playMusic);
      document.removeEventListener('touchstart', playMusic);
    };
    // Algunos navegadores requieren interacción del usuario
    document.addEventListener('click', playMusic);
    document.addEventListener('touchstart', playMusic);
    // Intento inicial
    music.play().catch(() => {});
  }

  // Modal mapa
  const btnMapa = document.getElementById('btnMapa');
  const modalMapa = document.getElementById('mapaModal');
  const cerrarMapa = document.getElementById('cerrarMapa');
  if(btnMapa && modalMapa && cerrarMapa) {
    btnMapa.addEventListener('click', function() {
      modalMapa.style.display = 'flex';
    });
    cerrarMapa.addEventListener('click', function() {
      modalMapa.style.display = 'none';
    });
    modalMapa.addEventListener('click', function(e) {
      if(e.target === modalMapa) modalMapa.style.display = 'none';
    });
  }
});
