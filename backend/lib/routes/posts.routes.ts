import { Router }    from "express"
const { body, param } = require('express-validator');

var AsyncRouter = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';
import {
    createPost,
    readAllPosts,
    readPost,
    updatePost,
    repostPost,
    replyToPost,
    heartPost,
    unheartPost
 } from '../controllers/Posts.controller';


const router = AsyncRouter({mergeParams: true});

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createPost);

router.get('/', readAllPosts);

router.get('/:pid',  validate([
    param('uid').isMongoId().trim().withMessage('invalid post id')
]), readPost);

router.put('/:pid',  validate([
    param('uid').isMongoId().trim().withMessage('invalid post id'),
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), updatePost);

router.post('/:pid/repost', repostPost);

router.post('/:pid/reply', validate([
    body('content').not().isEmpty().trim().withMessage('reply must have some content'),
]), replyToPost);

router.post('/:pid/heart', heartPost);
router.delete('/:pid/heart', unheartPost);

// router.get('/:pid/replies', readPostReplies);
// router.get('/:pid/replies/:tid', readPostThreadReplies);

export default router;