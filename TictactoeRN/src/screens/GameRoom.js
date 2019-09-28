import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button} from 'react-native-elements';
import {
  GameRoomContext,
  getGameRoom,
  gameRoomSubject,
  isGameFinished,
  calcScore,
  getGameStatus,
} from '../state/gameRoom';
import Board from '../components/Board';
import socket from '../socket';

const GameRoom = () => {
  const [gameRoom, setGameRoom] = useState(getGameRoom());
  const [rematch, setRematch] = useState(isGameFinished());
  const [score, setScore] = useState(calcScore());
  const [gameStatus, setGameStatus] = useState(getGameStatus());
  useEffect(() => {
    const sub = gameRoomSubject.subscribe(gr => {
      setGameRoom(gr);
      const finished = isGameFinished();
      setRematch(finished);
      if (finished) {
        setScore(calcScore());
      }
      setGameStatus(getGameStatus());
      return () => sub.unsubscribe();
    });
  }, []);
  return (
    <GameRoomContext.Provider value={gameRoom}>
      <View style={styles.view1}>
        <Text1>{score}</Text1>
        <Text1>
          Player {gameRoom.players[gameRoom.hostId].symbol}:{' '}
          {gameRoom.players[gameRoom.hostId].username}
        </Text1>
        <Text1>
          Player {gameRoom.players[gameRoom.guestId].symbol}:{' '}
          {gameRoom.players[gameRoom.guestId].username}
        </Text1>
        <Text1>{gameStatus}</Text1>
        <View style={{marginTop: 15, alignItems: 'center'}}>
          <Board></Board>
        </View>
        {rematch && (
          <View style={{margin: 20}}>
            <Button
              title="Rematch"
              onPress={() => {
                // console.log('rematch');
                socket.emit('c2s-rematch');
              }}></Button>
          </View>
        )}
      </View>
    </GameRoomContext.Provider>
  );
};

export default GameRoom;

const styles = {
  view1: {
    flex: 1,
    margin: 10,
    // borderWidth: 2,
    // borderColor: '#000000',
    // borderStyle: 'solid',
  },
};

const Text1 = props => {
  return <Text style={{fontSize: 20}}>{props.children}</Text>;
};
