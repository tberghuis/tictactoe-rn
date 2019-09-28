const { Subject } = require("rxjs");
const io = require("../io");
const uuid = require("uuidv4").default;
const { clientToUsername } = require("./clientToUsername");
const { clientToGameRoom } = require("./clientToGameRoom");

// TODO require lobby

const gameRooms = {
  // [gameRoomId]: {
  //     gameRoomId:
  // TODO rewrite this
  //     host: {id:, username:}
  //     guest: {id:, username:}
  //     board:
  //     gameResults: HOST, GUEST, ...
  //     gameState: NEW | REMATCH | MID_GAME | DRAW | HOST_WINNER | GUEST_WINNER | END_DISCONNECT | END_NO_REMATCH // or I should use seperate events
  //     turn: HOST | GUEST
  //     rematch: {[playerid]:true, ...}
  // }, ...
};
global.DEV_GLOBAL.gameRooms = gameRooms;

// pipe through updated rooms
const gameRoomSubject = new Subject();

// on first game hostId has first turn
const createGameRoom = ({ hostId, guestId }) => {
  const gameRoomId = uuid();
  // const host = { id: hostId, username: clientToUsername[hostId], symbol: "O" };
  // const guest = {
  //   id: guestId,
  //   username: clientToUsername[guestId],
  //   symbol: "X"
  // };
  const gameRoom = {
    gameRoomId,
    hostId,
    guestId,
    players: {
      [hostId]: { username: clientToUsername[hostId], symbol: "O" },
      [guestId]: { username: clientToUsername[guestId], symbol: "X" }
    },
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    gameResults: [],
    gameState: "NEW",
    turn: "HOST",
    rematch: {}
  };
  gameRoomSubject.next(gameRoom);

  clientToGameRoom[hostId] = gameRoomId;
  clientToGameRoom[guestId] = gameRoomId;
};

gameRoomSubject.subscribe(gameRoom => {
  if (["NEW"].indexOf(gameRoom.gameState > -1)) {
    gameRooms[gameRoom.gameRoomId] = gameRoom;
    emitGameRoom(gameRoom);
  }
});

const emitGameRoom = gameRoom => {
  io.to(gameRoom.hostId).emit("s2c-game-room", gameRoom);
  io.to(gameRoom.guestId).emit("s2c-game-room", gameRoom);
};

// const endGameRoom = gameRoomId => {};

const playerTurn = ({ cid, rowIndex, colIndex }) => {
  console.log("TCL: cid,rowIndex,colIndex", cid, rowIndex, colIndex);

  const gameRoomId = clientToGameRoom[cid];
  const gameRoom = gameRooms[gameRoomId];

  const isClientTurn =
    (gameRoom.turn === "HOST" && gameRoom.hostId === cid) ||
    (gameRoom.turn === "GUEST" && gameRoom.guestId === cid);

  if (!isClientTurn) {
    return;
  }

  // make turn
  gameRoom.board[rowIndex][colIndex] = gameRoom.players[cid].symbol;
  gameRoom.turn = gameRoom.turn === "HOST" ? "GUEST" : "HOST";
  gameRoom.gameState = "MID_GAME";

  // TODO logic here
  if (isGameWon(gameRoom.board)) {
    const isHost = cid === gameRoom.hostId;
    gameRoom.gameState = isHost ? "HOST_WINNER" : "GUEST_WINNER";
    gameRoom.gameResults.push(isHost ? "HOST" : "GUEST");
  } else if (!gameRoom.board.flat().includes("")) {
    gameRoom.gameState = "DRAW";
    gameRoom.gameResults.push("DRAW");
  }

  // do i even need gameRoomSubject??? no
  emitGameRoom(gameRoom);
};

const rematch = cid => {
  console.log("rematch", cid);
  const gameRoom = gameRooms[clientToGameRoom[cid]];
  gameRoom.rematch[cid] = true;
  if (gameRoom.rematch[gameRoom.hostId] && gameRoom.rematch[gameRoom.guestId]) {
    // reset gameState
    gameRoom.rematch = {};
    gameRoom.board = [["", "", ""], ["", "", ""], ["", "", ""]];
    gameRoom.gameState = "NEW";
    gameRoom.turn = gameRoom.gameResults.length % 2 === 0 ? "HOST" : "GUEST";
    const { symbol } = gameRoom.players[gameRoom.hostId];
    gameRoom.players[gameRoom.hostId].symbol = symbol === "X" ? "O" : "X";
    gameRoom.players[gameRoom.guestId].symbol = symbol === "X" ? "X" : "O";
    emitGameRoom(gameRoom);
  }
};

module.exports = { playerTurn, gameRooms, createGameRoom, rematch };

const isGameWon = board => {
  const didWinRow = rowIndex => {
    return (
      board[rowIndex][0] !== "" &&
      board[rowIndex][0] === board[rowIndex][1] &&
      board[rowIndex][1] === board[rowIndex][2]
    );
  };

  const didWinCol = colIndex => {
    return (
      board[0][colIndex] !== "" &&
      board[0][colIndex] === board[1][colIndex] &&
      board[1][colIndex] === board[2][colIndex]
    );
  };

  const didWinDiag = () => {
    return (
      board[1][1] !== "" &&
      ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[2][0] === board[1][1] && board[1][1] === board[0][2]))
    );
  };

  if (
    didWinRow(0) ||
    didWinRow(1) ||
    didWinRow(2) ||
    didWinCol(0) ||
    didWinCol(1) ||
    didWinCol(2) ||
    didWinDiag()
  ) {
    return true;
  }
  return false;
};
