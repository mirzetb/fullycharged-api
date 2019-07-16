const mongoose = require('mongoose')

const chargingSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    energy: {
        type: Number,
        required: true
    }
})

module.exports = chargingSchema