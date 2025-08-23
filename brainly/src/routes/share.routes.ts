import { Router } from "express";
import { toggleShareLink, getSharedContent } from "../controller/share.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

// Route for creating/toggling share links
router.post("/shareLink", verifyJWT, toggleShareLink);
router.get("/shareLink", verifyJWT, toggleShareLink); // For getting existing share link

// Route for accessing shared content
router.get("/share/:shareLink", getSharedContent);

export default router;