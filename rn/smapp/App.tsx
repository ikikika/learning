import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getFontFamily } from './assets/fonts/helper';
import Title from './components/Title/Title';

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={{ fontSize: 50, fontFamily: getFontFamily({baseFont: 'Inter', weight: '100'}) }}>Test123</Text> */}
      <Title title="Let's Explore" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
