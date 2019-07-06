const express = require('express');
const router = express.Router();
const chargingLocationController = require('../controllers/chargingLocation');

router.post('/addlocation', chargingLocationController.addLocation);

module.exports = router;