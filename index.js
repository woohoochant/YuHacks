const http = require('http');
const express = require('express');
const session = require('express-session');
const app = express();

//Global vars
global.id = 0;
global.meetings = [false,false,false,false];
global.players = {};

app.enable('trust-proxy');

//Use the session middleware
app.use(session({
    name: 'YUhack',
    secret: 'secret' ,
    resave: true,
    saveUninitialized: true,
    proxy: true,
}));

// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// Use middleware to parse request body as JSON.
// bodyParser is deprecated and now merged into express itself.
app.use(express.json());

app.listen(3000)

app.get('/update', function(req,res) {
    if (session.username == null) {
        session.username = req.query.username;
    }

    if (session.game == null) {
        session.game = req.query.game;
    }

    if (session.id == null) {
        id++;
        session.id = id;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.write('RECEIVED');
    res.end();
})

app.get('/player', function(req,res) {
    //Player json response obj
    const player = {

    };
    player.id = session.id;
    player.username = session.username;
    player.game = session.game;
    player.meetingid = session.meetingid;

    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(player));
    res.end();
})
