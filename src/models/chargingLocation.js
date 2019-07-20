const mongoose = require('mongoose')
const { pointSchema } = require('./geoJSON')
const ChargingUnit = require('./chargingUnit')
const { EVCP } = require('./user')
const addressDefinition = require('./address')

const chargingLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: addressDefinition,
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
    cancellationTimeout: {
        type: Number,
        required: true,
        default: 2
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'EVCP'
    },
    geoPoint: {
        type: pointSchema,
        required: true
    },
    // chargingUnits: {
    //     type: mongoose.Schema.Types.Mixed,
    //     ref: 'ChargingUnit',
    //     required: true
    // }
}, {
    timestamps: true,
    versionKey: false
});

chargingLocationSchema.virtual('chargingUnits', {
    ref: 'ChargingUnit',
    localField: '_id',
    foreignField: 'chargingLocation'
});

chargingLocationSchema.set('toJSON', {
    virtuals: true
});

chargingLocationSchema.set('toObject', {
    virtuals: true
});

const ChargingLocation = mongoose.model('ChargingLocation', chargingLocationSchema)

module.exports = ChargingLocation
