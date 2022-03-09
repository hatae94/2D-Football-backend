function RoomManager(io) {
  this.rooms = [];

  this.create = function (player1Socket, player2Socket) {
    const roomNumber = player1Socket.id + player2Socket.id;
    const room = new Room(roomNumber, player1Socket, player2Socket);

    player1Socket.join(roomNumber);
    player2Socket.join(roomNumber);

    // io.to(roomNumber).emit("loadPlayer", { players: room });

    this.rooms.push(room);
    console.log("Room Created : ", roomNumber);
  };

  this.findRoomIndex = function (socket) {
    let roomIndex = -1;

    this.rooms.forEach((room, index) => {
      for (const object in room.objects) {
        const obj = room.objects[object];

        if (obj.id === socket.id) {
          roomIndex = index;
          return;
        }
      }
    });

    return roomIndex;
  };
}

function Room(roomNumber, player1Socket, player2Socket) {
  this.roomNumber = roomNumber;
  this.status = "waiting";
  this.time = 120;
  this.isPaused = false;
  this.isGameOver = false;

  this.objects = {};

  this.objects[player1Socket.id] = {};
  this.objects[player1Socket.id].id = player1Socket.id;
  this.objects[player1Socket.id].side = "player1";
  this.objects[player1Socket.id].isReady = false;
  this.objects[player1Socket.id].name = "";

  this.objects[player2Socket.id] = {};
  this.objects[player2Socket.id].id = player2Socket.id;
  this.objects[player2Socket.id].side = "player2";
  this.objects[player2Socket.id].isReady = false;
  this.objects[player1Socket.id].name = "";

  this.objects.ball = {};
  this.objects.ball.id = roomNumber;

  this.players = [this.objects[player1Socket.id], this.objects[player2Socket.id]];
}

module.exports = RoomManager;
