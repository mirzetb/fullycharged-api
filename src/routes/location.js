const express = require('express')
const router = express.Router()

const checkAuthentication = require('../middleware/auth')
const locationController = require('../controllers/location')

// GET /locations/search?sw=lat,long&ne=lat,long&startDate=YYYY-MM-DD&startTime=NN&price=NN.NN
router.get('/search', checkAuthentication, locationController.search)
// GET /locations/:id/analytics
router.get('/:id/analytics', checkAuthentication, locationController.locationAnalytics)
// GET /locations/analytics
router.get('/analytics', checkAuthentication, locationController.globalAnalytics)
router.post('/addlocation', locationController.addLocation);
router.get('/alllocations', locationController.getAllLocations);
router.get('/chargertypes', locationController.getChargerTypes);

module.exports = router;