import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Pressable } from 'react-native';
import style from './style';

const BackButton = ({ onPress }: BackButtonProps) => {
  return (
    <Pressable onPress={() => onPress()} style={style.container}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Pressable>
  );
};

interface BackButtonProps {
  onPress: () => void;
}

export default BackButton;
