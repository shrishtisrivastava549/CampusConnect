const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                message: "Access denied. Invalid token format."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.Role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Admin only."
            });
        }

        if (user.AccountStatus !== "approved") {
            return res.status(403).json({
                message: "Admin account is not approved."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Admin Auth Error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = adminAuth;