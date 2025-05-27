import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ILoggedInUser } from '../../models/LoggedInUser';
import { GetApiService } from '../../services/get-api.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-main-welcome',
  templateUrl: './main-welcome.component.html',
  styleUrl: './main-welcome.component.css',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
})
export class MainWelcomeComponent implements OnInit {
  @Output() userData = new EventEmitter<ILoggedInUser>();

  user: ILoggedInUser | undefined;
  error: string | null = null;

  isLoading = false;

  showLoading() {
    this.isLoading = true; // Show the spinner
  }

  hideLoading() {
    this.isLoading = false; // Hide the spinner
  }

  constructor(
    private toastr: ToastrService,
    private apiSerV: GetApiService // private router: Router
  ) {}

  ngOnInit(): void {
    this.getLoggedInUser();
  }

  getLoggedInUser() {
    this.showLoading();
    this.apiSerV.getLoggedInUser().subscribe({
      next: (data) => {
        this.user = data;
        this.userData.emit(this.user);
        this.hideLoading();
      },
      error: (err) => {
        this.hideLoading();
        console.log('the error is :- ', err);
        const statusCode = err.status;
        const errorMessage = err.error?.error || 'An unexpected error occurred';

        // Show an error toast
        // this.toastr.error(errorMessage, `Error ${statusCode}`);
      },
    });
  }
}
