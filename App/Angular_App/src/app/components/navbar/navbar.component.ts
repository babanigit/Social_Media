import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(private router: Router) {}

  signup() {
    this.router.navigate(['/register']);
  }

  login() {
    this.router.navigate(['/login']);
  }
}
