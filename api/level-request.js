const { EmbedBuilder } = require('discord.js');

// ID канала для запросов уровней
const LEVEL_REQUEST_CHANNEL_ID = '1363896964638572685';

// Vercel API handler
module.exports = async (req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'https://gdps.ayrich.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,discord-token');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Обработка OPTIONS запроса
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Проверка метода
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Проверка токена
        const token = req.headers['discord-token'];
        if (!token) {
            return res.status(401).json({ error: 'Discord token is required' });
        }

        // Получаем данные из тела запроса
        const { levelName, levelId, difficulty } = req.body;

        // Проверяем наличие всех необходимых полей
        if (!levelName || !levelId || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Получаем информацию о пользователе из Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Invalid Discord token' });
        }

        const userData = await userResponse.json();

        // Создаем эмбед для Discord
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('Новый запрос уровня')
            .addFields(
                { name: 'Level name', value: levelName, inline: true },
                { name: 'ID', value: levelId, inline: true },
                { name: 'Req diff', value: difficulty, inline: true },
                { name: 'Sender', value: `${userData.username} (${userData.id})` }
            )
            .setTimestamp();

        // Получаем канал для отправки
        const channel = await global.client.channels.cache.get(LEVEL_REQUEST_CHANNEL_ID);
        if (!channel) {
            return res.status(500).json({ error: 'Discord channel not found' });
        }

        // Отправляем сообщение
        await channel.send({ embeds: [embed] });

        // Отправляем успешный ответ
        res.status(200).json({ 
            success: true, 
            message: 'Level request sent successfully' 
        });

    } catch (error) {
        console.error('Error processing level request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}; 
