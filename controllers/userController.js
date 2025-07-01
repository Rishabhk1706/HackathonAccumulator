import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().populate("college", "name");
  res.status(200).json(users);
};

// Get by ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate("college", "name");
  res.status(200).json(user);
};

// Update
export const updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

// Delete
export const deleteUser = async (req, res) => {
  const deleted = await User.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};
