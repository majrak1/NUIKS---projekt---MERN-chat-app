import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and Confirm Password do not match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // https://avatar-placeholder.iran.liara.run/
        // https://api.dicebear.com/
        // Using PNG format for React Native compatibility (React Native doesn't support SVG)

        const boyProfilePic = `https://api.dicebear.com/9.x/pixel-art/png?seed=${username}&hair=short01`;
        const girlProfilePic = `https://api.dicebear.com/9.x/pixel-art/png?seed=${username}&hair=long01`;

        const newUser = await User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            // generate JWT token
            generateTokenAndSetCookie(newUser._id, res);


            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.error("Error in signup controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });


    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



export const logout = (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0, // expire the cookie immediately            
        });
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.error("Error in logout controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};