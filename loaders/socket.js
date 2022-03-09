const io = require("socket.io")();

const LobbyManager = require("../managers/LobbyManager");
const Roomanager = require("../managers/RoomManager");

const lobbyManager = new LobbyManager();
const roomManager = new Roomanager(io);

module.exports = ({ app }) => {
  let userState = {};

  io.on("connect", (socket) => {
    console.log("socket connected : ", socket.id);

    socket.on("makeRoom", () => {
      lobbyManager.push(socket);
      lobbyManager.dispatch(roomManager);
    });

    socket.on("joinRoom", () => {
      const roomIndex = roomManager.findRoomIndex(socket);
      const roomInfo = roomManager?.rooms[roomIndex];

      if (roomInfo) {
        socket.emit("loadPlayer", { roomInfo: roomInfo?.objects });

        userState = {};
      }
    });

    socket.on("setUserState", ({ name, isReady }) => {
      const roomIndex = roomManager.findRoomIndex(socket);
      const roomInfo = roomManager?.rooms[roomIndex];

      userState[socket.id] = { name, isReady };

      if (Object.keys(userState).length > 1) {
        roomInfo?.players.map((player) => {
          player.name = userState[player.id].name;
          player.isReady = userState[player.id].isReady;

          return player;
        });
      }
    });

    socket.on("checkIsAllReady", () => {
      const roomIndex = roomManager.findRoomIndex(socket);
      const roomInfo = roomManager?.rooms[roomIndex];
      const isAllReady = !roomInfo?.players.some((player) => {
        return !player.isReady;
      });
      let playersNameList = [];

      if (isAllReady) {
        playersNameList = roomInfo?.players.map((player) => {
          return player.name;
        });

        io.to(roomInfo?.roomNumber).emit("sendPlayersNameList", { playersNameList });
      }

      io.to(roomInfo?.roomNumber).emit("isAllReadyCheck", { isAllReady });
    });

    socket.on("movePlayer", ({ x, y, anims, time }) => {
      const serverTime = new Date();

      socket.broadcast.emit("otherPlayerMove", { x, y, anims, id: socket.id, serverTime });
    });

    socket.on("moveBall", ({ x, y, anims, id, possession, time }) => {
      const serverTime = new Date();
      const { roomNumber } = roomManager.rooms[roomManager.findRoomIndex(socket)];

      io.to(roomNumber).emit("ballMove", { x, y, anims, id, possession, serverTime });
    });

    socket.on("setGameOver", () => {
      const roomIndex = roomManager.findRoomIndex(socket);
      const roomInfo = roomManager?.rooms[roomIndex];

      roomInfo.isGameOver = true;

      io.to(roomInfo.roomNumber).emit("gameOver", { isGameOver: roomInfo.isGameOver });
    });

    socket.on("resetObjects", () => {
      const roomIndex = roomManager.findRoomIndex(socket);
      const roomInfo = roomManager?.rooms[roomIndex];

      io.to(roomInfo.roomNumber).emit("resetObjects");
    });

    socket.on("disconnect", () => {
      const roomIndex = roomManager.findRoomIndex(socket);

      if (roomIndex !== -1) {
        userState = roomManager.rooms[roomIndex].players.filter(
          (player) => player.id !== socket.id,
        );
        roomManager.rooms.splice(roomIndex, 1);
      }

      delete userState[socket.id];

      lobbyManager.leave(socket);

      console.log(`Goodbye ${socket.id}`);
    });
  });

  app.io = io;
};
