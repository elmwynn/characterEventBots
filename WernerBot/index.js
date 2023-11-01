require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');

const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const wernerTreat = {
    treats: require('./wernerTreats.json'),
    setTreats: function (wernerTreat){
        this.treats = wernerTreat;
    }
};

const wernerBot = () =>{
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
        else if(message.author.username == 'elmwynn'){
            if(message.content.startsWith('/updateWerner')){
                const request = message.content.substring(14);
                await character.updateSpecialMessage('Werner', request);
                message.channel.send('Got it! BDv');
            }
            else if(message.content.startsWith('/create')){
                const request = message.content.substring(8).split(' ');
                const name = await character.createCharacter(request);
                message.channel.send(`${name} has been created! Awesome! The more the merrier!`)
            }
            else if(message.content.startsWith('/sleepWerner')){
                await character.wakeOrSleep(false, "Werner");
                message.channel.send("Okie dokie. Good night! Sleep tight! Don't let the bed bugs bite!")
            }
            else if(message.content.startsWith('/wakeWerner')){
                await character.wakeOrSleep(true, "Werner");
                message.channel.send("Good morning! Do you want me to make you breakfast?");
            }
        }
        if(message.content.startsWith('/trickOrTreat Werner')){
            const user = message.author.id;
            const name = message.author.username;
            message.channel.send('I think... the season\'s over...');
            message.channel.send(`But I'll always have treats for you, ${name}! Here!`);
            message.channel.send({embeds: [halloween.getSimpleEmbed(`${name} received a milk chocolate bar!`)]})
        }
        if(message.content.startsWith('/chapterUpdate')){
            const messageReq = await character.getSpecialMessage('Werner');
            message.channel.send(messageReq);
        }

    });
    
    client.login(process.env.WERNER_TOKEN);

}

module.exports = {
    wernerBot
}
