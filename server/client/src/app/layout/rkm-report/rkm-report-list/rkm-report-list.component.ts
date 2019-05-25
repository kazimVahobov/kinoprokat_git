import {Component, OnInit, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-rkm-report-list',
  templateUrl: './rkm-report-list.component.html',
  styleUrls: ['./rkm-report-list.component.scss']
})
export class RkmReportListComponent implements OnInit, OnDestroy {

  modes = [
    {
      value: 0,
      name: 'Отчёты дистрибьюторов'
    },
    {
      value: 1,
      name: 'Отчёты кинотеатров'
    }
  ];
  currentMode: number;
  filterReport = JSON.parse(localStorage.getItem('filterReport'));
  state = true;

  currentDate: Date;

  currentDateForDist: Date;

  constructor() {
  }

  ngOnInit() {

    if (this.filterReport) {
      if (this.filterReport.currentMode === 0) {
        this.currentMode = 0
      } else if (this.filterReport.currentMode === 1) {
        this.currentMode = 1
      }
    } else {
      this.currentMode = 1;
    }
    if (this.filterReport) {
      if (this.filterReport.currentDate) {
        if (this.currentMode === 1) {
          this.currentDate = new Date(this.filterReport.currentDate);
        }
        if (this.currentMode === 0) {
          this.currentDateForDist = new Date(this.filterReport.currentDate);
        }
      }
      localStorage.removeItem('filterReport');
    } else {
      this.currentDate = null
      this.currentDateForDist = null
    }
  }


  clearDataPicker() {
    if (this.currentMode === 0) {
      this.currentDateForDist = null;
    } else if (this.currentMode === 1) {
      this.currentDate = null;
    }
  }

  refresh() {
    this.state = false;
    setTimeout(() => {
      this.state = true;
    }, 1000);
  }

  ngOnDestroy() {
    this.filterReport = null;
  }

}
