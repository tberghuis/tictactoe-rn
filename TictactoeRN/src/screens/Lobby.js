import React, {useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {ListItem, Text, Overlay, Button} from 'react-native-elements';
import {lobbyUsersSubject, lobbyUsersRef} from '../state/lobbyUsers';
import {
  declineInvite,
  acceptInvite,
  gameInvitesSubject,
} from '../state/gameInvites';
import socket from '../socket';

// my first custom hook
function useSet() {
  const [set, setSet] = useState(new Set());
  const addToSet = item => {
    setSet(new Set(set.add(item)));
  };
  const deleteFromSet = item => {
    set.delete(item);
    setSet(new Set(set));
  };
  const setContains = item => {
    return set.has(item);
  };
  return [setContains, addToSet, deleteFromSet];
}

const Lobby = () => {
  const [lobbyUsers, setLobbyUsers] = useState(lobbyUsersRef.lobbyUsers);
  const [isSwitchEnabled, enableSwitch, disableSwitch] = useSet();
  useEffect(() => {
    setLobbyUsers(lobbyUsersRef.lobbyUsers);
    const subscription = lobbyUsersSubject.subscribe({
      next: v => {
        setLobbyUsers(v);
      },
    });

    // NOTE for some reason this don't work
    // return subscription.unsubscribe;
    // however this does??? is the reason some sort of prototype chain rules???
    return () => subscription.unsubscribe();
  }, []);

  const lobbyUsersFiltered = lobbyUsers.filter(lu => lu.cid !== socket.id);

  return (
    <View>
      <Text>Lobby screen</Text>
      <ListItem
        key="list-title"
        title="Username"
        rightTitle="invite"
        bottomDivider
      />
      <ScrollView>
        {lobbyUsersFiltered.map(lu => (
          <ListItem
            key={lu.cid}
            title={lu.username}
            switch={{
              onValueChange: val => {
                if (val) {
                  enableSwitch(lu.cid);
                  socket.emit('c2s-send-invite', {guestId: lu.cid});
                  return;
                }
                // TODO implement removing invite
                // disableSwitch(lu.cid);
              },
              value: isSwitchEnabled(lu.cid),
            }}
            bottomDivider
          />
        ))}
      </ScrollView>
      <InviteOverlay></InviteOverlay>
    </View>
  );
};

export default Lobby;

const InviteOverlay = () => {
  // overkill to do correct initial state via call getGameInvites()
  const [isVisible, setVisible] = useState(false);
  const [gameInvite, setGameInvite] = useState(null);
  useEffect(() => {
    // TODO
    const sub = gameInvitesSubject.subscribe(v => {
      console.log('gameInvitesSubject v', v);
      setGameInvite(v.length > 0 ? v[0] : null);
      setVisible(v.length > 0);
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <>
      {isVisible && (
        <Overlay overlayStyle={{height: 'auto'}} isVisible>
          {/* TODO view flex-0, add ref to view, userEffect setState overlay height */}
          <View>
            <Text h4>Accept game invite?</Text>
            <Text h4>User: {gameInvite.hostUsername}</Text>
            <Button
              title="Accept"
              onPress={() => acceptInvite(gameInvite.hostId)}
              containerStyle={{marginTop: 10}}
            />
            <Button
              title="Decline"
              onPress={() => {
                declineInvite();
              }}
              containerStyle={{marginTop: 10}}
            />
          </View>
        </Overlay>
      )}
    </>
  );
};
