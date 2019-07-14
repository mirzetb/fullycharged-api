const mongoose = require('mongoose')

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
    chargingUnit: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChargingUnit'
    }
})

const Booking = mongoose.model('Booking', bookingSchema)

module.exports = Booking