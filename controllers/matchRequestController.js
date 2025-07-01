import MatchRequest from "../models/MatchRequest.js";

// Get all match requests
export const getAllMatchRequests = async (req, res) => {
  const requests = await MatchRequest.find()
    .populate("user", "name email")
    .populate("event", "title");
  res.status(200).json(requests);
};

// Get one by ID
export const getMatchRequestById = async (req, res) => {
  const request = await MatchRequest.findById(req.params.id)
    .populate("user", "name")
    .populate("event", "title");
  res.status(200).json(request);
};

// Create new match request
export const createMatchRequest = async (req, res) => {
  const newRequest = new MatchRequest(req.body);
  await newRequest.save();
  res.status(201).json(newRequest);
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
