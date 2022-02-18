const http = require('http');
const express = require('express');
const session = require('express-session');
const app = express();

//Global vars
global.id = 0;
global.meetings = [false,false,false,false];

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


app.get('/Player', function(req,res) {

    if (session.username == null) {
        session.username = req.query.username;
    }

    if (session.id == null) {
        id++;
        session.id = id;
    }

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