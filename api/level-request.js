const express = require('express');
const router = express.Router();
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

// Middleware для проверки Discord токена
const verifyDiscordToken = (req, res, next) => {
    const token = req.headers['discord-token'];
    if (!token) {
        return res.status(401).json({ error: 'Discord token is required' });
    }
    next();
};

// POST обработчик для запросов уровней
router.post('/', verifyDiscordToken, async (req, res) => {
    try {
        const { levelName, levelId, difficulty } = req.body;

        if (!levelName || !levelId || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const channel = global.client.channels.cache.get(config.levelRequestChannel);
        if (!channel) {
            return res.status(500).json({ error: 'Channel not found' });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('New Level Request')
            .addFields(
                { name: 'Level Name', value: levelName },
                { name: 'Level ID', value: levelId },
                { name: 'Requested Difficulty', value: difficulty }
            )
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('accept')
                    .setLabel('Accept')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('reject')
                    .setLabel('Reject')
                    .setStyle(ButtonStyle.Danger)
            );

        await channel.send({ embeds: [embed], components: [row] });
        res.json({ success: true });

    } catch (error) {
        console.error('Error processing level request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 
