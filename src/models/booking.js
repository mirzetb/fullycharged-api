const mongoose = require('mongoose')
const { EVO } = require('./user')
const ChargingUnit = require('./chargingUnit')
const chargingSchema = require('./charging')
const paymentSchema = require('./payment')

const bookingSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        required: true,
        default: false
    },
    canceled: {
        type: Boolean,
        required: true,
        default: false
    },
    estimatedChargePercentage: {
        type: Number,
        required: true
    },
    estimatedChargekWh: {
        type: Number,
        required: true
    }, 
    estimatedChargingCost: {
        type: Number,
        required: true
    },
    estimatedVolumeFee: {
        type: Number,
        required: true
    },
    chargingUnit: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChargingUnit'
    },
    evo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EVO'
    },
    basicBookingFee: {
        type: Number,
        required: true
    },
    charging: chargingSchema,
    payment: paymentSchema
}, {
    timestamps: true,
    versionKey: false
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking