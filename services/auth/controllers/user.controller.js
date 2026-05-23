import User from "../models/user.model.js";
import { Op } from "sequelize";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = await User.findAll({
            where: { id: { [Op.ne]: loggedInUserId } },
            attributes: ["id", "fullName", "username", "gender", "profilePic"],
        });

        const usersFormatted = filteredUsers.map((u) => ({
            _id: u.id,
            fullName: u.fullName,
            username: u.username,
            gender: u.gender,
            profilePic: u.profilePic,
        }));

        res.status(200).json(usersFormatted);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ message: "Server error" });
    }
};
