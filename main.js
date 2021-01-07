var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const {joinUser, removeUser, findUser} = require('./users');





app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});



var thisRoom = "";



io.on("connection", function (socket) {
  socket.on("join room", (data) => {
    console.log(data.username + " joined the room: " + data.roomName);

    var Newuser = joinUser(socket.id, data.username, data.roomName);
    socket.emit("send data" , {id: socket.id, username: Newuser.username, roomname: Newuser.roomname });
    
    thisRoom = Newuser.roomname;
    socket.join(thisRoom);
  });


  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", {data: data, id: socket.id});
    console.log(data.user + " send to " + thisRoom + ": " + data.value);
  });


  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if(user) {
      console.log(user.username + " has left the room: " + thisRoom);
    }
  });
});

http.listen(process.env.PORT || 3000);

// add room name at top