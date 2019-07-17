const mongoose = require('mongoose')
require('./src/db/mongoose')

const ChargerType = require('./src/models/chargerType')
const VehicleModel = require('./src/models/vehicleModel')
const { EVO, EVCP } = require('./src/models/user')
const ChargingLocation = require('./src/models/chargingLocation')
const ChargingUnit = require('./src/models/chargingUnit')
const Booking = require('./src/models/booking')
const DailyStatistics = require('./src/models/dailyStatistics')
const MonthlyStatistics = require('./src/models/monthlyStatistics')

const seed = async () => {
    // Charger types
    const chargerTypes = [{
        _id: new mongoose.Types.ObjectId(),
        chargingLevel: 1,
        connector: 'Type F (Schuko)' // EU Wall Plug
    }, {
        _id: new mongoose.Types.ObjectId(),
        chargingLevel: 2,
        connector: 'Type 2' // IEC 62196 Type 2
    }, {
        _id: new mongoose.Types.ObjectId(),
        chargingLevel: 3,
        connector: 'CHAdeMO'
    }, {
        _id: new mongoose.Types.ObjectId(),
        chargingLevel: 3,
        connector: 'Combo CCS'
    }, {
        _id: new mongoose.Types.ObjectId(),
        chargingLevel: 3,
        connector: 'Tesla Supercharger'
    }]
    await ChargerType.insertMany(chargerTypes)
    console.info('Inserted', chargerTypes.length, 'charger types.')
    
    // Vehicle models
    const vehicleModels = [{
        _id: new mongoose.Types.ObjectId(),
        name: 'i3 2019',
        manufacturer: 'BMW',
        batteryCapacity: 42.2,
        supportedChargers: [{
            type: chargerTypes[0]._id,
            power: 2.4
        }, {
            type: chargerTypes[1]._id,
            power: 11
        }, {
            type: chargerTypes[3]._id,
            power: 50
        }]
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'LEAF ZE1 MY19',
        manufacturer: 'NISSAN',
        batteryCapacity: 40,
        supportedChargers: [{
            type: chargerTypes[1]._id,
            power: 6.6
        }, {
            type: chargerTypes[2]._id,
            power: 50
        }]
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Model 3 Standard Range',
        manufacturer: 'Tesla',
        batteryCapacity: 46,
        supportedChargers: [{
            type: chargerTypes[1]._id,
            power: 11
        }, {
            type: chargerTypes[0]._id,
            power: 3
        }, {
            type: chargerTypes[4]._id,
            power: 120
        }]
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Model S Performance (P100D)',
        manufacturer: 'Tesla',
        batteryCapacity: 100,
        supportedChargers: [{
            type: chargerTypes[0]._id,
            power: 3
        }, {
            type: chargerTypes[1]._id,
            power: 16.5
        }, {
            type: chargerTypes[2]._id,
            power: 43
        }, {
            type: chargerTypes[3]._id,
            power: 120
        }, {
            type: chargerTypes[4]._id,
            power: 120
        }]
    }]
    await VehicleModel.insertMany(vehicleModels)
    console.info('Inserted', vehicleModels.length, 'vehicle models.')
    
    const evcps = [{
        _id: new mongoose.Types.ObjectId(),
        name: 'TUM GreenEnergy',
        email: 'greenenergy@tum.de',
        password: 'pa$$w0rd',
        role: 'EVCP'
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'SWM ElectricMunich',
        email: 'munich@swm.de',
        password: 'pa$$w0rd',
        role: 'EVCP'
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'BMW Chargers',
        email: 'chargers@bmw.de',
        password: 'pa$$w0rd',
        role: 'EVCP'
    }]
    // Password hashing on pre.save
    await new EVCP(evcps[0]).save()
    await new EVCP(evcps[1]).save()
    await new EVCP(evcps[2]).save()
    console.info('Inserted', evcps.length, 'EVCPs.')
    
    const evos = [{
        _id: new mongoose.Types.ObjectId(),
        name: 'Elon Musk',
        email: 'elon.musk@tum.de',
        password: 'pa$$w0rd',
        role: 'EVO',
        vehicleModel: vehicleModels[3]._id
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mirzet Brkic',
        email: 'mirzet.brkic@tum.de',
        password: 'pa$$w0rd',
        role: 'EVO',
        vehicleModel: vehicleModels[0]._id
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Lionel Messi',
        email: 'messi@tum.de',
        password: 'pa$$w0rd',
        role: 'EVO',
        vehicleModel: vehicleModels[1]._id
    }]
    // Password hashing on pre.save
    await new EVO(evos[0]).save()
    await new EVO(evos[1]).save()
    await new EVO(evos[2]).save()
    console.info('Inserted', evos.length, 'EVOs.')

    // Charging Locations
    const chargingLocations = [{
        _id: new mongoose.Types.ObjectId(),
        name: 'Campus Garching',
        address: {
            street: 'Boltzmannstraße 15',
            city: 'Garching bei München',
            state: 'Bayern',
            postalCode: '85748',
            country: 'Deutschland'
        },
        owner: evcps[0]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.671068, 48.265722]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'UnternehmerTUM',
        address: {
            street: 'Lichtenbergstraße 6',
            city: 'Garching bei München',
            state: 'Bayern',
            postalCode: '85748',
            country: 'Deutschland'
        },
        owner: evcps[0]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.665440, 48.267570]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Research and Technology House',
        address: {
            street: 'Parkring 19',
            city: 'Garching bei München',
            state: 'Bayern',
            postalCode: '85748',
            country: 'Deutschland'
        },
        owner: evcps[2]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.637680, 48.251940]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'The New Motion I',
        address: {
            street: 'Max-Joseph-Platz 4',
            city: 'München',
            state: 'Bayern',
            postalCode: '80539',
            country: 'Deutschland'
        },
        owner: evcps[1]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.577920, 48.140000]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Arabellapark',
        address: {
            street: 'Arabellastraße 4',
            city: 'München',
            state: 'Bayern',
            postalCode: '81925',
            country: 'Deutschland'
        },
        owner: evcps[1]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.616900, 48.153221]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'The New Motion II',
        address: {
            street: 'Lilli-Palmer Str. 2',
            city: 'München',
            state: 'Bayern',
            postalCode: '80636',
            country: 'Deutschland'
        },
        owner: evcps[1]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.538010, 48.144489]
        }
    }]
    await ChargingLocation.insertMany(chargingLocations)
    console.info('Inserted', chargingLocations.length, 'locations.')
    
    // Charging units in location Campus Garching
    const chargingUnits0 = [{
        _id: new mongoose.Types.ObjectId(),
        name: 'GA01',
        energyPrice: 0.33,
        chargingLocation: chargingLocations[0]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'GA02',
        energyPrice: 0.33,
        chargingLocation: chargingLocations[0]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits0)
    console.info('Inserted', chargingUnits0.length, 'charging units for location', chargingLocations[0].name)
        
    // Charging units in location UnternehmerTUM
    const chargingUnits1 = [{
        name: '01',
        energyPrice: 0.35,
        chargingLocation: chargingLocations[1]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }, {
        name: '02',
        energyPrice: 0.35,
        chargingLocation: chargingLocations[1]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'DC01',
        energyPrice: 0.40,
        chargingLocation: chargingLocations[1]._id,
        charger: {
            power: 50,
            type: chargerTypes[2]._id
        }
    }, {
        name: 'DC02',
        energyPrice: 0.40,
        chargingLocation: chargingLocations[1]._id,
        charger: {
            power: 50,
            type: chargerTypes[2]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits1)
    console.info('Inserted', chargingUnits1.length, 'charging units for location', chargingLocations[1].name)
        
    // Charging units in location Research and Technology House
    const chargingUnits2 = [{
        name: 'BMW01',
        energyPrice: 0.30,
        chargingLocation: chargingLocations[2]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'BMW02',
        energyPrice: 0.30,
        chargingLocation: chargingLocations[2]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    },{
        name: 'BMW03',
        energyPrice: 0.30,
        chargingLocation: chargingLocations[2]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'BMWDC01',
        energyPrice: 0.39,
        chargingLocation: chargingLocations[2]._id,
        charger: {
            power: 50,
            type: chargerTypes[3]._id
        }
    }, {
        name: 'BMWDC02',
        energyPrice: 0.39,
        chargingLocation: chargingLocations[2]._id,
        charger: {
            power: 50,
            type: chargerTypes[3]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits2)
    console.info('Inserted', chargingUnits2.length, 'charging units for location', chargingLocations[2].name)

    // Charging units in location The New Motion Max-Joseph-Platz 4
    const chargingUnits3 = [{
        name: 'SWM01',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM02',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM03',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM04',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWMT01',
        energyPrice: 0.44,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 80,
            type: chargerTypes[4]._id
        }
    }, {
        name: 'SWMT02',
        energyPrice: 0.44,
        chargingLocation: chargingLocations[3]._id,
        charger: {
            power: 80,
            type: chargerTypes[4]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits3)
    console.info('Inserted', chargingUnits3.length, 'charging units for location', chargingLocations[3].name)

    // Charging units in location Arabellapark
    const chargingUnits4 = [{
        name: 'SWM01',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM02',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM03',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM04',
        energyPrice: 0.27,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWMDC01',
        energyPrice: 0.35,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 50,
            type: chargerTypes[2]._id
        }
    }, {
        name: 'SWMDC02',
        energyPrice: 0.35,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 50,
            type: chargerTypes[2]._id
        }
    }, {
        name: 'SWMDC03',
        energyPrice: 0.37,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 60,
            type: chargerTypes[3]._id
        }
    }, {
        name: 'SWMDC04',
        energyPrice: 0.37,
        chargingLocation: chargingLocations[4]._id,
        charger: {
            power: 60,
            type: chargerTypes[3]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits4)
    console.info('Inserted', chargingUnits4.length, 'charging units for location', chargingLocations[4].name)
    
    // Charging units in location The New Motion Lilli-Palmer Str. 2
    const chargingUnits5 = [{
        name: 'SWM01',
        energyPrice: 0.28,
        chargingLocation: chargingLocations[5]._id,
        charger: {
            power: 11,
            type: chargerTypes[1]._id
        }
    }, {
        name: 'SWM02',
        energyPrice: 0.28,
        chargingLocation: chargingLocations[5]._id,
        charger: {
            power: 22,
            type: chargerTypes[1]._id
        }
    }]
    await ChargingUnit.insertMany(chargingUnits5)
    console.info('Inserted', chargingUnits5.length, 'charging units for location', chargingLocations[5].name)

    // Bookings for tomorrow in location Campus Garching
    let today = new Date()
    today.setHours(0, 0, 0, 0)

    let tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const bookings = [{
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 59, 59),
        chargingUnit: chargingUnits0[0]._id,
        estimatedChargePercentage: 88,
        estimatedChargekWh: 88,
        estimatedChargingCost: 29.04,
        estimatedVolumeFee: 1.452,
        evo: evos[0]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 59, 59),
        chargingUnit: chargingUnits0[0]._id,
        estimatedChargePercentage: 100,
        estimatedChargekWh: 42.2,
        estimatedChargingCost: 13.926,
        estimatedVolumeFee: 0.6963,
        evo: evos[1]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 59, 59),
        chargingUnit: chargingUnits0[1]._id,
        estimatedChargePercentage: 33,
        estimatedChargekWh: 13.2,
        estimatedChargingCost: 4.356,
        estimatedVolumeFee: 0.2178,
        evo: evos[2]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 59, 59),
        chargingUnit: chargingUnits0[1]._id,
        estimatedChargePercentage: 66,
        estimatedChargekWh: 26.4,
        estimatedChargingCost: 8.712,
        estimatedVolumeFee: 0.4356,
        evo: evos[2]._id
    }]
    await Booking.insertMany(bookings)
    console.info('Inserted', bookings.length, 'bookings')

    const locationDailyStatistcs = [{
        date: new Date(today).setDate(today.getDate() - 1),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 12,
        numberOfBookings: 5,
        energySold: 112
    }, {
        date: new Date(today).setDate(today.getDate() - 2),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 18,
        numberOfBookings: 9,
        energySold: 156.5
    },{
        date: new Date(today).setDate(today.getDate() - 3),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 36,
        numberOfBookings: 15,
        energySold: 380.3
    }, {
        date: new Date(today).setDate(today.getDate() - 4),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 21,
        numberOfBookings: 7,
        energySold: 196.7
    }, {
        date: new Date(today).setDate(today.getDate() - 5),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 13,
        numberOfBookings: 5,
        energySold: 139
    }, {
        date: new Date(today).setDate(today.getDate() - 6),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 17,
        numberOfBookings: 6,
        energySold: 235
    }, {
        date: new Date(today).setDate(today.getDate() - 7),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 14,
        numberOfBookings: 5,
        energySold: 122
    }, {
        date: new Date(today).setDate(today.getDate() - 8),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 12,
        numberOfBookings: 5,
        energySold: 112
    }, {
        date: new Date(today).setDate(today.getDate() - 9),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 16,
        numberOfBookings: 8,
        energySold: 175
    }, {
        date: new Date(today).setDate(today.getDate() - 10),
        chargingLocation: chargingLocations[0]._id,
        chargeTime: 12,
        numberOfBookings: 5,
        energySold: 112
    }, 
    // 2nd Location
    {
        date: new Date(today).setDate(today.getDate() - 1),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 35,
        numberOfBookings: 25,
        energySold: 1050.7
    },{
        date: new Date(today).setDate(today.getDate() - 2),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 56,
        numberOfBookings: 51,
        energySold: 1836
    },{
        date: new Date(today).setDate(today.getDate() - 3),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 44,
        numberOfBookings: 40,
        energySold: 2051
    },{
        date: new Date(today).setDate(today.getDate() - 4),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 85,
        numberOfBookings: 68,
        energySold: 2720
    },{
        date: new Date(today).setDate(today.getDate() - 5),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 61.5,
        numberOfBookings: 34,
        energySold: 989
    },{
        date: new Date(today).setDate(today.getDate() - 6),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 66,
        numberOfBookings: 60,
        energySold: 2340
    },{
        date: new Date(today).setDate(today.getDate() - 7),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 80,
        numberOfBookings: 56,
        energySold: 3416
    },{
        date: new Date(today).setDate(today.getDate() - 1),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 13,
        numberOfBookings: 5,
        energySold: 136
    },{
        date: new Date(today).setDate(today.getDate() - 1),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 13,
        numberOfBookings: 5,
        energySold: 136
    },{
        date: new Date(today).setDate(today.getDate() - 1),
        chargingLocation: chargingLocations[1]._id,
        chargeTime: 13,
        numberOfBookings: 5,
        energySold: 136
    }]

    const globalDailyStatistics = []
    var i;
    for(let i = 0; i < 10; i++) {
        const stat = {
            date: locationDailyStatistcs[i].date,
            evcp: evcps[0]._id,
            chargeTime: locationDailyStatistcs[i].chargeTime + locationDailyStatistcs[i + 10].chargeTime,
            numberOfBookings: locationDailyStatistcs[i].numberOfBookings + locationDailyStatistcs[i + 10].numberOfBookings,
            energySold: locationDailyStatistcs[i].energySold + locationDailyStatistcs[i + 10].energySold
        }

        globalDailyStatistics.push(stat)
    }

    await DailyStatistics.insertMany(locationDailyStatistcs)
    await DailyStatistics.insertMany(globalDailyStatistics)
    console.info('Inserted 10 days of statistics (location and total) for', evcps[0].name)


    const beginningOfTheMonth = new Date(new Date(today).setDate(1))

    const locationMonthlyStatistics = [{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 1),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1485
    }, {
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 2),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1840
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 3),
        chargingLocation: chargingLocations[0]._id,
        revenue: 2183
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 4),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1322
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 5),
        chargingLocation: chargingLocations[0]._id,
        revenue: 2563
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 6),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1499
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 7),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1685
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 8),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1852
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 9),
        chargingLocation: chargingLocations[0]._id,
        revenue: 2520
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 10),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1480
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 11),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1333
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 12),
        chargingLocation: chargingLocations[0]._id,
        revenue: 1654
    },
    // 2nd location
    {
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 1),
        chargingLocation: chargingLocations[1]._id,
        revenue: 21425
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 2),
        chargingLocation: chargingLocations[1]._id,
        revenue: 16820
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 3),
        chargingLocation: chargingLocations[1]._id,
        revenue: 17425
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 4),
        chargingLocation: chargingLocations[1]._id,
        revenue: 20333
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 5),
        chargingLocation: chargingLocations[1]._id,
        revenue: 18444
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 6),
        chargingLocation: chargingLocations[1]._id,
        revenue: 13920
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 7),
        chargingLocation: chargingLocations[1]._id,
        revenue: 14821
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 8),
        chargingLocation: chargingLocations[1]._id,
        revenue: 18723
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 9),
        chargingLocation: chargingLocations[1]._id,
        revenue: 16890
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 10),
        chargingLocation: chargingLocations[1]._id,
        revenue: 20320
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 11),
        chargingLocation: chargingLocations[1]._id,
        revenue: 11824
    },{
        date: new Date(beginningOfTheMonth).setMonth(beginningOfTheMonth.getMonth() - 12),
        chargingLocation: chargingLocations[1]._id,
        revenue: 16420
    }]

    const globalMonthlyStatistics = []
    var i;
    for(let i = 0; i < 12; i++) {
        const stat = {
            date: locationMonthlyStatistics[i].date,
            evcp: evcps[0]._id,
            revenue: locationMonthlyStatistics[i].revenue + locationMonthlyStatistics[i + 12].revenue
        }

        globalMonthlyStatistics.push(stat)
    }

    await MonthlyStatistics.insertMany(locationMonthlyStatistics)
    await MonthlyStatistics.insertMany(globalMonthlyStatistics)
    console.info('Inserted 12 months of revenue statistics (location and total) for', evcps[0].name)

    console.info('Seed finished.')
    process.exit()
}

seed()
