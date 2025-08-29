import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { Image, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faBookmark,
  faEllipsisH,
  faHeart,
  faMessage,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const UserPost = ({
  firstName,
  lastName,
  location,
  image,
  profileImage,
  likes,
  comments,
  bookmarks,
}: UserPostType) => {
  return (
    <View style={style.userPostContainer}>
      <View style={style.user}>
        <View style={style.userContainer}>
          <UserProfileImage profileImage={profileImage} imageDimensions={48} />
          <View style={style.userTextContainer}>
            <Text style={style.username}>
              {firstName} {lastName}
            </Text>
            {location && <Text style={style.location}> {location}</Text>}
          </View>
        </View>
        <FontAwesomeIcon
          icon={faEllipsisH as IconProp}
          size={24}
          color={'#79869F'}
        />
      </View>
      <View style={style.postImage}>
        <Image source={image} />
      </View>
      <View style={{ marginLeft: 10, flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row' }}>
          <FontAwesomeIcon icon={faHeart as IconProp} color={'#79869F'} />
          <Text style={{ marginLeft: 3, color: '#79869F' }}>{likes}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 27 }}>
          <FontAwesomeIcon icon={faMessage as IconProp} color={'#79869F'} />
          <Text style={{ marginLeft: 3, color: '#79869F' }}>{comments}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 27 }}>
          <FontAwesomeIcon icon={faBookmark as IconProp} color={'#79869F'} />
          <Text style={{ marginLeft: 3, color: '#79869F' }}>{bookmarks}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserPost;

interface UserPostType {
  firstName: string;
  lastName: string;
  location: string;
  image: any;
  profileImage: any;
  likes: number;
  comments: number;
  bookmarks: number;
}
