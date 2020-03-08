import 'dotenv/config';
import express          from "express"
import morgan           from "morgan"
import mongoose         from 'mongoose'
import bodyParser       from 'body-parser'

import routes           from './routes'

var server:any;
const app = express();
app.set('trust proxy', 1);
app.use(bodyParser.json());
app.use(morgan("tiny"));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true })
const connection = mongoose.connection;
mongoose.Promise = Promise;

connection.once('open', () => {
    console.log("Connected to MongoDB.")
    try {
        app.use("/users",      routes.users)
        // app.use("/users",   routes.users)
        // app.use("/login",   routes.login)
        // app.use("/logout",  routes.logout)  

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