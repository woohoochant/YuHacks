const http = require('http');
const express = require('express');
const session = require('express-session');
const io = require('socket.io')(8080, {
    cors: {
      origin: "*",
    },
  });
const app = express();
const path = require('path');
const cors = require('cors');

//Global vars
global.id = 0;
global.meetings = [false,false,false,false];
global.players = [];
global.chatrooms = [];

app.enable('trust-proxy');
app.use(cors());
app.use(express.static(__dirname));

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

app.listen(3000);

//list of players, key is socket id
const activeChat = {};

io.on('connection', socket => {
    socket.on('init-user', player => {
        activeChat[socket.id] = player;
    })
    socket.on('send-chat-message', message => {
        console.log(message);
        socket.broadcast.emit('chat-message', {message: message, player: activeChat[socket.id]});
    });
});

app.get('/', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.sendFile('index.html', { root: path.join(__dirname, '') });
});

//games
app.get('/games', function(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.sendFile('new_categories.html', { root: path.join(__dirname, '') });
});

app.get('/chat', function(req, res){
    const session = req.session;
    const id = req.query.id;
    if (id && session.playerId != id) {
        res.redirect(req.baseUrl+'/');
        res.end();
    }
    else{
        console.log('found chat');
        // res.setHeader('Content-Type', 'text/html');
        res.statusCode = 200;
        res.sendFile('chat.html', { root: path.join(__dirname, '') });
    }
});

app.get('/update', function(req,res) {
    const session = req.session;
    if (session.username == null) {
        session.username = req.query.username;
        console.log(req.query.username);
    }

    if (req.query.game != null) {
        session.game = req.query.game;
    }

    if (session.playerId == null) {
        id++;
        session.playerId = id;
    }

    if (req.query.meetingid != null) {
        session.meetingid = req.query.meetingid;
    }

    const check = players.findIndex(e => e.id == session.playerId);
    if (check == -1) {
        //Player json response obj
        const player = {};
        player.id = session.playerId;
        player.username = req.session.username;
        player.game = req.session.game;
        player.meetingid = req.session.meetingid;
        players.push(player);
    } else {
        players[check].game = session.game;
        players[check].meetingid = session.meetingid;
        res.setHeader('Content-Type', 'application/json');
        console.log(JSON.stringify(players[check]));
        res.write(JSON.stringify(players[check]));
    }

    if (session.game == null){
        res.redirect(req.baseUrl+'/games');
    }
    res.end();
});

app.get('/playerlist', function(req,res) {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(players));
    res.end();
})

app.get('/player', function(req,res) {

    if (req.query.id != null) {
        //Player json response obj
        const check = players.findIndex(e => e.id == req.query.id);

        let obj = {};
        if (check == -1) {
            //No match
        } else {
            obj = players[check];
        }

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(obj));
        res.end();
    } else {
    // //Player json response obj
    // const player = {

    // };
    // player.id = req.session.id;
    // player.username = req.session.username;
    // player.game = req.session.game;
    // player.meetingid = req.session.meetingid;

    // res.setHeader('Content-Type', 'application/json');
    // res.write(JSON.stringify(player));
    res.end();
    }
});

app.get('/search', function(req,res) {
    const session = req.session;
    for (let i = 0; i < players.length; i++) {
        const check = players.findIndex(e => session.game == e.game && e.id != session.playerId);
        console.log(check);
        if (check != -1) {
            //Match
            console.log('match');
            for (let j = 0; j < meetings.length; i++) {
                if (!meetings[j]) {
                    const self = players.findIndex(e=> session.playerId == e.id);
                    
                    //Update state in session,db and meetings
                    meetings[j] = true;
                    session.meetingid = j;
                    players[self].meetingid = j;
                    players[check].meetingid = j;

                    const new_chat = {};

                    new_chat.meetingid = j;
                    new_chat.player1 = session.id;
                    new_chat.player2 = players[check].id;

                    chatrooms.push(new_chat);
                    res.redirect(req.baseUrl+'/chat?id='+players[self].id);
                    return;
                }
            }
        }
    }
    res.redirect(req.baseUrl+'/chat');
});

app.get('/check', function(req,res) {
    const session = req.session;
    const check = players.findIndex(e => session.playerId == e.id && e.meetingid != null);

    console.log('checking: ' +check);
    if (check == -1) {
        //Still in queue
        res.end();
    } else {
        //Found match
        //Update session state
        session.meetingid = players[check].meetingid;

        //Redirect to chat
        console.log(req.baseUrl+'/chat?id='+players[check].id);
        res.write(JSON.stringify(players[check].id));
        res.end();
    }
    
    res.write('Checking');
    res.end();
})
