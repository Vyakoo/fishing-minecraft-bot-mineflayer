const mineflayer = require('mineflayer');
const {pathfinder, Movements, goals : {GoalNear, GoalFollow}} = require('mineflayer-pathfinder');


const bot = mineflayer.createBot({
    host: '127.0.0.1', //localhost or 127.0.0.1 
    port: 5000,
    username: 'bot',
 });


bot.loadPlugin(pathfinder);

let mcData

let nowFishing = false;

bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version);
});

bot.on('chat', (username, message) => {
    const msg = message.toLowerCase().split('-');

    if (username == 'bot') return

    switch (msg[0]){

        /*
        this code adds a standard movement by type: to me, follow me, stop
        данный код добавляет стандартное передвижение по типу: ко мне, за мной, стой
        case 'come':
            goToMe(username);
            break
        
        case 'follow me':
            followMe(username);
            break
        
        case 'stop':
            stopWolk();
            break
        */

        case 'start fishing':
            startFishing();
            break

        case 'stop fishing':
            stopFishing();
            break
    
    }
});


/*
this code adds a standard movement by type: to me, follow me, stop
данный код добавляет стандартное передвижение по типу: ко мне, за мной, стой

//Ко мне
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


//Следуй за мной
function followMe(username) {
    try {
        const player = bot.players[username].entity

        bot.pathfinder.setMovements(new Movements(bot, mcData));
        bot.pathfinder.setGoal(new GoalFollow(player, 1), 1);

        bot.chat('Следую за вами');   
    } catch (error) {
        console.log(error);
        bot.chat('error');
    }
}


//Стоп
function stopWolk() {
    try {
        bot.pathfinder.setGoal(null, 1);
        bot.chat('Стою');
    } catch (error) {
        console.log(error);
        bot.chat('error');
    }
}
*/

//Рыбалка
function onCollect (player, entity) {
    if (entity.metadata[8] && player === bot.entity) {
      bot.removeListener('playerCollect', onCollect);
      fishing();
    }
}
  
async function fishing() {
    try {
        await bot.equip(bot.registry.itemsByName.fishing_rod.id, 'hand')
      } catch (err) {
        return bot.chat(err.message)
      }
    
      nowFishing = true
    
      try {
        await bot.fish();
        bot.on('playerCollect', onCollect);
      } catch (err) {
        bot.chat(err.message)
      }
      nowFishing = false
    
}

async function startFishing() {
    const water = bot.findBlocks({
        matching: mcData.blocksByName.water.id,
        maxDistance: 100,
        count: 1
      });

    if (!water) {
        bot.chat('Я не могу найти воду');
        return
    }

    const waterPos = bot.blockAt(water[0]);
    const waterAt = bot.blockAt(waterPos.position.offset(0, 1, 0));


    bot.pathfinder.setMovements(new Movements(bot, mcData));
    bot.pathfinder.setGoal(new GoalNear(waterPos.position.x, waterPos.position.y, waterPos.position.z, 2));

    

    bot.once('goal_reached', async () => {
        await bot.lookAt(waterAt.position, false);
        bot.chat('starting fishing');
        fishing();
      });
}
  


function stopFishing() {
    try {
        bot.removeListener('payerCollect', onColllect);
    } catch (error) {
        console.log('Dont listen')
    }
    bot.chat('Я больше не рыбачу')
    if (nowFishing) {
        bot.activateItem();
    }
}


bot.on('kicked', console.log)
bot.on('error', console.log)
