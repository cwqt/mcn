import { validate } from '../common/validate'; 
const AsyncRouter               = require("express-async-router").AsyncRouter;

import {
    getDeviceRoutines,
    createDeviceRoutine,
    readRoutine,
    createTaskInRoutine,
    updateRoutine,
    deleteRoutine,
    executeTask,
    updateTask,
    deleteTask,
} from '../controllers/Routines.controller';

const router = AsyncRouter({mergeParams: true});

// ### `/users/:uid/devices/:did/routines`
router.get('/',     getDeviceRoutines);
router.post('/',    createDeviceRoutine);

// ### `/users/:uid/devices/:did/routines/:rtid`
const routineRouter = AsyncRouter({mergeParams: true})
router.use('/:trid', routineRouter);

routineRouter.get('/',          readRoutine);
routineRouter.put('/',          updateRoutine);
routineRouter.delete('/',       deleteRoutine);
routineRouter.post('/tasks',    createTaskInRoutine);

// ### `/user/:uid/devices/:did/routines/:rtid/tasks/:tid`
const taskRouter = AsyncRouter({mergeParams: true});
routineRouter.use('/tasks/:tid', taskRouter);

taskRouter.get('/',     executeTask);
taskRouter.put('/',     updateTask);
taskRouter.delete('/',  deleteTask)

export default router;