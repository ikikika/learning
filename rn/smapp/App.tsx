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
import UserPost from './components/UserPost/UserPost';

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

const userPosts = [
  {
    firstName: 'Allison',
    lastName: 'Becker',
    location: 'Boston, MA',
    likes: 1201,
    comments: 24,
    bookmarks: 55,
    id: 1,
    image: require('./assets/images/default_post.png'),
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Jennifer',
    lastName: 'Wilkson',
    location: 'Worcester, MA',
    likes: 1301,
    comments: 25,
    bookmarks: 70,
    id: 2,
    image: require('./assets/images/default_post.png'),
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Adam',
    lastName: 'Spera',
    location: 'Worcester, MA',
    likes: 100,
    comments: 8,
    bookmarks: 3,
    id: 3,
    image: require('./assets/images/default_post.png'),
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Nata',
    lastName: 'Vacheishvili',
    location: 'New York, NY',
    likes: 200,
    comments: 16,
    bookmarks: 6,
    id: 4,
    image: require('./assets/images/default_post.png'),
    profileImage: require('./assets/images/default_profile.png'),
  },
  {
    firstName: 'Nicolas',
    lastName: 'Namoradze',
    location: 'Berlin, Germany',
    likes: 2000,
    comments: 32,
    bookmarks: 12,
    id: 5,
    image: require('./assets/images/default_post.png'),
    profileImage: require('./assets/images/default_profile.png'),
  },
];

function App() {
  const userStoriesPageSize = 4;
  const [userStoriesCurrentPage, setUserStoriesCurrentPage] = useState(1);
  const [userStoriesRenderedData, setUserStoriesRenderedData] = useState<
    typeof userStories
  >([]);
  const [isLoadingUserStories, setIsLoadingUserStories] = useState(false);

  const userPostsPageSize = 2;
  const [userPostsCurrentPage, setUserPostsCurrentPage] = useState(1);
  const [userPostsRenderedData, setUserPostsRenderedData] = useState<
    typeof userPosts
  >([]);
  const [isLoadingUserPosts, setIsLoadingUserPosts] = useState(false);

  const pagination = ({
    database,
    currentPage,
    pageSize,
  }: {
    database: typeof userStories | typeof userPosts;
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

    setIsLoadingUserPosts(true);
    const getInitialDataPosts = pagination({
      database: userPosts,
      currentPage: 1,
      pageSize: userPostsPageSize,
    });
    setUserPostsRenderedData(getInitialDataPosts as typeof userPosts);
    setIsLoadingUserPosts(false);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <FlatList
            ListHeaderComponent={
              // determines whats at the head of the list
              // in this project, the user list will scroll with the post, instead of staying fixed on top
              <>
                <View style={globalStyle.header}>
                  <Title title={"Let's Explore"} />
                  <TouchableOpacity style={globalStyle.messageIcon}>
                    <FontAwesomeIcon
                      icon={faEnvelope as IconProp}
                      size={20}
                      color={'#898DAE'}
                    />
                    <View style={globalStyle.messageNumberContainer}>
                      <Text style={globalStyle.messageNumber}>2</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={globalStyle.userStoryContainer}>
                  <FlatList
                    onEndReachedThreshold={0.5}
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
                      if (contentToAppend.length > 0) {
                        setUserStoriesCurrentPage(userStoriesCurrentPage + 1);
                        setUserStoriesRenderedData(prev => [
                          ...prev,
                          ...contentToAppend,
                        ]);
                      }
                      setIsLoadingUserStories(false);
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
                </View>
              </>
            }
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              if (isLoadingUserPosts) {
                return;
              }
              setIsLoadingUserPosts(true);
              console.log(
                'fetching more data for you ',
                userPostsCurrentPage + 1,
              );
              const contentToAppend = pagination({
                database: userPosts,
                currentPage: userPostsCurrentPage + 1,
                pageSize: userPostsPageSize,
              });
              setTimeout(() => {
                if (contentToAppend.length > 0) {
                  setUserPostsCurrentPage(userPostsCurrentPage + 1);
                  setUserPostsRenderedData(prev => [
                    ...prev,
                    ...(contentToAppend as typeof userPosts),
                  ]);
                }
                setIsLoadingUserPosts(false);
              }, 3000);
            }}
            data={userPostsRenderedData}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={globalStyle.userPostContainer}>
                <UserPost
                  firstName={item.firstName}
                  lastName={item.lastName}
                  image={item.image}
                  likes={item.likes}
                  comments={item.comments}
                  bookmarks={item.bookmarks}
                  profileImage={item.profileImage}
                  location={item.location}
                />
              </View>
            )}
          />
        </View>
        {isLoadingUserPosts && <Text>loading posts...</Text>}
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
