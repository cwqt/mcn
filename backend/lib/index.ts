import express          from "express";
import morgan           from "morgan";
import mongoose         from 'mongoose';
import bodyParser       from 'body-parser';
import cors             from 'cors';
import session          from 'express-session';

const mongo4j = require('mongo4j');
mongo4j.init('bolt://localhost', {user: 'neo4j', pass: 'mjnk'});

import config           from './config';
import routes           from './routes';
import { handleError, ErrorHandler } from './common/errorHandler';

let server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(session({
    secret: config.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: process.env.NODE_ENV == 'development' ? false : true,
        secure: process.env.NODE_ENV == 'development' ? false : true
    }
}))

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:mjnk@localhost:7474');
db.cypher({
    query: 'MATCH (c:Comment)-[:COMMENTS_ON]->(u:Post {m_id: {_id}}) RETURN c',
    params: {
        _id: '5e98dae80d1f01a2d562129e',
    },
}, function (err:any, results:any) {
    if (err) console.log(err);
    if(results) {
        results.forEach((comment:any) => {
            console.log(comment.c.properties.m_id)
        })
    }
});


mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const connection = mongoose.connection;
mongoose.Promise = Promise;

connection.once('open', () => {

    console.log("Connected to MongoDB.")
    try {        
        app.use("/users",       routes.users)
        app.use('/auth',        routes.auth)
        app.use('/time',        routes.time)
        
        app.all('*', (req:any, res:any, next:any) => { throw new ErrorHandler(404, 'No such route exists')})
        app.use((err:any, req:any, res:any, next:any) => handleError(err, res));

        process.on('SIGTERM', graceful_exit);
        process.on('SIGINT', graceful_exit);          
        server = app.listen(3000, () => {
            console.log('Listening on 3000')
          })        
    } catch (err) {
        console.log(err)
    }
})

function graceful_exit() {
    connection.close(() => {
        console.log(`Termination requested, MongoDB connection closed`);
        server.close();
    });
}
