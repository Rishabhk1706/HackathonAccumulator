import Event from "../models/Event.js";

// Get all events
export const getAllEvents = async (req, res) => {
  const events = await Event.find()
    .populate("createdBy", "name email")
    .populate("college", "name");
  res.status(200).json(events);
};

// Get event by ID
export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("createdBy", "name")
    .populate("college", "name")
    .populate({
      path: "registeredUsers",
      select: "name email college",
      populate: { path: "college", select: "name" }                                          //updated by id controller 12-07
    });

  res.status(200).json(event);
};

// Create a new event
export const createEvent = async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.status(201).json(newEvent);
};

// Update event
export const updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

// Delete event
export const deleteEvent = async (req, res) => {
  const deleted = await Event.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};

// Register user for event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }

    // Check if event is full
    if (event.isFull()) {
      return res.status(400).json({ error: "Event has reached max participants." });
    }

    // Register user
    event.registeredUsers.push(req.user.id);
    await event.save();

    res.status(200).json({ message: "Successfully registered for the event." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error while registering." });
  }
};