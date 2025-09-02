import React, { useState, useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import style from './style';
import UserStory from '../../components/UserStory/UserStory';
import UserPost from '../../components/UserPost/UserPost';
import { scaleFontSize } from '../../assets/styles/scaling';
import globalStyle from '../../assets/styles/globalStyle';
import Title from '../../components/Title/Title';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NavProp, Routes } from '../../navigation/Routes';

const userStories = [
  {
    firstName: 'Joseph',
    id: 1,
    profileImage: require('../../assets/images/default_profile.png'),
  }, //0
  {
    firstName: 'Angel',
    id: 2,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'White',
    id: 3,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'Olivier',
    id: 4,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'Nata',
    id: 5,
    profileImage: require('../../assets/images/default_profile.png'),
  }, //4
  {
    firstName: 'Nicolas',
    id: 6,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'Nino',
    id: 7,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'Nana',
    id: 8,
    profileImage: require('../../assets/images/default_profile.png'),
  },
  {
    firstName: 'Adam',
    id: 9,
    profileImage: require('../../assets/images/default_profile.png'),
  }, //8
];
const userPosts = [
  {
    firstName: 'Allison',
    lastName: 'Becker',
    location: 'Boston, MA',
    likes: 1201,
    comments: 24,
    bookmarks: 55,
    image: require('../../assets/images/default_post.png'),
    profileImage: require('../../assets/images/default_profile.png'),
    id: 1,
  },
  {
    firstName: 'Jennifer',
    lastName: 'Wilkson',
    location: 'Worcester, MA',
    likes: 1301,
    comments: 25,
    bookmarks: 70,
    image: require('../../assets/images/default_post.png'),
    profileImage: require('../../assets/images/default_profile.png'),
    id: 2,
  },
  {
    firstName: 'Adam',
    lastName: 'Spera',
    location: 'Worcester, MA',
    likes: 100,
    comments: 8,
    bookmarks: 3,
    image: require('../../assets/images/default_post.png'),
    profileImage: require('../../assets/images/default_profile.png'),
    id: 3,
  },
  {
    firstName: 'Nata',
    lastName: 'Vacheishvili',
    location: 'New York, NY',
    likes: 200,
    comments: 16,
    bookmarks: 6,
    image: require('../../assets/images/default_post.png'),
    profileImage: require('../../assets/images/default_profile.png'),
    id: 4,
  },
  {
    firstName: 'Nicolas',
    lastName: 'Namoradze',
    location: 'Berlin, Germany',
    likes: 2000,
    comments: 32,
    bookmarks: 12,
    image: require('../../assets/images/default_post.png'),
    profileImage: require('../../assets/images/default_profile.png'),
    id: 5,
  },
];

const Home = ({ navigation }: NavProp) => {
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
      <SafeAreaView style={globalStyle.backgroundWhite}>
        <View>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={style.header}>
                  <Title title={'Let’s Explore'} />
                  <TouchableOpacity style={style.messageIcon}>
                    <FontAwesomeIcon
                      icon={faEnvelope as IconProp}
                      size={scaleFontSize(20)}
                      color={'#898DAE'}
                    />
                    <View style={style.messageNumberContainer}>
                      <Text style={style.messageNumber}>2</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={style.userStoryContainer}>
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
            onEndReachedThreshold={0.5}
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
              <View style={style.userPostContainer}>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;
