import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const Routes = {
  Home: 'Home',
  SingleDonation: 'SingleDonation',
};

type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.SingleDonation]: undefined;
};

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type NavProp = { navigation: RootNavigation };
