import { StyleSheet } from 'react-native';
import { getFontFamily } from '../fonts/helper';

const globalStyle = StyleSheet.create({
  header: {
    marginLeft: 27,
    marginRight: 17,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageIcon: {
    padding: 14,
    backgroundColor: '#f9fafa',
    borderRadius: 100,
  },
  messageNumberContainer: {
    backgroundColor: '#f35bac',
    justifyContent: 'center',
    flexDirection: 'row',
    width: 10,
    height: 10,
    borderRadius: 10,
    position: 'absolute',
    right: 12,
    top: 14

  },
  messageNumber: {
    color: '#ffffff',
    fontSize: 6,
    fontFamily: getFontFamily({ baseFont: 'Inter', weight: '600' }),
  },
});

export default globalStyle;
