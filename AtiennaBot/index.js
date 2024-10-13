require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const halloween = require('../controllers/trickOrTreatController');
const character = require('../controllers/characterControllers')
const atiennaTreat = {
    treats: require('./atiennaTreats.json'),
    setTreats: function(atiennaTreat) {
        this.treats = atiennaTreat;
    }
};

const atiennaBot = () => {
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
        if (message.content.startsWith('/trickOrTreat Atienna')) {
            const user = message.author.id;

            if (!await halloween.playerExists(user)) {
                message.channel.send("Oh. We should calm down a bit first, don't you think?")
            }
            else {
                if (!await halloween.checkTrickOrTreatCount(user)) {
                    message.channel.send("I wonder if we should stop for today...")
                }
                else {
                    const treat = atiennaTreat.treats[halloween.getRandomTreat()];
                    await halloween.allocateTreat(user, treat);
                    message.channel.send(treat.quote);
                }
            }
        }
        if (message.content.startsWith('/updateAtienna')) {
            const request = message.content.substring(16);
            await character.updateSpecialMessage('Atienna', request);
            message.channel.send("Ah, of course.");
        }

    });

    client.login(process.env.ATIENNA_TOKEN);
}

module.exports = {
    atiennaBot
}