const { generateVerificationHash, verifyHash } = require('dbless-email-verification');
import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

import { ErrorHandler } from '../common/errorHandler';
import { User } from '../models/User.model';
import config from '../config';

const generateEmailHash  = (email:string) => {
    const hash = generateVerificationHash(email, config.PRIVATE_KEY, 60)
    return hash;
}

const verifyEmail = (email:string, hash:string) => {
    const isEmailVerified = verifyHash(hash, email, config.PRIVATE_KEY)
    return isEmailVerified;
}

export const sendVerificationEmail = (email:string):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV == 'development') resolve(true);

        let hash = generateEmailHash(email);
        let verificationUrl = `${config.API_URL}/auth/verify?email=${email}&hash=${hash}`
        
        let transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: config.SENDGRID_USERNAME,
                pass: config.SENDGRID_API_KEY
            }
        });
    
        let mailOptions = {
            from: config.EMAIL_ADDRESS,
            to: email,
            subject: `Verify your ${config.SITE_TITLE} account 🌱`,
            html: `<p>Click the link to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`
        };
    
        transporter.sendMail(mailOptions, (error:any) => {
            if(error) {
                console.log(error);
                resolve(false);
            }
            resolve(true);
        });
    })
}

export const verify = (req:Request, res:Response, next:NextFunction) => {
    let hash = req.query.hash;
    let email = req.query.email;

    let isVerified = verifyEmail(email, hash);
    if(!isVerified) throw new ErrorHandler(400, 'Not a valid hash')

    User.findOneAndUpdate({email:email}, {verified:true}, (err, user) => {
        if(err) next(new ErrorHandler(400, err.message));
        res.redirect(301, `${config.FE_URL}/verified`)
    })
}