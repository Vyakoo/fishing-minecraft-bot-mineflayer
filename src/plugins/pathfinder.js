const mineflayerPathfinder = require('mineflayer-pathfinder');
const { Movements } = require('mineflayer-pathfinder').pathfinder;
const minecraftData = require('minecraft-data');

module.exports = (bot) => {
    const mcData = minecraftData(bot.version);
    bot.loadPlugin(mineflayerPathfinder);

    const defaultMovements = new Movements(bot, mcData);

    bot.on('path_update', (r) => {
        const nodesPerTick = (r.visitedNodes * 50) / r.time;
        console.log(`Calculated ${nodesPerTick.toFixed(2)} nodes per tick`);
    });

    bot.on('goal_reached', () => {
        bot.chat('Goal reached!');
    });

    return defaultMovements;
};
