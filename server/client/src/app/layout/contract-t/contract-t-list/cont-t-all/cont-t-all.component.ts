import {Component, OnInit} from '@angular/core';
import {
  ContractModel,
  ContractService, DistributorModel, DistributorService, MovieModel, MovieService, PagerService, TheaterModel,
  TheaterService
} from 'src/app/core';

@Component({
  selector: 'app-cont-t-all',
  templateUrl: './cont-t-all.component.html',
  styleUrls: ['./cont-t-all.component.scss']
})
export class ContTAllComponent implements OnInit {

  contracts: ContractModel[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];
  movies: MovieModel[] = [];
  distributors: DistributorModel[] = [];
  theaters: TheaterModel[] = [];
  theater: TheaterModel = new TheaterModel();
  currentUser = JSON.parse(localStorage.getItem('user'));

  constructor(private service: ContractService,
              private pagerService: PagerService,
              private movieService: MovieService,
              private theaterService: TheaterService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {
    this.movieService.getAll().subscribe(movies => this.movies = movies);
    this.getAllContracts();
  }

  getAllContracts() {
    this.service.getAll().subscribe(contracts => {
      this.distributorService.getAll().subscribe(distributors => {
        this.theaterService.getAll().subscribe(theaters => {
          this.distributors = distributors;
          this.theaters = theaters;
          this.contracts = contracts.filter(d => d.typeOfCont === 2).reverse();
          if (this.contracts) {
            this.setPage(1);
          }
        });
      });
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.contracts.length, page);
    this.pagedItems = this.contracts.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  // if return 0 - play
  // if return 1 - stop
  // if return 2 - wait
  status(contract: ContractModel): number {
    const current = new Date();
    const start = new Date(contract.fromDate);
    const end = new Date(contract.toDate);
    if (current < start) {
      return 2;
    } else if (current < end) {
      return 0;
    } else if (current > end) {
      return 1;
    }
  }
}
