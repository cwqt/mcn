var AsyncRouter = require("express-async-router").AsyncRouter;
import { validate } from '../common/validate'; 
const { body, param, query } = require('express-validator');
var multer = require('multer');


import {
    readAllUsers,
    readUserById,
    readUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser, 
    updateUserAvatar,
    updateUserCoverImage} from "../controllers/User.controller";

import devices  from './device.routes';
import plants   from './plants.routes';
import gardens  from './gardens.routes';
import posts    from './posts.routes';

const router = AsyncRouter();

const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2*1024*1024 //no files larger than 2mb
    }
});

router.get('/', readAllUsers);

router.post('/', validate([
    body('username').not().isEmpty().trim().withMessage('username cannot be empty'),
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
]), createUser);

router.post('/login', validate([
    body('email').isEmail().normalizeEmail().withMessage('not a valid email address'),
    body('password').not().isEmpty().isLength({ min: 6 }).withMessage('password length must be > 6 characters')
]), loginUser)

router.post('/logout', logoutUser)

router.put('/:uid/avatar', storage.single('avatar'), updateUserAvatar)
router.put('/:uid/cover_image', storage.single('cover_image'), updateUserCoverImage)

router.get('/u/:username', validate([
    param('username').not().isEmpty().trim()
]), readUserByUsername)

router.get('/:uid', validate([
    param('uid').isUUID(4).trim().withMessage('invalid user id')
]), readUserById);

router.put('/:uid', validate([
    param('uid').isUUID(4).trim().withMessage('invalid user id')
]),  updateUser);

router.delete('/:uid', validate([
    param('uid').isUUID(4).trim().withMessage('invalid user id')
]), deleteUser);

router.use('/:uid/posts',   posts);
router.use('/:uid/devices', devices);
router.use('/:uid/plants',  plants);
router.use('/:uid/gardens', gardens);

export default router;