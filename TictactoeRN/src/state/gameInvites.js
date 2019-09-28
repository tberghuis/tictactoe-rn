import devGlobal from '../../devGlobal';
import {Subject} from 'rxjs';
import socket from '../socket';

let gameInvites = [];

export const getGameInvites = () => gameInvites;
devGlobal.getGameInvites = getGameInvites;

export const gameInvitesSubject = new Subject();
gameInvitesSubject.subscribe({
  next: v => {
    gameInvites = v;
  },
});

export const receiveInvite = invite => {
  gameInvites.push(invite);
  gameInvitesSubject.next([...gameInvites]);
};

export const declineInvite = () => {
  gameInvites.shift();
  gameInvitesSubject.next([...gameInvites]);
};

export const acceptInvite = hostId => {
  // just emit
  socket.emit('c2s-invite-accepted', {hostId});
  gameInvitesSubject.next([]);
};
