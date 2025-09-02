import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavProp } from '../../navigation/Routes';

const Profile = ({ navigation }: NavProp) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
        <Text>Welcome to profile page</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Profile;
