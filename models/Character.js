const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const characterSchema = new Schema({
    characterId: {
        type: Number,
        required: true,
        unique: true
    },
    characterName: {
        type: String,
        required: true
    },
    characterQuotes: [String],
    specialQuote: {
        type: String
    }
});

module.exports = mongoose.model('Character', characterSchema);