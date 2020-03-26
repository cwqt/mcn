import jwt from "jsonwebtoken";
import { Request, Response } from 'express';

import { Plant } from "../models/Plant.model";
import { Garden } from "../models/Garden.model";
import { ApiKey } from "../models/ApiKey.model"
import { User } from "../models/User.model";

export const generateRecordableSymmetricKey = (req:Request, res:Response) => {}

export const validateMessageWithKey = (req:Request, res:Response) => {
    const recordable_id = req.header('_id');
    const type          = req.header('type');
    if(!recordable_id || !type) {
        res.status(400).json({message:'Needs headers'});
    }
    if(!['plant', 'garden'].includes(type)) {
        res.status(400).json({message:'Must be correct type'});
    }

    let recordable;
    if(type == 'plant') recordable = Plant;
    if(type == 'garden') recordable = Garden;

}

export const generateJwt = (req:Request, res:Response) => {
    let user_id = req.body._id

    //encoded with user_id such that token can used on this user
    var token = jwt.sign({
        data: user_id,
        exp: Math.floor(Date.now() / 1000) + (3600*24), //1 day
    }, process.env.PRIVATE_KEY);

    return res.json({"data": token})
}

export const validateJwt = async (req:Request, res:Response, next:any) => {

  let token = req.headers.authorization.split(' ')[1];

  let user_id = req.body._id
  if (!token) { return res.json({"message": "No token provided"}) }

  // see if user exists
  let user = await User.findById(user_id, (err, user) => {})
  if (user == null) { return res.status(400).json({"message": "User not found"})}

  // if admin, let them do whatever the hell they want
  if (user.admin) { next(); }

  //check if token is even valid
  let decoded:any;
  try {
    decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch(err) {
    return res.status(400).json({"message": err.message})
  }
  if (!decoded) { return res.status(400).json({"message":"Token is invalid"}) } 
  
  //check if token is blacklisted
  // todo: this with redis

  
  //check if provided token is for this user
  let tokenIsForUser = decoded.data == user_id ? true : false
  if (!tokenIsForUser) { return res.status(400).json({"message": "Invalid token for this user"}) }

  //if all checks passed, pass onto route execution since authorised
  next();
};
