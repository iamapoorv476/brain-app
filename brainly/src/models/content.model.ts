import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContent extends Document {
  title: string;
  links: string;
  type: string;
  tags: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
}

const contentSchema = new Schema<IContent>(
  {
    title: {
      type: String,
      required: true,
    },
    links: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId, 
        ref: "Tag",
      },
    ],
    user: {
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Content: Model<IContent> = mongoose.model<IContent>(
  "Content",
  contentSchema
);
export default Content;
