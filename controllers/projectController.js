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
    .populate("selectedUsers.user", "name")
    .populate("applicants.user", "_id"); // ✅ Add this line
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

// Apply to a project
export const applyToProject = async (req, res) => {
  const project = await ProjectPosting.findById(req.params.id);
  if (!project) return res.status(404).json({ error: "Project not found" });

  const alreadyApplied = project.applicants.some(app => {
    const appUserId = app.user?.toString?.();
    const reqUserId = req.user._id?.toString?.();
    return appUserId === reqUserId;
  });
  if (alreadyApplied) return res.status(400).json({ error: "Already applied" });

  project.applicants.push({
    user: req.user._id,
    message: req.body.message || ""
  });

  await project.save();
  res.status(200).json({ success: true, message: "Applied successfully" });
};