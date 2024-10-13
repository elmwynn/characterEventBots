require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const character = require('../controllers/characterControllers');
const halloween = require('../controllers/trickOrTreatController');
const wernerTreat = {
    treats: require('./wernerTreats.json'),
    setTreats: function(wernerTreat) {
        this.treats = wernerTreat;
    }
};

const wernerBot = () => {
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
        if (message.content.startsWith('/trickOrTreat Werner')) {
            const user = message.author.id;
            const name = message.author.username;

            if (!await halloween.playerExists(user)) {
                console.log("triggered")
                message.channel.send("Oh! You don't have a bag yet! No worries! Let me get you one!")
            }
            else {
                if (!await halloween.checkTrickOrTreatCount(user)) {
                    message.channel.send("Here you go-");
                    message.channel.send("Oh wait... I don't think I can give you any more candy today. I'm sorry... 😔")
                }
                else {
                    const treat = wernerTreat.treats[halloween.getRandomTreat()];
                    await halloween.allocateTreat(user, treat);
                    message.channel.send(treat.quote);
                }
            }
        }
        if (message.content.startsWith('/updateWerner')) {
            const request = message.content.substring(14);
            await character.updateSpecialMessage('Werner', request);
            message.channel.send('Got it! BDv');
        }
        if (message.content.startsWith('/chapterUpdate')) {
            const messageReq = await character.getSpecialMessage('Werner');
            message.channel.send(messageReq);
        }
        if (message.content.startsWith('/create')) {
            const request = message.content.substring(8).split(' ');
            const name = await character.createCharacter(request);
            message.channel.send(`${name} has been created! Awesome! The more the merrier!`)
        }
        if (message.content.startsWith('/steal')) {
            message.channel.send("Hey... That's not very nice...");
        }
    });

    client.login(process.env.WERNER_TOKEN);

}

module.exports = {
    wernerBot
}