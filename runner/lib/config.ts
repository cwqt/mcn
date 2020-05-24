const dotenv = require('dotenv');
dotenv.config();

interface IEnv {
    N4J_USER: string,
    N4J_PASS: string,
    N4J_HOST: string,
    N4J_PROTOCOL: string,
    MONGO_URL: string,
    PRIVATE_KEY: string,
    API_URL: string,
    PRODUCTION: boolean,
    DEVELOPMENT: boolean,
    EXPRESS_PORT: number
}

const base = {
    N4J_USER: process.env.NEO4J_USERNAME,
    N4J_PASS: process.env.NEO4J_PASSWORD,
    N4J_HOST: process.env.NEO4J_HOST,
    N4J_PROTOCOL: process.env.NEO4J_PROTOCOL,
    MONGO_URL: process.env.MONGO_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    EXPRESS_PORT: 3000,
    PRODUCTION: false,
    DEVELOPMENT: false,
} as IEnv

const prod:IEnv = {
    ...base,
    API_URL: 'https://api.corrhizal.net',
    PRODUCTION: true
}

const dev:IEnv = {
    ...base,
    API_URL: 'http://localhost:3000',
    DEVELOPMENT: true
}

let env:IEnv;

switch(process.env.NODE_ENV) {
    case 'production':
        env = prod;
        break;
    case 'development':
        env = dev
        break;
}

console.log('\nBackend running in env: \x1b[04m' + process.env.NODE_ENV + "\x1b[0m\n");

export default env;