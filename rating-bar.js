// Конфигурация для разных систем рейтинга
const ratingConfigs = {
    'Star Rate': {
        layout: 85,
        decorations: 20,
        gameplay: 50,
        effects: 20,
        impressions: 25,
        time: '30+ seconds',
        description: 'Browse the star rating system and its requirements'
    },
    'Featured Rate': {
        layout: 60,
        decorations: 55,
        gameplay: 70,
        effects: 45,
        impressions: 40,
        time: '45+ seconds',
        description: 'Browse the featured rating system and its requirements'
    },
    'Epic Rate': {
        layout: 45,
        decorations: 70,
        gameplay: 85,
        effects: 85,
        impressions: 90,
        time: '60+ seconds',
        description: 'Browse the epic rating system and its requirements'
    },
    'Legendary Rate': {
        layout: 20,
        decorations: 90,
        gameplay: 95,
        effects: 90,
        impressions: 95,
        time: '60+ seconds',
        description: 'Browse the legendary rating system and its requirements'
    },
    'Mythic Rate': {
        layout: 5,
        decorations: 95,
        gameplay: 98,
        effects: 95,
        impressions: 98,
        time: '60+ seconds',
        description: 'Browse the mythic rating system and its requirements'
    },
    'Reupload Rate': {
        layout: NaN,
        decorations: NaN,
        gameplay: NaN,
        effects: NaN,
        impressions: NaN,
        time: '60+ seconds',
        description: 'If you reupload a level from official Geometry Dash, you will get starrate and this level will unrate in few days or weeks!'
    }
};

// Функция для обновления значений в реальном времени
function updateRatingValue(system, parameter, value) {
    if (ratingConfigs[system] && typeof value === 'number') {
        ratingConfigs[system][parameter] = value;
        
        // Если это текущая активная система, обновляем отображение
        const ratingSystem = window.ratingSystem;
        if (ratingSystem && ratingSystem.currentSystem === system) {
            const progressBar = ratingSystem.progressBars[parameter];
            if (progressBar) {
                progressBar.fill.style.width = `${value}%`;
                progressBar.text.textContent = `${value}%`;
            }
        }
    }
}

class RatingSystem {
    constructor() {
        this.progressBars = {};
        this.currentSystem = 'Star Rate';
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        // Находим все прогресс бары
        const progressItems = document.querySelectorAll('.progress-item');
        progressItems.forEach(item => {
            const label = item.querySelector('.progress-label').textContent.split(' ')[0].toLowerCase();
            this.progressBars[label] = {
                fill: item.querySelector('.progress-fill'),
                text: item.querySelector('.progress-text')
            };
        });

        // Заголовок и описание
        this.title = document.querySelector('.rating-container h1');
        this.description = document.querySelector('.description');

        // Обработчик кнопки закрытия
        document.querySelector('.close-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Обработчики для навигационных ссылок
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    window.location.href = href;
                }
            });
        });

        // Инициализируем начальное состояние
        this.updateRatingSystem(this.currentSystem);
    }

    initializeEventListeners() {
        // Обработчики для кнопок навигации
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const systemName = button.textContent.trim();
                this.updateRatingSystem(systemName);
            });
        });

        // Обработчики для стрелок
        const leftArrow = document.querySelector('.arrow.left');
        const rightArrow = document.querySelector('.arrow.right');

        leftArrow.addEventListener('click', () => this.navigateRating('prev'));
        rightArrow.addEventListener('click', () => this.navigateRating('next'));

        // Обработчик клавиш
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.navigateRating('prev');
            } else if (e.key === 'ArrowRight') {
                this.navigateRating('next');
            }
        });
    }

    updateRatingSystem(systemName) {
        if (!ratingConfigs[systemName]) return;

        this.currentSystem = systemName;
        const config = ratingConfigs[systemName];

        // Обновляем заголовок и описание
        this.title.textContent = systemName + ' System';
        this.description.textContent = config.description;

        // Обновляем все прогресс бары с анимацией
        Object.entries(this.progressBars).forEach(([key, elements]) => {
            const newValue = config[key];
            if (newValue !== undefined) {
                if (typeof newValue === 'number') {
                    elements.fill.style.width = `${newValue}%`;
                    elements.text.textContent = `${newValue}%`;
                } else {
                    elements.fill.style.width = '100%';
                    elements.text.textContent = newValue;
                }
            }
        });

        // Обновляем активную кнопку
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.textContent.trim() === systemName);
        });
    }

    navigateRating(direction) {
        const systems = Object.keys(ratingConfigs);
        let currentIndex = systems.indexOf(this.currentSystem);
        
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % systems.length;
        } else {
            currentIndex = currentIndex <= 0 ? systems.length - 1 : currentIndex - 1;
        }

        this.updateRatingSystem(systems[currentIndex]);
        
        // Прокручиваем к активной кнопке
        const activeButton = document.querySelector('.nav-button.active');
        if (activeButton) {
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }
}

// Инициализация системы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.ratingSystem = new RatingSystem();
});

// Экспортируем функцию обновления для использования извне
window.updateRatingValue = updateRatingValue; 