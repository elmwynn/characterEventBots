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
        if(message.author.username == 'elmwynn'){
            if(message.content.startsWith('/updateJericho')){
                const request = message.content.substring(15);
                await character.updateSpecialMessage('Jericho', request);
                message.channel.send("I'm certainly happy to help.");
            }
            else if(message.content.startsWith('/sleepJericho')){
                await character.wakeOrSleep(false, "Jericho");
                message.channel.send("I understand. Good night.")
            }
            else if(message.content.startsWith('/wakeJericho')){
                await character.wakeOrSleep(true, "Jericho");
                message.channel.send("Another day.");
            }
        }

        else if(message.content.startsWith('/trickOrTreat Jericho')){
            message.channel.send('Since I have no more candy left, how about I give you one of ELPIS\'s informational packets instead? Now the education in that is the real treat.')
        }

        else if(message.content.startsWith('/artUpdate')){
            const messageReq = await character.getSpecialMessage('Jericho');
            message.channel.send(messageReq);
        }
    });
    
    client.login(process.env.JERICHO_TOKEN);
}

module.exports = {
    jerichoBot
}
