"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAllShares = exports.getSharedContent = exports.toggleShareLink = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const ApiError_1 = require("../utils/ApiError");
const share_model_1 = __importDefault(require("../models/share.model"));
const content_model_1 = __importDefault(require("../models/content.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const Share_1 = require("../utils/Share");
const toggleShareLink = (0, asyncHandler_1.default)(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError_1.ApiError(401, "Unauthorized: User not found");
    }
    const share = req.body.share;
    if (share) {
        const existingLink = await share_model_1.default.findOne({
            user: req.user._id
        });
        if (existingLink) {
            return res.json({ hash: existingLink.hash });
        }
        const hash = (0, Share_1.random)(10);
        await share_model_1.default.create({
            user: req.user._id,
            hash
        });
        return res.json({ hash });
    }
    else {
        await share_model_1.default.deleteOne({
            user: req.user._id
        });
        return res.json({ message: "Removed link" });
    }
});
exports.toggleShareLink = toggleShareLink;
const getSharedContent = (0, asyncHandler_1.default)(async (req, res) => {
    const hash = req.params.shareLink;
    const link = await share_model_1.default.findOne({ hash });
    if (!link) {
        throw new ApiError_1.ApiError(411, "Sorry Incorrect Input");
    }
    const content = await content_model_1.default.find({ user: link.user });
    const user = await user_model_1.default.findById(link.user);
    if (!user) {
        throw new ApiError_1.ApiError(411, "User not found,should not happen");
    }
    return res.json({
        username: user.username,
        content,
    });
});
exports.getSharedContent = getSharedContent;
