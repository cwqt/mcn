import { validate } from '../common/validate'; 
const AsyncRouter               = require("express-async-router").AsyncRouter;
const { body, param, query }    = require('express-validator');

const router = AsyncRouter({mergeParams: true});


export default router;