const mongoose = require('mongoose')
const ChargingLocation = require('./chargingLocation')
const { EVCP } = require('./user')

const monthlyStatisticsSchema = new mongoose.Schema({
    // Beginning of the month
    date: {
        type: Date,
        required: true
    },
    // If EVCP is set then this is total statistic over all locations, otherwise chargingLocation should be set for a location based statistics
    evcp: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'EVCP'
    },
    chargingLocation: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ChargingLocation'
    },
    revenue: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const MonthlyStatistics = mongoose.model('MonthlyStatistics', monthlyStatisticsSchema)

module.exports = MonthlyStatistics