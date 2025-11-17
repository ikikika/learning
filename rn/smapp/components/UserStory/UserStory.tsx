import { Image, ImageSourcePropType, Text, View } from 'react-native';
import style from './style';
import UserProfileImage from '../UserProfileImage/UserProfileImage';
import { horizontalScale } from '../../assets/styles/scaling';

const UserStory = ({ firstName, profileImage }: UserStoryProps) => {
  return (
    <View style={style.storyContainer}>
      <UserProfileImage
        profileImage={profileImage}
        imageDimensions={horizontalScale(65)}
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
