const BookingModel = require("../models/booking");

// GET request
const bookingList = async (req, res) => {
  const bookingDetails = await BookingModel.find();

  res.send(bookingDetails);
};

// GET request
const oneBooking = async (req, res) => {
  const oneBookingDetails = await BookingModel.findById(req.params.id);

  res.send(oneBookingDetails);
};

// PUT request
const cancelOneBooking = async (req, res) => {
  const _id = req.params.id;

  const canceledBooking = await BookingModel.findById(_id);

  if (!_id) {
    return res.status(404).send("data is not found");
  } else {
    canceledBooking.canceled = true;
    canceledBooking
      .save()
      .then(_id => {
        res.json("Booking Cancelled");
      })
      .catch(err => {
        res.status(400).send("Booking cannot be cancelled now.");
      });
  }
};

module.exports = {
  bookingList,
  oneBooking,
  cancelOneBooking
};
