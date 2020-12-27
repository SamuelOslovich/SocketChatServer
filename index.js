var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var rooms = 0;

app.use(express.static('.'));

app.get('/', function(req, res) {
    res.sendDate(`${__dirname}/index.html`);
})

server.listen(5000);

io.on('connection', function(socket) {
    socket.on('createRoom', function(data) {
        socket.join(`room-${++rooms}`);
        socket.emit('newRoom', {name: data.name, room: `room-${rooms}`});
    });

    socket.on('joinRoom', function(data) {
        var room = io.nsps['/'].adapter.rooms[data.room];

        if (room)
        {
            socket.join(data.room);
            socket.broadcast.to(data.room).emit('broadcastJoin', {
                name: data.name
            });
        }
    });

    socket.on('sendMessage', function(data) {
        socket.broadcast.to(data.room).emit('recMessage', {
            name: data.name,
            message: data.message,
            room: data.room
        });
    });
})