import {
  FlatList,
  StatusBar,
  // Platform,
  StyleSheet,
  // Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from './components/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import globalStyle from './assets/styles/globalStyle';
import UserStory from './components/UserStory/UserStory';
import { useEffect, useState } from 'react';
import UserPost from './components/UserPost/UserPost';
import { scaleFontSize } from './assets/styles/scaling';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './navigation/MainNavigation';


function App() {
  

  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
