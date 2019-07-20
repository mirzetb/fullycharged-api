const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    bookingFee: {
        type: Number,
        required: true
    },
    energyCost: {
        type: Number,
        required: false
    },
    percentageCost: {
        type: Number,
        required: false
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    }, 
    paidOn: {
        type: Date
    }
})

module.exports = paymentSchema