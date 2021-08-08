require('dotenv').config();
const { ChatClient } = require('twitch-chat-client');
const ws = require('ws');

const wss = new ws.Server({ port: 3030 });

const broadcast = (cmd, payload) => {
    wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(payload ? cmd + '\n' + payload : cmd);
        }
    });
}

wss.on('connection', conn => {
    conn.on('message', message => {
        console.log('received: %s', message);
    });

    broadcast('fireworks');
});

const chatClient = ChatClient.anonymous({ channels: ['wmhilton'] });

// listen to more events...
chatClient.connect().then(() => {
    chatClient.onMessage(async (channel, user, message, msg) => {
        console.log(channel, user, message, msg);
        if (message === '!fireworks') {
            broadcast('fireworks')
        }
    });
})
