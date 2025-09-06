import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';

const Home = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Header title={'Azzahri A.'} type={1} />
        <Button
          title={'Donate'}
          onPress={() => {
            console.log('You just pressed me!');
          }}
        />
        <Button title={'Donate'} isDisabled={true} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
