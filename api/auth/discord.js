const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/token', async (req, res) => {
    try {
        const { code } = req.body;

        // Получаем токен от Discord
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI
            })
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
            throw new Error(tokenData.error_description || tokenData.error);
        }

        // Получаем информацию о пользователе
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        const userData = await userResponse.json();

        res.json({
            ...userData,
            access_token: tokenData.access_token
        });
    } catch (error) {
        console.error('Ошибка авторизации:', error);
        res.status(500).json({ message: 'Ошибка авторизации' });
    }
});

module.exports = router; 
