import {navigate} from '../navigator';
import {Subject} from 'rxjs';
import React from 'react';
import socket from '../socket';

// this is redundant but helpful for debugging
let _gameRoom = null;

export const getGameRoom = () => _gameRoom;

export const gameRoomSubject = new Subject();

gameRoomSubject.subscribe(gameRoom => {
  _gameRoom = gameRoom;
  if (gameRoom.gameState === 'NEW') {
    navigate('GameRoom');
  }
});

export const GameRoomContext = React.createContext(null);

export const isPlayerTurn = () => {
  // should never be null when calling
  return (
    (_gameRoom.turn === 'HOST' && _gameRoom.hostId === socket.id) ||
    (_gameRoom.turn === 'GUEST' && _gameRoom.guestId === socket.id)
  );
};

export const isGameFinished = () => {
  // should never be null when calling
  return (
    _gameRoom.gameState === 'DRAW' ||
    _gameRoom.gameState === 'HOST_WINNER' ||
    _gameRoom.gameState === 'GUEST_WINNER'
  );
};

const isHost = () => {
  return _gameRoom.hostId === socket.id;
};

export const calcScore = () => {
  const {gameResults} = _gameRoom;
  // should never be null when calling
  let wins, losses, draws;
  draws = gameResults.filter(gr => gr === 'DRAW').length;
  if (isHost()) {
    wins = gameResults.filter(gr => gr === 'HOST').length;
    losses = gameResults.filter(gr => gr === 'GUEST').length;
  } else {
    wins = gameResults.filter(gr => gr === 'GUEST').length;
    losses = gameResults.filter(gr => gr === 'HOST').length;
  }
  return `Score: ${wins} wins, ${losses} losses, ${draws} draws`;
};

export const getGameStatus = () => {
  if (isGameFinished()) {
    if (_gameRoom.gameState === 'DRAW') {
      return 'Game is a draw.';
    }
    if (
      (isHost() && _gameRoom.gameState === 'HOST_WINNER') ||
      (!isHost() && _gameRoom.gameState === 'GUEST_WINNER')
    ) {
      return 'Congrats! You won this game.';
    }
    return 'Sorry, you lost.';
  }

  const {turn} = _gameRoom;
  if (isHost() && turn === 'HOST') {
    return `Your turn (${_gameRoom.players[_gameRoom.hostId].symbol})`;
  }
  if (!isHost() && turn === 'GUEST') {
    return `Your turn (${_gameRoom.players[_gameRoom.guestId].symbol})`;
  }
  if (isHost() && turn === 'GUEST') {
    return `Opponent turn (${_gameRoom.players[_gameRoom.guestId].symbol})`;
  }
  return `Opponent turn (${_gameRoom.players[_gameRoom.hostId].symbol})`;
};
