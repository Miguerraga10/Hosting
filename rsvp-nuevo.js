// ===== NUEVA VERSIÓN SIMPLIFICADA DEL FORMULARIO RSVP =====

// Variables globales para el manejo de asistentes
let contadorAsistentes = 1;

// Función para agregar un nuevo acompañante
function agregarAcompanante() {
  const container = document.getElementById('acompanantesContainer');
  const nuevoAsistente = document.createElement('div');
  nuevoAsistente.className = 'asistente-item';
  nuevoAsistente.setAttribute('data-index', contadorAsistentes);
  
  nuevoAsistente.innerHTML = `
    <input type="text" class="nombre-asistente" placeholder="Nombre del acompañante" required />
    <button type="button" class="btn-eliminar" onclick="eliminarAsistente(${contadorAsistentes})">❌</button>
  `;
  
  container.appendChild(nuevoAsistente);
  contadorAsistentes++;
}

// Función para eliminar un asistente
function eliminarAsistente(index) {
  const asistente = document.querySelector(`[data-index="${index}"]`);
  if (asistente && index !== 0) { // No permitir eliminar el primer asistente
    asistente.remove();
  }
}

// Función para recopilar datos de todos los asistentes
function recopilarDatosAsistentes() {
  // Obtener la confirmación general del formulario
  const confirmacionGeneral = document.querySelector('input[name="confirmado_general"]:checked');
  if (!confirmacionGeneral) {
    alert('Por favor, confirma si asistirás o no.');
    return [];
  }
  
  const confirmado = confirmacionGeneral.value === 'true';
  
  // Buscar el asistente principal y todos los acompañantes
  const asistentePrincipal = document.querySelector('[data-index="0"]');
  const acompanantes = document.querySelectorAll('#acompanantesContainer .asistente-item');
  
  const datosAsistentes = [];
  
  // Procesar asistente principal
  if (asistentePrincipal) {
    const nombre = asistentePrincipal.querySelector('.nombre-asistente').value.trim();
    
    if (nombre) {
      datosAsistentes.push({
        nombre: nombre,
        confirmado: confirmado,
        esPrincipal: true
      });
    }
  }
  
  // Procesar acompañantes
  acompanantes.forEach((asistente) => {
    const nombre = asistente.querySelector('.nombre-asistente').value.trim();
    
    if (nombre) {
      datosAsistentes.push({
        nombre: nombre,
        confirmado: confirmado,
        esPrincipal: false
      });
    }
  });
  
  return datosAsistentes;
}

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

// Función para enviar múltiples asistentes al backend
async function enviarMultiplesAsistentes(asistentes) {
  console.log('🚀 ENVIANDO MÚLTIPLES ASISTENTES AL BACKEND:', asistentes);
  
  const resultados = [];
  
  for (const asistente of asistentes) {
    try {
      const response = await fetch('https://nicol15-backend.onrender.com/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: asistente.nombre,
          confirmado: asistente.confirmado,
          asistentes: 1 // Cada registro es un asistente individual
        })
      });
      
      console.log(`📡 Status para ${asistente.nombre}:`, response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error del servidor para ${asistente.nombre}:`, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const resultado = await response.json();
      console.log(`✅ Confirmación guardada para ${asistente.nombre}:`, resultado);
      resultados.push({ nombre: asistente.nombre, exitoso: true, resultado });
      
    } catch (error) {
      console.error(`❌ Error enviando datos de ${asistente.nombre}:`, error);
      resultados.push({ nombre: asistente.nombre, exitoso: false, error: error.message });
    }
  }
  
  return resultados;
}

// Función para enviar al backend (mantener compatibilidad)
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
  
  // CONFIGURAR BOTÓN AGREGAR ACOMPAÑANTE
  const btnAgregarAcompanante = document.getElementById('btnAgregarAcompanante');
  if (btnAgregarAcompanante) {
    btnAgregarAcompanante.addEventListener('click', function() {
      console.log('➕ Agregando acompañante');
      agregarAcompanante();
    });
  }
  
  // MANEJAR CLICK DEL BOTÓN
  botonEnviar.addEventListener('click', async function(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    
    console.log('🎯 BOTÓN CLICKEADO - Nuevo sistema de asistentes');
    
    // Cambiar apariencia del botón
    botonEnviar.disabled = true;
    botonEnviar.textContent = '⏳ Enviando...';
    botonEnviar.style.backgroundColor = '#cccccc';
    
    try {
      // OBTENER DATOS DE TODOS LOS ASISTENTES
      const asistentes = recopilarDatosAsistentes();
      
      console.log('📊 Asistentes recopilados:', asistentes);
      
      // VALIDAR
      if (asistentes.length === 0) {
        mostrarModal('Por favor ingresa al menos un nombre', 'error');
        return;
      }
      
      // Verificar que todos tengan nombre
      const sinNombre = asistentes.find(a => !a.nombre);
      if (sinNombre) {
        mostrarModal('Por favor completa todos los nombres', 'error');
        return;
      }
      
      console.log('� Enviando datos de asistentes:', asistentes);
      
      // ENVIAR CADA ASISTENTE INDIVIDUALMENTE
      const resultados = await enviarMultiplesAsistentes(asistentes);
      
      // Verificar resultados
      const exitosos = resultados.filter(r => r.exitoso);
      const fallidos = resultados.filter(r => !r.exitoso);
      
      if (exitosos.length === asistentes.length) {
        mostrarModal(`✅ Todas las confirmaciones fueron enviadas correctamente!\n\nAsistentes registrados: ${exitosos.map(r => r.nombre).join(', ')}`, 'exito');
        
        // Limpiar formulario
        const asistentePrincipal = document.querySelector('[data-index="0"]');
        if (asistentePrincipal) {
          asistentePrincipal.querySelector('.nombre-asistente').value = '';
          const radios = asistentePrincipal.querySelectorAll('input[type="radio"]');
          radios.forEach(radio => radio.checked = false);
        }
        
        // Limpiar acompañantes
        document.getElementById('acompanantesContainer').innerHTML = '';
        contadorAsistentes = 1;
        
      } else if (exitosos.length > 0) {
        mostrarModal(`⚠️ Se enviaron ${exitosos.length} de ${asistentes.length} confirmaciones.\n\nExitosos: ${exitosos.map(r => r.nombre).join(', ')}\nFallidos: ${fallidos.map(r => r.nombre).join(', ')}`, 'parcial');
      } else {
        mostrarModal('❌ No se pudo enviar ninguna confirmación. Intenta de nuevo.', 'error');
      }
      
    } catch (error) {
      console.error('💥 ERROR EN ENVÍO:', error);
      mostrarModal('Error al enviar. Intenta nuevamente.', 'error');
      
    } finally {
      // Restaurar botón
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'Enviar confirmaciones';
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

// Funciones globales para el HTML
window.agregarAcompanante = agregarAcompanante;
window.eliminarAsistente = eliminarAsistente;

// ===== FUNCIONES ADICIONALES =====

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
