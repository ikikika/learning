import { Text } from 'react-native';
import style from './style';

const Title = ({title}: TitleProps) => {
  return <Text style={style.title}>{title}</Text>;
};

export default Title;

interface TitleProps {
  title: string;
}
