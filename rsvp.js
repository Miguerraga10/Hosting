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
  const mensaje_element = modal.querySelector('#modalMensaje');
  
  // Configurar el contenido según el tipo
  if (tipo === 'error') {
    contenido.className = 'modal-contenido error';
    mensaje_element.innerHTML = `❌ ${mensaje}`;
  } else {
    contenido.className = 'modal-contenido';
    mensaje_element.innerHTML = `🎉 ${mensaje}`;
  }
  
  // Mostrar el modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('visible');
  }, 50);
  
  // Cerrar automáticamente después de 4 segundos
  setTimeout(() => {
    modal.classList.remove('visible');
    setTimeout(() => { 
      modal.style.display = 'none'; 
    }, 300);
  }, 4000);
  
  // También cerrar al hacer clic
  modal.onclick = (event) => {
    if (event.target === modal || event.target === contenido) {
      modal.classList.remove('visible');
      setTimeout(() => { 
        modal.style.display = 'none'; 
      }, 300);
    }
  };
}

// Función para enviar al backend
async function enviarRSVP(datos) {
  const response = await fetch('https://nicol15-backend.onrender.com/api/rsvp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos)
  });
  if (!response.ok) {
    throw new Error('Error al enviar RSVP');
  }
  return await response.json();
}

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
  const mensaje_element = modal.querySelector('#modalMensaje');
  
  // Configurar el contenido según el tipo
  if (tipo === 'error') {
    contenido.className = 'modal-contenido error';
    mensaje_element.innerHTML = `❌ ${mensaje}`;
  } else {
    contenido.className = 'modal-contenido';
    mensaje_element.innerHTML = `🎉 ${mensaje}`;
  }
  
  // Mostrar el modal
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('visible');
  }, 50);
  
  // Cerrar automáticamente después de 4 segundos
  setTimeout(() => {
    modal.classList.remove('visible');
    setTimeout(() => { 
      modal.style.display = 'none'; 
    }, 300);
  }, 4000);
  
  // También cerrar al hacer clic
  modal.onclick = (event) => {
    if (event.target === modal || event.target === contenido) {
      modal.classList.remove('visible');
      setTimeout(() => { 
        modal.style.display = 'none'; 
      }, 300);
    }
  };
}

// Función para enviar al backend
async function enviarRSVP(datos) {
  console.log('=== INICIANDO ENVÍO AL BACKEND ===');
  console.log('Datos a enviar:', datos);
  console.log('URL objetivo: https://nicol15-backend.onrender.com/api/rsvp');
  
  try {
    const response = await fetch('https://nicol15-backend.onrender.com/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos)
    });
    
    console.log('=== RESPUESTA RECIBIDA ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('OK:', response.ok);
    console.log('Headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== ERROR DEL SERVIDOR ===');
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${response.statusText} - ${errorText}`);
    }
    
    const resultado = await response.json();
    console.log('=== ÉXITO ===');
    console.log('Respuesta exitosa:', resultado);
    return resultado;
    
  } catch (error) {
    console.error('=== ERROR EN LA PETICIÓN ===');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Error de conectividad - el servidor puede estar apagado');
    }
    
    throw error;
  }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Cargado - Iniciando aplicación');
  
  crearParticulas();
  siguientePagina();

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

  // CONFIGURAR FORMULARIO RSVP
  const formRSVP = document.getElementById('formRSVP');
  console.log('Formulario encontrado:', formRSVP);
  
  if (formRSVP) {
    // Prevenir submit del formulario por defecto
    formRSVP.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Submit interceptado');
      return false;
    });
    
    // Configurar el botón de envío
    const submitBtn = formRSVP.querySelector('button[type="submit"]');
    console.log('Botón enviar encontrado:', submitBtn);
    
    if (submitBtn) {
      submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('=== BOTÓN ENVIAR CLICKEADO ===');
        
        // Deshabilitar botón para evitar dobles envíos
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#cccccc';
        submitBtn.textContent = 'Enviando...';
        
        try {
          // Obtener datos del formulario
          const nombre = document.getElementById('nombre')?.value?.trim();
          const asistentesInput = document.getElementById('asistentes')?.value;
          const confirmado = document.querySelector('input[name="confirmado"]:checked');
          
          console.log('=== DATOS CAPTURADOS ===');
          console.log('Nombre:', nombre);
          console.log('Asistentes input:', asistentesInput);
          console.log('Confirmado elemento:', confirmado);
          console.log('Confirmado valor:', confirmado?.value);
          
          // Validar campos obligatorios
          if (!nombre) {
            mostrarModal('Por favor ingresa tu nombre', 'error');
            return;
          }
          
          if (!asistentesInput || asistentesInput < 1) {
            mostrarModal('Por favor ingresa un número válido de asistentes', 'error');
            return;
          }
          
          if (!confirmado) {
            mostrarModal('Por favor confirma si asistirás o no', 'error');
            return;
          }
          
          const asistentes = parseInt(asistentesInput);
          
          console.log('=== VALIDACIÓN EXITOSA ===');
          
          const datos = {
            nombre: nombre,
            asistentes: asistentes,
            confirmado: confirmado.value === 'true',
            mensaje: '' // Campo opcional
          };
          
          console.log('=== DATOS FINALES A ENVIAR ===');
          console.log('Datos:', datos);
          
          // Enviar al servidor
          const resultado = await enviarRSVP(datos);
          
          console.log('=== ENVÍO COMPLETADO ===');
          
          // Mostrar mensaje de éxito
          const tipoConfirmacion = confirmado.value === 'true' ? 'asistencia' : 'no asistencia';
          mostrarModal(`🎉 ¡Gracias ${nombre}! Tu ${tipoConfirmacion} ha sido confirmada exitosamente. ✨`);
          
          // Limpiar formulario
          formRSVP.reset();
          
        } catch (error) {
          console.error('=== ERROR AL PROCESAR FORMULARIO ===');
          console.error('Error:', error);
          
          let mensajeError = 'Error al conectar con el servidor. Por favor intenta nuevamente.';
          
          if (error.message.includes('Failed to fetch')) {
            mensajeError = 'No se pudo conectar al servidor. Verifica tu conexión de internet.';
          } else if (error.message.includes('4')) {
            mensajeError = 'Error del servidor. Por favor intenta más tarde.';
          }
          
          mostrarModal(mensajeError, 'error');
          
        } finally {
          // Rehabilitar botón
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = '';
          submitBtn.textContent = 'Enviar';
          console.log('=== BOTÓN REHABILITADO ===');
        }
      });
    }
    
  } else {
    console.error('No se encontró el formulario RSVP con ID "formRSVP"');
  }
});
