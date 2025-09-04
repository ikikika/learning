import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from './Routes';

import Profile from '../screens/Profile/Profile';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home/Home';
import { Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ProfileTabTitle from '../components/ProfileTabTitle/ProfileTabTitle';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const ProfileTabs = createMaterialTopTabNavigator();

const Tab1 = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is tab 1</Text>
    </View>
  );
};

const Tab2 = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is tab 2</Text>
    </View>
  );
};

const Tab3 = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is tab 3</Text>
    </View>
  );
};

export const ProfileTabsNavigation = () => {
  return (
    <ProfileTabs.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          zIndex: 0,
          elevation: 0,
        },
      }}
    >
      <ProfileTabs.Screen
        name={'Tab1'}
        options={{
          tabBarLabel: ({ focused }) => (
            <ProfileTabTitle isFocused={focused} title={'Photos'} />
          ),
        }}
        component={Tab1}
      />
      <ProfileTabs.Screen
        name={'Tab2'}
        options={{
          tabBarLabel: ({ focused }) => (
            <ProfileTabTitle isFocused={focused} title={'Videos'} />
          ),
        }}
        component={Tab2}
      />
      <ProfileTabs.Screen
        name={'Tab3'}
        options={{
          tabBarLabel: ({ focused }) => (
            <ProfileTabTitle isFocused={focused} title={'Saved'} />
          ),
        }}
        component={Tab3}
      />
    </ProfileTabs.Navigator>
  );
};
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
