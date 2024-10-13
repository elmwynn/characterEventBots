require('dotenv').config();
const halloween = require('../controllers/trickOrTreatController');
const character = require('../controllers/characterControllers')
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const cron = require('cron');


const halloweenBot = () => {
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
        const name = message.author.username;
        const resetTheCount = new cron.CronJob('00 30 08 * * *', async () => {
            await halloween.resetCounts();
            const channel = client.channels.cache.get('909800517583143062');
            channel.send({ embeds: [halloween.getSimpleEmbed('Counts have been reset!')] });
        });
        resetTheCount.start();
        if (message.author.bot)
            return;
        if (name == 'elmwynn') {
            const channel = client.channels.cache.get('909800517583143062');
            if (message.content.startsWith('/resetCount')) {
                await halloween.resetCounts();
                const channel = client.channels.cache.get('909800517583143062');
                message.channel.send({ embeds: [halloween.getSimpleEmbed('Counts have been reset!')] });
                channel.send({ embeds: [halloween.getSimpleEmbed('Counts have been reset!')] });

            }
            if (message.content.startsWith('/readjust')) {
                await halloween.reAdjust();
                message.channel.send({ embeds: [halloween.getSimpleEmbed('Candies have been readjusted!')] })
            }
            if (message.content.startsWith('/newArrival')) {
                channel.send({ embeds: [halloween.getSimpleEmbed('A special guest has arrived!')] })
            }
        }
        if (message.content.startsWith('/trickOrTreat')) {
            if (!await halloween.playerExists(user)) {
                await halloween.createPlayer(user, name);
                const createPlayerEmbed = halloween.getSimpleEmbed("Trick-or-treater created. Candy bags delegated.")
                message.channel.send({ embeds: [createPlayerEmbed] });
            }
            else {
                const trickOrTreatCount = await halloween.checkTrickOrTreatCount(user);
                const characters = ['Olive', 'Cadence', 'Werner', 'Atienna', 'Maria', 'Jericho'];
                const char = message.content.substring(14);
                if (!characters.includes(char)) {
                    const incorrectCandyGiver = halloween.getSimpleEmbed(`Who is ${char}?`);
                    message.channel.send({ embeds: [incorrectCandyGiver] });
                }
                else if (!await character.checkIfAwake(char)) {
                    message.channel.send({ embeds: [halloween.getSimpleEmbed(`${char} is unavailable!`)] })
                }
                else if (!trickOrTreatCount) {
                    const noMoreCandy = halloween.getSimpleEmbed(`${name}, YOUR DAILY CANDY LIMIT HAS BEEN REACHED. CHECK YOUR BLOOD SUGAR!`);
                    message.channel.send({ embeds: [noMoreCandy] });
                }
                else {
                    await character.sleep(1000);
                    const validReq = await halloween.checkIfValid(user, char);
                    if (validReq || (char == 'Francis' && !client.users.fetch(1162798195542343831).presence)) {
                        message.channel.send({ embeds: [await halloween.getRecievedTreat(user, "given")] });
                        const rankUp = await halloween.checkRanking(user);
                        if (rankUp !== null) {
                            halloween.rankUp(user, rankUp);
                            const rankUpEmbed = halloween.getSimpleEmbed(`${name} has ranked up to ${rankUp.title}!`)
                            message.channel.send({ embeds: [rankUpEmbed] })
                        }
                    }
                    else {
                        message.channel.send({ embeds: [halloween.getSimpleEmbed(`Either ${char} isn't up right now or something went wrong!`)] })
                    }
                }
            }
        }
        else if (message.content.startsWith('/steal')) {
            if (!await halloween.playerExists(user)) {
                await halloween.createPlayer(user, name);
                const createPlayerEmbed = halloween.getSimpleEmbed("Trick-or-treater created. Candy bags delegated.")
                message.channel.send({ embeds: [createPlayerEmbed] });
            }
            const potentialRobbed = message.content.substring(7);
            if (await halloween.checkStealCount(user)) {
                if (name == potentialRobbed) {
                    message.channel.send({ embeds: [halloween.getSimpleEmbed(`YOU CANNOT STEAL FROM YOURSELF!`)] })
                }
                else if (await halloween.isUsernameValid(potentialRobbed)) {
                    const announceSteal = halloween.getSimpleEmbed(`${name} has attempted a steal from ${potentialRobbed}! Dastardly!`)
                    message.channel.send({ embeds: [announceSteal] });
                    if (halloween.isStealSuccessful()) {
                        const takenCandy = await halloween.stealCandy(potentialRobbed);
                        await halloween.removeCandy(potentialRobbed, takenCandy);
                        await character.sleep(1000);
                        await halloween.giveStolenCandy(user, takenCandy);
                        message.channel.send({ embeds: [await halloween.getRecievedTreat(user, potentialRobbed)] })
                        await halloween.decrementSteal(user);
                    }
                    else {
                        await halloween.decrementSteal(user);
                        const stealFail = halloween.getSimpleEmbed(`THE STEAL HAS FAILED!`);
                        message.channel.send({ embeds: [stealFail] });

                    }
                }
                else {
                    const usernameFail = halloween.getSimpleEmbed(`${potentialRobbed} DOES NOT HAVE ANYTHING TO BE TAKEN.`)
                    message.channel.send({ embeds: [usernameFail] });
                }
            }
            else {
                message.channel.send({ embeds: [halloween.getSimpleEmbed(`${name}, YOU HAVE STOLEN TOO MANY TIMES TODAY! NO MORE!`)] })
            }

        }
        else if (message.content.startsWith('/checkPotentialTreats')) {
            const request = message.content.substring(22);
            if (request[0] >= '0' && request[0] <= '9') {
                const number = Number(request);
                const treatList = await halloween.getTreatList(number);
                message.channel.send({ embeds: [treatList] });
            }
        }
        else if (message.content.startsWith('/checkLeaderBoard')) {

            const leaderBoardEmbed = await halloween.getLeaderBoard();
            message.channel.send({ embeds: [leaderBoardEmbed] });
        }
        else if (message.content.startsWith('/checkCandyStats')) {
            if (!await halloween.playerExists(user)) {
                await halloween.createPlayer(user, name);
                const createPlayerEmbed = halloween.getSimpleEmbed("Trick-or-treater created. Candy bags delegated.")
                message.channel.send({ embeds: [createPlayerEmbed] });
            }
            const personalEmbed = await halloween.getMyStats(message.author.id);
            message.channel.send({ embeds: [personalEmbed] });
        }
        else if (message.content.startsWith('/checkTreatBag')) {
            if (!await halloween.playerExists(user)) {
                await halloween.createPlayer(user, name);
                const createPlayerEmbed = halloween.getSimpleEmbed("Trick-or-treater created. Candy bags delegated.")
                message.channel.send({ embeds: [createPlayerEmbed] });
            }
            const request = message.content.substring(15);
            if (request[0] >= '0' && request[0] <= '9') {
                const number = Number(request);
                const personalEmbed = await halloween.lookAtTreatBag(message.author.id, number);
                message.channel.send({ embeds: [personalEmbed] });
            }
        }
        else if (message.content.startsWith('/halloweenRules')) {
            const rulesEmbed = new EmbedBuilder()
                .setColor(0xe67e22)
                .setTitle('Six Chances Halloween Bot!')
                .setDescription('Gather Candies and become the ultimate trick-or-treater!')

                .addFields(
                    { name: 'COMMANDS', value: ' ' },
                    { name: '/trickOrTreat firstName', value: 'You can ask SC characters for candy 3x a day! Resets at 8:30 EST' },
                    { name: '/steal userName', value: 'You have the opportunity to steal the latest candy and points from a fellow trick-or-treater' },
                    { name: '/checkCandyStats', value: 'See a summary of your trick-or-treating' },
                    { name: '/checkTreatBag #', value: 'Rummage through your sugar collection' },
                    { name: '/checkPotentialTreats #', value: 'Check the possible treats you can get!' },
                    { name: 'General Info', value: ' ' },
                    { name: 'Candy', value: 'Each character bot gives out certain candies worth certain points.' },
                    { name: 'Special Visitors', value: 'Special visitors will occasionally visit the server. They give out candies worth a lot of points!' },
                    { name: 'Rank', value: 'Your trick-or-treating rank delegated by the quality and number of candies you\'ve collected' },
                    { name: 'trickOrTreat', value: 'The basic command to ask a character for candy. You can only do this 3x a day, so keep an eye on who you\'re asking!' },
                    { name: 'steal', value: 'Get a 30% chance to steal the last received candy from a trick-or-treater! Are you heartless, enough?' },
                    { name: 'points', value: 'Each candy is worth a certain amount of EXP points that can be used to level up and also be saved for the Gacha Roll' }

                )
            message.channel.send({ embeds: [rulesEmbed] })
        }



    });
    client.login(process.env.HALLOWEEN_TOKEN);
}

module.exports = {
    halloweenBot
}
