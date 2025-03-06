import { Component } from '@angular/core';
import { GetApiService } from '../../services/get-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: GetApiService, private router: Router) {}

  // Submit the login form
  login(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.successMessage = 'Login successful';
        console.log('User logged in successfully:', response);
        // Handle successful login (e.g., store user info, redirect, etc.)
        const token = response.token; // Assuming 'token' is the key in the JSON response
        if (token) {
          console.log('Token stored in local storage');
          localStorage.setItem('auth_token', token);
          this.router.navigate(['/']);
        }
      },
      (error) => {
        this.errorMessage = error.error?.error || 'Login failed';
        console.error('Error during login:', error);
      }
    );
  }
}
