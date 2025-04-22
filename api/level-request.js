const express = require('express');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cors = require('cors');

// Создаем роутер
const router = express.Router();

// ID канала для запросов уровней
const LEVEL_REQUEST_CHANNEL_ID = '1363896964638572685';

// Настройка CORS
const corsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'discord-token'],
    credentials: true,
    maxAge: 86400
};

// Применяем CORS и парсер JSON
router.use(cors(corsOptions));
router.use(express.json());

// Middleware для проверки Discord токена
function verifyDiscordToken(req, res, next) {
    try {
        const token = req.headers['discord-token'];
        if (!token) {
            return res.status(401).json({ error: 'Discord token is required' });
        }
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ error: 'Internal server error during token verification' });
    }
}

// Обработчик GET запроса для проверки работоспособности
router.get('/', (req, res) => {
    try {
        res.json({ status: 'ok', message: 'Level request API is working' });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST обработчик для запросов уровней
router.post('/', verifyDiscordToken, async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        
        const { levelName, levelId, difficulty } = req.body;

        if (!levelName || !levelId || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!global.client) {
            console.error('Discord client is not initialized');
            return res.status(500).json({ error: 'Discord client is not available' });
        }

        const channel = global.client.channels.cache.get(LEVEL_REQUEST_CHANNEL_ID);
        if (!channel) {
            console.error('Channel not found:', LEVEL_REQUEST_CHANNEL_ID);
            return res.status(500).json({ error: 'Discord channel not found' });
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('New Level Request')
            .addFields(
                { name: 'Level Name', value: levelName.toString() },
                { name: 'Level ID', value: levelId.toString() },
                { name: 'Requested Difficulty', value: difficulty.toString() }
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
        console.log('Message sent to Discord successfully');
        
        res.json({ success: true, message: 'Level request sent successfully' });

    } catch (error) {
        console.error('Error processing level request:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router; 
