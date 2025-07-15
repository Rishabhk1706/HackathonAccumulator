import MatchRequest from "../models/MatchRequest.js";

// Get all match requests
export const getAllMatchRequests = async (req, res) => {
  const requests = await MatchRequest.find()
    .populate("user", "name email")
    .populate("event", "title startDate");                    //added startDate 11-07
  res.status(200).json(requests);
};

// Get one by ID
export const getMatchRequestById = async (req, res) => {
  const request = await MatchRequest.findById(req.params.id)
    .populate("user", "name")
    .populate("event", "title");
  res.status(200).json(request);
};

// Create new match request — now with duplication check
export const createMatchRequest = async (req, res) => {
  try {
    const { event, maxTeamSize, lookingForRoles, skills } = req.body;

    if (!event || !maxTeamSize || !lookingForRoles || !skills) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Prevent multiple match requests by same user for same event
    const existing = await MatchRequest.findOne({
      user: req.user.id,
      event,
    });

    if (existing) {
      return res.status(400).json({
        error: "You have already created a match request for this event.",
      });
    }

    const newRequest = new MatchRequest({
      user: req.user.id,
      event,
      maxTeamSize,
      lookingForRoles,
      skills,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error creating match request:", err);
    res.status(500).json({ error: "Server error while creating match request." });
  }
};

// Update request                                                                                   //updated 15-07
export const updateMatchRequest = async (req, res) => {
  try {
    const match = await MatchRequest.findById(req.params.id);
    if (!match) return res.status(404).json({ error: "Match request not found." });

    Object.assign(match, req.body); // apply fields
    await match.save(); // trigger pre-save
    res.status(200).json(match);
  } catch (err) {
    console.error("Error updating match request:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// Delete request
export const deleteMatchRequest = async (req, res) => {
  const deleted = await MatchRequest.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};

//Apply request                                                                                           (added on 15-07)                                                                                             
import Event from "../models/Event.js"; // To check if user is registered

export const applyToMatchRequest = async (req, res) => {
  try {
    const { id } = req.params; // MatchRequest ID
    const { role, description } = req.body;
    const userId = req.user.id;

    if (!role) {
      return res.status(400).json({ error: "Role is required." });
    }

    const match = await MatchRequest.findById(id).populate("event");

    if (!match) {
      return res.status(404).json({ error: "Match request not found." });
    }

    // 1. Check if user is registered in the event
    const event = await Event.findById(match.event._id);
    const registeredIds = event.registeredUsers.map(id => id.toString());

    if (!registeredIds.includes(userId)) {
      return res.status(403).json({ error: "You must be registered for the event to apply." });
    }

    // 2. Check if user already applied
    const alreadyApplied = match.applicants.some(app => app.user.toString() === userId);
    if (alreadyApplied) {
      return res.status(400).json({ error: "You have already applied to this match request." });
    }

    // 3. Check if team is already full
    if (match.isTeamFull()) {
      return res.status(400).json({ error: "Team is already full." });
    }

    // 4. Push new applicant
    match.applicants.push({
      user: userId,
      role,
      description,
    });

    await match.save();
    res.status(200).json({ message: "Applied successfully." });

  } catch (err) {
    console.error("Error applying:", err);
    res.status(500).json({ error: "Server error while applying." });
  }
};