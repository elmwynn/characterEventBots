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
        if(message.author.username == 'elmwynn'){
            if(message.content.startsWith('/updateCadence')){
                const request = message.content.substring(15);
                await character.updateSpecialMessage('Cadence', request);
                message.channel.send('All clear, dear.');
            }
            else if(message.content.startsWith('/sleepCadence')){
                await character.wakeOrSleep(false, "Cadence");
                message.channel.send("Let's all take a break, shall we?")
            }
            else if(message.content.startsWith('/wakeCadence')){
                await character.wakeOrSleep(true, "Cadence");
                message.channel.send("Good morning, dear.");
            }
        }
        else if(message.content.startsWith('/trickOrTreat Cadence')){
           message.channel.send("Oh, honey, I don't have anymore candy for you...")
        }
        
        else if(message.content.startsWith('/musicRec')){
            const messageReq = await character.getSpecialMessage('Cadence');
            message.channel.send(messageReq);
        }

    });
    
    client.login(process.env.CADENCE_TOKEN);
}

module.exports = {
    cadenceBot
}
