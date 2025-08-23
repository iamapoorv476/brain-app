"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.findContent = exports.createContent = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const content_model_1 = __importDefault(require("../models/content.model"));
const createContent = (0, asyncHandler_1.default)(async (req, res) => {
    const { title, link, type } = req.body;
    console.log(" Request body:", req.body);
    console.log(" Extracted values:", { title, link, type });
    console.log(" User ID:", req.user?._id);
    if (!title || !link || !type) {
        throw new ApiError_1.ApiError(400, "Title, link, and type are required");
    }
    if (!req.user || !req.user._id) {
        throw new ApiError_1.ApiError(401, "Unauthorized: User not found in request");
    }
    const contentData = {
        title,
        links: link,
        type,
        user: req.user._id,
        tags: [],
    };
    console.log("📝 Data being sent to database:", contentData);
    const content = await content_model_1.default.create(contentData);
    return res.status(201).json(new ApiResponse_1.ApiResponse(201, "Content created successfully", content));
});
exports.createContent = createContent;
const findContent = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError_1.ApiError(401, "Unauthorized: User not found in request");
    }
    const content = await content_model_1.default.find({
        user: req.user._id,
    }).populate("user", "username");
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Content found", content));
});
exports.findContent = findContent;
const deleteContent = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError_1.ApiError(401, "Unauthorized: User not found in request");
    }
    const contentId = req.params.id;
    if (!contentId) {
        throw new ApiError_1.ApiError(400, "Content ID is required");
    }
    const content = await content_model_1.default.findOneAndDelete({
        _id: contentId,
        user: req.user._id,
    });
    if (!content) {
        throw new ApiError_1.ApiError(404, "Content not found or not authorized");
    }
    return res.status(200).json(new ApiResponse_1.ApiResponse(200, "Content deleted successfully", content));
});
exports.deleteContent = deleteContent;
