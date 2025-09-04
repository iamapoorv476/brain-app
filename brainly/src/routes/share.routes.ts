import { Router } from "express";
import { toggleShareLink, getSharedContent } from "../controller/share.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/shareLink", verifyJWT, toggleShareLink);
 


router.get("/share/:shareLink", getSharedContent);

export default router;