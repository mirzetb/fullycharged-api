const mongoose = require('mongoose')
const ChargerType = require('./chargerType')

const chargerSchema = new mongoose.Schema({
    power: {
        type: Number,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargerType',
        required: true
    }
})

module.exports = chargerSchema