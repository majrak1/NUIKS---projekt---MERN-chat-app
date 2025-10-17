import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {

        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -createdAt -updatedAt -__v");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Server error" });
    }
}