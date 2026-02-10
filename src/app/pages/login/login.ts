import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  async signInWithGoogle() {
    this.loading = true;
    this.error = null;
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = 'Échec de la connexion. Veuillez réessayer.';
      this.loading = false;
    }
  }
}
