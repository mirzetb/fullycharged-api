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
    console.log(booking)
    // All the fields must be present and valid
    // startTime is na integers [0..23], duration is and integer [1..12] number of hours
    // booking cannot be made in the past
    if(!booking.chargingLocation 
        || !booking.chargingUnit
        || !mongoose.Types.ObjectId.isValid(booking.chargingLocation)
        || !mongoose.Types.ObjectId.isValid(booking.chargingUnit) 
        || !booking.date
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

    // Check if the selected charging unit is occupied by other booking or the user has a booking in the same time
    const chargingUnit = location.chargingUnits[0]
    const startTime = new Date(new Date(booking.date).setHours(booking.startTime, 0, 0, 0))
    const endTime = new Date(new Date(booking.date).setHours(booking.startTime + booking.duration - 1, 59, 59, 999))
    const afterEndTime = new Date(new Date(booking.date).setHours(booking.startTime + booking.duration, 0, 0, 0))
    const occupied = await Booking.find({
        $and: [
            { canceled: false },
            { $or: [
                { chargingUnit: chargingUnit._id },
                { evo: req.user._id }
            ]},
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
        return res.status(400).send('The given time is occupied by another booking or you have another booking at the same time!')
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
    const cancelationTimeout = location.cancelationTimeout

    const newBooking = new Booking({
        startTime,
        endTime,
        chargingUnit,
        evo: req.user._id,
        estimatedChargekWh,
        estimatedChargePercentage,
        estimatedChargingCost,
        estimatedVolumeFee,
        basicBookingFee,
        cancelationTimeout
    })

    await newBooking.save()
    return res.status(201).send(newBooking)
}

// Get all active and paginate past bookings for the user
const list = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit): 5
    const skip = req.query.skip ? parseInt(req.query.skip): 0

    const activeBookings = await Booking.find({
        evo: req.user._id,
        canceled: false,
        endTime: { $gte: new Date() }
    }).populate({
        path: 'chargingUnit',
        populate: {
            path: 'charger.type',
            model: 'ChargerType' 
        }
    }).sort({ startTime: 1 })

    const pastBookings = await Booking.find({
        evo: req.user._id,
        $or: [{
            canceled: true
        }, {
            endTime: { $lt: new Date() }
        }]
    }).populate({
        path: 'chargingUnit',
        populate: {
            path: 'charger.type',
            model: 'ChargerType' 
        }
    }).limit(limit).skip(skip).sort({ startTime: -1 })

    return res.send({
        activeBookings,
        pastBookings
    })
}

const cancel = async (req, res) => {
    const _id = req.params.id

    const booking = await Booking.findOne({
        _id,
        evo: req.user._id,
        startTime: { $gt: new Date() },
        canceled: false
    })

    if(!booking) {
        return res.status(404).send('Booking not found or not suitable for cancel!')
    }

    var cancelTime = new Date()
    // Booking will be cancelled, but the basic booking fee must be paid since the cancelation happened in the cancelation timeout
    if(cancelTime.setHours(cancelTime.getHours() + booking.cancelationTimeout) > booking.startTime) {
        booking.payment = {
            bookingFee: booking.basicBookingFee,
            paid: false
        }
    }

    booking.canceled = true
    booking.canceledOn = new Date()
    await booking.save()

    return res.send(booking)
}

const authorize = async (req, res) => {
    const chargingUnit = req.body.charger
    if (!chargingUnit) {
        return res.status(400).send('No charger unit provided!')
    }

    // Find user's booking that is starting
    const now = new Date()
    const booking = await Booking.findOne({
        chargingUnit,
        evo: req.user._id,
        canceled: false,
        used: false,
        startTime: { $lte: now },
        endTime: { $gt: now }
    })

    if(!booking) {
        return res.status(404).send('No active booking found or wrong charger!')
    }

    booking.used = true
    booking.authorizedOn = now

    await booking.save()

    return res.send(booking)
}

const charge = async(req, res) => {
    const _id = req.params.id
    const energy = req.body.energy

    if(!energy) {
        return res.status(400).send('Charged energy not provided!')
    }

    const now = new Date()
    const booking = await Booking.findOne({
        evo: req.user._id,
        _id,
        used: true,
        canceled: false,
        charging: null,
        endTime: { $gte: now }
    }).populate({
        path: 'chargingUnit'
    })

    if(!booking) {
        return res.status(404).send('No active booking found!')
    }

    booking.charging = {
        startTime: booking.authorizedOn,
        endTime: now,
        energy
    }
    
    const bookingFee = booking.basicBookingFee
    const energyCost = Math.round((energy * booking.chargingUnit.energyPrice) * 100) / 100
    const percentageCost = Math.round(((energyCost * req.user.volumeFeePrecentage) / 100) * 100) / 100
    booking.payment = {
        bookingFee,
        energyCost, 
        percentageCost,
        paid: false 
    }
    await booking.save()
    
    return res.send(booking)
}

module.exports = {
    book,
    list,
    cancel,
    authorize,
    charge
}