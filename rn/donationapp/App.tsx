import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigation from './navigation/RootNavigation';
import { useEffect, useRef } from 'react';
import { AppState, PermissionsAndroid } from 'react-native';
import { checkToken } from './api/user';
import messaging from '@react-native-firebase/messaging';

function App() {
  async function requestUserPermission() {
    // const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    // if (enabled) {
    //   console.log('Authorization status:', authStatus);
    // }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission granted');
    } else {
      console.log('Notification permission denied');
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log({ token });
  };

  useEffect(() => {
    requestUserPermission();
    getToken();
  }, []);

  // In React, useRef is commonly used to persist values across renders without causing the component to re-render when the value changes. Here, appState.current will hold the app's current state (such as 'active', 'background', or 'inactive' in a React Native app). This is useful for tracking the app's state in event handlers or effects, especially when you want to avoid unnecessary re-renders.
  // A key point is that updating appState.current will not trigger a re-render of the component. If you need the UI to update in response to app state changes, you would typically use useState instead. However, for tracking or referencing the value in callbacks, useRef is a lightweight and effective choice.
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('You have come back into the app');
          // this will log when user close the app but still keep it running in the background, then come back to the app
          // this will not log if user close the app completely

          await checkToken();
          // we are coming from background to the foreground
        }

        appState.current = nextAppState;
      },
    );
    checkToken();
    console.log('Application has rendered');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <NavigationContainer>
            <RootNavigation />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

export default App;
