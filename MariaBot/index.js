require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder} = require('discord.js');
const mongoose = require('mongoose');
const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const connectDB = require('../config/dbConn');
const mariaTreat = {
    treats: require('./mariaTreats.json'),
    setTreats: function (mariaTreat){
        this.treats = mariaTreat;
    }
};

const mariaBot = () =>{
    //connectDB.connectDB();
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
            if(message.content.startsWith('/updateMaria')){
                const request = message.content.substring(13);
                await character.updateSpecialMessage('Maria', request);
                message.channel.send('Ay! You are the captain now, yes? All clear!');
            }
            else if(message.content.startsWith('/sleepMaria')){
                await character.wakeOrSleep(false, "Maria");
                message.channel.send("Good night to you too!")
            }
            else if(message.content.startsWith('/wakeMaria')){
                await character.wakeOrSleep(true, "Maria");
                message.channel.send("Good morning!");
            }
        }
        if(message.content.startsWith('/trickOrTreat Maria')){
            const user = message.author.id;
            message.channel.send("Ay! It looks like all of the candy has been pillaged! Next time, yes?")
        }
    });
    
    client.login(process.env.MARIA_TOKEN);
}

module.exports = {
    mariaBot
}
