import {Component, Input, OnInit} from '@angular/core';
import {
  ContractModel,
  ContractService,
  DistributorModel,
  DistributorService,
  TheaterModel,
  TheaterService
} from "../../../../core";

declare var $;

@Component({
  selector: 'app-movie-contracts',
  templateUrl: './movie-contracts.component.html',
  styleUrls: ['./movie-contracts.component.scss']
})
export class MovieContractsComponent implements OnInit {

  @Input() movieId: string = null;
  contracts: ContractModel[] = [];
  distributors: DistributorModel[];
  theaters: TheaterModel[];

  constructor(private service: ContractService,
              private distributorService: DistributorService,
              private theaterService: TheaterService) {
  }

  ngOnInit() {
    this.contracts = [];
    this.distributors = [];
    this.theaters = [];
    this.service.getAll().subscribe(contracts => {
      this.contracts = contracts.filter(item => item.movieId === this.movieId)
        .filter(item => item.typeOfCont == 2);
      this.distributorService.getAll().subscribe(data => {
        this.distributors = data;
        this.theaterService.getAll().subscribe(theaters => this.theaters = theaters);
      });
    });
  }

  print() {
    $("#contracts-print").print();
  }
}

