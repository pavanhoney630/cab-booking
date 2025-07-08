const Ticket = require('../../models/AdminModels/ticket.model');
const Message = require('../../models/ChatModel/messages.model');

// Generate auto ticket ID with prefix
const generateTicketId = async () => {
  const PREFIX = '6304334';
  const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

  let number = 1;
  if (lastTicket && lastTicket.ticketId) {
    const lastNum = parseInt(lastTicket.ticketId.slice(PREFIX.length), 10);
    number = lastNum + 1;
  }

  const padded = String(number).padStart(3, '0');
  return `${PREFIX}${padded}`;
};
// Raise a new support ticket
const raiseTicket = async (req, res) => {
  try {
    const { issue } = req.body;
    if (!issue) return res.status(400).json({ message: 'Issue is required' });

    const ticketId = await generateTicketId();

    const newTicket = new Ticket({
      ticketId,
      issue,
      userId: req.driver._id,              // ✅ From middleware
      userType: req.auth.type || 'Driver'  // ✅ 'SelfRegistered' or 'AdminAdded'
    });
    console.log(newTicket);

    await newTicket.save();

    return res.status(201).json({ success: true, ticket: newTicket });
  } catch (err) {
    console.error('Error raising ticket:', err);
    return res.status(500).json({ message: 'Failed to Raise Ticket' });
  }
};

// Get all tickets raised by a driver (for now, dummy - real would use driverId)
const getTickets = async (req, res) => {
  try {
    const userId = req.driver._id;
    console.log(userId)
    const userType = req.auth.type ;

    const tickets = await Ticket.find({ userId}).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ tickets,userType, success:true});
  } catch (err) {
    console.error('Error fetching tickets:', err);
    return res.status(500).json({ message: 'Failed to fetch Tickets' });
  }
};

// Get messages related to a ticket
const getTicketMessages = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const messages = await Message.find({ ticketId }).sort({ createdAt: 1 }).lean();
    return res.status(200).json({ messages, success:true });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return res.status(500).json({ message: 'Failed to fetch Ticket Messages' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { content } = req.body;

    // Simulated driverId from auth middleware (you must implement it)
   const driverId = req.driver?._id;
    const senderType = 'Driver';
    const receiverId = 'SupportTeam'
    const receiverType = 'Support'; 

    if (!content) {
      return res.status(400).json({ message: "Message content is required" });
    }

    // ✅ Validate that ticket exists
    const ticketExists = await Ticket.findOne({ ticketId, userId: driverId });
    if (!ticketExists) return res.status(404).json({ message: "Ticket not found" });

    // ✅ Create and save message
    const newMessage = new Message({
      senderId: driverId,
      senderType,
      receiverId,
      receiverType,
      content,
      ticketId,
      read: false
    });

    await newMessage.save();

    res.status(201).json({ success: true, message: newMessage });

  } catch (err) {
    console.error("Message send error:", err);
    res.status(500).json({ message: "Failed to send Message" });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['Ongoing', 'Solved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId },
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, ticket: updatedTicket });
  } catch (err) {
    console.error('Error updating ticket status:', err);
    res.status(500).json({ message: 'Failed to Update Ticket' });
  }
};


module.exports = {
  raiseTicket,
  getTickets,
  getTicketMessages,
  sendMessage,
  updateTicketStatus
};
