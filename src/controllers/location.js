const ChargingLocation = require('../models/chargingLocation');

const addLocation = async (req, res) => {
    try {
        let chargingLocation = await ChargingLocation.create(req.body);
        res.status(200).json(chargingLocation);
    } catch (e) {
        res.status(400).send(e)
    }
};

module.exports = {
    addLocation
};