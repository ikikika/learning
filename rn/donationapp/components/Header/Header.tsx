import React from 'react';
import { View, Text } from 'react-native';
import style from './style';

const Header = ({ type, title, color = '#000000' }: HeaderTypes) => {
  const styleToApply = () => {
    switch (type) {
      case 1:
        return style.title1;
      case 2:
        return style.title2;
      case 3:
        return style.title3;
    }
  };
  return (
    <View>
      <Text style={[styleToApply(), color && { color: color }]}>{title}</Text>
    </View>
  );
};

interface HeaderTypes {
  title: string;
  type: number;
  color: string;
}

export default Header;
