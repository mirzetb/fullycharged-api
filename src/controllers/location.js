const validator = require('validator');
const ChargingLocation = require('../models/chargingLocation');
const Booking = require('../models/booking');
const DailyStatistics = require('../models/dailyStatistics');
const ChargerType = require('../models/chargerType');
const ChargingUnit = require('../models/chargingUnit');
const { EVCP } = require('../models/user');
const MonthlyStatistics = require('../models/monthlyStatistics');

const search = async (req, res) => {
    if (!req.query.sw || !req.query.ne || !validator.isLatLong(req.query.sw) || !validator.isLatLong(req.query.ne)) {
        return res.status(400).send('SW and NE coordinates not valid!')
    }

    const startDate = new Date(Date.parse(req.query.startDate))
    if (!startDate) {
        return res.status(400).send('Start date not defined or invalid!')
    }

    const startTime = parseInt(req.query.startTime)
    if (Number.isNaN(startTime) || startTime < 0 || startTime > 23) {
        return res.status(400).send('Start time not defined or invalid!')
    }
    startDate.setHours(startTime, 0, 0, 0)

    if (startDate < new Date()) {
        return res.status(400).send('Cannot search in past!')
    }

    const price = !req.query.price ? 0 : parseFloat(req.query.price) 
    if(price < 0) {
        return res.status(400).send('Invalid price!')
    }

    const sw = req.query.sw.split(',')
    const SW = {
        lat: parseFloat(sw[0]),
        long: parseFloat(sw[1])
    }

    const ne = req.query.ne.split(',')
    const NE = {
        lat: parseFloat(ne[0]),
        long: parseFloat(ne[1])
    }

    const border = {
        type: 'Polygon',
        coordinates: [[
            [NE.long, NE.lat],
            [NE.long, SW.lat],
            [SW.long, SW.lat],
            [SW.long, NE.lat],
            [NE.long, NE.lat]
        ]]
    }

    // Find enabled and non-deleted locations within the border and with at least one supported charger type that is enabled and non-deleted
    const supportedChargerIds = req.user.vehicleModel.supportedChargers.map((charger) => charger.type)
    const filterChargingUnits = { 
        $and: [
            { enabled: true },
            { deleted: false },
            { 'charger.type': { $in: supportedChargerIds } }
        ]
    }
    var locations = await ChargingLocation.find({
        geoPoint: {
            $geoWithin: {
                $geometry: border
            }
        },
        enabled: true,
        deleted: false
    }).lean().populate({
        path: 'chargingUnits',
        match: filterChargingUnits
    }).exec()

    // Cache coincident bookings for selected charging units or user's concurrent bookings
    var chargingUnits = locations.map((location) => location.chargingUnits)
    chargingUnits = [].concat.apply([], chargingUnits).map((unit) => unit._id)
    const bookings = await Booking.find({
        $or: [{ 
            chargingUnit: { $in: chargingUnits }
        },{ 
            evo: req.user._id 
        }],
        canceled: false,
        startTime: { $lte: startDate },
        endTime: { $gte: startDate } 
    }).lean()

    // Cache next bookings (for max available time)
    const nextBookings = await Booking.find({
        chargingUnit: { $in: chargingUnits },
        canceled: false,
        startTime: { $gt: startDate, $lt: new Date(startDate).setHours(startDate.getHours() + 12) }
    }).lean()

    // STATUS = EX | NA | OK
    // Eliminate charging locations that don't have suitable supported units
    locations = locations.filter((location) => location.chargingUnits.lenght != 0).map((location) => {
        location.chargingUnits.forEach(function (unit, index) {
            // Let's assume the unit is available - OK
            this[index]['status'] = 'OK'

            // If price limit was set, and unit has higher price it is expensive - EX
            if (price > 0) {
                if (unit.energyPrice > price) {
                    this[index]['status'] = 'EX'
                }
            }

            // If there is a booking on this time for this unit, the unit is not available - NA || user has a booking on this time
            if (bookings.some((booking) => booking.chargingUnit == unit._id.toString())
            || bookings.some((booking) => booking.evo == req.user._id.toString())) {
                this[index]['status'] = 'NA'
            }

            // Find max duration
            if (this[index]['status'] === 'OK') {
                const nextBooking = nextBookings.filter(booking => booking.chargingUnit == unit._id.toString())
                .sort((a, b) => a.startTime < b.startTime ? 1 : -1)

                const duration = !nextBooking[0] ? 12 : (nextBooking[0].startTime - startDate) / 36e5
                this[index]['maxDuration'] = Math.min(duration, 12)
            }
        }, location.chargingUnits)
     
        // If there is at least one OK charger, the location is OK, otherwise if there is at least one EX charger, the location is EX, otherwise NA
        if (location.chargingUnits.some((unit) => unit.status === 'OK')) {
            location['status'] = 'OK'
        } else if (location.chargingUnits.some((unit) => unit.status === 'EX')) {
            location['status'] = 'EX'
        } else {
            location['status'] = 'NA'
        }
        return location 
    })

    res.send(locations)
}

