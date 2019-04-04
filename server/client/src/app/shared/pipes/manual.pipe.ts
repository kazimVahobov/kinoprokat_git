import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'manual'
})
export class ManualPipe implements PipeTransform {

  transform(id: any, array: any[], display?: string, value?: string): any {
    display = display ? display : 'name';
    value = value ? value : '_id';
    if (array) {
      const item = array.find(a => a[value] === id);
      return item ? item[display] : id;
    }
    return id;
  }

}
