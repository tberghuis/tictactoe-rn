import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {initUsername} from '../state/username';
import {navigate} from '../navigator';

const Loading = () => {
  useEffect(() => {
    const fn = async () => {
      await initUsername();
      navigate('Home');
    };
    fn();
  }, []);
  return (
    <View>
      <Text>Loading screen</Text>
    </View>
  );
};

export default Loading;
