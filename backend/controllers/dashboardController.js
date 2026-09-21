const User = require("../models/User");
const Resource = require("../models/Resource");
const Note = require("../models/Note");
const Project = require("../models/Project");
const Query = require("../models/Query");
const Notification = require("../models/Notification");
const Recommendation = require("../models/Recommendation");

// =========================
// STUDENT DASHBOARD
// =========================

const getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const [
            resources,
            notes,
            projects,
            queries,
            notifications
        ] = await Promise.all([
            Resource.find({ Owner: userId }),
            Note.find({ Owner: userId }),
            Project.find({ Owner: userId }),
            Query.find({ Owner: userId }),
            Notification.find({ Recipient: userId })
                .sort({ createdAt: -1 })
                .limit(10)
        ]);

        res.status(200).json({
            counts: {
                resources: resources.length,
                notes: notes.length,
                projects: projects.length,
                queries: queries.length,
                notifications: notifications.length
            },

            resources,
            notes,
            projects,
            queries,
            notifications
        });

    } catch (error) {
        console.log("Student Dashboard Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// ADMIN DASHBOARD
// =========================

const getAdminDashboard = async (req, res) => {
    try {
        const [
            pendingUsers,
            pendingResources,
            pendingNotes,
            pendingProjects,
            pendingRecommendations,
            totalUsers,
            totalResources,
            totalNotes,
            totalProjects,
            totalQueries
        ] = await Promise.all([
            User.find({ Status: "pending" }),
            Resource.find({ Status: "pending" }),
            Note.find({ Status: "pending" }),
            Project.find({ Status: "pending" }),
            Recommendation.find({ Status: "pending" }),

            User.countDocuments(),
            Resource.countDocuments(),
            Note.countDocuments(),
            Project.countDocuments(),
            Query.countDocuments()
        ]);

        res.status(200).json({
            pendingCounts: {
                users: pendingUsers.length,
                resources: pendingResources.length,
                notes: pendingNotes.length,
                projects: pendingProjects.length,
                recommendations: pendingRecommendations.length
            },

            statistics: {
                totalUsers,
                totalResources,
                totalNotes,
                totalProjects,
                totalQueries
            },

            pendingUsers,
            pendingResources,
            pendingNotes,
            pendingProjects,
            pendingRecommendations
        });

    } catch (error) {
        console.log("Admin Dashboard Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getStudentDashboard,
    getAdminDashboard
};