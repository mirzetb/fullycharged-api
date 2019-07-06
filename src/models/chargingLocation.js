const mongoose = require('mongoose');
const addressDefinition = require('./modelDefinitions/address');
const charginUnitDefinition = require('./modelDefinitions/chargingUnit');

const ChargingLocationSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        address: addressDefinition,
        chargingUnit: [charginUnitDefinition],
        enabled: {
            type: Boolean,
            default: true,
            required: true
        },
        basicBookingFee: {
            type: Number,
            required: true
        },
        cancellationTimeout: {
            type: Number,
            required: true
        }
    }
);

const ChargingLocation = mongoose.model('ChargingLocation', ChargingLocationSchema);

module.exports = ChargingLocation;