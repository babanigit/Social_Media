import { CommentsSortByDatePipe } from './comments-sort-by-date.pipe';

describe('CommentsSortByDatePipe', () => {
  it('create an instance', () => {
    const pipe = new CommentsSortByDatePipe();
    expect(pipe).toBeTruthy();
  });
});
