import { Router } from "express";
import { cypher } from "../common/dbs";
const router = Router({ mergeParams: true });

router.post("/drop", (req, res) => {
  cypher(`MATCH (n) DETACH DELETE n`, {}).then(() => res.status(200).end());
});

export default router;
