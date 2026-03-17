const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// ✅ Render.com er jonno Dummy Web Server (Jate bot bondho na hoy)
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('SKA HOST Bot is Online and Running on Render!');
});

app.listen(port, () => {
    console.log(`Web server is listening on port ${port}`);
});

// ✅ Discord Bot Logic
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
    // Bot er status set kora
    client.user.setActivity('SKA HOST DASHBOARD', { type: 3 }); // 3 = Watching
});

// Chotto ekta test command
client.on('messageCreate', message => {
    if (message.author.bot) return; // Nijekei reply korbe na
    
    if (message.content === '!ping') {
        message.reply('🏓 Pong! Bot is working perfectly!');
    }
});

// Bot token diye login kora (Token ta asbe Render er Environment Variable theke)
client.login(process.env.DISCORD_TOKEN);

