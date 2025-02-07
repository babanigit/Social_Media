import { Pipe, PipeTransform } from '@angular/core';
import { IComment } from '../models/Comments';

@Pipe({
  name: 'commentsSortByDate',
  standalone:true
})
export class CommentsSortByDatePipe implements PipeTransform {
  transform(comments: IComment[]): IComment[] {
    if (!comments || comments.length === 0) return [];

    return comments.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }
}
