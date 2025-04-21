// Добавляем обработчики событий после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы модального окна
    const modal = document.getElementById('downloadModal');
    const downloadBtn = document.querySelector('.download-btn');
    const closeBtn = document.querySelector('.close-btn');
    const discordBtn = document.querySelector('.discord-btn');
    const platformBtns = document.querySelectorAll('.platform-btn');

    // Открытие модального окна
    downloadBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Запрещаем прокрутку страницы
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Разрешаем прокрутку страницы
    });

    // Закрытие при клике вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Обработка кнопок платформ
    platformBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = btn.classList.contains('windows-btn') ? 'Windows' : 'Android';
            
            // Проверяем наличие файла перед загрузкой
            fetch(btn.href)
                .then(response => {
                    if (response.ok) {
                        console.log(`[DOWNLOAD] Starting download for ${platform}`);
                    } else {
                        e.preventDefault();
                        alert(`Download file for ${platform} is not available at the moment. Please try again later.`);
                    }
                })
                .catch(error => {
                    e.preventDefault();
                    console.error(`[ERROR] Failed to check ${platform} download:`, error);
                    alert(`Error checking download availability. Please try again later.`);
                });
        });
    });

    // Обработчик для кнопки Discord
    discordBtn.addEventListener('click', () => {
        window.open('https://discord.gg/F5aubDmgsm', '_blank');
    });

    // Анимация для статистики
    const statNumbers = document.querySelectorAll('.stat-card p');
    statNumbers.forEach(number => {
        const finalNumber = parseInt(number.textContent);
        animateNumber(number, 0, finalNumber, 2000);
    });
});

