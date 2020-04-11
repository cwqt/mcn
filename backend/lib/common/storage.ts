import mongoose from "mongoose";
const AWS = require('aws-sdk');
import config from '../config';

AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_ACCESS_SECRET_KEY
});

var s3 = new AWS.S3();

const uploadImageToS3 = (user_id:string, file:Express.Multer.File):Promise<string | object> => {
    return new Promise((resolve, reject) => {
        if(!file) reject('No image provided');

        let extension = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        let allowed_extensions = ["jpg", "jpeg", "png"];
        if(!allowed_extensions.includes(extension)) reject('File type not allowed');      

        let params = {
            Bucket: config.AWS_BUCKET_NAME,
            Body: file.buffer,
            Key: `${user_id}/${new mongoose.Types.ObjectId()}.${extension}`
        }

        s3.upload(params, function (err:any, data:any) {
            if(err) reject(err);
            if(data) resolve(data);
        });    
    })
}
