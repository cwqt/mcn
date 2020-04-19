var AsyncRouter = require("express-async-router").AsyncRouter;
const { body, param } = require('express-validator');

import { validate } from '../common/validate';
import {
    createComment,
    // updateComment,
    // deleteComment
 } from '../controllers/Comments.controller';

const router = AsyncRouter({mergeParams: true});
// /users/:uid/posts/:pid/comments

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createComment);

router.post('/:cid', validate([
    param('cid').isUUID(4).trim().withMessage('invalid comment id'),
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), (req:any,res:any,next:any) => {res.locals.isReply = true; next()}, createComment);

// router.put('/:cid',  validate([
//     param('cid').isMongoId().trim().withMessage('invalid comment id'),
//     body('content').not().isEmpty().trim().withMessage('post must have some content'),
// ]), updateComment);

// router.delete('/:cid',  validate([
//     param('cid').isMongoId().trim().withMessage('invalid comment/reply id'),
// ]), deleteComment);

export default router;