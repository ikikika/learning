import React from 'react';
import { View, Text } from 'react-native';
import style from './style';

const Header = ({
  type = 1,
  title,
  color = '#000000',
  numberOfLines,
}: HeaderTypes) => {
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
      <Text
        style={[styleToApply(), color && { color: color }]}
        numberOfLines={numberOfLines ? numberOfLines : 0}
      >
        {title}
      </Text>
    </View>
  );
};

interface HeaderTypes {
  title: string;
  type?: number;
  color?: string;
  numberOfLines?: number;
}

export default Header;
