import { Router } from "express";
import { n4j } from '../common/neo4j';
const router = Router({mergeParams: true});


router.post('/drop', (req,res) => {
    let session = n4j.session()
    session.run(`
        MATCH (n) DETACH DELETE n
    `, {}).then(() => res.status(200).end())
})

export default router;