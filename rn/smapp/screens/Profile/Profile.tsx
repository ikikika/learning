import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavProp } from '../../navigation/Routes';
import style from './style';

const Profile = ({ navigation }: NavProp) => {
  return (
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={globalStyle.flexGrow}>
        <View style={style.profileImageContainer}>
          <View style={style.profileImageContent}>
            <Image
              style={style.profileImage}
              source={require('../../assets/images/default_profile.png')}
            />
          </View>
        </View>
        <Text style={style.userName}>Emmanuel Robertsen</Text>
        <View style={style.statContainer}>
          <View>
            <Text style={style.statAmount}>45</Text>
            <Text style={style.statType}>Following</Text>
          </View>
          <View style={style.statBorder} />
          <View>
            <Text style={style.statAmount}>30M</Text>
            <Text style={style.statType}>Followers</Text>
          </View>
          <View style={style.statBorder} />
          <View>
            <Text style={style.statAmount}>100</Text>
            <Text style={style.statType}>Posts</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default Profile;
