import { Image, ImageSourcePropType, Text, View } from 'react-native';
import style from './style';

const UserStory = ({ firstName, profileImage }: UserStoryProps) => {
  return (
    <View style={style.storyContainer}>
      <View style={style.userImageContainer}>
        <Image source={profileImage} style={style.image} />
      </View>
      <Text style={style.firstName}>{firstName}</Text>
    </View>
  );
};

interface UserStoryProps {
  firstName: string;
  profileImage: ImageSourcePropType;
}

export default UserStory;
