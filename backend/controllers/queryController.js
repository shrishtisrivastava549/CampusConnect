const Query = require("../models/Query");

// =========================
// CREATE QUERY
// =========================

const createQuery = async (req, res) => {
    try {
        const {
            Title,
            Description,
            Category
        } = req.body;

        const query = await Query.create({
            Title,
            Description,
            Category,
            Owner: req.user._id,
            Status: "open"
        });

        res.status(201).json({
            message: "Query submitted successfully",
            query
        });

    } catch (error) {
        console.log("Create Query Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET ALL OPEN QUERIES
// =========================

const getOpenQueries = async (req, res) => {
    try {
        const queries = await Query.find({
            Status: "open"
        }).populate(
            "Owner",
            "Name Role CollegeEmail PersonalEmail"
        );

        res.status(200).json({
            count: queries.length,
            queries
        });

    } catch (error) {
        console.log("Get Open Queries Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET MY QUERIES
// =========================

const getMyQueries = async (req, res) => {
    try {
        const queries = await Query.find({
            Owner: req.user._id
        });

        res.status(200).json({
            count: queries.length,
            queries
        });

    } catch (error) {
        console.log("Get My Queries Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// RESOLVE QUERY
// =========================

const resolveQuery = async (req, res) => {
    try {
        const { id } = req.params;

        const query = await Query.findById(id);

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        if (
            query.Owner.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "You can only resolve your own query"
            });
        }

        query.Status = "resolved";

        await query.save();

        res.status(200).json({
            message: "Query resolved successfully",
            query
        });

    } catch (error) {
        console.log("Resolve Query Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// ADMIN REJECT QUERY
// =========================

const rejectQuery = async (req, res) => {
    try {
        const { id } = req.params;

        const query = await Query.findById(id);

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        query.Status = "rejected";

        await query.save();

        res.status(200).json({
            message: "Query rejected successfully",
            query
        });

    } catch (error) {
        console.log("Reject Query Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// ADMIN DELETE QUERY
// =========================

const deleteQuery = async (req, res) => {
    try {
        const { id } = req.params;

        const query = await Query.findById(id);

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }

        await Query.findByIdAndDelete(id);

        res.status(200).json({
            message: "Query deleted successfully"
        });

    } catch (error) {
        console.log("Delete Query Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    createQuery,
    getOpenQueries,
    getMyQueries,
    resolveQuery,
    rejectQuery,
    deleteQuery
};