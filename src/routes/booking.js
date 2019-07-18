const express = require('express')
const router = express.Router()

const checkAuthentication = require('../middleware/auth')
const bookingController = require('../controllers/booking')

// POST /bookings
router.post('', checkAuthentication, bookingController.book)

module.exports = router