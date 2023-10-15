const HalloweenPlayer = require("../models/Halloweenplayer");
const {EmbedBuilder} = require('discord.js');
const rankData = {
    ranks: require('../HalloweenBot/ranking.json'),
    setRanking: function (rankData){
        this.ranks = rankData;
    }
};



const playerExists = async (userID) => {
    const result = await HalloweenPlayer.find({
        //search database for player
        playerId: userID
    })
    if(result.length === 0)
    //create player if they do not exist
        return false;
    return true;
}

const createPlayer = async (userID, userName) => {
    await HalloweenPlayer.create({
        playerId: userID,
        username: userName,
        title: rankData.ranks[0].title,
        rankNumber: rankData.ranks[0].rank
    
    })
}

const getRandomTreat = () =>{
    const randomTreat = Math.floor(Math.random()*101);
    let chosenTreat = 0;
    if(randomTreat <= 39)
        chosenTreat = 0; 
    else if(randomTreat <= 64)
        chosenTreat = 1; 
    else if(randomTreat <=84)
        chosenTreat = 2; 
    else if(randomTreat <= 94)
        chosenTreat = 3; 
    else if(randomTreat <= 99)
        chosenTreat = 4; 
    else
        chosenTreat = 5;
    return chosenTreat;
}

const isStealSuccessful = () => {
    const roll = Math.floor(Math.random() * 10) + 1;
    if(roll <= 3)
        return true;
    return false; 
}

const isUsernameValid = async(username) => {
    const doesExist = await HalloweenPlayer.find(
        {username: username}
    );
    if(doesExist.length == 0)   
        return false;
    if(!doesExist[0].candyCollection || doesExist[0].candyCollection.length == 0)
        return false;
    return true;
}

const stealCandy = async (victimUsername) => {
    const robbed = await HalloweenPlayer.find(
        {username: victimUsername}
    );
    return robbed[0].latestTreat;
}
const giveStolenCandy = async(stealerID, stolenCandy) => {
    await HalloweenPlayer.findOneAndUpdate(
        {playerId: stealerID},
        {
            $push: {candyCollection: stolenCandy},
            $set: {latestTreat: stolenCandy},
            $inc: {
                points: stolenCandy.points,
                candyCount: 1,
                stealCount: 1
            }
        }
    )

}

const reAdjust = async() => {
    const result = await HalloweenPlayer.find();
    for(let i = 0; i < result.length; i++){
        let trueLastTreat;
        let truePoints = 0
        if(result[i].candyCollection.length != 0){
            const length = result[i].candyCollection.length;
            trueLastTreat= result[i].candyCollection[length-1];
            for(let j = 0; j < length; j++)
                truePoints += result[i].candyCollection[j].points;
        }
        await HalloweenPlayer.findOneAndUpdate(
            {playerId: result[i].playerId},
            {
                $set: {
                    latestTreat: trueLastTreat,
                    points: truePoints
                }
            }
        )
       
    }
}

const removeCandy = async(victimUsername, stolenCandy) => {
    const result = await HalloweenPlayer.find(
        {username: victimUsername}
    )
    if(result[0].length == 1){
        
    }
    const candies = result[0].candyCollection;
    const latestCandy = candies[candies.length-2];
    await HalloweenPlayer.findOneAndUpdate(
        {username: victimUsername},
        {
            $pop: {candyCollection: 1},
            $set: {latestTreat: latestCandy},
            $inc: {
                points: -stolenCandy.points,
                candyCount: -1,
            }
        }
    )
}
    
    


const allocateTreat = async(userID, treat) => {
    const points = Number(treat.points);
    await HalloweenPlayer.findOneAndUpdate(
        {playerId: userID},
        //find player by id
        {
            //push the treat to their collection
            //and increment their counts
            $push: {candyCollection: treat},
            $set: {latestTreat: treat},
            $inc: {
                points: points,
                candyCount: 1,
                trickOrTreatCount: 1
            }
        }
    );


}

const lookAtTreatBag  = async(userID, bagNumber) => {
        const result = await HalloweenPlayer.find({
            playerId: userID
        });
        const length = result[0].candyCollection.length;
        //obtain length of their characterDeck
    
        const beginIndex = bagNumber*10-10;
        //obtain the starting index
        endIndex = beginIndex + 10;
        //there are 10 cards per page so the end index would be 10 more than the beginning
        //note: the 'true' ending index would be endIndex-1. 
        if(endIndex > length){
            //if the addition from the previous line of code is greater than the length
            //that would be invalid, so set the index to the length
            endIndex = length;
        }
        const candyEmbeded = new EmbedBuilder()
        .setColor(0xa84300)
        .setTitle(`Candies of ${result[0].username}, Bag ${bagNumber}`)
        for(let i = beginIndex; i < endIndex; i++){
            candyEmbeded.addFields(
                {
                    name: `Candy # ${i+1}  »  ${result[0].candyCollection[i].treat}`,
                    value: `From:  ${result[0].candyCollection[i].from}`
                }
            )
        }
        return candyEmbeded;
}

