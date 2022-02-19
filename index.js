const http = require('http');
const express = require('express');
const session = require('express-session');
const app = express();

//Global vars
global.id = 0;
global.meetings = [false,false,false,false];
global.players = [];

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

    if (req.query.game != null) {
        session.game = req.query.game;
    }

    if (session.id == null) {
        id++;
        session.id = id;
    }

    if (req.query.meetingid != null) {
        session.meetingid = req.query.meetingid;
    }

    const check = players.findIndex(e => e.id == session.id);
    if (check == -1) {
        //Player json response obj
        const player = {};
        player.id = session.id;
        player.username = session.username;
        player.game = session.game;
        player.meetingid = session.meetingid;
        players.push(player);
    } else {
        players[check].game = session.game;
        players[check].meetingid = session.meetingid;
    }

    res.setHeader('Content-Type', 'text/plain');
    res.write('RECEIVED');
    res.end();
});

app.get('/playerlist', function(req,res) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(players));
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
});

app.get('/search', function(req,res) {
    for (let i = 0; i < players.length; i++) {
        const check = players.findIndex(e => session.game == e.game && e.meetingid == null && e.id != session.id);

        if (check == -1) {
            //Not found
            //Redirect to queue page
        } else {
            //Match
            for (let j = 0; j < meetings.length; i++) {
                if (!meetings[j]) {
                    const self = players.findIndex(e=> session.id == e.id);
                    
                    //Update state in session and db
                    session.meetingid = j;
                    players[self].meetingid = j;

                }
                players[check].meetingid = j;
            }
        }
    }

    res.write('Dog');
    res.end();
});

app.get('/check', function(req,res) {
    const check = players.findIndex(e => session.id == e.id && e.meetingid != null);

    if (check == -1) {
        //Still in queue
    } else {
        //Found match
        //Update session state
        session.meetingid = players[check].meetingid;

        //Redirect to chat
    }
})
