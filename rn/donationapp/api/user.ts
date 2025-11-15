import { getApp } from '@react-native-firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@react-native-firebase/auth';

let cachedAuth: ReturnType<typeof getAuth> | null = null;

export const getFirebaseAuth = () => {
  if (!cachedAuth) {
    const app = getApp();
    cachedAuth = getAuth(app);
  }
  return cachedAuth;
};

export const createUser = async ({
  fullName,
  email,
  password,
}: CreateUserProps) => {
  try {
    // Get the current Firebase app instance
    const auth = getFirebaseAuth();

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
        return { error: 'The email you entered is already in use.' };
      case 'auth/invalid-email':
        return { error: 'Please enter a valid email address.' };
      default:
        return { error: 'Something went wrong with your request.' };
    }
  }
};

export const loginUser = async ({ email, password }: LoginUserProps) => {
  try {
    const auth = getFirebaseAuth();

    const response = await signInWithEmailAndPassword(auth, email, password);
    const token = await response.user.getIdToken();

    return {
      status: true,
      data: {
        displayName: response.user.displayName,
        email: response.user.email,
        token,
      },
    };
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      return {
        status: false,
        error: 'Please check your login details',
      };
    }
    return { status: false, error: 'Something went wrong' };
  }
};

export const logOut = async () => {
  const auth = getFirebaseAuth();
  await signOut(auth);
};

interface CreateUserProps {
  fullName: string;
  email: string;
  password: string;
}

interface LoginUserProps {
  email: string;
  password: string;
}
