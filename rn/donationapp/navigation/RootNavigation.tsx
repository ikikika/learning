import { useAppSelector } from '../redux/hooks';
import { Authenticated, NonAuthenticated } from './MainNavigation';

const RootNavigation = () => {
  const user = useAppSelector(state => state.user);
  return user.isLoggedIn ? <Authenticated /> : <NonAuthenticated />;
};

export default RootNavigation;
