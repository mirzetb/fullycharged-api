const mongoose = require('mongoose')
require('./src/db/mongoose')

const ChargerType = require('./src/models/chargerType')
const VehicleModel = require('./src/models/vehicleModel')
const { EVO, EVCP } = require('./src/models/user')
const ChargingLocation = require('./src/models/chargingLocation')
const ChargingUnit = require('./src/models/chargingUnit')
const Booking = require('./src/models/booking')

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
        address: 'Boltzmannstraße 15, 85748 Garching Bei München',
        owner: evcps[0]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.671068, 48.265722]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'UnternehmerTUM',
        address: 'Lichtenbergstraße 6, 85748 Garching bei München',
        owner: evcps[0]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.665440, 48.267570]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Research and Technology House',
        address: 'Parkring 19, 85748 Garching bei München',
        owner: evcps[2]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.637680, 48.251940]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'The New Motion',
        address: 'Max-Joseph-Platz 4, 80539 München',
        owner: evcps[1]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.577920, 48.140000]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'Arabellapark',
        address: 'Arabellastraße 4, 81925 München',
        owner: evcps[1]._id,
        geoPoint: {
            type: 'Point',
            coordinates: [11.616900, 48.153221]
        }
    }, {
        _id: new mongoose.Types.ObjectId(),
        name: 'The New Motion',
        address: 'Lilli-Palmer Str. 2, 80636 München',
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
    const today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const bookings = [{
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 59, 59),
        chargingUnit: chargingUnits0[0]._id,
        evo: evos[0]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 59, 59),
        chargingUnit: chargingUnits0[0]._id,
        evo: evos[1]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 8, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 59, 59),
        chargingUnit: chargingUnits0[1]._id,
        evo: evos[2]._id
    }, {
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 59, 59),
        chargingUnit: chargingUnits0[1]._id,
        evo: evos[2]._id
    }]
    await Booking.insertMany(bookings)
    console.info('Inserted', bookings.length, 'bookings')

    console.info('Seed finished.')
    process.exit()
}

seed()
