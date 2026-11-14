const Resource = require("../models/Resource");
const Notification = require("../models/Notification");
const fs = require("fs");
const path = require("path");

// =========================
// CREATE RESOURCE
// =========================

const createResource = async (req, res) => {
    try {
        const {
            Title,
            Description,
            Category,
            Type,
            Price,
            Condition,
            ContactEmail,
            ContactPhone,
            Image
        } = req.body;

        // Uploaded file path
        const File = req.file
            ? `/uploads/resources/${req.file.filename}`
            : undefined;

        const resource = await Resource.create({
            Title,
            Description,
            Category,
            Type,
            Price,
            Condition,
            ContactEmail,
            ContactPhone,
            Image,
            File,
            Owner: req.user._id,
            Status: "pending"
        });

        res.status(201).json({
            message: "Resource submitted for approval",
            resource
        });

    } catch (error) {
        console.log("Create Resource Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET APPROVED RESOURCES
// =========================

const getApprovedResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            Status: "approved"
        }).populate("Owner", "Name CollegeEmail");

        res.status(200).json({
            count: resources.length,
            resources
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// GET MY RESOURCES
// =========================

const getMyResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            Owner: req.user._id
        });

        res.status(200).json({
            count: resources.length,
            resources
        });

    } catch (error) {
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
        }).populate("Owner", "Name CollegeEmail");

        res.status(200).json({
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
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        resource.Status = "approved";

        await resource.save();

        await Notification.create({
            Recipient: resource.Owner,
            Type: "resource_approved",
            Message: `Your resource has been approved: ${resource.Title}`
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
// UPDATE RESOURCE
// =========================

const updateResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        if (resource.Owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only edit your own resource"
            });
        }

        const {
            Title,
            Description,
            Category,
            Type,
            Price,
            Condition,
            ContactEmail,
            ContactPhone,
            Image
        } = req.body;

        if (Title !== undefined) resource.Title = Title;
        if (Description !== undefined) resource.Description = Description;
        if (Category !== undefined) resource.Category = Category;
        if (Type !== undefined) resource.Type = Type;
        if (Price !== undefined) resource.Price = Price;
        if (Condition !== undefined) resource.Condition = Condition;
        if (ContactEmail !== undefined) resource.ContactEmail = ContactEmail;
        if (ContactPhone !== undefined) resource.ContactPhone = ContactPhone;
        if (Image !== undefined) resource.Image = Image;

        if (req.file) {
            resource.File = `/uploads/resources/${req.file.filename}`;
        }

        resource.Status = "pending";

        await resource.save();

        res.status(200).json({
            message: "Resource updated and sent for approval",
            resource
        });

    } catch (error) {
        console.log("Update Resource Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// DELETE RESOURCE
// =========================

const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Resource not found"
            });
        }

        const isOwner = resource.Owner.toString() === req.user._id.toString();
        const isAdmin = req.user.Role === "admin";
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "You can only delete your own resource"
            });
        }

        if (resource.File) {
            const filename = path.basename(resource.File);
            const uploadsRoot = process.env.UPLOADS_DIR
                ? path.join(process.env.UPLOADS_DIR, "uploads")
                : path.join(__dirname, "..", "uploads");
            const storedFile = path.join(uploadsRoot, "resources", filename);
            await fs.promises.unlink(storedFile).catch((error) => {
                if (error.code !== "ENOENT") throw error;
            });
        }
        await resource.deleteOne();

        res.status(200).json({
            message: "Resource deleted successfully"
        });

    } catch (error) {
        console.log("Delete Resource Error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};

// =========================
// EXPORT
// =========================

module.exports = {
    createResource,
    getApprovedResources,
    getMyResources,
    getPendingResources,
    approveResource,
    updateResource,
    deleteResource
};