import { StyleSheet } from 'react-native';
import { getFontFamily } from '../../assets/fonts/helper';

const style = StyleSheet.create({
  title: {
    fontFamily: getFontFamily({baseFont: 'Inter', weight: '600'}),
    fontSize: 24
  },
});

export default style;