import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ageWord',
  standalone: true
})
export class AgeWordPipe implements PipeTransform {

  transform(value: number): string {
      if (value === null || value === undefined || isNaN(value)) {
        return '';
      }

      const lastDigit = value % 10;
      const lastTwoDigits = value % 100;

      let suffix = 'лет';

      if (lastTwoDigits < 11 || lastTwoDigits > 14) {
        if (lastDigit === 1) {
          suffix = 'год';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
          suffix = 'года';
        }
      }

      return `${value} ${suffix}`;
  }
}
