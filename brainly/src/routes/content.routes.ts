import express, { Request, Response } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import {
    createContent,
    findContent,
    deleteContent,
} from '../controller/content.controller';

const router = express.Router();

console.log('📋 Content routes loaded!');


router.get('/test', (req: Request, res: Response) => {
    console.log('✅ Content test route hit!');
    res.json({ 
        message: 'Content routes are working!',
        success: true 
    });
});


router.post('/create', verifyJWT, createContent);
router.get('/find', verifyJWT, findContent);
router.delete('/:id', verifyJWT, deleteContent);

export default router;