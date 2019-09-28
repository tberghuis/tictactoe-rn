const clientToGameRoom = {};
// { [socket.id]: $gameRoomId, ... }
global.DEV_GLOBAL.clientToGameRoom = clientToGameRoom;

module.exports = { clientToGameRoom };
