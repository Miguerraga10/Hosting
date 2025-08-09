// Variables globales para YouTube
let player;
let isYouTubeReady = false;

// Función llamada por la API de YouTube cuando está lista
function onYouTubeIframeAPIReady() {
  isYouTubeReady = true;
}

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

  // Configurar manejo del video de YouTube
  const playButton = document.getElementById('playButton');
  
  if (playButton) {
    playButton.addEventListener('click', function() {
      // Crear el player de YouTube cuando se haga click
      if (isYouTubeReady || window.YT) {
        player = new YT.Player('mainVideo', {
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      } else {
        // Fallback si la API no está lista
        const iframe = document.getElementById('mainVideo');
        iframe.style.display = 'block';
        playButton.style.display = 'none';
        
        const currentSrc = iframe.src;
        iframe.src = currentSrc.replace('autoplay=0', 'autoplay=1');
        
        // Timeout para mostrar las secciones
        setTimeout(() => {
          showInfo();
        }, 20000); // 20 segundos
      }
    });
  }
});

// Funciones para el player de YouTube
function onPlayerReady(event) {
  const playButton = document.getElementById('playButton');
  const iframe = document.getElementById('mainVideo');
  
  // Mostrar video y ocultar botón
  iframe.style.display = 'block';
  playButton.style.display = 'none';
  
  // Reproducir el video
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  // Cuando el video termine (estado 0)
  if (event.data == YT.PlayerState.ENDED) {
    showInfo();
  }
}
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
  
  // Inicializar música de fondo
  const music = document.getElementById("backgroundMusic");
  if (music) {
    music.volume = 0.3;
    music.play().catch(() => {
      // Si no se puede reproducir automáticamente, esperar a la interacción del usuario
      const playOnClick = () => {
        music.play().catch(() => {});
        document.removeEventListener('click', playOnClick);
        document.removeEventListener('touchstart', playOnClick);
      };
      document.addEventListener('click', playOnClick);
      document.addEventListener('touchstart', playOnClick);
    });
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
