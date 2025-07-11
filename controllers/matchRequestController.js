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

// Update request
export const updateMatchRequest = async (req, res) => {
  const updated = await MatchRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

// Delete request
export const deleteMatchRequest = async (req, res) => {
  const deleted = await MatchRequest.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};
