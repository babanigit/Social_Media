import { Component } from '@angular/core';
import { GetApiService } from '../../services/get-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  bio: string = '';
  profileImage?: File; // To store the profile image file
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: GetApiService) { }

  // Handle file input change
  onProfileImageSelected(event: any): void {
    this.profileImage = event.target.files[0]; // Store the selected image
  }

  // Submit the registration form
  register(): void {
    if (!this.name || !this.username || !this.email || !this.password) {
      this.errorMessage = 'Name, username, email, and password are required';
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('username', this.username);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('bio', this.bio);
    if (this.profileImage) {
      formData.append('profile_image', this.profileImage);
    }

    this.authService.register(formData).subscribe(
      (response) => {
        this.successMessage = 'Registration successful';
        console.log('User registered successfully:', response);
      },
      (error) => {
        this.errorMessage = error.error?.error || 'Registration failed';
        console.error('Error during registration:', error);
      }
    );
  }
}
