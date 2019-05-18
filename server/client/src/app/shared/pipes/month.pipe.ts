import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'month'
})
export class MonthPipe implements PipeTransform {

  transform(n: number, lang?: string): string {
    let month_ru: string[] = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    let month_eng: string[] = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    lang = lang ? lang : 'ru';

    let result: string = null;

    switch (lang) {
      case 'ru': {
        result = month_ru[n];
        break;
      }
      case 'Ru': {
        result = MonthPipe.firstToUp(month_ru[n]);
        break;
      }
      case 'RU': {
        result = month_ru[n].toUpperCase();
        break;
      }
      case 'eng': {
        result =  month_eng[n];
        break;
      }
      case 'Eng': {
        result = MonthPipe.firstToUp(month_eng[n]);
        break;
      }
      case 'ENG': {
        result = month_eng[n].toUpperCase();
        break;
      }
      default : {
        result = n.toString();
        break;
      }
    }

    return result;
  }

  static firstToUp(str: string): string {
    let first = str.substring(0, 1).toUpperCase();
    let rest = str.substring(1, str.length);
    return first + rest;
  }
}
