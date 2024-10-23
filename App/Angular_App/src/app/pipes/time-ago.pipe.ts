import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const createdAt = new Date(value);
    const now = new Date();
    const differenceInMs = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(differenceInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days + 'd';
    } else if (hours > 0) {
      return hours + 'h';
    } else if (minutes > 0) {
      return minutes + 'm';
    } else {
      return seconds + 's';
    }
  }
}
