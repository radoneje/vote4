const http = require('http');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
var cookieParser = require('cookie-parser');
const path = require('path');
//const server = http.createServer();


const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger(':date[clf] ":method :url"'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', require('./routes/indexRouter'));

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
server.on('listening', ()=> {
    console.log('Listening on ' + server.address().port);
});
