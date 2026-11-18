const Recommendation = require("../models/Recommendation");
const Notification = require("../models/Notification");

const normalizeLink = (value) => {
    if (!value) return "";
    const link = String(value).trim();
    let parsed;
    try { parsed = new URL(link); } catch { return null; }
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.toString() : null;
};

const createRecommendation = async (req, res) => {
    try {
        const { Title, Description, Category, Reason, Link } = req.body;
        if (!Title?.trim() || !Description?.trim()) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const safeLink = normalizeLink(Link);
        if (safeLink === null) {
            return res.status(400).json({ message: "Please enter a valid http or https link" });
        }
        const recommendation = await Recommendation.create({
            Title: Title.trim(),
            Description: Description.trim(),
            Category: Category || "general",
            Reason: Reason?.trim() || "",
            Link: safeLink,
            Owner: req.user._id,
            Status: "pending"
        });
        res.status(201).json({ message: "Recommendation submitted successfully", recommendation });
    } catch (error) {
        console.error("Create Recommendation Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getMyRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ Owner: req.user._id })
            .populate("Owner", "Name Role")
            .sort({ createdAt: -1 });
        res.status(200).json({ count: recommendations.length, recommendations });
    } catch (error) {
        console.error("Get My Recommendations Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const getPublicRecommendations = async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ Status: { $in: ["reviewed", "resolved"] } })
            .populate("Owner", "Name CollegeEmail")
            .sort({ createdAt: -1 });
        res.status(200).json({ count: recommendations.length, recommendations });
    } catch (error) {
        console.error("Get Public Recommendations Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const resolveRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.id);
        if (!recommendation) return res.status(404).json({ message: "Recommendation not found" });
        recommendation.Status = "resolved";
        await recommendation.save();
        await Notification.create({
            Recipient: recommendation.Owner,
            Type: "recommendation_resolved",
            Message: `Your recommendation "${recommendation.Title}" has been resolved.`
        });
        res.status(200).json({ message: "Recommendation resolved successfully", recommendation });
    } catch (error) {
        console.error("Resolve Recommendation Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const deleteRecommendation = async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.id);
        if (!recommendation) return res.status(404).json({ message: "Recommendation not found" });
        const isOwner = recommendation.Owner.toString() === req.user._id.toString();
        const isAdmin = req.user.Role === "admin";
        if (!isOwner && !isAdmin) return res.status(403).json({ message: "You can only delete your own recommendation" });
        await recommendation.deleteOne();
        res.status(200).json({ message: "Recommendation deleted successfully" });
    } catch (error) {
        console.error("Delete Recommendation Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const toggleHelpful = async (req, res) => {
    try {
        const recommendation = await Recommendation.findById(req.params.id);
        if (!recommendation) return res.status(404).json({ message: "Recommendation not found" });
        if (recommendation.Status === "pending") return res.status(400).json({ message: "This recommendation is not public yet" });
        const userId = req.user._id.toString();
        const alreadyHelpful = recommendation.HelpfulBy.some((id) => id.toString() === userId);
        if (alreadyHelpful) {
            recommendation.HelpfulBy = recommendation.HelpfulBy.filter((id) => id.toString() !== userId);
        } else {
            recommendation.HelpfulBy.push(req.user._id);
        }
        await recommendation.save();
        res.status(200).json({
            message: alreadyHelpful ? "Helpful vote removed" : "Marked as helpful",
            helpfulCount: recommendation.HelpfulBy.length,
            isHelpful: !alreadyHelpful
        });
    } catch (error) {
        console.error("Toggle Helpful Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRecommendation,
    getMyRecommendations,
    getPublicRecommendations,
    resolveRecommendation,
    deleteRecommendation,
    toggleHelpful
};
