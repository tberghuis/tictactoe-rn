import {Subject} from 'rxjs';

// [{cid,username}, ...]
// const lobbyUsers = [];

export const lobbyUsersRef = {lobbyUsers: []};

export const lobbyUsersSubject = new Subject();

lobbyUsersSubject.subscribe({
  next: v => {
    lobbyUsersRef.lobbyUsers = v;
  },
});
