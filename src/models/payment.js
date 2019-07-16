const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    bookingFee: {
        type: Number,
        required: true
    },
    energyCost: {
        type: Number,
        required: true
    },
    percentageCost: {
        type: Number,
        required: true
    },
    paid: {
        type: Boolean,
        required: true,
        default: false
    }, 
    paidOn: {
        type: Date
    },
    paymentDueDate: {
        type: Date
    }
})

module.exports = paymentSchema