import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     // Scroll to the desired position (e.g., keep the scroll position or scroll to specific coordinates)
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    //   }
    // });
  }


  title = 'Angular_App';
  fun() {
    console.log('button clicked');
  }
}
