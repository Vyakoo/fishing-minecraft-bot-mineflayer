const { Movements, goals: { GoalNear, GoalFollow } } = require('mineflayer-pathfinder');

const mcData = require('minecraft-data')(bot.version);

// Go to me
function goToMe(username) {
    try {
        const player = bot.players[username].entity.position;

        bot.pathfinder.setMovements(new Movements(bot, mcData));
        bot.pathfinder.setGoal(new GoalNear(player.x, player.y, player.z, 0), 1);

        bot.chat('Иду на позицию');
    } catch (error) {
        console.log(error);
        bot.chat('error');
    }
}

// Follow me
function followMe(username) {
    try {
        const player = bot.players[username].entity;

        bot.pathfinder.setMovements(new Movements(bot, mcData));
        bot.pathfinder.setGoal(new GoalFollow(player, 1), 1);

        bot.chat('Следую за вами');
    } catch (error) {
        console.log(error);
        bot.chat('error');
    }
}

// Stop walking
function stopWalk() {
    try {
        bot.pathfinder.setGoal(null, 1);
        bot.chat('Стою');
    } catch (error) {
        console.log(error);
        bot.chat('error');
    }
}

module.exports = {
    goToMe,
    followMe,
    stopWalk
};
