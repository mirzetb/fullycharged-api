const express = require('express')
const router = express.Router()

const vehicleController = require('../controllers/vehicle')

// GET /vehicles
router.get('', vehicleController.list)

module.exports = router