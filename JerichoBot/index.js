require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const jerichoTreats = {
    treats: require('./jerichoTreats.json'),
    setTreats: function (jerichoTreats){
        this.treats = jerichoTreats;
    }
};


const jerichoBot = () =>{
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
        const user = message.author.id;
        if(message.author.bot)
            return;
        if(message.content.startsWith('/trickOrTreat Jericho')){
         
            if(!await halloween.playerExists(user)){
                message.channel.send("Hm... Let's get you settled first.")
            }
            else {
                if(!await halloween.checkTrickOrTreatCount(user)){
                    message.channel.send("I think that's enough for today.")
            }
            else{
                const treat = jerichoTreats.treats[halloween.getRandomTreat()];
                await halloween.allocateTreat(user, treat);
                message.channel.send(treat.quote);
            }
        }
        }
        if(message.content.startsWith('/updateJericho')){
            const request = message.content.substring(15);
            await character.updateSpecialMessage('Jericho', request);
            message.channel.send("I'm certainly happy to help.");
        }
        if(message.content.startsWith('/artUpdate')){
            const messageReq = await character.getSpecialMessage('Jericho');
            message.channel.send(messageReq);
        }
    });
    
    client.login(process.env.JERICHO_TOKEN);
}

module.exports = {
    jerichoBot
}
