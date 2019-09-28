import React from 'react';
import Lobby from './src/screens/Lobby';
import GameRoom from './src/screens/GameRoom';
import Home from './src/screens/Home';
import Loading from './src/screens/Loading';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {setNavigator, handleNavigationChange} from './src/navigator';

// TODO ????
// import socket from './src/socket';

import devGlobal from './devGlobal';

devGlobal.blend = 'willitblend';

const AppStack = createStackNavigator({
  Home: {
    screen: Home,
  },
  Lobby: {
    screen: Lobby,
  },
  GameRoom: {
    screen: GameRoom,
  },
});

const SwitchNavigator = createSwitchNavigator(
  {
    InitialRoute: Loading,
    AppStack,
  },
  {
    initialRouteName: 'InitialRoute',
  },
);

const AppContainer = createAppContainer(SwitchNavigator);

export default App = () => {
  return (
    <AppContainer
      ref={n => setNavigator(n)}
      onNavigationStateChange={handleNavigationChange}
    />
  );
};
