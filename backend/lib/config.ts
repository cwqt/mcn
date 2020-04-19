import { ProcessCredentials } from "aws-sdk";

const dotenv = require('dotenv');
dotenv.config();

let base = {
    N4J_USER: process.env.NEO4J_USERNAME,
    N4J_PASS: process.env.NEO4J_PASSWORD,
    N4J_HOST: process.env.NEO4J_HOST,
    N4J_PROTOCOL: process.env.NEO4J_PROTOCOL,

    MONGO_URL: process.env.MONGO_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_SECRET_KEY: process.env.AWS_ACCESS_SECRET_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME
}

let prod = Object.assign(base, {
    SITE_TITLE: 'my.corrhizal.net',
    API_URL: 'https://api.corrhizal.net',
    FE_URL: 'https://my.corrhizal.net',
})

let dev = Object.assign(base, {
    SITE_TITLE: 'dev.corrhizal.net',
    API_URL: 'http://localhost:3000',
    FE_URL: 'http://localhost:4200',
})

export default process.env.NODE_ENV == 'production' ? prod : dev;