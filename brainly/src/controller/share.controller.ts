import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import Share from "../models/share.model";
import Content from "../models/content.model";
import User from "../models/user.model";
import { random } from "../utils/Share";

interface AuthRequest extends Request {
  user?: { _id: string; username?: string };
}


const toggleShareLink = asyncHandler(async(req:AuthRequest, res:Response)=>{
     if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: User not found");
  }
  const share = req.body.share;
  if(share){
    const existingLink = await Share.findOne({
        user:req.user._id
    })
    if(existingLink){
        return res.json({hash:existingLink.hash});
    }
    const hash = random(10);
    await Share.create({
        user:req.user._id,
        hash
    });
    return res.json({hash});
  }
  else{
    await Share.deleteOne({
        user:req.user._id
    });
    return res.json({message:"Removed link"});
  }
});

const getSharedContent = asyncHandler(async(req:Request,res:Response)=>{
    const hash = req.params.shareLink;

    const link = await Share.findOne({hash});
    if(!link){
        throw new ApiError( 411,"Sorry Incorrect Input");
    }
    const content = await Content.find({user:link.user});
    const user = await User.findById(link.user);
    if(!user){
        throw new ApiError(411,"User not found,should not happen")
    }
    return res.json({
        username: user.username,
        content,
    });
});
export{toggleShareLink,getSharedContent,listAllShares};

