import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList, Routes } from './Routes';
import Home from '../screens/Home/Home';
import SingleDonationScreen from '../screens/SingleDonationScreen/SingleDonationScreen';
import Login from '../screens/Login/Login';
import Registration from '../screens/Registration/Registration';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null, headerShown: false }}
      initialRouteName={Routes.Login}
    >
      <Stack.Screen name={Routes.Login} component={Login} />
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen
        name={Routes.SingleDonation}
        // Pass the component directly to let React Navigation handle props
        component={SingleDonationScreen}
      />
      <Stack.Screen name={Routes.Registration} component={Registration} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
