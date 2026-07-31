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
import { logger } from '@/utils/logger';

export class FirebaseAuthProvider implements IAuthProvider {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (!credentials.password) {
      throw new Error('Password is required for login.');
    }

    if (!auth) {
      logger.warn('Firebase Auth instance missing. Using development local session fallback.');
      return {
        uid: `dev-user-${Date.now()}`,
        email: credentials.email,
        displayName: credentials.email.split('@')[0],
        photoURL: null,
        role: credentials.role,
        emailVerified: true,
      };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      return this.mapUser(userCredential.user, credentials.role);
    } catch (err: unknown) {
      // In development mode with demo keys, provide fallback local session for portal testing
      if (process.env.NODE_ENV === 'development') {
        logger.warn('Firebase login API call failed in dev mode. Falling back to local session mode:', err);
        return {
          uid: `dev-user-${Date.now()}`,
          email: credentials.email,
          displayName: credentials.email.split('@')[0],
          photoURL: null,
          role: credentials.role,
          emailVerified: true,
        };
      }
      throw err;
    }
  }

  async logout(): Promise<void> {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        logger.warn('Firebase logout warning:', err);
      }
    }
  }

  async getToken(): Promise<string | null> {
    if (auth && auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch {
        return null;
      }
    }
    return 'demo-jwt-token-dev-mode';
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    try {
      return firebaseOnAuthStateChanged(auth, (user) => {
        if (user) {
          callback(this.mapUser(user, 'student'));
        } else {
          callback(null);
        }
      });
    } catch (err) {
      logger.warn('Firebase onAuthStateChanged error:', err);
      callback(null);
      return () => {};
    }
  }

  async resetPassword(email: string): Promise<void> {
    if (!auth) {
      logger.log('Demo mode password reset triggered for:', email);
      return;
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
