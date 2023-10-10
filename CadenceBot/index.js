require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const halloween = require('../controllers/trickOrTreatController');
const character = require('../controllers/characterControllers')
const cadenceTreat = {
    treats: require('./cadenceTreats.json'),
    setTreats: function (cadenceTreat){
        this.treats = cadenceTreat;
    }
};

const cadenceBot = () =>{
    const client = new Client({
        intents: [
           GatewayIntentBits.Guilds, 
           GatewayIntentBits.GuildMessages,
           GatewayIntentBits.MessageContent
       ] 
    });
    client.on('ready', () => {
        //inform of successful ready connection
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.on('messageCreate', async (message) => { 
        if(message.author.bot)
            return;
        if(message.content.startsWith('/trickOrTreat Cadence')){
            const user = message.author.id;
            const name = message.author.username;
        
            if(!await halloween.playerExists(user)){
                message.channel.send("Oh, honey... You don't even have a bag yet. Here. Let me help you with that. I have a couple fashionable bags you can choose from.")
            }
            else {
                if(!await halloween.checkTrickOrTreatCount(user)){
                    message.channel.send("I think you've had enough, dear.")
            }
            else{
                const treat = cadenceTreat.treats[halloween.getRandomTreat()];
                await halloween.allocateTreat(user, treat);
                message.channel.send(treat.quote);
            }
        }
        }
        if(message.content.startsWith('/updateCadence')){
            const request = message.content.substring(15);
            await character.updateSpecialMessage('Cadence', request);
            message.channel.send('All clear, dear.');
        }
        if(message.content.startsWith('/musicRec')){
            const messageReq = await character.getSpecialMessage('Cadence');
            message.channel.send(messageReq);
        }

    });
    
    client.login(process.env.CADENCE_TOKEN);
}

module.exports = {
    cadenceBot
}
