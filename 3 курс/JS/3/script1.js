const lights = document.querySelectorAll('.light');
const button = document.getElementById('nextButton');

let activeIndex = 0; // Индекс активного света

function changeLight() {
    // Убираем активный класс у всех
    lights.forEach(light => light.classList.remove('active'));

    // Включаем нужный свет
    lights[activeIndex].classList.add('active');

    // Меняем индекс по кругу (0 → 1 → 2 → 0)
    activeIndex = (activeIndex + 1) % lights.length;
}

// Запускаем светофор при клике
button.addEventListener('click', changeLight);

// Включаем красный при загрузке
    
