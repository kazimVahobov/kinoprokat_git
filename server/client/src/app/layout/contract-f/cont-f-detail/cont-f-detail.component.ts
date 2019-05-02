import {Component, OnInit} from '@angular/core';
import {
  ContractService,
  ContractModel,
  MovieService,
  MovieModel,
  DistributorModel,
  DistributorService
} from "../../../core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-cont-f-detail',
  templateUrl: './cont-f-detail.component.html',
  styleUrls: ['./cont-f-detail.component.scss']
})
export class ContFDetailComponent implements OnInit {

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
