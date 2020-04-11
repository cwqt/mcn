import { Router } from 'express';
var multer = require('multer');
const { body } = require('express-validator');

import { uploadFile } from '../common/storage';

const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5*1024*1024 //no files larger than 5mb
    }
});

const router = Router();

router.post('/', storage.single('file'), uploadFile)

export default router;