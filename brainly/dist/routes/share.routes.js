"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const share_controller_1 = require("../controller/share.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post("/shareLink", auth_middleware_1.verifyJWT, share_controller_1.toggleShareLink);
router.get("/share/:shareLink", share_controller_1.getSharedContent);
exports.default = router;
