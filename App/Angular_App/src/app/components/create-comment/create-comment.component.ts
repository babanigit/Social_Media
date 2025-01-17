import { Component, EventEmitter, Output } from '@angular/core';
import { GetApiService } from '../../services/get-api.service';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css'
})
export class CreateCommentComponent {
 content: string = '';
  selectedImage?: File;

  @Output() tweetCreated = new EventEmitter<void>();


  constructor(private tweetService: GetApiService) { }

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
          this.tweetCreated.emit();
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
