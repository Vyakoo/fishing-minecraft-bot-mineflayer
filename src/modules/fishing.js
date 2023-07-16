const bot = require('mineflayer');

let nowFishing = false;

function onCollect(player, entity) {
    if (entity.metadata[8] && player === bot.entity) {
        bot.removeListener('playerCollect', onCollect);
        fishing();
    }
}

async function startFishing() {
    const water = bot.findBlocks({
        matching: mcData.blocksByName.water.id,
        maxDistance: 64,
        count: 1,
    });

    if (!water) {
        bot.chat('Я не могу найти воду');
        return;
    }

    const waterPos = bot.blockAt(water[0]);
    const waterAt = bot.blockAt(waterPos.position.offset(0, 1.5, 0));

    bot.pathfinder.setMovements(new Movements(bot, mcData));
    bot.pathfinder.setGoal(new GoalNear(waterPos.position.x, waterPos.position.y, waterPos.position.z, 2));

    bot.chat('starting fishing');

    bot.once('goal_reached', async () => {
        await bot.lookAt(waterAt.position, false);
        fishing();
    });
}

function stopFishing() {
    bot.removeListener('playerCollect', onCollect);
    bot.chat('Я больше не рыбачу');
    if (nowFishing) {
        bot.activateItem();
    }
}

async function fishing() {
    try {
        await bot.equip(bot.inventory.items().find((item) => item.name.includes('rod')), 'hand');
    } catch (error) {
        bot.chat('Я не могу найти удочку');
        console.log(error);
    }

    nowFishing = true;
    bot.on('playerCollect', onCollect);

    try {
        await bot.fish();
    } catch (error) {
        bot.chat('error fishing');
        console.log(error);
    }

    nowFishing = false;
}

module.exports = {
    startFishing,
    stopFishing,
    fishing
};
