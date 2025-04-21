const express = require('express');
const router = express.Router();
const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const REQUESTS_CHANNEL_ID = ''; // ID канала для запросов
const MOD_ROLE_ID = ''; // ID роли модераторов

// Middleware для проверки токена Discord
const verifyDiscordToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Проверяем токен через Discord API
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const userData = await response.json();
        req.user = userData;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/', verifyDiscordToken, async (req, res) => {
    try {
        const { name, id, difficulty, user, channelId } = req.body;
        
        // Проверяем авторизацию
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' });
        }

        // Создаем сообщение для отправки
        const message = {
            embeds: [{
                title: '🎮 Новый запрос уровня!',
                color: 0x5865F2,
                fields: [
                    {
                        name: '📝 Название',
                        value: name,
                        inline: true
                    },
                    {
                        name: '🔢 ID уровня',
                        value: id,
                        inline: true
                    },
                    {
                        name: '⭐ Сложность',
                        value: difficulty,
                        inline: true
                    }
                ],
                author: {
                    name: user.username,
                    icon_url: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'
                },
                timestamp: new Date().toISOString()
            }]
        };

        // Получаем канал и отправляем сообщение
        const channel = await global.client.channels.fetch(channelId);
        await channel.send(message);

        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router; 
