require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const oliveTreat = {
    treats: require('./oliveTreats.json'),
    setTreats: function (oliveTreat){
        this.treats = oliveTreat;
    }
};

const oliveBot = () =>{
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
        if(message.author.username == 'elmwynn'){
            if(message.content.startsWith('/updateOlive')){
                const request = message.content.substring(13);
                await character.updateSpecialMessage('Olive', request);
                message.channel.send("That's a tall ask, but I got you.");
            }
            else if(message.content.startsWith('/sleepOlive')){
                await character.wakeOrSleep(false, "Olive");
                message.channel.send("Night.")
            }
            else if(message.content.startsWith('/wakeOlive')){
                await character.wakeOrSleep(true, "Olive");
                message.channel.send("Can't I get a few more minutes?");
            }
        }
    
        if(message.content.startsWith('/trickOrTreat Olive')){
            const user = message.author.id;
            message.channel.send('Pfft.')
        }
        else if(message.content.startsWith('/math')){
            const messageReq = await character.getSpecialMessage('Olive');
            message.channel.send(messageReq);
        }
    });
    
    client.login(process.env.OLIVE_TOKEN);
}

module.exports = {
    oliveBot
}
