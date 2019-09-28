import AsyncStorage from '@react-native-community/async-storage';
import {Subject} from 'rxjs';

export const usernameRef = {username: null};

// this shit to be done controlled by component lifecycle
export const initUsername = async () => {
  usernameRef.username = await AsyncStorage.getItem('@username');
  // console.log('TCL: initLogin -> username', username);
};

export const updateUsernameSubject = new Subject();

updateUsernameSubject.subscribe({
  next: v => {
    console.log('next username', v);
    // write to storage
    AsyncStorage.setItem('@username', v);
    usernameRef.username = v;
  },
});
