import { useState } from 'react';
import { KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import style from './style';

const Input = ({
  keyboardType,
  placeholder,
  label,
  onChangeText,
  secureTextEntry,
}: InputType) => {
  const [value, setValue] = useState('');
  return (
    <View>
      <Text style={style.label}>{label}</Text>
      <TextInput
        placeholder={placeholder ? placeholder : ''}
        style={style.input}
        value={value}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={val => {
          setValue(val);
          onChangeText(val);
        }}
      />
    </View>
  );
};

Input.defaultProps = {
  onChangeText: () => {},
  keyboardType: 'default',
  secureTextEntry: false,
};

interface InputType {
  keyboardType: KeyboardTypeOptions;
  placeholder: string;
  label: string;
  onChangeText: (val: string) => void;
  secureTextEntry: boolean;
}

export default Input;
