import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {GameRoomContext, isPlayerTurn, isGameFinished} from '../state/gameRoom';
import socket from '../socket';

// TODO gameRoom from props
const Board = () => {
  return (
    <View style={styles.container}>
      <Row rowIndex={0}></Row>
      <Row rowIndex={1}></Row>
      <Row rowIndex={2}></Row>
    </View>
  );
};

export default Board;

const Row = ({rowIndex}) => {
  return (
    <View style={{flex: 1, flexDirection: 'row'}}>
      <Col rowIndex={rowIndex} colIndex={0}></Col>
      <Col rowIndex={rowIndex} colIndex={1}></Col>
      <Col rowIndex={rowIndex} colIndex={2}></Col>
    </View>
  );
};

const Col = ({rowIndex, colIndex}) => {
  const borderStyle = cellBorderStyles[`cell_${rowIndex}_${colIndex}`];
  const gameRoom = useContext(GameRoomContext);

  // console.log('TCL: Col -> gameRoom', gameRoom);

  const cellValue = gameRoom.board[rowIndex][colIndex];
  return (
    <View
      style={{
        ...borderStyle,
        flex: 1,
      }}>
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffff9e',
          margin: 10,
        }}
        onPress={() => {
          console.log('isPlayerTurn', isPlayerTurn());

          if (isGameFinished() || !isPlayerTurn() || cellValue !== '') {
            return;
          }

          socket.emit('c2s-player-turn', {rowIndex, colIndex});
        }}>
        <Text style={{fontSize: 60}}>{cellValue}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    aspectRatio: 1,
    width: '80%',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  col: {flex: 1, justifyContent: 'center', alignItems: 'center'},
};

const cellBorderStyles = {
  cell_0_0: {
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
  },
  cell_0_1: {
    borderTopWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cell_0_2: {
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cell_1_0: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 0,
  },
  cell_1_1: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cell_1_2: {
    borderTopWidth: 2,
    borderRightWidth: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cell_2_0: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cell_2_1: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 0,
    borderLeftWidth: 2,
  },
  cell_2_2: {
    borderTopWidth: 2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 2,
  },
};
