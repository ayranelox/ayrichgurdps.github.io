const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, GatewayIntentBits } = require('discord.js');

// ID канала для запросов уровней
const LEVEL_REQUEST_CHANNEL_ID = '1363896964638572685';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Инициализация Discord клиента
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

let isClientReady = false;

client.once('ready', () => {
    console.log('Discord bot is ready!');
    isClientReady = true;
});

// Подключаем бота
client.login(DISCORD_TOKEN).catch(console.error);

// Vercel API handler
module.exports = async (req, res) => {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://gdps.ayrich.fun');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, discord-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');

    // Обработка preflight запроса
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

        // Проверка готовности Discord клиента
        if (!isClientReady) {
            return res.status(503).json({ error: 'Discord service is not ready' });
        }

        const { levelName, levelId, difficulty } = req.body;

        if (!levelName || !levelId || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const channel = client.channels.cache.get(LEVEL_REQUEST_CHANNEL_ID);
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
}; 
