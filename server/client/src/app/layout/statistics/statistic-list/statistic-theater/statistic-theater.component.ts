import {Component, OnInit} from '@angular/core';
import {PagerService, TheaterService, YearListService} from "../../../../core";
import {StatisticService} from "../../../../core/services/statistic.service";

declare var $;

@Component({
  selector: 'app-statistic-theater',
  templateUrl: './statistic-theater.component.html',
  styleUrls: ['./statistic-theater.component.scss']
})
export class StatisticTheaterComponent implements OnInit {

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));
  parametersPanelIsOpen: boolean = true;
  selectedMovieId: string = null;
  selectedYear: number = null;
  selectedMonth: number = null;
  months: any[] = [];
  yearList: any[] = [];
  movies: any[] = [];

  constructor(private yearListService: YearListService,
              private theaterService: TheaterService,
              private pagerService: PagerService,
              public statisticService: StatisticService) {
  }

  ngOnInit() {
    this.yearListService.getYearList().subscribe(years => this.yearList = years.reverse());
    this.movies = [];
    this.months = this.statisticService.months;
    this.statisticService.getMoviesWithNameByThReports(this.currentUser.theaterId).subscribe(movies => {
      this.movies = movies
    }, error1 => {
      console.log(error1.toString());
    });
    this.loadData();
  }

  loadData() {
    if (!this.selectedMovieId && !this.selectedYear && this.selectedMonth == null) {
      console.log('1');
      this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId).subscribe(data => this.setPage(1, data));
    }

    if (this.selectedMovieId && !this.selectedYear && this.selectedMonth == null) {
      console.log('2');
      this.theaterService.getById(this.currentUser.theaterId).subscribe(theater => {
        this.statisticService.filterByMovieId(this.selectedMovieId, theater.regionId, theater._id).subscribe(data => this.setPage(1, data));
      });
    }

    if (!this.selectedMovieId && this.selectedYear) {
      if (this.selectedMonth != null) {
        this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId, this.selectedYear, this.selectedMonth).subscribe(data => this.setPage(1, data));
      } else if (this.selectedMonth == null) {
        this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId, this.selectedYear).subscribe(data => this.setPage(1, data));
      }
    }
  }

  changeMovie() {
    this.selectedYear = null;
    this.selectedMonth = null;
    this.loadData();
  }

  changeYear() {
    this.selectedMovieId = null;
    this.selectedMonth = null;
    this.loadData();
  }

  print() {
    $("#print-section").print();
  }

  resetFilters() {
    this.selectedMovieId = null;
    this.selectedYear = null;
    this.selectedMonth = null;
    this.loadData();
  }

  setPage(page: number, data: any[]) {
    // get pager object from service
    this.pager = this.pagerService.getPager(data.length, page);

    // get current page of items
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
