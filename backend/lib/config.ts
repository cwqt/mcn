const dotenv = require('dotenv');
dotenv.config();

interface IEnv {
    N4J_USER: string,
    N4J_PASS: string,
    N4J_HOST: string,
    N4J_PROTOCOL: string,
    MONGO_URL: string,
    PRIVATE_KEY: string,
    EMAIL_ADDRESS: string,
    SENDGRID_API_KEY: string,
    SENDGRID_USERNAME: string,
    AWS_ACCESS_KEY_ID: string,
    AWS_ACCESS_SECRET_KEY: string,
    AWS_BUCKET_NAME: string
    SITE_TITLE: string,
    API_URL: string,
    FE_URL: string,
    RUNNER_URL: string,
    PRODUCTION: boolean,
    DEVELOPMENT: boolean,
    TESTING: boolean,
    EXPRESS_PORT: number
}

const base = {
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
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    EXPRESS_PORT: 3000,
    PRODUCTION: false,
    DEVELOPMENT: false,
    TESTING: false,
} as IEnv

const prod:IEnv = {
    ...base,
    SITE_TITLE: 'my.corrhizal.net',
    API_URL:    'https://api.corrhizal.net',
    RUNNER_URL: 'https://runner.corrhizal.net',
    FE_URL:     'https://my.corrhizal.net',
    PRODUCTION: true
}

const dev:IEnv = {
    ...base,
    SITE_TITLE: 'dev.corrhizal.net',
    API_URL:    'http://localhost:3000',
    RUNNER_URL: 'http://localhost:3001',
    FE_URL:     'http://localhost:4200',
    DEVELOPMENT: true
}

const test:IEnv = {
    ...base,
    SITE_TITLE: 'dev.corrhizal.net',
    API_URL:    'http://localhost:3000',
    RUNNER_URL: 'http://localhost:3001',
    FE_URL:     'http://localhost:4200',
    TESTING:    true
}

let env:IEnv;

switch(process.env.NODE_ENV) {
    case 'production':
        env = prod;
        break;
    case 'development':
        env = dev
        break;
    case 'testing':
        env = test;
        break;
}

console.log('\nBackend running in env: \x1b[04m' + process.env.NODE_ENV + "\x1b[0m\n");

export default env;