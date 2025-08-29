import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Title from './components/Title/Title';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import globalStyle from './assets/styles/globalStyle';
import UserStory from './components/UserStory/UserStory';
import { useEffect, useState } from 'react';

const userStories = [
  {
    firstName: 'Aaa',
    id: 1,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Bbb',
    id: 2,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Ccc',
    id: 3,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Ddd',
    id: 4,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Eee',
    id: 5,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Fff',
    id: 6,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Ggg',
    id: 7,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Hhh',
    id: 8,
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Iii',
    id: 9,
    profileImage: require('./assets/images/default_profile.png'),
  },
];

function App() {
  const userStoriesPageSize = 3;
  const [userStoriesCurrentPage, setUserStoriesCurrentPage] = useState(1);
  const [userStoriesRenderedData, setUserStoriesRenderedData] = useState<
    typeof userStories
  >([]);
  const [isLoadingUserStories, setIsLoadingUserStories] = useState(false);

  const pagination = ({
    database,
    currentPage,
    pageSize,
  }: {
    database: typeof userStories;
    currentPage: number;
    pageSize: number;
  }) => {
    console.log({ currentPage });
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex >= database.length) {
      return [];
    }
    return database.slice(startIndex, endIndex);
  };

  useEffect(() => {
    setIsLoadingUserStories(true);
    const getInitialData = pagination({
      database: userStories,
      currentPage: 1,
      pageSize: userStoriesPageSize,
    });
    setUserStoriesRenderedData(getInitialData);
    setIsLoadingUserStories(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={globalStyle.header}>
          <Title title="Let's Explore" />
          <TouchableOpacity style={globalStyle.messageIcon}>
            <FontAwesomeIcon
              icon={faEnvelope as IconProp}
              size={20}
              color="#8980ab"
            />
            <View style={globalStyle.messageNumberContainer}>
              <Text style={globalStyle.messageNumber}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={globalStyle.userStoryContainer}>
          <FlatList
            onEndReachedThreshold={0.1} // 10% away from end of list
            onEndReached={() => {
              if (isLoadingUserStories) {
                return;
              }
              setIsLoadingUserStories(true);
              const contentToAppend = pagination({
                database: userStories,
                currentPage: userStoriesCurrentPage + 1,
                pageSize: userStoriesPageSize,
              });
              setTimeout(() => {
                if (contentToAppend.length > 0) {
                  setUserStoriesCurrentPage(userStoriesCurrentPage + 1);
                  setUserStoriesRenderedData(prev => [
                    ...prev,
                    ...contentToAppend,
                  ]);
                }

                setIsLoadingUserStories(false);
              }, 5000);
            }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={userStoriesRenderedData}
            renderItem={({ item }) => (
              <UserStory
                key={'userStory' + item.id}
                firstName={item.firstName}
                profileImage={item.profileImage}
              />
            )}
          />
          {isLoadingUserStories && <Text>Loading</Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
