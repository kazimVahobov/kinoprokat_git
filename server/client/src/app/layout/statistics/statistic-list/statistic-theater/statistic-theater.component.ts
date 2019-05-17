import {Component, OnInit} from '@angular/core';
import {TheaterService, YearListService} from "../../../../core";
import {StatisticService} from "../../../../core/services/statistic.service";

declare var $;

@Component({
  selector: 'app-statistic-theater',
  templateUrl: './statistic-theater.component.html',
  styleUrls: ['./statistic-theater.component.scss']
})
export class StatisticTheaterComponent implements OnInit {

  currentUser = JSON.parse(localStorage.getItem('user'));
  parametersPanelIsOpen: boolean = true;
  selectedMovieId: string = null;
  selectedYear: number = null;
  selectedMonth: number = null;
  months: any[] = [];
  yearList: any[] = [];
  movies: any[] = [];

  listOfMoviesByTheaterId: MainFilter[] = [];

  constructor(private yearListService: YearListService,
              private theaterService: TheaterService,
              private statisticService: StatisticService) {
  }

  ngOnInit() {
    this.yearListService.getYearList().subscribe(years => this.yearList = years.reverse());
    this.movies = [];
    this.months = this.statisticService.months;
    this.statisticService.getMoviesWithNameByReports(this.currentUser.theaterId).subscribe(movies => {
      this.movies = movies
    }, error1 => {
      console.log(error1.toString());
    });
    this.loadData();
  }

  loadData(movieId?: string, year?: number, month?: number) {
    if (!movieId && !year && !month) {
      this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId).subscribe(data => this.listOfMoviesByTheaterId = data);
    } else if (movieId && !year && !month) {
      this.theaterService.getById(this.currentUser.theaterId).subscribe(theater => {
        this.statisticService.filterByMovieId(movieId, theater.regionId, theater._id).subscribe(data => this.listOfMoviesByTheaterId = data);
      });
    } else if (!movieId && year && !month) {
      this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId, year).subscribe(data => {
        this.listOfMoviesByTheaterId = data;
      });
    } else if (!movieId && year && month) {
      this.statisticService.getMoviesByTheaterId(this.currentUser.theaterId, year, month).subscribe(data => {
        this.listOfMoviesByTheaterId = data;
      });
    }
  }

  changeMovie() {
    if (this.selectedMovieId) {
      this.selectedYear = null;
      this.selectedMonth = null;
      this.loadData(this.selectedMovieId);
    } else {
      this.loadData();
    }
  }

  changeYear() {
    if (this.selectedYear) {
      this.selectedMovieId = null;
      this.loadData(null, this.selectedYear);
    } else {
      this.loadData();
    }
  }

  changeMonth() {
    if (this.selectedMonth) {
      this.loadData(null, this.selectedYear, this.selectedMonth);
    } else {
      this.loadData(null, this.selectedYear);
    }
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
