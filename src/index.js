const mineflayer = require('mineflayer');
const botActions = require('./modules/botActions');
const fishing = require('./modules/fishing');
const movement = require('./modules/movement');
const pathfinderPlugin = require('./plugins/pathfinder');

const bot = mineflayer.createBot({
    host: '127.0.0.1',
    port: 5000,
    username: 'bot',
});

const movements = pathfinderPlugin(bot);

bot.on('spawn', () => {
    console.log('Bot spawned!');
});

bot.on('chat', (username, message) => {
    if (username === 'bot') return;

    const msg = message.toLowerCase().split('-');

    switch (msg[0]) {
        case 'start fishing':
            fishing.startFishing(bot, movements);
            break;

        case 'stop fishing':
            fishing.stopFishing(bot);
            break;

        case 'come':
            movement.goToMe(bot, username, movements);
            break;

        case 'follow me':
            movement.followMe(bot, username, movements);
            break;

        case 'stop':
            movement.stopWalk(bot, movements);
            break;
    }
});

bot.on('kicked', (reason, loggedIn) => {
    if (loggedIn) {
        console.log('Bot was kicked from the server:', reason);
    } else {
        console.log('Bot cannot log in:', reason);
    }
    // Perform additional actions if needed
});

bot.on('error', (err) => {
    console.log('An error occurred:', err);
});
