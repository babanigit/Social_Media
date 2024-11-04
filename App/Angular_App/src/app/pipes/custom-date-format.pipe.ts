import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat',
  standalone:true
})
export class CustomDateFormatPipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);

    // Format options
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };

    // Format time as "10:06 PM · Oct 31, 2024"
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    const formattedDate = date.toLocaleDateString('en-US', options);

    return `${formattedTime} · ${formattedDate}`;
  }
}
