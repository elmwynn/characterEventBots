require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const connectDB = require('../config/dbConn');
const mariaTreat = {
    treats: require('./mariaTreats.json'),
    setTreats: function(mariaTreat) {
        this.treats = mariaTreat;
    }
};

const mariaBot = () => {
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
        if (message.author.bot)
            return;
        if (message.content.startsWith('/trickOrTreat Maria')) {
            try {
                const user = message.author.id;
                if (!await halloween.playerExists(user)) {
                    message.channel.send("Ay! Dear! Let's get you settled first, yes?")
                }
                else {
                    if (!await halloween.checkTrickOrTreatCount(user)) {
                        message.channel.send("Let us stop for today, yes? Restraint makes things more enjoyable, no?");
                    }
                    else {
                        const treat = mariaTreat.treats[halloween.getRandomTreat()];
                        await halloween.allocateTreat(user, treat);
                        message.channel.send(treat.quote);
                    }
                }
            } catch (e) {
                message.channel.send(e);
            }

        }
        if (message.content.startsWith('/updateMaria')) {
            const request = message.content.substring(13);
            await character.updateSpecialMessage('Maria', request);
            message.channel.send('Ay! You are the captain now, yes? All clear!');
        }
    });

    client.login(process.env.MARIA_TOKEN);
}

module.exports = {
    mariaBot
}