const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Discord Bot Setup
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

// ✅ Problem 1 Fix: Cannot GET / (Ebar ekhane success message asbe)
app.get('/', (req, res) => {
    res.send('<h2>✅ SKA HOST Bot is Online and Running on Render!</h2><p>Go to <a href="/api/chat">/api/chat</a> to see live messages.</p>');
});

// ✅ Problem 2 Fix: Advanced Chat API
app.get('/api/chat', async (req, res) => {
    try {
        // Bot ready na hole error dibe
        if (!client.isReady()) {
            return res.status(503).json({ error: "Bot ekhono start hocche. Ektu wait korun." });
        }

        // Apnar channel ID (Video theke dewa)
        const channelId = process.env.CHANNEL_ID || '1472601009854480436'; 
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            return res.status(404).json({ error: "Channel khuje pawa jacche na." });
        }

        // Fetch last 15 messages
        const messages = await channel.messages.fetch({ limit: 15 }); 

        const chatData = messages.map(m => ({
            id: m.id,
            user: m.author ? m.author.username : "Unknown",
            avatar: m.author ? m.author.displayAvatarURL() : "",
            text: m.content || "[Image/Embed/Sticker]",
            time: m.createdAt
        })).reverse(); 

        res.json(chatData);
    } catch (error) {
        console.error("API Error:", error);
        // Ebar ashol error ta browser e dekhabe
        res.status(500).json({ error: "Chat fetch fail: " + error.message });
    }
});

app.listen(port, () => {
    console.log(`Web server running on port ${port}`);
});

// ✅ Token Error Check
if (!process.env.DISCORD_TOKEN) {
    console.error("❌ ERROR: Render-e DISCORD_TOKEN dewa nei!");
} else {
    client.login(process.env.DISCORD_TOKEN).catch(err => {
        console.error("❌ ERROR logging in:", err.message);
    });
}
