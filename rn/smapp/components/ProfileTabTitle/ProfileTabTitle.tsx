import React from 'react';

import { Text } from 'react-native';
import style from './style';

const ProfileTabTitle = ({ title, isFocused }: ProfileTabTitleType) => {
  return (
    <Text style={[style.title, !isFocused && style.titleNotFocused]}>
      {title}
    </Text>
  );
};

export default ProfileTabTitle;

interface ProfileTabTitleType {
  title: string;
  isFocused: boolean;
}
