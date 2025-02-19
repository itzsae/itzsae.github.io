document.addEventListener("DOMContentLoaded", function() {
  let audioContext = null;
  let analyser = null;
  let animationId = null;
  const video = document.getElementById("background-video");
  const card = document.querySelector(".card");
  
  // Функция для создания и настройки аудио контекста
  async function setupAudioContext() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      analyser.smoothingTimeConstant = 0.8;

      console.log("Аудио контекст создан");
      return true;
    } catch (error) {
      console.error("Ошибка создания аудио контекста:", error);
      return false;
    }
  }

  // Функция для подключения видео к аудио контексту
  async function connectVideoToAnalyser() {
    try {
      if (!video.captureStream) {
        console.error("captureStream не поддерживается");
        return false;
      }

      const stream = video.captureStream();
      const audioTracks = stream.getAudioTracks();
      
      if (audioTracks.length === 0) {
        console.error("Аудио дорожка не найдена");
        return false;
      }

      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      mediaStreamSource.connect(analyser);
      console.log("Видео подключено к анализатору");
      return true;
    } catch (error) {
      console.error("Ошибка подключения видео:", error);
      return false;
    }
  }

  // // Функция визуализации
  // function visualize() {
  //   const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
  //   function draw() {
  //     analyser.getByteFrequencyData(dataArray);
      
  //     // Получаем среднее значение низких частот
  //     const bassValues = dataArray.slice(0, 4);
  //     const bassAvg = bassValues.reduce((a, b) => a + b, 0) / bassValues.length;
      
  //     // Нормализуем и усиливаем значение
  //     const intensity = Math.min((bassAvg / 128) * 3, 1);
      
  //     // Применяем эффект к карточке
  //     const red = 255;
  //     const whiteComponent = Math.floor(255 * (1 - intensity));
  //     const shadowSize = 20 + (intensity * 60);
  //     const shadowOpacity = 0.5 + (intensity * 0.5);
      
  //     card.style.boxShadow = `0 0 ${shadowSize}px rgba(${red}, ${whiteComponent}, ${whiteComponent}, ${shadowOpacity})`;
      
  //     console.log("Бас:", bassAvg, "Интенсивность:", intensity);
      
  //     animationId = requestAnimationFrame(draw);
  //   }
    
  //   draw();
  // }

  // Кнопка входа
  document.getElementById("enter-button").onclick = async function() {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("main-content").style.display = "flex";
    document.getElementById("video-background").style.display = "block";
    
    try {
      // Настраиваем видео
      video.volume = 1.0;
      video.muted = false;
      
      // Запускаем видео
      await video.play();
      console.log("Видео запущено");
      
      // Настраиваем аудио контекст
      if (await setupAudioContext()) {
        // Даем время на инициализацию видео
        setTimeout(async () => {
          if (await connectVideoToAnalyser()) {
            visualize();
            console.log("Визуализация запущена");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Ошибка запуска:", error);
    }
  };

  // Обработчики событий видео для отладки
  video.addEventListener("play", () => {
    console.log("Видео играет");
    console.log("Громкость:", video.volume);
    console.log("Без звука:", video.muted);
    console.log("Длительность:", video.duration);
    console.log("Текущее время:", video.currentTime);
  });

  video.addEventListener("pause", () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      card.style.boxShadow = "0 0 30px rgba(255, 255, 255, 0.5)";
    }
    console.log("Видео на паузе");
  });

  // Создание снежинок
  const snowfall = document.querySelector('.snowfall');
  const numberOfSnowflakes = 100; 
  let mouseX = 0;
  let mouseY = 0;

  // Отслеживание позиции мыши
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    
    // Начальная позиция
    let posX = Math.random() * window.innerWidth;
    let posY = -10;
    let speedX = (Math.random() - 0.5) * 2;
    let speedY = Math.random() * 2 + 1;
    let isDisturbed = false;
    
    // Случайный размер (3-6px)
    const size = (Math.random() * 3) + 3;
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    
    // Случайная прозрачность (0.4-0.8)
    snowflake.style.opacity = (Math.random() * 0.4) + 0.4;

    function updatePosition() {
      // Проверяем расстояние до курсора
      const dx = mouseX - posX;
      const dy = mouseY - posY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 50 && !isDisturbed) { 
        // Отталкивание от курсора
        const angle = Math.atan2(dy, dx);
        speedX = -Math.cos(angle) * 8;
        speedY = -Math.sin(angle) * 8;
        isDisturbed = true;
        snowflake.classList.add('active');
        
        // Возвращаем нормальную скорость через некоторое время
        setTimeout(() => {
          isDisturbed = false;
          speedX = (Math.random() - 0.5) * 2;
          speedY = Math.random() * 2 + 1;
          snowflake.classList.remove('active');
        }, 1000);
      }

      // Обновляем позицию
      posX += speedX;
      posY += speedY;

      // Проверяем границы
      if (posY > window.innerHeight + 10) {
        posY = -10;
        posX = Math.random() * window.innerWidth;
      }
      if (posX < -10) posX = window.innerWidth + 10;
      if (posX > window.innerWidth + 10) posX = -10;

      // Применяем позицию
      snowflake.style.transform = `translate(${posX}px, ${posY}px)`;
      requestAnimationFrame(updatePosition);
    }

    // Запускаем анимацию
    requestAnimationFrame(updatePosition);
    return snowflake;
  }

  // Создаем начальные снежинки
  for (let i = 0; i < numberOfSnowflakes; i++) {
    const snowflake = createSnowflake();
    // Случайное начальное положение по вертикали
    const randomY = Math.random() * window.innerHeight;
    snowflake.style.transform = `translate(${Math.random() * window.innerWidth}px, ${randomY}px)`;
    snowfall.appendChild(snowflake);
  }

  // Добавляем снежинки при изменении размера окна
  window.addEventListener('resize', () => {
    while (snowfall.firstChild) {
      snowfall.removeChild(snowfall.firstChild);
    }
    for (let i = 0; i < numberOfSnowflakes; i++) {
      const snowflake = createSnowflake();
      const randomY = Math.random() * window.innerHeight;
      snowflake.style.transform = `translate(${Math.random() * window.innerWidth}px, ${randomY}px)`;
      snowfall.appendChild(snowflake);
    }
  });

  // Код для защиты от инспектора
  let alertVisible = false;
  const overlay = document.createElement("div");
  overlay.style = `
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    padding: 20px 40px;
    border-radius: 8px;
    color: white;
    font-size: 20px;
    text-align: center;
    backdrop-filter: blur(5px);
    transition: opacity 0.3s;
    z-index: 9999;
  `;
  overlay.textContent = "нахуй";
  overlay.style.opacity = "0";
  overlay.style.display = "none";
  document.body.appendChild(overlay);

  function showAlert() {
    if (alertVisible) return;
    alertVisible = true;
    overlay.style.display = "block";
    setTimeout(() => {
      overlay.style.opacity = "1";
    }, 10);
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.style.display = "none";
        alertVisible = false;
      }, 300);
    }, 2000);
  }

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
    showAlert();
  });

  document.addEventListener("keydown", function(e) {
    if (
      e.key === "F12" || 
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.keyCode === 73))
    ) {
      e.preventDefault();
      showAlert();
    }
  });
});
