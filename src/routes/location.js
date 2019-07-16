const express = require('express')
const router = express.Router()

const checkAuthentication = require('../middleware/auth')
const locationController = require('../controllers/location')

router.get('/search', checkAuthentication, locationController.search)
router.get('/:id/analytics', checkAuthentication, locationController.locationAnalytics)
router.get('/analytics', checkAuthentication, locationController.globalAnalytics)

module.exports = router