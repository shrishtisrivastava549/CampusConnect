const Resource = require("../models/Resource");
const Note = require("../models/Note");
const Project = require("../models/Project");
const Query = require("../models/Query");

// =========================
// GLOBAL SEARCH
// =========================

const globalSearch = async (req, res) => {

    try {

        const searchText = req.query.query;

        if (!searchText || !searchText.trim()) {
            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const regex = new RegExp(searchText.trim(), "i");

        const [resources, notes, projects, queries] = await Promise.all([

            Resource.find({
                Status: "approved",
                $or: [
                    { Title: regex },
                    { Description: regex }
                ]
            }),

            Note.find({
                Status: "approved",
                $or: [
                    { Title: regex },
                    { Subject: regex },
                    { Description: regex }
                ]
            }),

            Project.find({
                Status: "approved",
                $or: [
                    { Title: regex },
                    { Description: regex }
                ]
            }),

            Query.find({
                Status: "open",
                $or: [
                    { Title: regex },
                    { Description: regex }
                ]
            }).populate("Owner", "Name Role")

        ]);

        res.status(200).json({

            query: searchText,

            totalResults:
                resources.length +
                notes.length +
                projects.length +
                queries.length,

            resources,
            notes,
            projects,
            queries

        });

    } catch (error) {

        console.log("Search Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    globalSearch
};