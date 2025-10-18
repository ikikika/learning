import { Text } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import style from './style';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../components/BackButton/BackButton';
import { NavProp } from '../../navigation/Routes';

const SingleDonationScreen = ({ navigation }: SingleDonationScreenProps) => {
  const donationItemInformation = useAppSelector(
    state => state.donations.selectedDonationInformation,
  );
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ScrollView showsVerticalScrollIndicator={false} style={style.container}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text>
          {donationItemInformation !== null
            ? JSON.stringify(donationItemInformation)
            : ''}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleDonationScreen;

interface SingleDonationScreenProps extends NavProp {}
