const express = require('express');
const router = express.Router();
const {
  raiseTicket,
  getTickets,
  getTicketMessages,
  sendMessage,
  updateTicketStatus
} = require('../../controllers/UserController/userSupport.controller');
 
const { userValidateToken } = require('../../middlewares/user.middleware');
 
 
// 🔹 Create a new ticket
router.post('/raise-ticket', userValidateToken,raiseTicket);
 
// 🔹 Get all tickets for the driver (in future: use auth/driverId)
router.get('/my-tickets',userValidateToken, getTickets);
 
// 🔹 Get all messages for a specific ticket (chat history)
router.get('/ticket/:ticketId/messages',userValidateToken, getTicketMessages);
 
router.post('/ticket/:ticketId/message',userValidateToken, sendMessage);
 
router.put('/ticket/:ticketId/status', updateTicketStatus);
 
module.exports = router;