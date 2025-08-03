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
  document.getElementById('intro').style.display = 'none';
  document.getElementById('infoSection').style.display = 'block';
  iniciarTemporizador();
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
    timerSpan.textContent = `${dias} días, ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
  }
  updateTimer();
  setInterval(updateTimer, 1000);
}
