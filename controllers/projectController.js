import ProjectPosting from "../models/ProjectPosting.js";

// Get all project postings
export const getAllProjects = async (req, res) => {
  const projects = await ProjectPosting.find()
    .populate("postedBy", "name email")
    .populate("selectedUsers.user", "name");
  res.status(200).json(projects);
};

// Get a single project
export const getProjectById = async (req, res) => {
  const project = await ProjectPosting.findById(req.params.id)
    .populate("postedBy", "name")
    .populate("selectedUsers.user", "name");
  res.status(200).json(project);
};

// Create a new project
export const createProject = async (req, res) => {
  const newProject = new ProjectPosting(req.body);
  await newProject.save();
  res.status(201).json(newProject);
};

// Update project
export const updateProject = async (req, res) => {
  const updated = await ProjectPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
};

// Delete project
export const deleteProject = async (req, res) => {
  const deleted = await ProjectPosting.findByIdAndDelete(req.params.id);
  res.status(200).json(deleted);
};
