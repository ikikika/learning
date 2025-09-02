import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './Routes';

import Profile from '../screens/Profile/Profile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home/Home';
import { Text } from 'react-native';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainMenuNavigation = () => {
  return (
    <Drawer.Navigator
      // screenOptions={{ header: () => null, headerShown: false }} // hide "home" label at the top of the page
      initialRouteName={Routes.Home}
      screenOptions={{
        headerShown: false,
        swipeEnabled: true, // enable drawer swipe
        swipeEdgeWidth: 100, // how far from edge swipe works
      }}
    >
      <Drawer.Screen name={Routes.Home} component={Home} />
      <Drawer.Screen name={Routes.Profile} component={Profile} />
    </Drawer.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="Drawer">
      <Stack.Screen
        name="Drawer"
        component={MainMenuNavigation}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
