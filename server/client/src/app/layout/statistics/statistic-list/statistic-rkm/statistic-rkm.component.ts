import {Component, OnInit} from '@angular/core';
import {DistributorService, MovieService, TheaterService, YearListService} from "../../../../core/services";
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
  listOfMovies: MainFilter[] = [];

  constructor(private yearListService: YearListService,
              private statisticService: StatisticService,
              private distributorService: DistributorService,
              private moviesService: MovieService,
              private theaterService: TheaterService) {
  }

  ngOnInit() {
    this.months = this.statisticService.months;
    this.yearListService.getYearList().subscribe(data => this.years = data.reverse());
    this.loadData();
  }

  loadData() {
    if (!this.selectedDistId && !this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear && this.selectedMonth == null) {
      this.moviesService.getAll().subscribe(data => this.movies = data);
      this.distributorService.getAll().subscribe(data => this.distributors = data);
      this.statisticService.getMoviesByDate().subscribe(data => this.listOfMovies = data);
    }

    if (this.selectedDistId) {

      if (!this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear) {
        // only distId
        this.statisticService.filterByOneDistId(this.selectedDistId).subscribe(data => this.listOfMovies = data);
      }

      if (this.selectedTheaterId && !this.selectedMovieId && !this.selectedYear) {
        // only distId and theaterId
        this.statisticService.getMoviesByTheaterId(this.selectedTheaterId).subscribe(data => this.listOfMovies = data);
      }

      if (this.selectedTheaterId && this.selectedMovieId && !this.selectedYear) {
        // only distId, theaterId and movieId
        this.statisticService.filterByMovieId(this.selectedMovieId, this.selectedDistId, this.selectedTheaterId)
          .subscribe(data => this.listOfMovies = data);
      }

      if (this.selectedTheaterId && !this.selectedMovieId && this.selectedYear) {
        if (this.selectedMonth != null) {
          // only distId, theaterId, year and month
          this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear, this.selectedMonth)
            .subscribe(data => this.listOfMovies = data);
        } else if (this.selectedMonth == null) {
          // only distId, theaterId and year
          this.statisticService.getMoviesByTheaterId(this.selectedTheaterId, this.selectedYear)
            .subscribe(data => this.listOfMovies = data);
        }
      }

      if (!this.selectedTheaterId && this.selectedMovieId && !this.selectedYear) {
        // only distId and movieId
        this.statisticService.filterByMovieId(this.selectedMovieId, this.selectedDistId)
          .subscribe(data => this.listOfMovies = data);
      }

      if (!this.selectedTheaterId && !this.selectedMovieId && this.selectedYear) {
        if (this.selectedMonth != null) {
          // only distId, year and month
          this.statisticService.getMoviesByDate(this.selectedYear, this.selectedDistId, this.selectedMonth)
            .subscribe(data => this.listOfMovies = data);
        } else if (this.selectedMonth == null) {
          // only distId and year
          this.statisticService.getMoviesByDate(this.selectedYear, this.selectedDistId)
            .subscribe(data => this.listOfMovies = data);
        }
      }

    }

    if (!this.selectedDistId && !this.selectedTheaterId && this.selectedMovieId && !this.selectedYear) {
      // only movieId
      this.statisticService.filterByMovieId(this.selectedMovieId).subscribe(data => this.listOfMovies = data);
    }

    if (!this.selectedDistId && !this.selectedTheaterId && !this.selectedMovieId && this.selectedYear) {
      if (this.selectedMonth != null) {
        // only year and month
        this.statisticService.getMoviesByDate(this.selectedYear, null, this.selectedMonth)
          .subscribe(data => this.listOfMovies = data);
      } else if (this.selectedMonth == null) {
        // only year
        this.statisticService.getMoviesByDate(this.selectedYear)
          .subscribe(data => this.listOfMovies = data);
      }
    }
  }

  changeDist() {
    if (this.selectedDistId) {
      this.theaterService.getByDistId(this.selectedDistId).subscribe(data => this.theaters = data);
      this.statisticService.getMoviesWithNameByDistId(this.selectedDistId).subscribe(data => this.movies = data);
    }
    this.selectedMovieId = null;
    this.selectedTheaterId = null;
    this.loadData();
  }

  changeTheater() {
    if (this.selectedTheaterId) {
      this.statisticService.getMoviesWithNameByThReports(this.selectedTheaterId).subscribe(data => this.movies = data);
    }
    this.selectedMovieId = null;
    this.loadData();
  }

  changeMovie() {
    if (this.selectedMovieId) {
      this.selectedYear = null;
      this.selectedMonth = null;
    }
    this.loadData();
  }

  changeYear() {
    if (!this.selectedYear) {
      this.selectedMonth = null;
    }
    this.loadData();
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

