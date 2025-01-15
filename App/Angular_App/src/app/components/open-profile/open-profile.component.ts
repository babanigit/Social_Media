import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-open-profile',
  templateUrl: './open-profile.component.html',
  styleUrl: './open-profile.component.css'
})
export class OpenProfileComponent implements OnInit  {


 profileId: string | null = null;
  // commentsData: IGetComments | undefined;
  // tweetById: IGetTweetById | undefined;


  constructor(
        private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.profileId = params.get('id'); // Access the 'id' parameter
      console.log('profile ID:', this.profileId);
      // Add logic here to load comments or perform actions based on the ID
      // this.getLoggedIn();
    });
  }

}