// Average charge time per day, last 7 days
// Number of bookins per day, last 7 days
// Energy sold per day, last 7 days
// Revenue chart, last 12 months
// PER LOCATION
const locationAnalytics = async (req, res) => {
    const _id = req.params.id

    const location = await ChargingLocation.findOne({ _id, owner: req.user._id }).populate({
        path: 'chargingUnits',
        populate: {
            path: 'charger.type',
            model: 'ChargerType' 
        }
    }).lean()
    
    if(!location) {
        return res.status(404).send('Location with id ' + _id + ' not found!')
    }

    let today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let aWeekAgo = new Date()
    aWeekAgo.setDate(today.getDate() - 7)
    aWeekAgo.setHours(0, 0, 0, 0)

    const dailyStatistics = await DailyStatistics.find({
        chargingLocation: _id,
        date: { $lt: today, $gte: aWeekAgo }
    })

    let firstDayOfTheMonht = (new Date(today)).setDate(1)
    const monthlyStatistics = await MonthlyStatistics.find({
        chargingLocation: _id,
        date: { $lt:  firstDayOfTheMonht, $gte: (new Date(firstDayOfTheMonht)).setMonth(today.getMonth() - 12) }
    })

    res.send({
        location,
        dailyStatistics,
        monthlyStatistics
    })
}

// Average charge time per day, last 7 days
// Number of bookins per day, last 7 days
// Energy sold per day, last 7 days
// Revenue chart, last 12 months
// PER EVCP
const globalAnalytics = async (req, res) => {
    const locations = await ChargingLocation.find({ owner: req.user._id }).lean()
   
    let today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let aWeekAgo = new Date()
    aWeekAgo.setDate(today.getDate() - 7)
    aWeekAgo.setHours(0, 0, 0, 0)

    const dailyStatistics = await DailyStatistics.find({
        evcp: req.user._id,
        date: { $lt: today, $gte: aWeekAgo }
    })

    let firstDayOfTheMonht = (new Date(today)).setDate(1)
    const monthlyStatistics = await MonthlyStatistics.find({
        evcp: req.user._id,
        date: { $lt:  firstDayOfTheMonht, $gte: (new Date(firstDayOfTheMonht)).setMonth(today.getMonth() - 12) }
    })

    res.send({
        locations,
        dailyStatistics,
        monthlyStatistics
    })
}

// Add location
const addLocation = async (req, res) => {
    try {
        let chargingLocation = req.body;
        let chargingUnits = req.body.chargingUnits;
        chargingLocation.geoPoint= {
            type: 'Point',
                coordinates: [11.671068, 48.265722]
        };
        chargingLocation = await ChargingLocation.create(chargingLocation);
        chargingUnits.forEach((chargingUnit)=>{
            chargingUnit.chargingLocation = chargingLocation._id;
            ChargingUnit.create(chargingUnit);
        });
        res.status(200).send(chargingLocation);
    } catch (e) {
        res.status(400).send(e)
    }
};

// Get ChargingUnits
const getChargerTypes = async (req, res) => {
    try {
        let chargingUnits = await ChargerType.find({});
        res.status(200).send(chargingUnits);
    } catch (e) {
        res.status(400).send(e)
    }
};

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        let locations = await ChargingLocation.find({deleted: false}).populate('chargingUnits');
        res.status(200).send(locations);
    } catch (e) {
        res.status(400).send(e)
    }
};

module.exports = {
    search,
    locationAnalytics,
    globalAnalytics,
    addLocation,
    getChargerTypes,
    getAllLocations
}