import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth = inject(Auth);
    user$: Observable<User | null> = user(this.auth);

    async signInWithGoogle(): Promise<void> {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }

    async signOut(): Promise<void> {
        await signOut(this.auth);
    }
}
