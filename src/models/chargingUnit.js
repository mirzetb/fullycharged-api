const mongoose = require('mongoose')
const chargerSchema = require('./charger')
const ChargingLocation = require('./chargingLocation')

const chargingUnitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: true
    }, 
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    energyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    chargingLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChargingLocation',
        required: true
    },
    charger: chargerSchema
}, {
    timestamps: true,
    versionKey: false
})

const ChargingUnit = mongoose.model('ChargingUnit', chargingUnitSchema);

module.exports = ChargingUnit;