import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsDatepickerViewMode } from 'ngx-bootstrap/datepicker/models';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { PermissionService } from 'src/app/core';

@Component({
  selector: 'app-distributor-report-list',
  templateUrl: './distributor-report-list.component.html',
  styleUrls: ['./distributor-report-list.component.scss']
})
export class DistributorReportListComponent implements OnInit, OnDestroy {

  cont: number;
  state = true;
  modes = [
    {
      value: 0,
      name: 'Входящие'
    },
    {
      value: 1,
      name: 'Отправленные'
    }
  ];
  currentMode: number;
  currentUser = JSON.parse(localStorage.getItem('user'));
  filterReport = JSON.parse(localStorage.getItem('filterReport'));

  currentDate: Date;
  currentDateforDist: Date;
  minMode: BsDatepickerViewMode;
  bsConfig: Partial<BsDatepickerConfig>;

  isCreate = false;

  constructor(private permissionService: PermissionService) {
  }

  ngOnInit() {
    this.minMode = 'month'
    this.bsConfig = Object.assign({}, {
      minMode: this.minMode
    });

    if(this.filterReport) {
      if (this.filterReport.currentMode === 0) {
        this.currentMode = 0
      } else if (this.filterReport.currentMode === 1) {
        this.currentMode = 1
      }
    }  else {
      this.currentMode = 1;
    }

    if(this.filterReport) {
    if (this.filterReport.currentDate) {
      if (this.currentMode === 0) {
        this.currentDate = new Date(this.filterReport.currentDate);
      }
      if (this.currentMode === 1) {
        this.currentDateforDist = new Date(this.filterReport.currentDate);
      }
    }
    localStorage.removeItem('filterReport'); 
  } else {
      this.currentDate = null
      this.currentDateforDist = null
    }

    if (this.permissionService.reportDist) {
      for (let i = 0; i < this.permissionService.reportDist.length; i++) {
        if (this.permissionService.reportDist[i].value === 0) {
          this.isCreate = true;
        }
      }
    }
  }

  clearDatapicker() {
    if (this.currentMode === 0) {
      this.currentDate = null;
    } else if (this.currentMode === 1) {
      this.currentDateforDist = null;
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
