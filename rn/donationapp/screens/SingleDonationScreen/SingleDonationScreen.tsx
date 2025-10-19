import { Button, Image, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../components/BackButton/BackButton';
import { NavProp, SingleDonationScreenProps } from '../../navigation/Routes';
import { DonationItemType } from '../../types/donation.type';
import Badge from '../../components/Badge/Badge';
import Header from '../../components/Header/Header';
import { initialDonationItem } from '../../redux/reducers/Donations';

const SingleDonationScreen = ({
  navigation,
  route,
}: SingleDonationScreenProps) => {
  const donationItemInformation: DonationItemType =
    useAppSelector(state => state.donations.selectedDonationInformation) ??
    initialDonationItem;

  const { categoryInformation } = route.params ?? {
    categoryInformation: { name: '' },
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <Image
          source={{ uri: donationItemInformation.image }}
          style={style.image}
        />
        <View style={style.badge}>
          <Badge title={categoryInformation.name} />
        </View>
        <Header type={1} title={donationItemInformation.name} />
        <Text style={style.description}>
          {donationItemInformation.description}
          {donationItemInformation.description}
          {donationItemInformation.description}
          {donationItemInformation.description}
          {donationItemInformation.description}
          {donationItemInformation.description}
          {donationItemInformation.description}
        </Text>
        <View style={style.button}>
          <Button title={'Donate'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleDonationScreen;

// export interface SingleDonationScreenProps extends NavProp {
//   route: {
//     params: {
//       categoryInformation: {
//         name: string;
//       };
//     };
//   };
// }
