import io from 'socket.io-client';
import config from './config';
import {lobbyUsersSubject} from './state/lobbyUsers';
import {receiveInvite} from './state/gameInvites';
import {gameRoomSubject} from './state/gameRoom';

const socket = io(config.SOCKET_SERVER_URL);
console.log('TCL: config.SOCKET_SERVER_URL', config.SOCKET_SERVER_URL);

export default socket;

console.log('TCL: socket', socket);

// socket events here, until i decide where to put

// why is this running so often????
socket.on('s2c-lobby-users', data => {
  console.log('s2c-lobby-users', data);
  lobbyUsersSubject.next(data);
});

socket.on('s2c-receive-invite', data => {
  console.log('TCL: data', data);
  receiveInvite(data);
});

socket.on('s2c-game-room', gameRoom => {
  console.log('TCL: gameRoom', gameRoom);

  // this is where i call enterGameRoom...
  gameRoomSubject.next(gameRoom);
  // navigate GameRoom
});
