import React, { SetStateAction, useEffect, useState } from 'react';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import globalStyle from '../../assets/styles/globalStyle';
import Header from '../../components/Header/Header';
import { useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
// import { resetToInitialState, updateFirstName } from '../../redux/reducers/User';
import Search from '../../components/Search/Search';
import style from './style';
import Tab from '../../components/Tab/Tab';
import { updateSelectedCategoryId } from '../../redux/reducers/Categories';
import {
  // resetDonations,
  updateSelectedDonationId,
} from '../../redux/reducers/Donations';
import { DonationItemType } from '../../types/donation.type';
import SingleDonationItem from '../../components/SingleDonationItem/SingleDonationItem';
import { NavProp, Routes } from '../../navigation/Routes';

interface HomeProps extends NavProp {}

const Home = ({ navigation }: HomeProps) => {
  // Using the useSelector hook to select the "user" slice of the store
  // This will return the user object containing firstName, lastName and userId fields
  // const user = useSelector(state => state.user);

  // Instead of importing useSelector directly from react-redux, import the typed version:
  const { firstName, lastName, profileImage } = useAppSelector(
    state => state.user,
  );

  // Using the useDispatch hook to get a reference to the dispatch function
  // This function allows us to dispatch actions to update the store
  const dispatch = useDispatch();
  // dispatch(resetToInitialState());

  const categories = useAppSelector(state => state.categories);
  // console.log(categories);

  const donations = useAppSelector(state => state.donations);
  // dispatch(resetDonations());
  console.log('this is our current donations state', donations);

  const [donationItems, setDonationItems] = useState<DonationItemType[] | []>(
    [],
  );
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const categoryPageSize = 4;

  useEffect(() => {
    const items = donations.items.filter(value =>
      value.categoryIds.includes(categories.selectedCategoryId),
    );
    setDonationItems(items);
  }, [categories.selectedCategoryId]);

  useEffect(() => {
    setIsLoadingCategories(true);
    setCategoryList(
      pagination({
        items: categories.categories,
        pageNumber: categoryPage,
        pageSize: categoryPageSize,
      }),
    );
    setCategoryPage(prev => prev + 1);
    setIsLoadingCategories(false);
  }, []);

  const pagination = ({ items, pageNumber, pageSize }: PaginationType) => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    if (startIndex >= items.length) {
      return [];
    }
    return items.slice(startIndex, endIndex);
  };

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
          <View style={style.categoryHeader}>
            <Header title={'Select Category'} type={2} />
          </View>
          <View style={style.categories}>
            <FlatList
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (isLoadingCategories) {
                  return;
                }
                console.log(
                  'User has reached the end and we are getting more data for page number ',
                  categoryPage,
                );
                setIsLoadingCategories(true);
                let newData = pagination({
                  items: categories.categories,
                  pageNumber: categoryPage,
                  pageSize: categoryPageSize,
                });
                if (newData.length > 0) {
                  setCategoryList(prevState => [...prevState, ...newData]);
                  setCategoryPage(prevState => prevState + 1);
                }
                setIsLoadingCategories(false);
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={categoryList}
              renderItem={({ item }) => (
                <View style={style.categoryItem} key={item.categoryId}>
                  <Tab
                    tabId={item.categoryId}
                    onPress={value => dispatch(updateSelectedCategoryId(value))}
                    title={item.name}
                    isInactive={
                      item.categoryId !== categories.selectedCategoryId
                    }
                  />
                </View>
              )}
            />
          </View>
          {donationItems.length > 0 && (
            <View style={style.donationItemsContainer}>
              {donationItems.map(value => (
                <View
                  key={value.donationItemId}
                  style={style.singleDonationItem}
                >
                  <SingleDonationItem
                    onPress={selectedDonationId => {
                      dispatch(updateSelectedDonationId(selectedDonationId));
                      navigation.navigate(Routes.SingleDonation);
                    }}
                    donationItemId={value.donationItemId}
                    uri={value.image}
                    donationTitle={value.name}
                    badgeTitle={
                      categories.categories.filter(
                        val => val.categoryId === categories.selectedCategoryId,
                      )[0].name
                    }
                    price={parseFloat(value.price)}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Home;

interface CategoryType {
  categoryId: number;
  name: string;
}

interface PaginationType {
  items: CategoryType[];
  pageNumber: number;
  pageSize: number;
}
