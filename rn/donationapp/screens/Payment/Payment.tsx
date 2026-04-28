import { ScrollView } from 'react-native-gesture-handler';
import { PaymentScreenProp } from '../../navigation/Routes';
import { DonationItemType } from '../../types/donation.type';
import { useAppSelector } from '../../redux/hooks';
import { initialDonationItem } from '../../redux/reducers/Donations';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import Header from '../../components/Header/Header';
import { Alert, Platform, Text, View } from 'react-native';
import Button from '../../components/Button/Button';
import {
  CardForm,
  StripeProvider,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import { STRIPE_PUBLISHABLE_KEY } from '../../constants/App';
import { useState } from 'react';

const Payment = ({ navigation }: PaymentScreenProp) => {
  const donationItemInformation: DonationItemType =
    useAppSelector(state => state.donations.selectedDonationInformation) ??
    initialDonationItem;

  const [isReady, setIsReady] = useState(false);
  const { confirmPayment, loading } = useConfirmPayment();
  const user = useAppSelector(state => state.user);

  //Make sure to start your local server with nodemon index.js before running this, otherwise your local server will not receive your requests
  const fetchPaymentIntentClientSecret = async () => {
    const API_BASE_URL =
      'https://us-central1-donationapp-connection.cloudfunctions.net/stripePayment';
    // Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

    const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        currency: 'usd',
        amount: parseInt(donationItemInformation.price) * 100,
      }),
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };
  const handlePayment = async () => {
    const clientSecret = await fetchPaymentIntentClientSecret();
    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      paymentMethodType: 'Card',
    });
    if (error) {
      Alert.alert(
        'Error has occured with your payment',
        error.localizedMessage,
      );
    } else if (paymentIntent) {
      Alert.alert('Successful', 'The payment was confirmed successfully!');
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ScrollView contentContainerStyle={style.paymentContainer}>
        <Header title={'Making Donation'} />
        <Text style={style.donationAmountDescription}>
          You are about to donate {donationItemInformation.price}
        </Text>
        <View>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <CardForm
              style={style.cardForm}
              onFormComplete={() => {
                setIsReady(true);
              }}
            />
          </StripeProvider>
        </View>
      </ScrollView>
      <View style={style.button}>
        <Button
          title={'Donate'}
          isDisabled={!isReady || loading}
          onPress={async () => await handlePayment()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Payment;
