import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import Tab from '../../components/Tab/Tab';
import Badge from '../../components/Badge/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Header title={'Azzahri A.'} type={1} />
        <Tab title={'Highlight'} />
        <Tab title={'Highlight'} isInactive={true} />
        <Badge title={'Environment'} />
        <FontAwesomeIcon icon={faSearch} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
