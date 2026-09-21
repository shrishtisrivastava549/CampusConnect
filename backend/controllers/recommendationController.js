const Recommendation = require("../models/Recommendation");
const Notification = require("../models/Notification");

// =========================
// CREATE RECOMMENDATION
// =========================

const createRecommendation = async (req, res) => {
    try {
        const {
            Title,
            Description,
            Category
        } = req.body;

        const recommendation = await Recommendation.create({
            Title,
            Description,
            Category,
            Owner: req.user._id,
            Status: "pending"
        });

        res.status(201).json({
            message: "Recommendation submitted successfully",
            recommendation
        });

    } catch (error) {
        console.log("Create Recommendation Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET MY RECOMMENDATIONS
// =========================

const getMyRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({
            Owner: req.user._id
        });

        res.status(200).json({
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.log("Get My Recommendations Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET REVIEWED/RESOLVED RECOMMENDATIONS
// =========================

const getPublicRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({
            Status: {
                $in: ["reviewed", "resolved"]
            }
        }).populate(
            "Owner",
            "Name CollegeEmail"
        );

        res.status(200).json({
            count: recommendations.length,
            recommendations
        });

    } catch (error) {
        console.log("Get Public Recommendations Error:", error);

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
        const recommendation = await Recommendation.findById(
            req.params.id
        );

        if (!recommendation) {
            return res.status(404).json({
                message: "Recommendation not found"
            });
        }

        recommendation.Status = "resolved";

        await recommendation.save();

        await Notification.create({
            Recipient: recommendation.Owner,
            Type: "recommendation_resolved",
            Message: `Your recommendation "${recommendation.Title}" has been resolved.`
        });

        res.status(200).json({
            message: "Recommendation resolved successfully",
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
    createRecommendation,
    getMyRecommendations,
    getPublicRecommendations,
    resolveRecommendation
};