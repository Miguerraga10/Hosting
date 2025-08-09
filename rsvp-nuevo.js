// ===== NUEVA VERSIÓN SIMPLIFICADA DEL FORMULARIO RSVP =====

// Función para iniciar el video y la música
function iniciarVideoYMusica() {
  const video = document.getElementById('mainVideo');
  const musica = document.getElementById('backgroundMusic');
  const botonPlay = document.getElementById('playButton');
  
  if (video) {
    video.muted = false; // Activar audio del video
    video.play().then(() => {
      console.log('🎬 Video iniciado con audio');
      
      // Ocultar botón de play
      if (botonPlay) {
        botonPlay.classList.add('oculto');
      }
      
      // Activar música de fondo
      if (musica) {
        musica.play().then(() => {
          musica.volume = 0.3; // Volumen más bajo para que no compita con el video
          console.log('🎵 Música de fondo activada');
        }).catch(error => {
          console.log('❌ Error al reproducir música:', error);
        });
      }
      
    }).catch(error => {
      console.log('❌ Error al reproducir video:', error);
    });
  }
}

// Función para enviar al backend
async function enviarRSVP(datos) {
  console.log('🚀 ENVIANDO AL BACKEND:', datos);
  
  try {
    const response = await fetch('https://nicol15-backend.onrender.com/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    });
    
    console.log('📡 Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const resultado = await response.json();
    console.log('✅ ÉXITO:', resultado);
    return resultado;
    
  } catch (error) {
    console.error('💥 ERROR EN PETICIÓN:', error);
    throw error;
  }
}

// Modal de confirmación
function mostrarModal(mensaje, tipo = 'ok') {
  console.log('📢 Mostrando modal:', mensaje, tipo);
  
  let modal = document.getElementById('modalConfirmacion');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalConfirmacion';
    modal.className = 'modal-superpuesto';
    modal.innerHTML = '<div class="modal-contenido"><span id="modalMensaje"></span></div>';
    document.body.appendChild(modal);
  }
  
  const contenido = modal.querySelector('.modal-contenido');
  const mensaje_element = modal.querySelector('#modalMensaje');
  
  if (tipo === 'error') {
    contenido.className = 'modal-contenido error';
    mensaje_element.innerHTML = `❌ ${mensaje}`;
  } else {
    contenido.className = 'modal-contenido';
    mensaje_element.innerHTML = `🎉 ${mensaje}`;
  }
  
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('visible'), 50);
  
  setTimeout(() => {
    modal.classList.remove('visible');
    setTimeout(() => modal.style.display = 'none', 300);
  }, 4000);
  
  modal.onclick = (event) => {
    if (event.target === modal || event.target === contenido) {
      modal.classList.remove('visible');
      setTimeout(() => modal.style.display = 'none', 300);
    }
  };
}

// ===== CONFIGURACIÓN DEL FORMULARIO =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 DOM CARGADO - Configurando aplicación');
  
  // Configurar botón de play del video
  const botonPlay = document.getElementById('playButton');
  if (botonPlay) {
    botonPlay.addEventListener('click', iniciarVideoYMusica);
    console.log('▶️ Botón de play configurado');
  }
  
  // También permitir clic en el video para iniciar
  const video = document.getElementById('mainVideo');
  if (video) {
    video.addEventListener('click', iniciarVideoYMusica);
  }
  
  // Buscar el formulario
  const formulario = document.getElementById('formRSVP');
  console.log('📋 Formulario encontrado:', formulario);
  
  if (!formulario) {
    console.error('❌ NO SE ENCONTRÓ EL FORMULARIO RSVP');
    return;
  }
  
  // Buscar el botón
  const botonEnviar = formulario.querySelector('button[type="submit"]');
  console.log('🔘 Botón encontrado:', botonEnviar);
  
  if (!botonEnviar) {
    console.error('❌ NO SE ENCONTRÓ EL BOTÓN DE ENVÍO');
    return;
  }
  
  // MANEJAR CLICK DEL BOTÓN
  botonEnviar.addEventListener('click', async function(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    
    console.log('🎯 BOTÓN CLICKEADO');
    
    // Cambiar apariencia del botón
    botonEnviar.disabled = true;
    botonEnviar.textContent = '⏳ Enviando...';
    botonEnviar.style.backgroundColor = '#cccccc';
    
    try {
      // OBTENER DATOS
      const campoNombre = document.getElementById('nombre');
      const campoAsistentes = document.getElementById('asistentes');
      const radioConfirmado = document.querySelector('input[name="confirmado"]:checked');
      
      console.log('📝 Campos encontrados:', {
        nombre: campoNombre,
        asistentes: campoAsistentes,
        confirmado: radioConfirmado
      });
      
      const nombre = campoNombre?.value?.trim();
      const asistentes = campoAsistentes?.value;
      const confirmado = radioConfirmado?.value;
      
      console.log('📊 Valores capturados:', {
        nombre: nombre,
        asistentes: asistentes,
        confirmado: confirmado
      });
      
      // VALIDAR
      if (!nombre) {
        mostrarModal('Por favor ingresa tu nombre', 'error');
        return;
      }
      
      if (!asistentes || asistentes < 1) {
        mostrarModal('Por favor ingresa el número de asistentes', 'error');
        return;
      }
      
      if (!confirmado) {
        mostrarModal('Por favor selecciona si asistirás o no', 'error');
        return;
      }
      
      // PREPARAR DATOS
      const datosEnvio = {
        nombre: nombre,
        asistentes: parseInt(asistentes),
        confirmado: confirmado === 'true',
        mensaje: ''
      };
      
      console.log('📦 Datos preparados para envío:', datosEnvio);
      
      // ENVIAR
      await enviarRSVP(datosEnvio);
      
      // ÉXITO
      const tipoConfirmacion = confirmado === 'true' ? 'asistencia' : 'no asistencia';
      mostrarModal(`¡Gracias ${nombre}! Tu ${tipoConfirmacion} ha sido confirmada. ✨`);
      
      // Limpiar formulario
      formulario.reset();
      
    } catch (error) {
      console.error('💥 ERROR EN ENVÍO:', error);
      mostrarModal('Error al enviar. Intenta nuevamente.', 'error');
      
    } finally {
      // Restaurar botón
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'Enviar';
      botonEnviar.style.backgroundColor = '';
    }
  });
  
  // PREVENIR ENVÍO DEL FORMULARIO
  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    console.log('🚫 Submit del formulario prevenido');
    return false;
  });
  
  console.log('✅ Formulario RSVP configurado correctamente');
});

// ===== FUNCIONES ADICIONALES =====

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

// Configurar música y otros elementos cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎵 Configurando elementos adicionales');
  
  // Crear partículas
  crearParticulas();
  
  // Configurar música de fondo
  const music = document.getElementById('backgroundMusic');
  if (music) {
    const playMusic = () => {
      music.play().catch(() => {});
      document.removeEventListener('click', playMusic);
      document.removeEventListener('touchstart', playMusic);
    };
    document.addEventListener('click', playMusic);
    document.addEventListener('touchstart', playMusic);
    music.play().catch(() => {});
  }

  // Configurar modal del mapa
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
