// Mostrar la sección principal solo después del video
window.addEventListener('DOMContentLoaded', function() {
  // Inicializar temporizador
  iniciarTemporizador();
  
  // Configurar event listener para el botón del álbum
  const btnAlbumFotos = document.getElementById('btnAlbumFotos');
  if (btnAlbumFotos) {
    btnAlbumFotos.addEventListener('click', function() {
      window.open('https://photos.app.goo.gl/24Mxk3AU9jweS6uC7', '_blank');
    });
  }

  // Configurar manejo del video de YouTube (sin controles, sin pausas)
  const playButton = document.getElementById('playButton');
  const iframe = document.getElementById('mainVideo');
  
  if (playButton && iframe) {
    playButton.addEventListener('click', function() {
      // Iniciar música inmediatamente
      const music = document.getElementById("backgroundMusic");
      if (music) {
        music.volume = 0.5;
        music.currentTime = 0;
        music.play().catch(e => {
          console.log('Auto-play bloqueado en móvil:', e);
        });
      }
      
      // Mostrar el iframe y ocultar el botón
      iframe.style.display = 'block';
      playButton.style.display = 'none';
      
      // Cambiar src para iniciar autoplay del video
      iframe.src = 'https://www.youtube.com/embed/irHzDOUBv3A?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&loop=0&start=0&disablekb=1&fs=0&playsinline=1&vq=hd2160&hd=1&quality=hd2160&fmt=22&title=0&byline=0&portrait=0&color=ffffff&autopause=0';
      
      // Video completo: 1 minuto 14 segundos = 74 segundos + margen
      setTimeout(() => {
        showInfo();
      }, 76000);
    });
  }
});
function startPresentation() {
  const intro = document.getElementById("intro");
  const content = document.getElementById("content");
  intro.style.display = "none";
  content.style.display = "flex";

  // Reproduce música
  const music = document.getElementById("backgroundMusic");
  if (music) music.volume = 0.5;

  // Imágenes y slides sincronizados
  const slides = document.querySelectorAll(".slide");
  const slidesContainer = document.getElementById('slidesContainer');
  const imagenes = [
    document.getElementById('chicaImagen'),
    document.getElementById('chicaImagen2')
  ];
  let index = 0;
  let prevIndex = -1;

  // Oculta slides y contenedor al inicio
  slides.forEach(slide => {
    slide.classList.remove('visible');
    slide.style.visibility = 'hidden';
  });
  if (slidesContainer) slidesContainer.style.visibility = 'hidden';

  function showNextSlide() {
    // Muestra el contenedor de slides solo cuando se va a mostrar el primer slide
    if (index === 0 && slidesContainer) {
      slidesContainer.style.visibility = 'visible';
    }
    // Oculta el slide anterior
    if (prevIndex >= 0 && prevIndex < slides.length) {
      slides[prevIndex].classList.remove('visible');
      slides[prevIndex].style.visibility = 'hidden';
    }
    // Oculta todas las imágenes
    imagenes.forEach(img => img && img.classList.remove('visible'));

    if (index < slides.length) {
      slides[index].classList.add('visible');
      slides[index].style.visibility = 'visible';
      // Sincroniza la imagen con el mensaje
      if (imagenes[index]) {
        imagenes[index].classList.add('visible');
      } else if (imagenes.length > 0) {
        imagenes[0].classList.add('visible');
      }
      prevIndex = index;
      index++;
      setTimeout(showNextSlide, 3000);
    } else {
      // Al final, muestra la primera imagen
      if (imagenes[0]) imagenes[0].classList.add('visible');
      if (prevIndex >= 0 && prevIndex < slides.length) {
        slides[prevIndex].classList.remove('visible');
        slides[prevIndex].style.visibility = 'hidden';
      }
      setTimeout(function() {
        document.getElementById("finalScreen").style.opacity = 1;
        document.getElementById("finalScreen").style.display = "block";
      }, 800);
    }
  }

  setTimeout(showNextSlide, 1000);
}

function showInfo() {
  // Ocultar la sección del video
  const intro = document.getElementById('intro');
  if (intro) {
    intro.style.display = 'none';
  }
  
  // Mostrar el video de fondo
  const backgroundVideo = document.getElementById('backgroundVideo');
  if (backgroundVideo) {
    backgroundVideo.style.display = 'block';
    backgroundVideo.play().catch(() => {
      console.log('No se pudo reproducir el video de fondo automáticamente');
    });
  }
  
  // Mostrar todas las secciones cuando termine el video
  const infoFiesta = document.getElementById('infoFiestaSection');
  const lluviaSobres = document.getElementById('lluviaSobresSection');
  const timerSection = document.getElementById('timerSection');
  const fraseSection = document.getElementById('fraseSection');
  const confirmarSection = document.getElementById('confirmarSection');
  const albumFotos = document.getElementById('albumFotosSection');
  
  if (infoFiesta && lluviaSobres && timerSection && fraseSection && confirmarSection && albumFotos) {
    // Mostrar todas las secciones inmediatamente sin transición
    [infoFiesta, lluviaSobres, timerSection, fraseSection, confirmarSection, albumFotos].forEach(sec => {
      sec.style.display = 'block';
      sec.style.opacity = '1';
      sec.style.transition = 'none'; // Sin transición
    });
  }
  
  // Inicializar temporizador
  iniciarTemporizador();
  
  // Verificar que la música siga sonando
  const music = document.getElementById("backgroundMusic");
  if (music && music.paused) {
    // Solo si está pausada, intentar reproducirla de nuevo
    music.volume = 0.3;
    music.play().catch(() => {
      console.log('Música pausada, reintentando reproducción');
    });
  } else if (music && !music.paused) {
    // Si ya está sonando, solo ajustar volumen
    music.volume = 0.3;
  }
}

function iniciarTemporizador() {
  const timerSpan = document.getElementById('timer');
  function updateTimer() {
    const ahora = new Date();
    const evento = new Date(2025, 8, 26, 18, 0, 0); // 26 septiembre 2025 18:00
    let diff = evento - ahora;
    if (diff < 0) {
      timerSpan.textContent = '¡Ya comenzó la fiesta!';
      return;
    }
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= dias * (1000 * 60 * 60 * 24);
    const horas = Math.floor(diff / (1000 * 60 * 60));
    diff -= horas * (1000 * 60 * 60);
    const minutos = Math.floor(diff / (1000 * 60));
    diff -= minutos * (1000 * 60);
    const segundos = Math.floor(diff / 1000);
    timerSpan.textContent = `${dias} días. ${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}
