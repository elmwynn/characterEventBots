require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const keep_alive = require('./keep_alive.js');
const character = require('./controllers/characterControllers');
const oliveBotFunc = require('./OliveBot/index');
const cadenceBotFunc = require('./CadenceBot/index');
const wernerBotFunc = require('./WernerBot/index');
const mariaBotFunc = require('./MariaBot/index');
const atiennaBotFunc = require('./AtiennaBot/index');
const jerichoBotFunc = require('./JerichoBot/index');

//const halloweenBotFunc = require('./HalloweenBot/index')
const connectDB = require('./config/dbConn');

connectDB.connectDB();

oliveBotFunc.oliveBot();
cadenceBotFunc.cadenceBot();
wernerBotFunc.wernerBot();
mariaBotFunc.mariaBot();
atiennaBotFunc.atiennaBot();
jerichoBotFunc.jerichoBot();

<<<<<<< HEAD
halloweenBotFunc.halloweenBot();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
=======
mongoose.connection.once('open',() => {
    console.log('Connected to MongoDB');
>>>>>>> c415df89f3944c6cf340acbaafcd185137b104c7
});