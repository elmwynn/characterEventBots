
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const halloweenPlayerSchema = new Schema({
    playerId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    candyCount: {
        type: Number,
        default: 0
    },
    candyCollection: [Object], 
    points: {
        type: Number,
        default: 0
    },
    trickOrTreatCount: {
        type: Number,
        default: 0
    },
    stealCount: {
        type: Number,
        default: 0
    },
    title: String,
    rankNumber: Number,
    latestTreat: Object
})

module.exports = mongoose.model('Halloweenplayer', halloweenPlayerSchema);
