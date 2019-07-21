const VehicleModel = require('../models/vehicleModel')

const list = async (req, res) => {
    const supportedVehicles = await VehicleModel.find()

    res.send(supportedVehicles)
}

module.exports = {
    list
}