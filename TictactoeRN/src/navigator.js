import {NavigationActions} from 'react-navigation';

// do not maintain current screen as state,
// work with react navigation library
// because of edge cases such as back button

let _resolve = null;

const navigatorPromise = new Promise(function(resolve) {
  _resolve = resolve;
});

// is there a better way to achieve this pattern?
// some sort of DI?
export const setNavigator = navigator => {
  _resolve(navigator);
};

export const handleNavigationChange = (prevState, newState, action) => {
  console.log('prevState, newState, action', prevState, newState, action);
};

export const navigate = async screenName => {
  const nav = await navigatorPromise;
  nav.dispatch({
    type: NavigationActions.NAVIGATE,
    routeName: screenName,
  });
};
