require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const character = require('../controllers/characterControllers')


const atiennaBot = () =>{
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
            if(message.content.startsWith('/updateAtienna')){
                const request = message.content.substring(16);
                await character.updateSpecialMessage('Atienna', request);
                message.channel.send("Ah, of course.");
            }
            else if(message.content.startsWith('/sleepAtienna')){
                await character.wakeOrSleep(false, "Atienna");
                message.channel.send("Rest is good. Don't you think?")
            }
            else if(message.content.startsWith('/wakeAtienna')){
                await character.wakeOrSleep(true, "Atienna");
                message.channel.send("It's time to wake from the dream, hm?");
            }

        }
        if(message.content.startsWith('/trickOrTreat Atienna')){
            const user = message.author.id;
            message.channel.send(`Oh dear. Don't you think the season has passed?`)
        }
        
    });
    
    client.login(process.env.ATIENNA_TOKEN);
}

module.exports = {
    atiennaBot
}
