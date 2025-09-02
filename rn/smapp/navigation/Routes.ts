import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Routes = {
  Home: 'Home',
  Profile: 'Profile',
};

type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.Profile]: { userId?: string }; // if Profile takes params
};

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type NavProp = { navigation: RootNavigation };
