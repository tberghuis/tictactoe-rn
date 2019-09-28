// TODO if dev env
global.DEV_GLOBAL = {};
const server = require("./server");
const io = require("./io");
const { clientToUsername } = require("./state/clientToUsername");
const { joinLobby, leaveLobby } = require("./state/lobby");
const { createGameRoom, playerTurn, rematch } = require("./state/gameRooms");

io.on("connection", client => {
  client.on("c2s-enter-lobby", username => {
    clientToUsername[client.id] = username;
    joinLobby(client.id);
  });

  client.on("disconnect", () => {
    // remove from lobby
    leaveLobby(client.id);
    // remove from clientToUsername
    delete clientToUsername[client.id];
    // TODO remove from gameRooms, and emit s2c-game-end-by-disconnect
    // clientToGameRoom
  });

  client.on("c2s-send-invite", ({ guestId }) => {
    console.log("TCL: guestId", guestId);
    // send the user object
    io.to(guestId).emit("s2c-receive-invite", {
      hostId: client.id,
      hostUsername: clientToUsername[client.id]
    });
  });

  client.on("c2s-invite-accepted", ({ hostId }) => {
    console.log("TCL: hostId", hostId);
    leaveLobby(hostId);
    leaveLobby(client.id);

    // create game room
    createGameRoom({ hostId, guestId: client.id });
  });

  client.on("c2s-player-turn", ({ rowIndex, colIndex }) => {
    // console.log("TCL: rowIndex, colIndex", rowIndex, colIndex);
    playerTurn({ cid: client.id, rowIndex, colIndex });
  });

  client.on("c2s-rematch", () => {
    rematch(client.id);
  });
});

console.log("am i running");

const port = process.env.PORT || 3003;
server.listen(port);
