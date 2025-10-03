import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import { useAppSelector } from '../../redux/hooks';
// import { useDispatch } from 'react-redux';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
// import { resetToInitialState, updateFirstName } from '../../redux/reducers/User';
import Search from '../../components/Search/Search';
import style from './style';

const Home = () => {
  // Using the useSelector hook to select the "user" slice of the store
  // This will return the user object containing firstName, lastName and userId fields
  // const user = useSelector(state => state.user);

  // Instead of importing useSelector directly from react-redux, import the typed version:
  const { firstName, lastName, profileImage } = useAppSelector(
    state => state.user,
  );

  // Using the useDispatch hook to get a reference to the dispatch function
  // This function allows us to dispatch actions to update the store
  // const dispatch = useDispatch();
  // dispatch(resetToInitialState());

  const categories = useAppSelector(state => state.categories);
  console.log(categories);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        {/* <Header title={firstName + ' ' + lastName} />
        {/*dispatching updateFirstName action to the User so that our state gets updated with the new first name we want to use
        <Pressable
          onPress={() => dispatch(updateFirstName({ firstName: 'N' }))}
        >
          <Text>Press me to change first name</Text>
        </Pressable> */}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.header}>
            <View>
              <Text style={style.headerIntroText}>Hello, </Text>
              <View style={style.username}>
                <Header title={firstName + ' ' + lastName[0] + '. 👋'} />
              </View>
            </View>
            <Image
              source={{ uri: profileImage }}
              style={style.profileImage}
              resizeMode={'contain'}
            />
          </View>
          <View style={style.searchBox}>
            <Search onSearch={() => null} />
          </View>
          <Pressable style={style.highlightedImageContainer}>
            <Image
              style={style.highlightedImage}
              source={require('../../assets/images/highlighted_image.png')}
              resizeMode={'contain'}
            />
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
