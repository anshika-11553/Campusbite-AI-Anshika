import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { IAuthProvider } from './authProvider';
import { AuthUser, LoginCredentials } from '@/types/auth';

export class FirebaseAuthProvider implements IAuthProvider {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Please check your environment variables.');
    }
    if (!credentials.password) {
      throw new Error('Password is required for login.');
    }
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return this.mapUser(userCredential.user, credentials.role);
  }

  async logout(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
  }

  async getToken(): Promise<string | null> {
    if (auth && auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return firebaseOnAuthStateChanged(auth, (user) => {
      if (user) {
        // Default to student if custom claim role is not yet loaded
        callback(this.mapUser(user, 'student'));
      } else {
        callback(null);
      }
    });
  }

  async resetPassword(email: string): Promise<void> {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized.');
    }
    await sendPasswordResetEmail(auth, email);
  }

  private mapUser(user: FirebaseUser, role: AuthUser['role']): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role,
      emailVerified: user.emailVerified,
    };
  }
}

export const firebaseAuthProvider = new FirebaseAuthProvider();
