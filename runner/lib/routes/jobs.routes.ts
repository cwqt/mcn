import { validate } from '../common/validate'; 
import { TaskResolutionStates } from '../models/Tasks.model';
import { Request, Response, NextFunction } from 'express';
const AsyncRouter               = require("express-async-router").AsyncRouter;
const { body, param, query }    = require('express-validator');

const router = AsyncRouter({mergeParams: true});

export default router;
