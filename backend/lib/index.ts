import 'dotenv/config';
import express          from "express"
import morgan           from "morgan"
import mongoose         from 'mongoose'
import bodyParser       from 'body-parser'
import cors             from 'cors'

import { handleError } from './common/errorHandler';
import routes           from './routes'

var server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection;
mongoose.Promise = Promise;

connection.once('open', () => {
    console.log("Connected to MongoDB.")
    try {        
        app.use("/users",                   routes.users)
        app.use("/plants",                  routes.plants)
        app.use("/gardens",                 routes.gardens)
        app.use('/events',                  routes.events)
        app.use('/measurements',            routes.measurements )
        app.use('/time',                    routes.time)
        app.use('/auth',                    routes.auth)
        
        app.use((err:any, req:express.Request, res:express.Response, next:any) => handleError(err, res));

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