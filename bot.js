require('dotenv').config();
const { ChatClient } = require('twitch-chat-client');
const ws = require('ws');

const wss = new ws.Server({ port: 3030 });

wss.on('connection', conn => {
    conn.on('message', message => {
        console.log('received: %s', message);
    });

    conn.send('fireworks');
});

const chatClient = ChatClient.anonymous({ channels: ['wmhilton'] });

// listen to more events...
chatClient.connect().then(() => {
    chatClient.onMessage(async (channel, user, message, msg) => {
        console.log(channel, user, message, msg);
        if (message === '!fireworks') {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('fireworks');
                }
            });
        }
    });
})
