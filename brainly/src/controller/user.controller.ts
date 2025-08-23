import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import User, { IUser } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";

const generateAccessTokenAndRefreshToken = async (
  userId: Types.ObjectId | string
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const user = (await User.findById(userId)) as (IUser & {
      generateAccessToken: () => string;
      generateRefreshToken: () => string;
      refreshToken?: string;
    }) | null;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password }: { username?: string; password?: string } =
    req.body;

  if ([username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ username });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    username: username!.toLowerCase(),
    password,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      {
        user: {
          _id: user._id,
          username: user.username,
        },
      }
    )
  );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password }: { username?: string; password?: string } =
    req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username and password are required");
  }

  const existedUser = await User.findOne({ username });

  if (!existedUser) {
    throw new ApiError(400, "User does not exist!");
  }

  const isPasswordValid = await existedUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Type assertion to ensure _id is treated as ObjectId
  const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
    existedUser._id as Types.ObjectId
  );

  const loggedIn = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        "User logged in successfully!",
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        }
      )
    );
});

export { registerUser, loginUser };