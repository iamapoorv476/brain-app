import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import Content from "../models/content.model";

interface AuthRequest extends Request {
  user?: {
    _id: string;
    username?: string;
  };
}

const createContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, link, type } = req.body;

  console.log(" Request body:", req.body);
  console.log(" Extracted values:", { title, link, type });
  console.log(" User ID:", req.user?._id);

  
  if (!title || !link || !type) {
    throw new ApiError(400, "Title, link, and type are required");
  }

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  
  const contentData = {
    title,
    links: link, 
    type,
    user: req.user._id,
    tags: [],
  };

  console.log("📝 Data being sent to database:", contentData);

  const content = await Content.create(contentData);

  return res.status(201).json(
    new ApiResponse(201, "Content created successfully", content)
  );
});

const findContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  const content = await Content.find({
    user: req.user._id,
  }).populate("user", "username");

  return res.status(200).json(
    new ApiResponse(200, "Content found", content)
  );
});

const deleteContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: User not found in request");
  }

  const contentId = req.params.id; 
  if (!contentId) {
    throw new ApiError(400, "Content ID is required");
  }

  const content = await Content.findOneAndDelete({
    _id: contentId,
    user: req.user._id, 
  });

  if (!content) {
    throw new ApiError(404, "Content not found or not authorized");
  }

  return res.status(200).json(
    new ApiResponse(200, "Content deleted successfully", content)
  );
});

export { createContent, findContent, deleteContent };