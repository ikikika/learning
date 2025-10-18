import { Text } from 'react-native';
import { useAppSelector } from '../../redux/hooks';

const SingleDonationScreen = () => {
  const donationItemInformation = useAppSelector(
    state => state.donations.selectedDonationInformation,
  );
  return (
    <Text>
      {donationItemInformation !== null
        ? JSON.stringify(donationItemInformation)
        : ''}
    </Text>
  );
};

export default SingleDonationScreen;
