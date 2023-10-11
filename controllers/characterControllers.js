const sleep = async(ms) => await new Promise (r=> setTimeout(r, ms));
const Character = require('../models/Character');

const createCharacter = async(array)=> {
    await Character.create({
        characterId: Number(array[0]),
        characterName: array[1],
        
    })
    return array[1];
}

/*const addNewMessages = async(name, object) => {
    await Character.findOneAndUpdate(
        {characterName: name},
        //find character by name
        {
            $push: {characterQuotes: object},
        },
    );

}


const getMessage = async(Name, command)=>{
    const result = await HalloweenPlayer.find({
        playerId: userID
    });
}*/



const updateSpecialMessage = async(name, message) => {
    await Character.findOneAndUpdate(
        {characterName: name},
        //find character by name
        {
            $set: {specialQuote: message},
        },
    );
}

const getSpecialMessage = async(name) => {
    const result = await Character.find({
        characterName: name
    });
    return result[0].specialQuote;
}

module.exports = {
    sleep,
    createCharacter,
    updateSpecialMessage,
    getSpecialMessage
}