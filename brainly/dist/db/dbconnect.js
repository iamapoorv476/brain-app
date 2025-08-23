"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbconnect = async (uri) => {
    try {
        const conn = await mongoose_1.default.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log('MongoDB connection failed:', error);
        process.exit(1);
    }
};
exports.default = dbconnect;
