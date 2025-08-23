
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

export interface IUserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string | undefined): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string | undefined
): Promise<boolean> {
  if (!password) {
    return false;
  }
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  
  if (!accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
  }
  
  if (!accessTokenExpiry) {
    throw new Error('ACCESS_TOKEN_EXPIRY is not defined in environment variables');
  }
  
  return jwt.sign(
    {
      _id: this._id.toString(),
      username: (this as IUser).username,
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenExpiry,
    } as SignOptions
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  
  if (!refreshTokenSecret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in environment variables');
  }
  
  if (!refreshTokenExpiry) {
    throw new Error('REFRESH_TOKEN_EXPIRY is not defined in environment variables');
  }
  
  return jwt.sign(
    {
      _id: this._id.toString(),
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenExpiry,
    } as SignOptions
  );
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;