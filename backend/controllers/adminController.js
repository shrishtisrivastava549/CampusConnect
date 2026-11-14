const User = require("../models/User");
const Resource = require("../models/Resource");
const Note = require("../models/Note");
const Project = require("../models/Project");
const Recommendation = require("../models/Recommendation");
const Notification = require("../models/Notification");

// =========================
// GET PENDING USERS
// =========================

const getPendingUsers = async (req, res) => {

    try {

        const users = await User.find({
            AccountStatus: "pending",
            Role: "student"
        }).select("-Password");

        res.status(200).json({
            message: "Pending users fetched successfully",
            count: users.length,
            users
        });

    } catch (error) {

        console.log("Get Pending Users Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE USER
// =========================

const approveUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.AccountStatus = "approved";

        await user.save();

        res.status(200).json({
            message: "User approved successfully",
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.CollegeEmail || user.PersonalEmail,
                Role: user.Role,
                AccountStatus: user.AccountStatus
            }
        });

    } catch (error) {

        console.log("Approve User Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// REJECT USER
// =========================

const rejectUser = async (req, res) => {

    try {

        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.AccountStatus = "rejected";

        await user.save();

        res.status(200).json({
            message: "User rejected successfully",
            user: {
                _id: user._id,
                Name: user.Name,
                Email: user.CollegeEmail || user.PersonalEmail,
                Role: user.Role,
                AccountStatus: user.AccountStatus
            }
        });

    } catch (error) {

        console.log("Reject User Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING RESOURCES
// =========================

const getPendingResources = async (req, res) => {

    try {

        const resources = await Resource.find({
            Status: "pending"
        }).populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(200).json({
            message: "Pending resources fetched successfully",
            count: resources.length,
            resources
        });

    } catch (error) {

        console.log("Get Pending Resources Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE RESOURCE
// =========================

const approveResource = async (req, res) => {

    try {

        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        resource.Status = "approved";

        await resource.save();

        // =========================
        // CREATE RESOURCE APPROVAL NOTIFICATION
        // =========================

        await Notification.create({
            Recipient: resource.Owner,
            Type: "resource_approved",
            Message: "Your resource has been approved: " + resource.Title
        });

        res.status(200).json({
            message: "Resource approved successfully",
            resource
        });

    } catch (error) {

        console.log("Approve Resource Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// REJECT RESOURCE
// =========================

const rejectResource = async (req, res) => {

    try {

        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        resource.Status = "rejected";

        await resource.save();

        res.status(200).json({
            message: "Resource rejected successfully",
            resource
        });

    } catch (error) {

        console.log("Reject Resource Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING NOTES
// =========================

const getPendingNotes = async (req, res) => {

    try {

        const notes = await Note.find({
            Status: "pending"
        }).populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(200).json({
            message: "Pending notes fetched successfully",
            count: notes.length,
            notes
        });

    } catch (error) {

        console.log("Get Pending Notes Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE NOTE
// =========================

const approveNote = async (req, res) => {

    try {

        const { id } = req.params;

        const note = await Note.findById(id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        note.Status = "approved";

        await note.save();

        // =========================
        // CREATE NOTE APPROVAL NOTIFICATION
        // =========================

        await Notification.create({
            Recipient: note.Owner,
            Type: "note_approved",
            Message: "Your note has been approved: " + note.Title
        });

        res.status(200).json({
            message: "Note approved successfully",
            note
        });

    } catch (error) {

        console.log("Approve Note Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// REJECT NOTE
// =========================

const rejectNote = async (req, res) => {

    try {

        const { id } = req.params;

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        note.Status = "rejected";

        await note.save();

        res.status(200).json({
            message: "Note rejected successfully",
            note
        });

    } catch (error) {

        console.log("Reject Note Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING PROJECTS
// =========================

const getPendingProjects = async (req, res) => {

    try {

        const projects = await Project.find({
            Status: "pending"
        }).populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(200).json({
            message: "Pending projects fetched successfully",
            count: projects.length,
            projects
        });

    } catch (error) {

        console.log("Get Pending Projects Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// APPROVE PROJECT
// =========================

const approveProject = async (req, res) => {

    try {

        const { id } = req.params;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        project.Status = "approved";

        await project.save();

        // =========================
        // CREATE PROJECT APPROVAL NOTIFICATION
        // =========================

        await Notification.create({
            Recipient: project.Owner,
            Type: "project_approved",
            Message: "Your project has been approved: " + project.Title
        });

        res.status(200).json({
            message: "Project approved successfully",
            project
        });

    } catch (error) {

        console.log("Approve Project Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// REJECT PROJECT
// =========================

const rejectProject = async (req, res) => {

    try {

        const { id } = req.params;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        project.Status = "rejected";

        await project.save();

        res.status(200).json({
            message: "Project rejected successfully",
            project
        });

    } catch (error) {

        console.log("Reject Project Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET PENDING RECOMMENDATIONS
// =========================

const getPendingRecommendations = async (req, res) => {

    try {

        const recommendations = await Recommendation.find({
            Status: "pending"
        }).populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(200).json({
            message: "Pending recommendations fetched successfully",
            count: recommendations.length,
            recommendations
        });

    } catch (error) {

        console.log("Get Pending Recommendations Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// REVIEW RECOMMENDATION
// =========================

const reviewRecommendation = async (req, res) => {

    try {

        const { id } = req.params;

        const recommendation = await Recommendation.findById(id);

        if (!recommendation) {
            return res.status(404).json({
                message: "Recommendation not found"
            });
        }

        recommendation.Status = "reviewed";

        await recommendation.save();

        res.status(200).json({
            message: "Recommendation marked as reviewed",
            recommendation
        });

    } catch (error) {

        console.log("Review Recommendation Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// RESOLVE RECOMMENDATION
// =========================

const resolveRecommendation = async (req, res) => {

    try {

        const { id } = req.params;

        const recommendation = await Recommendation.findById(id);

        if (!recommendation) {
            return res.status(404).json({
                message: "Recommendation not found"
            });
        }

        recommendation.Status = "resolved";

        await recommendation.save();

        // =========================
        // CREATE RECOMMENDATION RESOLVED NOTIFICATION
        // =========================

        await Notification.create({
            Recipient: recommendation.Owner,
            Type: "recommendation_resolved",
            Message: "Your recommendation has been resolved"
        });

        res.status(200).json({
            message: "Recommendation marked as resolved",
            recommendation
        });

    } catch (error) {

        console.log("Resolve Recommendation Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser,

    getPendingResources,
    approveResource,
    rejectResource,

    getPendingNotes,
    approveNote,
    rejectNote,

    getPendingProjects,
    approveProject,
    rejectProject,

    getPendingRecommendations,
    reviewRecommendation,
    resolveRecommendation
};



