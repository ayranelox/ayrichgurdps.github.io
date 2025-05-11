// Получаем элементы DOM
const modal = document.getElementById('downloadModal');
const downloadBtn = document.getElementById('downloadBtn');
const closeBtn = document.getElementById('closeModal');

// Показываем модальное окно при клике на кнопку Download
downloadBtn.onclick = function() {
    modal.style.display = 'flex';
    // Сброс анимации
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'none';
    // Триггер перерисовки
    void modalContent.offsetWidth;
    modalContent.style.animation = '';
}

// Закрываем модальное окно при клике на X
closeBtn.onclick = function() {
    modal.style.display = 'none';
}

// Закрываем модальное окно при клике вне его
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Функция для скачивания в зависимости от платформы
function downloadForPlatform(platform) {
    const files = {
        'windows': 'assets/Cubi GDPS.zip',
        'android': 'assets/Cubi GDPS.apk'
    };

    if (files[platform]) {
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.href = files[platform];
        link.download = files[platform].split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Закрываем модальное окно
        modal.style.display = 'none';
    }
} 
