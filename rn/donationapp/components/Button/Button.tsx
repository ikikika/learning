import React from 'react';
import { Pressable, Text } from 'react-native';
import style from './style';

const Button = ({ title, isDisabled, onPress }: ButtonType) => {
  return (
    <Pressable
      disabled={isDisabled}
      style={[style.button, isDisabled && style.disabled]}
      onPress={() => (onPress ? onPress() : {})}
    >
      <Text style={style.title}>{title}</Text>
    </Pressable>
  );
};

interface ButtonType {
  title: string;
  isDisabled?: boolean;
  onPress?: () => void;
}

export default Button;
