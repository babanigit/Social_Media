// create-tweet.component.ts
import { Component } from '@angular/core';
import { GetApiService } from '../../services/get-api.service';

@Component({
  selector: 'app-create-tweet',
  templateUrl: './create-tweet.component.html',
  styleUrls: ['./create-tweet.component.css']
})
export class CreateTweetComponent {
  content: string = '';
  selectedImage?: File;

  constructor(private tweetService: GetApiService) {}

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  onSubmit() {

    if (this.content) {
      this.tweetService.createTweet(this.content, this.selectedImage).subscribe(
        (response) => {
          console.log('Tweet created successfully:', response);
          this.content = '';
          this.selectedImage = undefined;
        },
        (error) => {
          console.error('Error creating tweet:', error);
        }
      );
    } else {
      alert('Please enter some content or select an image.');
    }
  }
}
