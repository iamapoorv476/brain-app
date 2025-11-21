"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const content_controller_1 = require("../controller/content.controller");
const router = express_1.default.Router();
console.log(' Content routes loaded!');
router.get('/test', (req, res) => {
    console.log(' Content test route hit!');
    res.json({
        message: 'Content routes are working!',
        success: true
    });
});
router.post('/create', auth_middleware_1.verifyJWT, content_controller_1.createContent);
router.get('/find', auth_middleware_1.verifyJWT, content_controller_1.findContent);
router.delete('/:id', auth_middleware_1.verifyJWT, content_controller_1.deleteContent);
exports.default = router;
