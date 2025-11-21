"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const user_model_1 = __importDefault(require("../models/user.model"));
exports.verifyJWT = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        console.log(" JWT Middleware Started");
        console.log(" All cookies:", req.cookies);
        console.log(" Authorization header:", req.header("Authorization"));
        console.log(" All headers:", req.headers);
        let token;
        if (req.cookies?.accessToken) {
            token = req.cookies.accessToken;
            console.log(" Token found in cookies:", token.substring(0, 20) + "...");
        }
        else if (req.header("Authorization")) {
            const authHeader = req.header("Authorization");
            console.log(" Auth header value:", authHeader);
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.replace("Bearer ", "");
                console.log(" Token extracted from header:", token.substring(0, 20) + "...");
            }
            else {
                console.log(" Authorization header doesn't start with 'Bearer '");
            }
        }
        console.log(" Final token:", token ? "Found" : "Not found");
        console.log(" Token length:", token ? token.length : 0);
        if (!token) {
            console.log(" No token provided");
            throw new ApiError_1.ApiError(401, "Unauthorized request - No token provided");
        }
        console.log(" Attempting to verify token...");
        console.log(" ACCESS_TOKEN_SECRET exists:", !!process.env.ACCESS_TOKEN_SECRET);
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(" Token decoded successfully:", decodedToken);
        const user = await user_model_1.default.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            console.log(" User not found with ID:", decodedToken._id);
            throw new ApiError_1.ApiError(401, "Invalid Access Token - User not found");
        }
        console.log(" User found:", user.username || user._id);
        req.user = user;
        console.log(" JWT Middleware completed successfully");
        next();
    }
    catch (error) {
        console.log(" JWT Error Details:", {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw new ApiError_1.ApiError(401, error?.message || "Invalid access token");
    }
});
