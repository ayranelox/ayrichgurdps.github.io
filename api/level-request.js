const express = require('express');
const router = express.Router();

// ID кfанала для запросов уровней
const LEVEL_REQUEST_CHANNEL_ID = '1363896964638572685';

// Обработчик POST запроса
router.post('/', async (req, res) => {
    console.log('[Level Request] Получен новый запрос:', req.body);
    
    try {
        const { levelName, levelId, difficulty } = req.body;

        // Проверяем наличие всех необходимых полей
        if (!levelName || !levelId || !difficulty) {
            console.log('[Level Request] Отсутствуют обязательные поля');
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('[Level Request] Проверяем клиент Discord...');
        if (!global.client) {
            console.log('[Level Request] Клиент Discord не найден!');
            return res.status(500).json({ error: 'Discord client not initialized' });
        }

        // Получаем канал для отправки
        console.log('[Level Request] Получаем канал:', LEVEL_REQUEST_CHANNEL_ID);
        const channel = global.client.channels.cache.get(LEVEL_REQUEST_CHANNEL_ID);
        
        if (!channel) {
            console.log('[Level Request] Канал не найден!');
            return res.status(500).json({ error: 'Discord channel not found' });
        }

        console.log('[Level Request] Отправляем сообщение в канал...');
        // Отправляем сообщение
        await channel.send({
            embeds: [{
                color: 0x5865F2,
                title: 'NEW LEVEL REQUEST',
                fields: [
                    { name: 'Level name', value: levelName, inline: true },
                    { name: 'Level ID', value: levelId, inline: true },
                    { name: 'Requested difficulty', value: difficulty, inline: true }
                ],
                timestamp: new Date()
            }]
        });

        console.log('[Level Request] Сообщение успешно отправлено');
        res.json({ success: true, message: 'Request sent successfully' });
    } catch (error) {
        console.error('[Level Request] Ошибка:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
});

module.exports = router; 
