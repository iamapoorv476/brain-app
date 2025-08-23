import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import contentRoutes from "./routes/content.routes";
import shareRoutes from "./routes/share.routes";
import dotenv from "dotenv";
import dbconnect from "./db/dbconnect";

console.log("Loaded content routes:", contentRoutes);


dotenv.config();

const app: Application = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});
app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.originalUrl}`);
    next();
});



app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contents",contentRoutes);
app.use("/api/v1",shareRoutes);

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Route not found`);
    res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    const mongoUri = process.env.MONGODB_URI as string;

    if (!mongoUri) {
        console.error("❌ MONGODB_URI not defined in .env file");
        return;
    }

    try {
        await dbconnect(mongoUri);
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log('Available routes:');
            console.log('GET  /test');
            console.log('POST /api/v1/users/register');
        });
    } catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();