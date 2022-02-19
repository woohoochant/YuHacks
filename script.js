const apiURL = window.location.origin;
const socket = io('http://localhost:8080');
const chat = document.querySelector('#chat-room');
const form = document.querySelector('#message-form');
const message = document.querySelector('#message');

var meetingId;

window.onload = (event) => {
    let playerId = getParameterByName('id');
    fetch(apiURL + '/player?id=' + playerId)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    alert('something went wrong');
                    return;
                }
                response.json().then(json => {
                    meetingId = json.meetingid; 
                    socket.emit('init-user', json);
                    console.log(json);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function navigate(endpoint) {
    const url = window.location.origin + '/' + endpoint;
    console.log(url);
    window.location.href = url;
}

socket.on('chat-message', data => {
    console.log('receieved: ');
    console.log(data);
    if (meetingId == data.player.meetingid){
        console.log('should append');
        appendMsg(data.player.username+': '+data.message);
    }
})

form.addEventListener('submit', e => {
    e.preventDefault();
    const val = message.value;
    socket.emit('send-chat-message', val);
    message.value = '';
    appendMsg('You: '+val);
})

function appendMsg(msg) {
    const newMsg = document.createElement('div');
    newMsg.innerText = msg;
    chat.append(newMsg);
}