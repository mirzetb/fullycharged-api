const express = require('express')
const router = express.Router()

const checkAuthentication = require('../middleware/auth')
const bookingController = require('../controllers/booking')

// POST /bookings
router.post('', checkAuthentication, bookingController.book)

// GET /bookings?limit=N&skip=N
router.get('', checkAuthentication, bookingController.list)

// PATCH /bookings/:id/cancel
router.patch('/:id/cancel', checkAuthentication, bookingController.cancel)

// PATCH /bookings/authorize
router.patch('/authorize', checkAuthentication, bookingController.authorize)

// PATCH /bookings/:id/charge
router.patch('/:id/charge', checkAuthentication, bookingController.charge)

module.exports = router