// import { Router }               from 'express';
// import { Request, Response }    from "express"
// const { body } = require('express-validator');
// import { RecordableTypes }      from '../models/Recordable.model';
// import { 
//     readAllRecordables,
//     readRecordable,
//     createRecordable,
//     updateRecordable,
//     deleteRecordable,
// } from '../controllers/Recordable.controller';
// import {
//     readAllGardenSubplants,
//     addGardenSubplants,
//     deleteGardenSubplants,
// } from '../controllers/Garden.controller';
// const recordables = Router();
// recordables.use((req:Request, res:Response, next:any) => {
//     let type = req.baseUrl.replace('/', '');
//     if (type == 'plants')   res.locals.type == 'plant'
//     if (type == 'gardens')  res.locals.type == 'garden'
//     next();
// })
// const gardensOnly = (req:Request, res:Response, next:any) => {
//     if(req.baseUrl.replace('/', '') !== 'gardens') return res.status(400).json({message:'Plants cannot access these routes'})
//     next()
// }
// const plantsOnly = (req:Request, res:Response, next:any) => {
//     if(req.baseUrl.replace('/', '') !== 'plants') return res.status(400).json({message:'Gardens cannot access these routes'})
//     next()
// }
// recordables.get('/',                  readAllRecordables)
// recordables.get('/:recordable_id',    readRecordable)
// recordables.post('/',                 createRecordable)
// recordables.delete('/:recordable_id', deleteRecordable)
// recordables.put('/:recordable_id',    plantsOnly, [
//     body('name').not().isEmpty().trim(),
//     body('belongs_to').not().isEmpty().trim(),
//     body('recording').not().isEmpty().trim(),
//     body('species').not().isEmpty().trim(),
// ], updateRecordable)
// recordables.put('/:recordable_id',    gardensOnly, [
//     body('name').not().isEmpty().trim(),
//     body('recording').not().isEmpty().trim(),
// ], updateRecordable)
// //middleware gardens only
// recordables.get('/:garden_id/plants',       gardensOnly, readAllGardenSubplants)
// recordables.put('/:garden_id/plants',       gardensOnly, addGardenSubplants)
// recordables.delete('/:garden_id/plants',    gardensOnly, deleteGardenSubplants)
// export default recordables;
//# sourceMappingURL=recordables.routes.js.map