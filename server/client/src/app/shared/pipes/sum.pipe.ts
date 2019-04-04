import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})
export class SumPipe implements PipeTransform {

  transform(items: any[], attr?: string): any {
    if (attr) {
      if (typeof (items) == 'string') {
        items = JSON.parse(items);
      }
      return items.reduce((a, b) => a + b[attr], 0);
    } else {
      return items.reduce((a, b) => a + b, 0);
    }
  }

}
