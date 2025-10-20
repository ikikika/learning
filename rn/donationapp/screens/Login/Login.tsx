import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../components/Input/Input';
import style from './style';

const Login = () => {
  const [email, setEmail] = useState('');
  console.log(email);
  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.container}
      >
        <Input
          keyboardType={'email-address'}
          label={'Email'}
          placeholder={'Enter your email...'}
          onChangeText={value => setEmail(value)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
