import { getApp } from '@react-native-firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from '@react-native-firebase/auth';

export const createUser = async ({
  fullName,
  email,
  password,
}: CreateUserProps) => {
  try {
    // Get the current Firebase app instance
    const app = getApp();
    const auth = getAuth(app);

    // Create a new user
    await createUserWithEmailAndPassword(auth, email, password);

    // Get the freshly created currentUser directly from auth()
    const currentUser = auth.currentUser;

    // Update profile
    if (currentUser) {
      await updateProfile(currentUser, { displayName: fullName });

      console.log(
        '✅ User created (plain):',
        JSON.parse(JSON.stringify(currentUser.toJSON?.() ?? {})),
      );
    }

    return currentUser;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.log('That email address is already in use!');
        break;
      case 'auth/invalid-email':
        console.log('That email address is invalid!');
        break;
      default:
        console.error('Auth error:', error);
    }
  }
};

interface CreateUserProps {
  fullName: string;
  email: string;
  password: string;
}
