export interface User {
  id: string;
  email: string;
  username: string;
  image: string;
  bio: string;
  // Add other user properties as needed
}

export interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
  user: User | null;
}

export interface AuthContextType extends AuthState {
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  signUp: (token: string, user: User) => void;
} 