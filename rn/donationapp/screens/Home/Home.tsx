import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import { useAppSelector } from '../../redux/hooks';

const Home = () => {
  // Using the useSelector hook to select the "user" slice of the store
  // This will return the user object containing firstName, lastName and userId fields
  // const user = useSelector(state => state.user);

  // Instead of importing useSelector directly from react-redux, import the typed version:
  const { firstName, lastName } = useAppSelector(state => state.user);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Header title={firstName + ' ' + lastName} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
