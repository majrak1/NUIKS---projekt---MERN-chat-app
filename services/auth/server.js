import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import sequelize from "./db/sequelize.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth" }));

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully.");
        await sequelize.sync();
        console.log("Database synced.");

        app.listen(PORT, () => {
            console.log(`Auth service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Unable to start auth service:", error);
        process.exit(1);
    }
};

startServer();
