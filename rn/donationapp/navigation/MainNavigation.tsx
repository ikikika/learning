import { createStackNavigator } from '@react-navigation/stack';

import { Routes } from './Routes';
import Home from '../screens/Home/Home';
import SingleDonationScreen from '../screens/SingleDonationScreen/SingleDonationScreen';

const Stack = createStackNavigator();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null, headerShown: false }}
      initialRouteName={Routes.Home}
    >
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen
        name={Routes.SingleDonation}
        component={SingleDonationScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
