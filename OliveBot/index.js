require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const oliveTreat = {
    treats: require('./oliveTreats.json'),
    setTreats: function(oliveTreat) {
        this.treats = oliveTreat;
    }
};

const oliveBot = () => {
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
        if (message.content.startsWith('/trickOrTreat Olive')) {
            const user = message.author.id;

            if (!await halloween.playerExists(user)) {
                message.channel.send("Pfft. You don't look prepared yet. No offense.")
            }
            else {
                if (!await halloween.checkTrickOrTreatCount(user)) {
                    message.channel.send("The rules say only 3 a day but... meet me at 12:30 tonight and I'll see what I can do.");
                    message.channel.send("Of course I'm joking! I'm not going to break the rules for candy. For something else, on the other hand...")
                }
                else {
                    const treat = oliveTreat.treats[halloween.getRandomTreat()];
                    await halloween.allocateTreat(user, treat);
                    message.channel.send(treat.quote);
                }
            }
        }
        if (message.content.startsWith('/updateOlive')) {
            const request = message.content.substring(13);
            await character.updateSpecialMessage('Olive', request);
            message.channel.send("That's a tall ask, but I got you.");
        }
        if (message.content.startsWith('/math')) {
            const messageReq = await character.getSpecialMessage('Olive');
            message.channel.send(messageReq);
        }
    });

    client.login(process.env.OLIVE_TOKEN);
}

module.exports = {
    oliveBot
}