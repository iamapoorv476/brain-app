"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiResponse_1 = require("../utils/ApiResponse");
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = (await user_model_1.default.findById(userId));
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while generating access and refresh tokens");
    }
};
const registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { username, password } = req.body;
    if ([username, password].some((field) => !field?.trim())) {
        throw new ApiError_1.ApiError(400, "All fields are required");
    }
    const existedUser = await user_model_1.default.findOne({ username });
    if (existedUser) {
        throw new ApiError_1.ApiError(400, "User already exists");
    }
    const user = await user_model_1.default.create({
        username: username.toLowerCase(),
        password,
    });
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, "User registered successfully", {
        user: {
            _id: user._id,
            username: user.username,
        },
    }));
});
exports.registerUser = registerUser;
const loginUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new ApiError_1.ApiError(400, "Username and password are required");
    }
    const existedUser = await user_model_1.default.findOne({ username: username.toLowerCase() });
    if (!existedUser) {
        throw new ApiError_1.ApiError(400, "User does not exist!");
    }
    const isPasswordValid = await existedUser.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError_1.ApiError(401, "Invalid credentials");
    }
    // Type assertion to ensure _id is treated as ObjectId
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(existedUser._id);
    const loggedIn = await user_model_1.default.findById(existedUser._id).select("-password -refreshToken");
    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse_1.ApiResponse(200, "User logged in successfully!", {
        user: loggedIn,
        accessToken,
        refreshToken,
    }));
});
exports.loginUser = loginUser;
