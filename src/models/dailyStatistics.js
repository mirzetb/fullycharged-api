const mongoose = require('mongoose')
const ChargingLocation = require('./chargingLocation')
const { EVCP } = require('./user')

const dailyStatisticsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },    
    // If evcp is set then this is total statistics over all locations, otherwise chargingLocation should be set for a location based statistics
    evcp: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'EVCP'
    },
    chargingLocation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ChargingLocation'
    },
    chargeTime: {
        type: Number,
        required: true
    },
    numberOfBookings: {
        type: Number,
        required: true
    },
    energySold: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const DailyStatistics = mongoose.model('DailyStatistics', dailyStatisticsSchema)

module.exports = DailyStatistics