const Reply = require("../models/Reply");
const Query = require("../models/Query");
const Notification = require("../models/Notification");

// =========================
// ADD REPLY
// =========================

const addReply = async (req, res) => {
    try {
        const { queryId } = req.params;
        const { Content } = req.body;

        const query = await Query.findById(queryId);

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        if (query.Status !== "open") {
            return res.status(400).json({
                message: "Replies can only be added to open queries"
            });
        }

        if (!Content || !Content.trim()) {
            return res.status(400).json({
                message: "Reply content is required"
            });
        }

        const reply = await Reply.create({
            Query: queryId,
            Owner: req.user._id,
            Content: Content.trim()
        });

        // =========================
        // CREATE REPLY NOTIFICATION
        // =========================

        if (
            query.Owner.toString() !==
            req.user._id.toString()
        ) {
            await Notification.create({
                Recipient: query.Owner,
                Type: "query_reply",
                Message: "Someone replied to your query: " + query.Title
            });
        }

        await reply.populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(201).json({
            message: "Reply added successfully",
            reply
        });

    } catch (error) {
        console.log("Add Reply Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET REPLIES FOR QUERY
// =========================

const getReplies = async (req, res) => {
    try {
        const { queryId } = req.params;

        const query = await Query.findById(queryId);

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        const replies = await Reply.find({
            Query: queryId
        })
            .populate(
                "Owner",
                "Name Role CollegeEmail PersonalEmail"
            )
            .sort({ createdAt: 1 });

        res.status(200).json({
            count: replies.length,
            replies
        });

    } catch (error) {
        console.log("Get Replies Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// DELETE OWN REPLY
// =========================

const deleteOwnReply = async (req, res) => {
    try {
        const { id } = req.params;

        const reply = await Reply.findById(id);

        if (!reply) {
            return res.status(404).json({
                message: "Reply not found"
            });
        }

        if (
            reply.Owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only delete your own reply"
            });
        }

        await Reply.findByIdAndDelete(id);

        res.status(200).json({
            message: "Reply deleted successfully"
        });

    } catch (error) {
        console.log("Delete Own Reply Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// ADMIN DELETE REPLY
// =========================

const adminDeleteReply = async (req, res) => {
    try {
        const { id } = req.params;

        const reply = await Reply.findById(id);

        if (!reply) {
            return res.status(404).json({
                message: "Reply not found"
            });
        }

        await Reply.findByIdAndDelete(id);

        res.status(200).json({
            message: "Reply deleted successfully by admin"
        });

    } catch (error) {
        console.log("Admin Delete Reply Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    addReply,
    getReplies,
    deleteOwnReply,
    adminDeleteReply
};