const { Subject } = require("rxjs");
const io = require("../io");
const { clientToUsername } = require("./clientToUsername");

// when mutate, pass to subject.next
// TODO let lobby = []
const lobbyRef = { lobby: [] };
// [$cid, ...]
global.DEV_GLOBAL.lobbyRef = lobbyRef;
const lobbySubject = new Subject();

const joinLobby = cid => {
  if (lobbyRef.lobby.indexOf(cid) === -1) {
    lobbyRef.lobby.push(cid);
    lobbySubject.next(lobbyRef.lobby);
  }
};

const leaveLobby = cid => {
  lobbyRef.lobby = lobbyRef.lobby.filter(lobbyCid => lobbyCid !== cid);
  lobbySubject.next(lobbyRef.lobby);
};

module.exports = { joinLobby, leaveLobby };

lobbySubject.subscribe({
  next: lobby => {
    const lobbyUsers = lobby.map(cid => ({
      cid,
      username: clientToUsername[cid]
    }));
    lobby.forEach(cid => {
      io.to(cid).emit("s2c-lobby-users", lobbyUsers);
    });
  }
});
