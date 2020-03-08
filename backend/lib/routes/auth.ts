// import jwt        from "jsonwebtoken"
import { Router } from 'express';
import mongoose  from 'mongoose';

// import requiresToken  from "../middleware/auth"
// import rateLimit      from "../middleware/rateLimit"

const router = Router();

//generate token
// router.post("/:username", async (req, res) => {
//   var username = req.params.username
  
//   //see if user exists
//   var user = await mongoose.connection.findUser(username)
//   if (user == null) {
//     return res.json({"message":"User not found"})
//   }

//   //encoded with username such that token can used on this user
//   var token = jwt.sign({
//     data: username,
//     exp: Math.floor(Date.now() / 1000) + (3600*24), //1 day
//   }, process.env.PRIVATE_KEY);

//   return res.json({"data": token})
// })

// //token validation
// router.get("/:username", rateLimit, requiresToken, async (req, res) => {
//   return res.json({"data": true})
// });

export default router;
