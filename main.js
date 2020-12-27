var name;
var socket = io.connect("http://localhost:5000");
var roomID;

$('#create').on('click', () => {
    name = $('#name').val();

    if(!name) {
        alert('Please enter your name.');
        return;
    }

    
    socket.emit('createRoom', {name: name});

    $("#entryForm").css('display', 'none');
    $("#chatRoom").css('display', 'block');
});

$('#join').on('click', () => {
    name = $('#name2').val();
    roomID = $('#room').val();

    if(!name || !roomID) {
        alert('Please enter your name and game ID.');
        return;
    }

    socket.emit('joinRoom', {name: name, room: roomID});

    $('#roomLabel').text(roomID);

    $("#entryForm").css('display', 'none');
    $("#chatRoom").css('display', 'block');
});

$('#send').on('click', () => {
    var msg = $('#message').val();

    if(!msg) {
        alert('Please include a message.');
        return;
    }

    socket.emit('sendMessage', {
        name: name,
        message: msg,
        room: roomID
    });
    
    printMessage(name, msg);

    $('#message').val('');
});

socket.on('newRoom', (data) => {
    roomID = data.room;
    $('#roomLabel').text(roomID);
});

socket.on('broadcastJoin', (data) => {
    alert(`${data.name} has joined the room.`);
});

socket.on('recMessage', (data) => {
    var name = data.name;
    var msg = data.message;

    printMessage(name, msg);
});

function printMessage(name, msg)
{
    $('#chatList').append(`<li class='border mt-1 mr-1'> 
                                <div> 
                                    <label>${name}</label>
                                    <br>
                                    <label>${msg}</label>
                                </div> 
                           </li>`);

    $('#chats').animate({scrollTop:$(document).height()}, 'slow');
}