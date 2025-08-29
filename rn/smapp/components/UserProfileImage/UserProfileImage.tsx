import { Image, ImageSourcePropType, View } from 'react-native';
import style from './style';

const UserProfileImage = ({
  profileImage,
  imageDimensions,
}: UserProfileImageType) => {
  return (
    <View style={[style.userImageContainer, { borderRadius: imageDimensions }]}>
      <Image
        source={profileImage}
        style={{ width: imageDimensions, height: imageDimensions }}
      />
    </View>
  );
};
interface UserProfileImageType {
  profileImage: ImageSourcePropType;
  imageDimensions: number;
}
export default UserProfileImage;
