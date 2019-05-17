import {Component, OnInit} from '@angular/core';
import {DistributorService, TheaterService, YearListService} from "../../../../core/services";
import {StatisticService} from "../../../../core/services/statistic.service";

declare var $;

@Component({
  selector: 'app-statistic-rkm',
  templateUrl: './statistic-rkm.component.html',
  styleUrls: ['./statistic-rkm.component.scss']
})
export class StatisticRkmComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('user'));
  parametersPanelIsOpen: boolean = true;
  selectedDistId: string = null;
  selectedTheaterId: string = null;
  selectedMovieId: string = null;
  selectedYear: number = null;
  selectedMonth: number = null;

  distributors: any[] = [];
  theaters: any[] = [];
  movies: any[] = [];
  years: any[] = [];
  months: any[] = [];

  constructor(private yearListService: YearListService,
              private statisticService: StatisticService,
              private distributorService: DistributorService,
              private theaterService: TheaterService) {
  }

  ngOnInit() {
    this.months = this.statisticService.months;
    this.yearListService.getYearList().subscribe(data => this.years = data.reverse());
    this.distributorService.getAll().subscribe(data => this.distributors = data);
    this.loadData();
  }

  loadData() {
  }

  changeDist() {
    if (this.selectedDistId) {
      this.selectedMovieId = null;
      this.theaterService.getByDistId(this.selectedDistId).subscribe(data => this.theaters = data);
    }
  }

  changeTheater() {
  }

  changeMovie() {
  }

  changeYear() {
    if (!this.selectedYear) {
      this.selectedMonth = null;
    }
  }

  changeMonth() {
  }

  resetFilters() {
    this.selectedDistId = null;
    this.selectedTheaterId = null;
    this.selectedMovieId = null;
    this.selectedYear = null;
    this.selectedMonth = null;
    this.loadData();
  }






  print() {
    $("#print-section").print();
  }
}
