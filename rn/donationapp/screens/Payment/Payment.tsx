import { ScrollView } from 'react-native-gesture-handler';
import { PaymentScreenProp } from '../../navigation/Routes';
import { DonationItemType } from '../../types/donation.type';
import { useAppSelector } from '../../redux/hooks';
import { initialDonationItem } from '../../redux/reducers/Donations';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import Header from '../../components/Header/Header';
import { Text, View } from 'react-native';
import Button from '../../components/Button/Button';

const Payment = ({ navigation }: PaymentScreenProp) => {
  const donationItemInformation: DonationItemType =
    useAppSelector(state => state.donations.selectedDonationInformation) ??
    initialDonationItem;

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ScrollView contentContainerStyle={style.paymentContainer}>
        <Header title={'Making Donation'} />
        <Text style={style.donationAmountDescription}>
          You are about to donate {donationItemInformation.price}
        </Text>
        <View />
      </ScrollView>
      <View style={style.button}>
        <Button title={'Donate'} />
      </View>
    </SafeAreaView>
  );
};

export default Payment;
