import {Component, OnInit} from '@angular/core';
import {
  ContractModel,
  ContractService,
  DistributorModel, DistributorService,
  MovieModel,
  MovieService,
  TheaterModel, TheaterService
} from "../../../../core";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-movie-cont-detail',
  templateUrl: './movie-cont-detail.component.html',
  styleUrls: ['./movie-cont-detail.component.scss']
})
export class MovieContDetailComponent implements OnInit {

  id: string;
  model: ContractModel;
  movies: MovieModel[];
  distributors: DistributorModel[];
  theaters: TheaterModel[];

  constructor(private service: ContractService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private theaterService: TheaterService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.movies = [];
    this.distributors = [];
    this.theaters = [];
    this.model = new ContractModel();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(cont => {
          this.model = cont;
          this.movieService.getAll().subscribe(movies => {
            this.movies = movies;
            this.distributorService.getAll().subscribe(distributors => {
              this.distributors = distributors;
              this.theaterService.getAll().subscribe(theaters => this.theaters = theaters);
            });
          });
        });
      }
    });
  }

  backPage() {
    this.location.back();
  }
}
