import React, { useRef, useState } from 'react';
import { Pressable, Text } from 'react-native';

import { horizontalScale } from '../../assets/styles/scaling';
import style from './style';

const Tab = ({ tabId, title, isInactive = false, onPress }: TabProps) => {
  const [width, setWidth] = useState(0);
  const textRef = useRef(null);
  const paddingHorizontal = 33;
  const tabWidth = {
    width: horizontalScale(paddingHorizontal * 2 + width),
  };
  return (
    <Pressable
      // disabled={isInactive}
      style={[style.tab, isInactive && style.inactiveTab, tabWidth]}
      onPress={() => onPress && onPress(tabId)}
    >
      <Text
        onTextLayout={event => {
          // when component is rendered on the layout of the text, capture width
          setWidth(event.nativeEvent.lines[0].width); // make width of button follow width of content
        }}
        ref={textRef}
        style={[style.title, isInactive && style.inactiveTitle]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

interface TabProps {
  tabId: number;
  title: string;
  isInactive?: boolean;
  onPress?: (tabId: number) => void;
}

export default Tab;
