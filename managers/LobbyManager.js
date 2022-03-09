function LobbyManager() {
  this.lobby = [];
  this.updating = false;

  this.push = function (socket) {
    this.lobby.push(socket);
    console.log("push length", this.lobby.length);
  };

  this.leave = function (socket) {
    const index = this.lobby.indexOf(socket);

    if (index >= 0) {
      this.lobby.splice(index, 1);
    }
  };

  this.clean = function () {
    const sockets = this.lobby;

    this.lobby = sockets.filter((socket) => !socket);
  };

  this.dispatch = function (RoomManager) {
    console.log("length", this.lobby.length);
    if (this.dispatching) {
      return;
    }

    this.dispatching = true;

    while (this.lobby.length > 1) {
      const player1Socket = this.lobby.shift();
      const player2Socket = this.lobby.shift();

      RoomManager.create(player1Socket, player2Socket);
    }

    this.dispatching = false;
  };
}

module.exports = LobbyManager;
