const mongoose = require('mongoose')
const chargerSchema = require('./charger')

const vehicleModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    batteryCapacity: {
        type: Number,
        required: true
    },
    supportedChargers: [chargerSchema]
}, {
    timestamps: true,
    versionKey: false
})

const VehicleModel = mongoose.model('VehicleModel', vehicleModelSchema)

module.exports = VehicleModel