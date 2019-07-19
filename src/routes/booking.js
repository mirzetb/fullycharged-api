const express = require("express");
const router = express.Router();

const checkAuthentication = require("../middleware/auth");
const bookingController = require("../controllers/booking");

const BookingModel = require("../models/booking");

router.get("/allbookings", checkAuthentication, bookingController.bookingList);
router.get("/bookingid/:id", checkAuthentication, bookingController.oneBooking);
router.put(
  "/cancelbookingid/:id",
  checkAuthentication,
  bookingController.cancelOneBooking
);

module.exports = router;
