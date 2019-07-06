const ChargerTypeDefinition = {
    chargingLevel: {
        type: Number,
        required: true
    },
    power: {
        type: Number,
        required: true
    },
    connector: {
        type: String,
        required: true
    }};

module.exports = ChargerTypeDefinition;