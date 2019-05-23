import {Component, OnInit} from '@angular/core';
import {
  ContractService,
  DistributorService,
  MovieService,
  ContractModel,
  DistributorModel,
  MovieModel, TheaterModel, TheaterService
} from "../../../core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-cont-t-detail',
  templateUrl: './cont-t-detail.component.html',
  styleUrls: ['./cont-t-detail.component.scss']
})
export class ContTDetailComponent implements OnInit {

  id: string;
  model: ContractModel;
  movies: MovieModel[];
  distributors: DistributorModel[];
  theaters: TheaterModel[];

  constructor(private service: ContractService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private theaterService: TheaterService,
              private route: ActivatedRoute) {
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

}
