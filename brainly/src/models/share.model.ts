import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShare extends Document{
    hash:string;
    user:mongoose.Types.ObjectId;
}
const shareSchema = new Schema<IShare>(
    {
        hash:{
            type:String,
            required:true,
        },
        user: {
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    },
     { timestamps: true }

);
const Share: Model<IShare> = mongoose.model<IShare>(
    "Share",
    shareSchema
);
export default Share;
