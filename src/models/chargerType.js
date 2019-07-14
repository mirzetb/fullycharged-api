const mongoose = require('mongoose')

const chargerTypeSchema = new mongoose.Schema({
    chargingLevel: {
        type: Number,
        required: true
    },
    connector: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const ChargerType = mongoose.model('ChargerType', chargerTypeSchema)

module.exports = ChargerType