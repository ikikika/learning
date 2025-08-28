import { Image, ImageSourcePropType, Text, View } from 'react-native';
import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';

const UserStory = ({ firstName, profileImage }: UserStoryProps) => {
  return (
    <View style={style.storyContainer}>
      <UserProfileImage
        profileImage={profileImage}
        imageDimensions={65}
      />
      <Text style={style.firstName}>{firstName}</Text>
    </View>
  );
};

interface UserStoryProps {
  firstName: string;
  profileImage: ImageSourcePropType;
}

export default UserStory;
