const Booking = require('../models/booking')
const ChargingLocation = require('../models/chargingLocation')
const mongoose = require('mongoose')

// {
//     chargingLocation: _id,
//     chargingUnit: _id,
//     date: Date,
//     startTime: Number,
//     duration: Number
// }

const book = async (req, res) => {
    const booking = req.body

    // All the fields must be present and valid
    // startTime is na integers [0..23], duration is and integer [1..12] number of hours
    // booking cannot be made in the past
    if(!booking.chargingLocation 
        || !booking.chargingUnit
        || !mongoose.Types.ObjectId.isValid(booking.chargingLocation)
        || !mongoose.Types.ObjectId.isValid(booking.chargingUnit) 
        || !booking.date
        || !booking.startTime
        || !booking.duration
        || !Number.isInteger(booking.startTime) || booking.startTime < 0 || booking.startTime > 23
        || !Number.isInteger(booking.duration) || booking.duration < 0 || booking.duration > 12
        || isNaN(new Date(booking.date))
        || new Date(booking.date).setHours(parseInt(booking.startTime), 0, 0, 0) < new Date()) {
            return res.status(400).send('Invalid booking data!')
        }
    booking.startTime = parseInt(booking.startTime)
    booking.duration = parseInt(booking.duration)
    
    // Check if there is a charging unit in given location with given id that is suitable for evo's vehicle
    const supportedChargerIds = req.user.vehicleModel.supportedChargers.map((charger) => charger.type)
    const location = await ChargingLocation.findOne({
        _id: booking.chargingLocation,
        enabled: true,
        deleted: false
    }).lean().populate({
        path: 'chargingUnits',
        match: {
            _id: booking.chargingUnit,
            enabled: true,
            deleted: false,
            'charger.type': { $in: supportedChargerIds }
        }
    }).exec()
    if(!location || location.chargingUnits.length != 1) {
        return res.status(400).send('Charging location or charging unit is not found or not suitable for evo\'s vehicle!')
    }

    // Check if the selected charging unit is occupied by other booking
    const chargingUnit = location.chargingUnits[0]
    const startTime = new Date(new Date(booking.date).setHours(booking.startTime, 0, 0, 0))
    const endTime = new Date(new Date(booking.date).setHours(booking.startTime + booking.duration - 1, 59, 59, 999))
    const afterEndTime = new Date(new Date(booking.date).setHours(booking.startTime + booking.duration, 0, 0, 0))
    const occupied = await Booking.find({
        $and: [
            { canceled: false },
            { chargingUnit: chargingUnit._id },
            { $or: [{
                startTime: { 
                    $gte: startTime,
                    $lt: afterEndTime }
                },
                {
                endTime: {
                    $gte: startTime,
                    $lt: afterEndTime }
                }   
            ]}    
        ]
    })

    if (occupied.length != 0) {
        return res.status(400).send('The given time is occupied by another booking!')
    }

    // Calculate estimated charginig fees
    const power = Math.min(chargingUnit.charger.power, 
        req.user.vehicleModel.supportedChargers.find(charger => charger.type == chargingUnit.charger.type.toString()).power)
    const batteryCapacity = req.user.vehicleModel.batteryCapacity
    const estimatedChargekWh = Math.round(Math.min(booking.duration * power, batteryCapacity) * 100) / 100
    const estimatedChargePercentage = Math.round((estimatedChargekWh / batteryCapacity) * 100 * 100) / 100
    const estimatedChargingCost = Math.round(estimatedChargekWh * chargingUnit.energyPrice * 100) / 100
    const estimatedVolumeFee = Math.round(((estimatedChargingCost * req.user.volumeFeePrecentage) / 100) * 100) / 100
    const basicBookingFee = location.basicBookingFee

    const newBooking = new Booking({
        startTime,
        endTime,
        chargingUnit,
        evo: req.user._id,
        estimatedChargekWh,
        estimatedChargePercentage,
        estimatedChargingCost,
        estimatedVolumeFee,
        basicBookingFee
    })

    await newBooking.save()
    return res.status(201).send(newBooking)
}

module.exports = {
    book
}