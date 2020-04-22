const { generateVerificationHash, verifyHash } = require('dbless-email-verification');
import { Request, Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';

import neode from '../common/neo4j';

import { ErrorHandler } from '../common/errorHandler';
import config from '../config';
import { HTTP } from '../common/http';

const generateEmailHash  = (email:string) => {
    const hash = generateVerificationHash(email, config.PRIVATE_KEY, 60)
    return hash;
}

export const verifyEmail = (email:string, hash:string) => {
    if(!config.PRODUCTION) return true;
    const isEmailVerified = verifyHash(hash, email, config.PRIVATE_KEY);
    return isEmailVerified;
}

export const sendVerificationEmail = (email:string):Promise<boolean> => {
    return new Promise((resolve, reject) => {
        if(!config.PRODUCTION) resolve(true);

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

export const verifyUserEmail = async (req:Request, res:Response, next:NextFunction) => {
    let hash = req.query.hash as string;
    let email = req.query.email as string;

    let isVerified = verifyEmail(email, hash);
    if(!isVerified) throw new ErrorHandler(HTTP.BadRequest, 'Not a valid hash')

    await neode.instance.cypher(`
        MATCH (u:User {email: '${email}'})
        SET u.verified = TRUE
        RETURN u`, {})
 
    res.redirect(HTTP.Moved, `${config.FE_URL}/verified`)
}