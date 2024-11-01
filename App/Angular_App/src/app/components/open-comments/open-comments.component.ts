import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetApiService } from '../../services/get-api.service';
import { IGetComments } from '../../models/Comments';

@Component({
  selector: 'app-open-comments',
  templateUrl: './open-comments.component.html',
  styleUrl: './open-comments.component.css'
})
export class OpenCommentsComponent implements OnInit {

  postId: string | null = null;
  commentsData:IGetComments|undefined;

  constructor(private route: ActivatedRoute,private commentService: GetApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id'); // Access the 'id' parameter
      console.log('Post ID:', this.postId);
      // Add logic here to load comments or perform actions based on the ID
      if (this.postId) {
        this.commentService.getTweetComments(this.postId).subscribe(
          (data) => {
            this.commentsData = data;
            console.log('the fetched comments data id is :', this.commentsData);
          },
          (error) => {
            console.error('Error fetching comments:', error);
          }
        );
      }

    });
  }

}
