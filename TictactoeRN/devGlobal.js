import {getGameRoom} from './src/state/gameRoom';

const devGlobal = {};

// TODO only in dev env
global.DEV_GLOBAL = devGlobal;

// TODO rewrite so all globals assigned in this file
export default devGlobal;

global.DEV_GLOBAL.getGameRoom = getGameRoom;
