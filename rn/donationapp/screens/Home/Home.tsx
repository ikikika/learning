import React from 'react';
import { Text, View } from 'react-native';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';

const Home = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <View>
          <Text>Hello World!</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
