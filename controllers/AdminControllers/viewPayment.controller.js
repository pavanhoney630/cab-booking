const Booking = require("../../models/AdminModels/bookings.model");

// ✅ Controller to get booking/payment details by ID
const viewPaymentDetails = async (req, res) => {
  try {
    const {id} = req.params;
    console.log("Booking ID:", id);

    const booking = await Booking.findById(id);
    console.log("Booking Details:", booking);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        customerName: booking.customerName,
        driverName: booking.driverName,
        createdAt: booking.createdAt,
        pickupLocation: booking.pickupLocation,
        stoppage: booking.stoppage || "NA",
        destination: booking.destination,
        transactionId: booking.bookingId || "fetching Id",
        modeOfPayment: booking.modeOfPayment,
        advancePayment: booking.advancePayment,
        finalPayment: booking.finalPayment,
        totalAmount: booking.totalAmount,
      },
    });
  } catch (error) {
    console.error("Error in getBookingPaymentDetails:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  viewPaymentDetails,
};
