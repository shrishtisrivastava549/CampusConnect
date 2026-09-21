
const Project = require("../models/Project");
const Notification = require("../models/Notification");

// =========================
// CREATE PROJECT
// =========================

const createProject = async (req, res) => {
    try {
        const {
            Title,
            Description,
            Technology,
            Course,
            Semester
        } = req.body;

        const project = await Project.create({
            Title,
            Description,
            Technology,
            Course,
            Semester,
            Owner: req.user._id,
            Status: "pending"
        });

        res.status(201).json({
            message: "Project submitted successfully",
            project
        });

    } catch (error) {
        console.log("Create Project Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET APPROVED PROJECTS
// =========================

const getApprovedProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            Status: "approved"
        }).populate(
            "Owner",
            "Name CollegeEmail"
        );

        res.status(200).json({
            count: projects.length,
            projects
        });

    } catch (error) {
        console.log(
            "Get Approved Projects Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET MY PROJECTS
// =========================

const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            Owner: req.user._id
        });

        res.status(200).json({
            count: projects.length,
            projects
        });

    } catch (error) {
        console.log(
            "Get My Projects Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING PROJECTS
// ADMIN
// =========================

const getPendingProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            Status: "pending"
        }).populate(
            "Owner",
            "Name CollegeEmail"
        );

        res.status(200).json({
            count: projects.length,
            projects
        });

    } catch (error) {
        console.log(
            "Get Pending Projects Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE PROJECT
// ADMIN
// =========================

const approveProject = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        project.Status = "approved";

        await project.save();

        await Notification.create({
            Recipient: project.Owner,
            Type: "project_approved",
            Message: `Your project "${project.Title}" has been approved.`
        });

        res.status(200).json({
            message: "Project approved successfully",
            project
        });

    } catch (error) {
        console.log(
            "Approve Project Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// UPDATE PROJECT
// =========================

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            project.Owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only update your own project"
            });
        }

        const {
            Title,
            Description,
            Technology,
            Course,
            Semester
        } = req.body;

        if (Title !== undefined) {
            project.Title = Title;
        }

        if (Description !== undefined) {
            project.Description = Description;
        }

        if (Technology !== undefined) {
            project.Technology = Technology;
        }

        if (Course !== undefined) {
            project.Course = Course;
        }

        if (Semester !== undefined) {
            project.Semester = Semester;
        }

        // Updated projects need admin approval again
        project.Status = "pending";

        await project.save();

        res.status(200).json({
            message:
                "Project updated and submitted for approval",
            project
        });

    } catch (error) {
        console.log(
            "Update Project Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// DELETE PROJECT
// =========================

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        if (
            project.Owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can only delete your own project"
            });
        }

        await Project.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.log(
            "Delete Project Error:",
            error
        );

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    createProject,
    getApprovedProjects,
    getMyProjects,
    getPendingProjects,
    approveProject,
    updateProject,
    deleteProject
};