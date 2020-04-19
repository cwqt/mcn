import { Router }    from "express"
const { body, param } = require('express-validator');

var AsyncRouter = require("express-async-router").AsyncRouter;

import { validate } from '../common/validate';
import {
    createPost,
    readAllPosts,
    readPost,
    updatePost
 } from '../controllers/Posts.controller';

import comments from './comments.routes';

const router = AsyncRouter({mergeParams: true});

router.post('/', validate([
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), createPost);

router.get('/', readAllPosts);

router.get('/:pid',  validate([
    param('uid').isUUID(4).trim().withMessage('invalid post id')
]), readPost);

router.put('/:pid',  validate([
    param('uid').isUUID(4).trim().withMessage('invalid post id'),
    body('content').not().isEmpty().trim().withMessage('post must have some content'),
]), updatePost);

router.use('/:pid/comments', comments);

export default router;