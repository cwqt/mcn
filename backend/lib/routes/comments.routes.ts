import { Router }    from "express"
const { body, param } = require('express-validator');

import { validate } from '../common/validate';
import {
    createComment,
    updateComment,
    deleteComment
 } from '../controllers/Comments.controller';

const router = Router({mergeParams: true});

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createComment);

router.post('/:cid', validate([
    param('cid').isMongoId().trim().withMessage('invalid comment id'),
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), (req,res,next) => {res.locals.isReply = true; next()}, createComment);

router.put('/:cid',  validate([
    param('cid').isMongoId().trim().withMessage('invalid comment id'),
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), updateComment);

router.delete('/:cid',  validate([
    param('cid').isMongoId().trim().withMessage('invalid comment/reply id'),
]), deleteComment);

export default router;