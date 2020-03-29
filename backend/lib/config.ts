const dotenv = require('dotenv');
dotenv.config();

let prod = {
    SITE_TITLE: 'my.corrhizal.net',
    API_URL: 'https://api.corrhizal.net',
    FE_URL: 'https://my.corrhizal.net',
    MONGO_URL: process.env.MONGO_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
}

let dev = {
    SITE_TITLE: 'dev.corrhizal.net',
    API_URL: 'http://localhost:3000',
    FE_URL: 'http://localhost:4200',
    MONGO_URL: process.env.MONGO_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_USERNAME: process.env.SENDGRID_USERNAME
}

export default process.env.NODE_ENV == 'production' ? prod : dev;