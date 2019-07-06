const ChargerTypeDefinition = require('./chargerType.js');

const ChargingUnitDefinition = {
    name: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true,
        required: true
    },
    energyPrice: {
        type: Number,
        required: true
    },
    chargerType: ChargerTypeDefinition
};

module.exports = ChargingUnitDefinition;