const express = require('express');
const router = express.Router();
const {
  raiseTicket,
  getTickets,
  getTicketMessages,
  sendMessage,
  updateTicketStatus
} = require('../../controllers/DriverControllers/driversupport.controller');
 
const { driverAuthToken } = require("../../middlewares/driver.middleware");
 
 
// 🔹 Create a new ticket
router.post('/raise-ticket', driverAuthToken,raiseTicket);
 
// 🔹 Get all tickets for the driver (in future: use auth/driverId)
router.get('/my-tickets',driverAuthToken, getTickets);
 
// 🔹 Get all messages for a specific ticket (chat history)
router.get('/ticket/:ticketId/messages',driverAuthToken, getTicketMessages);
 
router.post('/ticket/:ticketId/message',driverAuthToken, sendMessage);
 
router.put('/ticket/:ticketId/status', updateTicketStatus);
 
module.exports = router;