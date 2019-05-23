import {Component, OnInit} from '@angular/core';
import {
  DistributorService,
  MovieService, PagerService,
  TheaterReportService,
  TheaterService,
  YearListService
} from "../../../../core";
import {StatisticService} from "../../../../core/services/statistic.service";

declare var $;

@Component({
  selector: 'app-statistic-dist',
  templateUrl: './statistic-dist.component.html',
  styleUrls: ['./statistic-dist.component.scss']
})
export class StatisticDistComponent implements OnInit {

  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('user'));
  parametersPanelIsOpen: boolean = true;
  months: any[] = [];
  yearList: any[] = [];
  movies: any[] = [];
  theaters: any[] = [];
  selectedTheaterId: string = null;
  selectedMovieId: string = null;
  selectedYear: number = null;
  selectedMonth: number = null;

  constructor(private yearListService: YearListService,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private thReportService: TheaterReportService,
              private pagerService: PagerService,
              public statisticService: StatisticService) {
  }

  ngOnInit() {
    this.yearListService.getYearList().subscribe(years => this.yearList = years.reverse());
    this.months = this.statisticService.months;
    this.statisticService.getTheatersWithName(this.currentUser.distId).subscribe(data => this.theaters = data);
    this.loadData();
  }

  loadData() {
    if (!this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear && this.selectedMonth == null) {
      this.statisticService.filterByOneDistId(this.currentUser.distId).subscribe(data =>  this.setPage(1, data));
      this.statisticService.getMoviesWithNameByDistId(this.currentUser.distId).subscribe(data => this.movies = data);
    }

    if (this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId).subscribe(data => this.setPage(1, data));
    }

    if (this.selectedTheaterId && this.selectedMovieId) {
      this.statisticService.filterByMovieId(this.selectedMovieId, this.currentUser.distId, this.selectedTheaterId).subscribe(data => this.setPage(1, data));
    }

    if (this.selectedTheaterId && this.selectedYear && this.selectedMonth == null) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear).subscribe(data => this.setPage(1, data));
    }

    if (this.selectedTheaterId && this.selectedYear && this.selectedMonth != null) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear, this.selectedMonth).subscribe(data => this.setPage(1, data));
      console.log('+theater, +year, +month');
    }

    if (!this.selectedTheaterId && this.selectedMovieId) {
      this.statisticService.filterByMovieId(this.selectedMovieId, this.currentUser.distId).subscribe(data => this.setPage(1, data));
    }

    if (!this.selectedTheaterId && this.selectedYear && this.selectedMonth == null) {
      this.statisticService.getMoviesByDate(this.selectedYear, this.currentUser.distId).subscribe(data => this.setPage(1, data));
    }

    if (!this.selectedTheaterId && this.selectedYear && this.selectedMonth != null) {
      this.statisticService.getMoviesByDate(this.selectedYear, this.currentUser.distId, this.selectedMonth).subscribe(data => this.setPage(1, data));
    }
  }

  changeTheater() {
    if (this.selectedTheaterId != null) {
      this.statisticService.getMoviesWithNameByThReports(this.selectedTheaterId).subscribe(data => this.movies = data);
    }
    this.selectedMovieId = null;
    this.loadData();
  }

  changeMovie() {
    if (this.selectedMovieId != null) {
      this.selectedYear = null;
      this.selectedMonth = null;
    }
    this.loadData();
  }

  changeYear() {
    if (this.selectedYear === null) {
      this.selectedMonth = null;
    }
    this.loadData();
  }

  resetFilters() {
    this.selectedTheaterId = null;
    this.selectedMovieId = null;
    this.selectedYear = null;
    this.selectedMonth = null;
    this.loadData();
  }

  print() {
    $("#print-section").print();
  }

  setPage(page: number, data: any[]) {
    // get pager object from service
    this.pager = this.pagerService.getPager(data.length, page);

    // get current page of items
    this.pagedItems = data.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}
