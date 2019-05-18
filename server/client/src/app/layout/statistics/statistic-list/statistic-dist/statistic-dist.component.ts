import {Component, OnInit} from '@angular/core';
import {
  DistributorService,
  MovieService,
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
  listOfMovies: MainFilter[] = [];

  constructor(private yearListService: YearListService,
              private theaterService: TheaterService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private thReportService: TheaterReportService,
              private statisticService: StatisticService) {
  }

  ngOnInit() {
    this.yearListService.getYearList().subscribe(years => this.yearList = years.reverse());
    this.months = this.statisticService.months;
    this.statisticService.getTheatersWithName(this.currentUser.distId).subscribe(data => this.theaters = data);
    this.loadData();
  }

  loadData() {
    if (!this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear && this.selectedMonth == null) {
      this.statisticService.filterByOneDistId(this.currentUser.distId).subscribe(data => this.listOfMovies = data);
      this.statisticService.getMoviesWithNameByDistId(this.currentUser.distId).subscribe(data => this.movies = data);
    }

    if (this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId).subscribe(data => this.listOfMovies = data);
    }

    if (this.selectedTheaterId && this.selectedMovieId) {
      this.statisticService.filterByMovieId(this.selectedMovieId, this.currentUser.distId, this.selectedTheaterId).subscribe(data => this.listOfMovies = data);
    }

    if (this.selectedTheaterId && this.selectedYear && this.selectedMonth == null) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear).subscribe(data => this.listOfMovies = data);
    }

    if (this.selectedTheaterId && this.selectedYear && this.selectedMonth != null) {
      this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear, this.selectedMonth).subscribe(data => this.listOfMovies = data);
      console.log('+theater, +year, +month');
    }

    if (!this.selectedTheaterId && this.selectedMovieId) {
      this.statisticService.filterByMovieId(this.selectedMovieId, this.currentUser.distId).subscribe(data => this.listOfMovies = data);
    }

    if (!this.selectedTheaterId && this.selectedYear && this.selectedMonth == null) {
      this.statisticService.getMoviesByDate(this.selectedYear, this.currentUser.distId).subscribe(data => this.listOfMovies = data);
    }

    if (!this.selectedTheaterId && this.selectedYear && this.selectedMonth != null) {
      this.statisticService.getMoviesByDate(this.selectedYear, this.currentUser.distId, this.selectedMonth).subscribe(data => this.listOfMovies = data);
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
}


class MainFilter {
  label: string;
  daySession?: SessionOfDetailFilter = new SessionOfDetailFilter();
  eveningSession?: SessionOfDetailFilter = new SessionOfDetailFilter();
}

class SessionOfDetailFilter {
  childCount: number;
  childSum: number;
  adultCount: number;
  adultSum: number;
}
