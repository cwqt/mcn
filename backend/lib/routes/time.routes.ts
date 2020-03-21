import { Router, Request, Response } from 'express';
const { body } = require('express-validator');
const router = Router();

//seconds since unix epoch
router.get('/', (req:Request, res:Response) => {
    const now = new Date()
    return res.json({data: Math.round(now.getTime() / 1000)})
})

export default router;