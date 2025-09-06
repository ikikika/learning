import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import MainNavigation from './navigation/MainNavigation';

function App() {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
}

export default App;
