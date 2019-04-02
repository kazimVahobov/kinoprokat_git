import { Injectable } from '@angular/core';
import { DistributorService } from './distributor.service';



@Injectable({
  providedIn: 'root'
})
export class YearListService {

  currentYear: number;
  startYear: number;
  yearList: Year[];

  constructor(private distributorService: DistributorService) {
  }

  getYearList()  {
    this.currentYear = 0;
    this.startYear = 0;
     this.yearList = [];

    this.distributorService.getAll().subscribe(distributors => {

      this.startYear = new Date(distributors.find(d => !d.parentId).createdDate).getFullYear()
      this.currentYear = new Date().getFullYear();

      this.yearList.push({
        value: this.startYear - 1,
        name: (this.startYear - 1).toString()
      })

      for (let i = this.startYear; i <= this.currentYear; i++) {
        this.yearList.push({
          value: i,
          name: i.toString()
        })
      }
      window.localStorage.setItem('yearList', JSON.stringify(this.yearList));
    })
  }

}

class Year {
  value: number;
  name: string;
}