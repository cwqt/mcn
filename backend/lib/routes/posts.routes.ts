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
const postRouter = AsyncRouter({mergeParams: true});
router.use('/:pid', postRouter);

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createPost);

router.get('/', readAllPosts);

// POST ===========================================================================================
postRouter.use(validate([
    param('pid').isMongoId().trim().withMessage('invalid post id')
]))

postRouter.get('/',         readPost);
postRouter.post('/repost',  repostPost);
postRouter.post('/heart',   heartPost);
postRouter.delete('/heart', unheartPost);

postRouter.put('/',  validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), updatePost);

postRouter.post('/reply', validate([
    body('content').not().isEmpty().trim().withMessage('reply must have some content'),
]), replyToPost);


// router.get('/replies', readPostReplies);
// router.get('/replies/:tid', readPostThreadReplies);

export default router;