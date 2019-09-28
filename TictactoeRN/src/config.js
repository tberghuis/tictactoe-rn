const configDev = {SOCKET_SERVER_URL: 'http://192.168.2.102:3003'};

const configProd = {};

// console.log('__DEV__', __DEV__);

export default config = __DEV__ ? configDev : configProd;
