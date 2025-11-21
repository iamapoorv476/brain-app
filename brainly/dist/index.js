"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
const share_routes_1 = __importDefault(require("./routes/share.routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbconnect_1 = __importDefault(require("./db/dbconnect"));
console.log("Loaded content routes:", content_routes_1.default);
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});
app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.originalUrl}`);
    next();
});
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/contents", content_routes_1.default);
app.use("/api/v1", share_routes_1.default);
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Route not found`);
    res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error(" MONGODB_URI not defined in .env file");
        return;
    }
    try {
        await (0, dbconnect_1.default)(mongoUri);
        app.listen(PORT, () => {
            console.log(` Server running on http://localhost:${PORT}`);
            console.log('Available routes:');
            console.log('GET  /test');
            console.log('POST /api/v1/users/register');
        });
    }
    catch (error) {
        console.error(" Failed to connect to the database:", error);
        process.exit(1);
    }
};
startServer();
