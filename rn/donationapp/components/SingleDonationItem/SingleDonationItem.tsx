import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Badge from '../Badge/Badge';
import Header from '../Header/Header';
import style from './style';

const SingleDonationItem = ({
  uri,
  badgeTitle,
  donationTitle,
  price,
  onPress,
  donationItemId,
}: SingleDonationItemTypes) => {
  return (
    <Pressable
      onPress={() => {
        onPress(donationItemId);
      }}
    >
      <View>
        <View style={style.badge}>
          <Badge title={badgeTitle} />
        </View>
        <Image
          resizeMode={'contain'}
          source={{ uri: uri }}
          style={style.image}
        />
      </View>
      <View style={style.donationInformation}>
        <Header
          title={donationTitle}
          type={3}
          color={'#0A043C'}
          numberOfLines={1}
        />
        <View style={style.price}>
          <Header title={'$' + price.toFixed(2)} type={3} color={'#156CF7'} />
        </View>
      </View>
    </Pressable>
  );
};

interface SingleDonationItemTypes {
  uri: string;
  badgeTitle: string;
  donationTitle: string;
  price: number;
  onPress: (iid: string) => void;
  donationItemId: string;
}

export default SingleDonationItem;
