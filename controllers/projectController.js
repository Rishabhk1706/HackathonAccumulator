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
    .populate("selectedUsers.user", "name email")                                 //14-07 added email
    .populate("applicants.user", "_id name email");                               //14-07 added name email
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
  try {
    const project = await ProjectPosting.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const { $push, $pull, ...rest } = req.body;                                                           //update controller updated 14-07
                                                                                                      
    // Handle $push
    if ($push?.selectedUsers) {
      project.selectedUsers.push($push.selectedUsers);
    }

    // Handle $pull
    if ($pull?.selectedUsers) {
      const userIdToRemove = $pull.selectedUsers.user?.toString?.();
      project.selectedUsers = project.selectedUsers.filter(
        entry => entry.user?.toString() !== userIdToRemove
      );
    }

    // Handle regular updates (title, description, etc.)
    Object.assign(project, rest);

    await project.save(); // This triggers isFull() → status update

    res.status(200).json(project);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: "Failed to update project" });
  }
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
    user: req.user.id,                                                                          //14-07
    message: req.body.message || ""
  });

  await project.save();
  res.status(200).json({ success: true, message: "Applied successfully" });
};