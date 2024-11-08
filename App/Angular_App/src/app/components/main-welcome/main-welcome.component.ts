import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ILoggedInUser } from '../../models/LoggedInUser';
import { GetApiService } from '../../services/get-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-welcome',
  templateUrl: './main-welcome.component.html',
  styleUrl: './main-welcome.component.css',
  standalone: true,
  imports: [CommonModule],
})
export class MainWelcomeComponent implements OnInit {
  @Output() userData = new EventEmitter<ILoggedInUser>();

  user: ILoggedInUser | undefined;
  loading = true;
  error: string | null = null;

  constructor(private getApiService: GetApiService, private router: Router) {}

  ngOnInit(): void {
    this.getLoggedIn();
  }

  getLoggedIn() {
    this.getApiService.getLoggedInUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
        this.userData.emit(this.user);
      },
      error: (err) => {
        this.error = 'Failed to load user data. Please try again later.';
        this.loading = false;
        console.error('Error loading user data:', err);
        // this.router.navigate(['/login']);
      },
    });
  }
}
