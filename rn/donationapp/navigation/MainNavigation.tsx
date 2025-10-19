import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList, Routes } from './Routes';
import Home from '../screens/Home/Home';
import SingleDonationScreen from '../screens/SingleDonationScreen/SingleDonationScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null, headerShown: false }}
      initialRouteName={Routes.Home}
    >
      <Stack.Screen name={Routes.Home} component={Home} />
      <Stack.Screen
        name={Routes.SingleDonation}
        // Pass the component directly to let React Navigation handle props
        component={SingleDonationScreen}
      />
    </Stack.Navigator>
  );
};

export default MainNavigation;
