import {Request, Response, NextFunction }    from "express"
const { body, param } = require('express-validator');
var AsyncRouter       = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';
import {
    createPost,
    readAllPosts,
    readPost,
    updatePost,
} from '../controllers/Posts.controller';
import { heartPostable, unheartPostable, repostPostable, replyToPostable } from '../controllers/Postable.controller';
import { PostableType } from "../models/Post.model";

const router = AsyncRouter({mergeParams: true});

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createPost);

router.get('/', readAllPosts);

// POST ===========================================================================================
const postRouter = AsyncRouter({mergeParams: true});
router.use('/:pid', postRouter);
postRouter.use((req:Request, res:Response, next:NextFunction) => {
    res.locals.type = PostableType.Post
    next();
})


postRouter.use(validate([
    param('pid').isMongoId().trim().withMessage('invalid post id')
]))

postRouter.get('/',         readPost);
postRouter.post('/repost',  repostPostable);
postRouter.post('/heart',   heartPostable);
postRouter.delete('/heart', unheartPostable);

postRouter.put('/',  validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), updatePost);

postRouter.post('/reply', validate([
    body('content').not().isEmpty().trim().withMessage('reply must have some content'),
]), replyToPostable);


// router.get('/replies', readPostReplies);
// router.get('/replies/:tid', readPostThreadReplies);

export default router;