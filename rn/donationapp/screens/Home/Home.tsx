import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Tab from '../../components/Tab/Tab';

const Home = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Header title={'Azzahri A.'} type={1} />
        <Tab title={'Highlight'} />
        <Tab title={'Highlight'} isInactive={true} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
