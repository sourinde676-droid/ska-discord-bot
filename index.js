const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // ✅ Apnar website theke data anar permission
app.use(express.json());

const port = process.env.PORT || 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
    client.user.setActivity('SKA HOST DASHBOARD', { type: 3 });
});

// ✅ Custom API: Website er jonno live chat pathano
app.get('/api/chat', async (req, res) => {
    try {
        // Ekhane 1472601009854480436 holo apnar chat channel er ID
        const channelId = process.env.CHANNEL_ID || '1472601009854480436'; 
        const channel = await client.channels.fetch(channelId);
        
        // Last 15 ta message nibe
        const messages = await channel.messages.fetch({ limit: 15 }); 

        const chatData = messages.map(m => ({
            id: m.id,
            user: m.author.username,
            avatar: m.author.displayAvatarURL(),
            text: m.content,
            time: m.createdAt
        })).reverse(); // Purono theke notun order e sajano

        res.json(chatData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Chat fetch korte fail hoyeche." });
    }
});

app.listen(port, () => {
    console.log(`Web server running on port ${port}`);
});

client.login(process.env.DISCORD_TOKEN);