const getTreatList = (number) => {
    const oliveTreat = {
        treats: require('../OliveBot/oliveTreats.json'),
        setTreats: function (oliveTreat){
            this.treats = oliveTreat;
        }
    };
    
    const cadenceTreat = {
        treats: require('../CadenceBot/cadenceTreats.json'),
        setTreats: function (cadenceTreat){
            this.treats = cadenceTreat;
        }
    };
    
    const wernerTreat = {
        treats: require('../WernerBot/wernerTreats.json'),
        setTreats: function (wernerTreat){
            this.treats = wernerTreat;
        }
    };
    
    const mariaTreat = {
        treats: require('../MariaBot/mariaTreats.json'),
        setTreats: function (mariaTreat){
            this.treats = mariaTreat;
        }
    };
    
    const atiennaTreat = {
        treats: require('../AtiennaBot/atiennaTreats.json'),
        setTreats: function (atiennaTreat){
            this.treats = atiennaTreat;
        }
    };
    
    const jerichoTreat = {
        treats: require('../JerichoBot/jerichoTreats.json'),
        setTreats: function (jerichoTreat){
            this.treats = jerichoTreat;
        }
    };
    
    const mergedTreatList = [...oliveTreat.treats, ...cadenceTreat.treats, ...wernerTreat.treats, ...mariaTreat.treats, ...atiennaTreat.treats, ...jerichoTreat.treats];
    const length = mergedTreatList.length;
    const beginIndex = number*10-10;
    console.log(beginIndex);
    //obtain the starting index
    endIndex = beginIndex + 10;
    //there are 10 cards per page so the end index would be 10 more than the beginning
    //note: the 'true' ending index would be endIndex-1. 
    if(endIndex > length){
        //if the addition from the previous line of code is greater than the length
        //that would be invalid, so set the index to the length
        endIndex = length;
    }
    console.log('passes here')
    console.log(length);
    const treatEmbedded = new EmbedBuilder()
        .setColor(0xa84300)
        .setTitle(`Potential Treat List, ${number}`)
        for(let i = beginIndex; i < endIndex; i++){
            treatEmbedded.addFields(
                {
                    name: `Candy  »  ${mergedTreatList[i].treat}`,
                    value: `From : ${mergedTreatList[i].from}`,
                }
            )
        }
        return treatEmbedded;
}

const getRecievedTreat = async(userID, givenOrStolen) => {
    const result = await HalloweenPlayer.find({
        playerId: userID
    });
    const recentCandy = result[0].latestTreat;
    const user = result[0].username;
    
    if(givenOrStolen == 'given'){
        message = `${user} received a ${recentCandy.treat} from ${recentCandy.from}!`
    }
    else{
        message = `${user} has stolen a ${recentCandy.treat} from ${givenOrStolen}!`
    }
    const latestCandyEmbedded = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle(message)
    return latestCandyEmbedded;
}

const checkIfValid = async(userID, name) =>{
    const result = await HalloweenPlayer.find({
        playerId: userID
    });
    const recentCandy = result[0].latestTreat;
    if(recentCandy.from != name)
        return false;
    return true;
}

const rankUp = async(userID, ranking) => {
    await HalloweenPlayer.findOneAndUpdate(
        {playerId: userID},
        //find player by id
        {
            $set: {
                "rankNumber" : ranking.rank,
                "title": ranking.title
            }
        },
    );

}

const getSimpleEmbed = (message) => {
    const simpleEmbed = new EmbedBuilder()
    .setColor(0xe67e22)
    .setTitle(message)
    return simpleEmbed;
}

const getLeaderBoard = async() => {
    const result = await HalloweenPlayer.find({}).sort({points: -1});
    const displayBoard = new EmbedBuilder()
    .setColor(0xe67e22)
    .setTitle('Trick-Or-Treat Leaderboard')
    for(let i = 0; i < result.length; i++){
        displayBoard.addFields(
            {
                name: `Rank # ${i+1}  »  ${result[i].username}`,
                value: `Points:  ${result[i].points}`
            }
        )
    }
    return displayBoard;

}

const getMyStats = async(userID) => {
    const result = await HalloweenPlayer.find({
        playerId: userID
    });
    const displayStats = new EmbedBuilder()
    .setColor(0xe67e22)
    .setTitle(`${result[0].username}'s Candy Stats`)
    .addFields(
        {name: 'Rank Title', value: `${result[0].title}`},
    )
    .addFields(
        {name: 'Candies in Bag', value: `${result[0].candyCount}`, inline:true},
        {name: 'EXP', value: `${result[0].points}`, inline: true},
    );
    return displayStats;

}

const decrementSteal = async(userID) =>{
    await HalloweenPlayer.findOneAndUpdate(
        {playerId: userID},
        //find player by id
        {
            $inc: {
                stealCount: 1
            }
        },
    );
}

//helper check functions:
const checkTrickOrTreatCount =  async (userID) => {
    const result = await HalloweenPlayer.find({
        playerId: userID
    })
    if(result[0].trickOrTreatCount  >= 3)
        return false;
    return true;
}

const checkStealCount = async(userID) => {
    const result = await HalloweenPlayer.find({
        playerId: userID
    })
    if(result[0].stealCount  >= 1)
        return false;
    return true;
}

const checkRanking = async(userID) => {
    const result = await HalloweenPlayer.find({
        playerId: userID
    })
    for(let i = 0; i < rankData.ranks.length; i++){
        if(rankData.ranks[i].rank > result[0].rankNumber && rankData.ranks[i].EXPrequired <= result[0].points && result[0].title != rankData.ranks[i].title)
            return rankData.ranks[i];
    }
    return null;
}

const resetCounts = async() => {
    await HalloweenPlayer.updateMany(
        {},
        {
            trickOrTreatCount: 0,
            stealCount: 0
        }
    );
}

module.exports = {
    playerExists,
    createPlayer,
    checkIfValid,
    getRandomTreat,
    allocateTreat,
    getRecievedTreat,
    lookAtTreatBag,
    rankUp,
    isUsernameValid,
    isStealSuccessful,
    stealCandy,
    resetCounts,
    giveStolenCandy,
    removeCandy,
    getLeaderBoard,
    getSimpleEmbed,
    getMyStats,
    decrementSteal,
    checkTrickOrTreatCount,
    checkRanking,
    checkStealCount,
    getTreatList,
    reAdjust

}