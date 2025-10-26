import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CategoryType } from '../redux/reducers/Categories';
import { RouteProp } from '@react-navigation/native';

export const Routes = {
  Home: 'Home',
  SingleDonation: 'SingleDonation',
  Login: 'Login',
  Registration: 'Registration',
};

export type RootStackParamList = {
  [Routes.Home]: undefined;
  [Routes.SingleDonation]: { categoryInformation: CategoryType };
};

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;
export type SingleDonationRouteProp = RouteProp<
  RootStackParamList,
  typeof Routes.SingleDonation
>;

export type NavProp = { navigation: RootNavigation };

export interface SingleDonationScreenProps {
  navigation: RootNavigation;
  route: SingleDonationRouteProp;
}

export interface LoginScreenProp extends NavProp {}

export interface RegistrationScreenProps extends NavProp {}
