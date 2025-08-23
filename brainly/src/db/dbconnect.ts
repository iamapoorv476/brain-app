import mongoose from 'mongoose';

const dbconnect = async (uri: string) => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default dbconnect;
