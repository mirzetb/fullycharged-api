const mongoose = require('mongoose')
const { pointSchema } = require('./geoJSON')
const ChargingUnit = require('./chargingUnit')

const chargingLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
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
    basicBookingFee: {
        type: Number,
        required: true,
        default: 0.5
    },
    cancelationTimeout: {
        type: Number,
        required: true,
        default: 120
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EVCP'
    },
    geoPoint: {
        type: pointSchema,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

chargingLocationSchema.virtual('chargingUnits', {
    ref: 'ChargingUnit',
    localField: '_id',
    foreignField: 'chargingLocation'
})

chargingLocationSchema.set('toJSON', {
    virtuals: true
})

chargingLocationSchema.set('toObject', {
    virtuals: true
})

const ChargingLocation = mongoose.model('ChargingLocation', chargingLocationSchema)

module.exports = ChargingLocation