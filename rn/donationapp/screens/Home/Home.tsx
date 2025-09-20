import React from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import { useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';
import { Pressable, Text } from 'react-native';
import { updateFirstName } from '../../redux/reducers/User';

const Home = () => {
  // Using the useSelector hook to select the "user" slice of the store
  // This will return the user object containing firstName, lastName and userId fields
  // const user = useSelector(state => state.user);

  // Instead of importing useSelector directly from react-redux, import the typed version:
  const { firstName, lastName } = useAppSelector(state => state.user);

  // Using the useDispatch hook to get a reference to the dispatch function
  // This function allows us to dispatch actions to update the store
  const dispatch = useDispatch();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
        <Header title={firstName + ' ' + lastName} />
        {/*dispatching updateFirstName action to the User so that our state gets updated with the new first name we want to use*/}
        <Pressable
          onPress={() => dispatch(updateFirstName({ firstName: 'N' }))}
        >
          <Text>Press me to change first name</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
