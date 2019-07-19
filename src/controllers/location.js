const validator = require('validator');
const ChargingLocation = require('../models/chargingLocation');
const Booking = require('../models/booking');
const DailyStatistics = require('../models/dailyStatistics');
const ChargerType = require('../models/chargerType');
const ChargingUnit = require('../models/chargingUnit');

// GET /locations/search?sw=lat,long&ne=lat,long&startDate=YYYY-MM-DD&startTime=NN&price=NN.NN
const search = async (req, res) => {
    if (!req.query.sw || !req.query.ne || !validator.isLatLong(req.query.sw) || !validator.isLatLong(req.query.ne)) {
        return res.status(400).send('SW and NE coordinates not valid!')
    }

    const startDate = new Date(Date.parse(req.query.startDate))
    if (!startDate) {
        return res.status(400).send('Start date not defined or invalid!')
    }

    const startTime = parseInt(req.query.startTime)
    if (!startTime || startTime < 0 || startTime > 23) {
        return res.status(400).send('Start time not defined or invalid!')
    }
    startDate.setHours(startTime)

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

    // Cache bookings for selected charing units 
    var chargingUnits = locations.map((location) => location.chargingUnits)
    chargingUnits = [].concat.apply([], chargingUnits).map((unit) => unit._id)
    const bookings = await Booking.find({
        chargingUnit: { $in: chargingUnits },
        canceled: false,
        used: false,
        startTime: { $lte: startDate },
        endTime: { $gte: startDate } 
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

            // If there is a booking on this time for this unit, the unit is not available - NA
            if (bookings.some((booking) => booking.chargingUnit == unit._id.toString())) {
                this[index]['status'] = 'NA'
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
// GET /locations/:id/analytics
const locationAnalytics = async (req, res) => {
    const _id = req.params.id

    return res.status(200).send('Called location alaytics for location' + _id)
    
    // const location = await ChargingLocation.findOne({ _id }).populate({
    //     path: 'chargingUnits',
    //     populate: {
    //         path: 'charger.type',
    //         model: 'ChargerType' 
    //     }
    // }).lean()
    
    // const dailyStatistics = await DailyStatistics.find({
    //     chargingLocation: _id

    // })
    // res.send(location)
}

const calculateDailyStatistics = async (location, date) => {

}

const calculateRevenue = async (location, date) => {

}

// Average charge time per day, last 7 days
// Number of bookins per day, last 7 days
// Energy sold per day, last 7 days
// Revenue chart, last 12 months
// PER EVCP
// GET /locations/analytics
const globalAnalytics = async (req, res) => {
    return res.status(200).send('Called global statistics')
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