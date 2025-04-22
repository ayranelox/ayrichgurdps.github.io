const express = require('express');
const router = express.Router();
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

const REQUESTS_CHANNEL_ID = '1363896964638572685'; // ID канала для запросов
const MOD_ROLE_ID = '1363525627055177851'; // ID роли модераторов

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
        const { name, id, difficulty } = req.body;
        const user = req.user;

        if (!name || !id || !difficulty) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const embed = new EmbedBuilder()
            .setTitle('🎮 Новый запрос уровня!')
            .setColor(0x5865F2)
            .addFields(
                { name: '📝 Название', value: name, inline: true },
                { name: '🔢 ID уровня', value: id, inline: true },
                { name: '⭐ Сложность', value: difficulty, inline: true }
            )
            .setAuthor({
                name: user.username,
                iconURL: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png'
            })
            .setTimestamp();

        // Создаем кнопки
        const acceptButton = new ButtonBuilder()
            .setCustomId(`accept_${id}`)
            .setLabel('Принять')
            .setStyle(ButtonStyle.Success);

        const rejectButton = new ButtonBuilder()
            .setCustomId(`reject_${id}`)
            .setLabel('Отклонить')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(acceptButton, rejectButton);

        // Получаем канал и отправляем сообщение
        const channel = await global.client.channels.fetch('1363896964638572685');
        await channel.send({
            embeds: [embed],
            components: [row]
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка при обработке запроса:', error);
        res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
});

module.exports = router; 
