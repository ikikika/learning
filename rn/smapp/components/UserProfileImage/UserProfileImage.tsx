import { Image, ImageSourcePropType, View } from 'react-native';
import style from './style';

const UserProfileImage = ({
  profileImage,
  imageDimensions,
}: UserProfileImage) => {
  return (
    <View style={[style.userImageContainer, { borderRadius: imageDimensions }]}>
      <Image
        source={profileImage}
        style={{ width: imageDimensions, height: imageDimensions }}
      />
    </View>
  );
};
interface UserProfileImage {
  profileImage: ImageSourcePropType;
  imageDimensions: number;
}
export default UserProfileImage;
