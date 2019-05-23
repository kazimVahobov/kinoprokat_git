import {Injectable} from '@angular/core';
import {DistributorService} from './distributor.service';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class YearListService {

  constructor(private distributorService: DistributorService) {
  }

  getYearList(): Observable<any[]> {

    return this.distributorService.getAll().pipe(map(distributors => {
      let currentYear = 0;
      let startYear = 0;
      let yearList = [];

      startYear = new Date(distributors.find(d => !d.parentId).createdDate).getFullYear();
      currentYear = new Date().getFullYear();

      yearList.push({
        value: startYear - 1
      });

      for (let i = startYear; i <= currentYear; i++) {
        yearList.push({
          value: i
        });
      }

      return yearList;
    }));
  }

}
