import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);

  user$: Observable<User | null> = user(this.auth);
  isLoading = signal(false);
  error = signal<string | null>(null);

  isUserLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  async login(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (err: any) {
      this.error.set(this.getErrorMessage(err.code));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async loginWithGoogle(): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Google login logic to be implemented
      return true;
    } catch (err: any) {
      this.error.set(this.getErrorMessage(err.code));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async register(email: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      return true;
    } catch (err: any) {
      this.error.set(this.getErrorMessage(err.code));
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Nieprawidłowy email lub hasło.';
      case 'auth/email-already-in-use':
        return 'Ten adres email jest już używany.';
      case 'auth/weak-password':
        return 'Hasło jest za słabe. Użyj minimum 6 znaków.';
      case 'auth/invalid-email':
        return 'Nieprawidłowy format adresu email.';
      case 'auth/popup-closed-by-user':
        return 'Logowanie anulowane.';
      case 'auth/cancelled-popup-request':
        return 'Logowanie anulowane.';
      default:
        return 'Wystąpił błąd. Spróbuj ponownie.';
    }
  }
}
