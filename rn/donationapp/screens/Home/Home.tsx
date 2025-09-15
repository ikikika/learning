import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Search from '../../components/Search/Search';

const Home = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Search
          onSearch={value => {
            console.log(value);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
