import {Component, OnInit} from '@angular/core';
import {
  ContractService,
  DistributorService,
  MovieService,
  ContractModel,
  DistributorModel,
  MovieModel
} from "../../../core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-cont-s-detail',
  templateUrl: './cont-s-detail.component.html',
  styleUrls: ['./cont-s-detail.component.scss']
})
export class ContSDetailComponent implements OnInit {

  id: string;
  model: ContractModel;
  movies: MovieModel[];
  distributors: DistributorModel[];

  constructor(private service: ContractService,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.movies = [];
    this.distributors = [];
    this.model = new ContractModel();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.service.getById(this.id).subscribe(cont => {
          this.model = cont;
          this.movieService.getAll().subscribe(movies => {
            this.movies = movies;
            this.distributorService.getAll().subscribe(distributors => this.distributors = distributors);
          });
        });
      }
    });
  }

}
