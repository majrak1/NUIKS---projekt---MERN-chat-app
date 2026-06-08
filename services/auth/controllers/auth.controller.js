import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import logger from "../utils/logger.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and Confirm Password do not match" });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://api.dicebear.com/9.x/pixel-art/png?seed=${username}&hair=short01`;
        const girlProfilePic = `https://api.dicebear.com/9.x/pixel-art/png?seed=${username}&hair=long01`;

        const newUser = await User.create({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        generateTokenAndSetCookie(newUser.id, res);

        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    } catch (error) {
        logger.error("Error in signup controller", { error: error.message });
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user.id, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        });
    } catch (error) {
        logger.error("Error in login controller", { error: error.message });
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        logger.error("Error in logout controller", { error: error.message });
        res.status(500).json({ message: "Internal Server Error" });
    }
};
