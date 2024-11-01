import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-open-comments',
  templateUrl: './open-comments.component.html',
  styleUrl: './open-comments.component.css'
})
export class OpenCommentsComponent implements OnInit {

  postId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('id'); // Access the 'id' parameter
      console.log('Post ID:', this.postId);
      // Add logic here to load comments or perform actions based on the ID
    });
  }

}
