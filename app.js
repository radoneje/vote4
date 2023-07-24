const http = require('http');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
var cookieParser = require('cookie-parser');
const path = require('path');
//const server = http.createServer();
const config= require('./config.json');
const knex = require('knex')({
    client: 'pg',
    version: '7.2',
    connection: config.pgConnection,
    pool: {min: 0, max: 40}
});
const amqp = require("amqplib");
const queue = "vote4";

const session  = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pgStoreConfig = {conObject: config.pgConnection}
var sess = {
    secret: (config.sha256Secret),
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        // secure: true,
        //httpOnly: true,
        //sameSite: 'none',
    }, // 10 days
    store: new pgSession(pgStoreConfig),
};

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess));
app.use('/',(req, res,next)=>{
    req.knex=knex;
    next();
});

app.use('/', require('./routes/indexRouter'));
app.use('/api', require('./routes/apiRouter'));

const server = http.createServer(app);
server.listen(7000);
server.on('error', (error)=>{
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', async ()=> {
    console.log('Listening on ' + server.address().port);
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
    });
});
