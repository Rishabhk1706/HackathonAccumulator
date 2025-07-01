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
    .populate("college", "name");
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
