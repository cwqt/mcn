import mongoose from "mongoose";
import AWS from 'aws-sdk';
import config from '../config';

AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_ACCESS_SECRET_KEY
});

var s3 = new AWS.S3();

interface S3Return {
    Location:string //— the URL of the uploaded object
    ETag:    string //— the ETag of the uploaded object
    Bucket:  string //— the bucket to which the object was uploaded
    Key:     string // — the key to which the object was uploaded
    key?:    string
}

export interface S3Image {
    data:       S3Return;
    fieldname?: string;
}

export const uploadImageToS3 = (user_id:string, file:Express.Multer.File, fieldname:string):Promise<string | S3Image> => {
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
            if(data) resolve({
                fieldname: fieldname,
                data: data
            } as S3Image);
        });    
    })
}
