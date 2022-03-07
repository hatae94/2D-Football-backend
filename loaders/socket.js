const io = require("socket.io")();

module.exports = ({ app }) => {
  const players = {};
  const times = [];

  io.on("connect", (socket) => {
    socket.on("newPlayer", () => {
      players[socket.id] = Object.keys(players).length;

      io.emit("loadPlayer", players);
    });

    socket.on("movePlayer", ({ x, y, anims, time }) => {
      const serverTime = new Date();

      socket.broadcast.emit("otherPlayerMove", { x, y, anims, id: socket.id, serverTime });
    });

    socket.on("moveBall", ({ x, y, anims, id, possession, time }) => {
      const serverTime = new Date();

      io.emit("ballMove", { x, y, anims, id, possession, serverTime });
    });

    socket.on("disconnect", () => {
      console.log(`Goodbye ${players[socket.id]}`);
      delete players[socket.id];
      io.emit("loadPlayer", players);
    });
  });

  app.io = io;
};
