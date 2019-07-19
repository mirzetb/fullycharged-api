const express = require('express')
const router = express.Router()

const checkAuthentication = require('../middleware/auth')
const locationController = require('../controllers/location')

router.get('/search', checkAuthentication, locationController.search);
router.get('/:id/analytics', checkAuthentication, locationController.locationAnalytics);
router.get('/analytics', checkAuthentication, locationController.globalAnalytics);
router.post('/addlocation', locationController.addLocation);
router.get('/alllocations', locationController.getAllLocations);
router.get('/chargertypes', locationController.getChargerTypes);

module.exports = router;