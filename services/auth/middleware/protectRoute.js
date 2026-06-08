import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error("Error in protectRoute middleware", { error: error.message });
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectRoute;
