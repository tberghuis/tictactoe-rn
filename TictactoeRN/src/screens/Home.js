import React from 'react';
import {View} from 'react-native';
import {Button, Input} from 'react-native-elements';
import socket from '../socket';
import {updateUsernameSubject, usernameRef} from '../state/username';
import {navigate} from '../navigator';

class Home extends React.Component {
  state = {
    // await initUsername in loading before navigate here
    username: usernameRef.username,
    error: false,
  };

  static navigationOptions = {
    title: 'Tic Tac Toe',
  };

  render() {
    return (
      <View>
        <Input
          label="Username"
          placeholder="Username"
          onChangeText={username => {
            this.setState({username, error: false});
          }}
          errorMessage={this.state.error ? 'Please enter Username' : null}
          value={this.state.username}
        />
        <Button
          title="Enter Lobby"
          onPress={() => {
            console.log('button press', this.state);
            const username = this.state.username.trim();
            if (!username) {
              console.log('empty string');
              this.setState({error: true});
              return;
            }
            updateUsernameSubject.next(username);
            
            
            navigate('Lobby');
            
            socket.emit('c2s-enter-lobby', username);
            
          }}
        />
      </View>
    );
  }
}

export default Home;
