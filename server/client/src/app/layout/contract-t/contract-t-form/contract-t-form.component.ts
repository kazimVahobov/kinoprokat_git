import {Component, OnInit} from '@angular/core';
import {
  ContractModel,
  MovieModel,
  DistributorModel,
  ContractService,
  MovieService,
  DistributorService,
  TheaterService,
  TheaterModel
} from 'src/app/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-contract-t-form',
  templateUrl: './contract-t-form.component.html',
  styleUrls: ['./contract-t-form.component.scss']
})
export class ContractTFormComponent implements OnInit {

  mainLabel = 'Новый договор (Дистрибьютор и кинотеатр)';
  currentDist: DistributorModel;
  currentTheater: TheaterModel;
  firstSide: DistributorModel[];
  secondSide: TheaterModel[];
  movies: MovieModel[];
  moviesAll: MovieModel[];
  contractsAll: ContractModel[];
  contractsOne: ContractModel[];
  contractsTwo: ContractModel[];
  contractsThree: ContractModel[];
  currentDate = new Date();
  distributors: DistributorModel[];

  form: FormGroup;
  id: string;
  theaters: TheaterModel[];
  theatersAll: TheaterModel[];

  noTheater = false;
  noMovie = false;

  currentUser = JSON.parse(localStorage.getItem('user'));
  role = JSON.parse(localStorage.getItem('role'));

  contractMode: boolean;
  secondPercent: number;

  priceControls: string[] = [
    'dayChildPriceTh',
    'dayAdultPriceTh',
    'eveningChildPriceTh',
    'eveningAdultPriceTh'
  ];

  constructor(private service: ContractService,
              private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private theaterService: TheaterService) {
  }

  ngOnInit() {
    this.createForm();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.load();
    });
    this.contractMode = true;
  }

  load() {
    this.distributorService.getAll().subscribe(distributors => {
      this.theaterService.getAll().subscribe(theaters => {
        this.movieService.getAll().subscribe(movies => {
          this.service.getAll().subscribe(contracts => {
            this.currentDist = new DistributorModel();
            this.currentTheater = new TheaterModel();
            this.distributors = [];
            this.distributors = distributors;
            this.firstSide = [];
            this.firstSide = distributors;
            this.movies = [];
            this.moviesAll = [];
            this.moviesAll = movies;
            this.contractsAll = [];
            this.contractsAll = contracts;
            this.theatersAll = [];
            this.theatersAll = theaters;
            if (this.role.typeOfRole === 0) {
              this.form.controls['firstSide'].setValue(this.currentUser.distId);
              this.contractsOne = [];
              this.contractsOne = contracts.filter(c => c.typeOfCont === 0 && new Date(c.toDate) > this.currentDate && c.secondSide === this.currentUser.distId);
              this.movies = movies.filter(m => this.contractsOne.some(c => c.movieId === m._id));
              this.noMovie = this.movies.length === 0;
              this.theaters = theaters.filter(i => i.distId === this.currentUser.distId);
            } else if (this.role.typeOfRole === 1) {
              this.form.controls['firstSide'].setValue(this.currentUser.distId);
              this.contractsTwo = [];
              this.contractsTwo = contracts.filter(c => c.typeOfCont === 1 && new Date(c.toDate) > this.currentDate && c.secondSide === this.currentUser.distId);
              this.movies = movies.filter(m => this.contractsTwo.some(c => c.movieId === m._id));
              this.noMovie = this.movies.length === 0;
              this.theaters = theaters.filter(i => i.distId === this.currentUser.distId);
            } else if (this.role.typeOfRole === 2) {
              this.currentTheater = theaters.find(i => i._id === this.currentUser.theaterId);
              this.theaters = theaters.filter(i => i.distId === this.currentTheater.distId);
              this.form.controls['firstSide'].setValue(distributors.find(i => i._id === this.currentTheater.distId)._id);
              this.form.controls['secondSide'].setValue(this.currentTheater._id);
              if (!this.id) {
                let tempContracts1: ContractModel[] = [];
                let tempContracts2: ContractModel[] = [];
                this.contractsThree = [];
                if (distributors.find(i => i._id === this.currentTheater.distId).parentId) {
                  tempContracts1 = contracts.filter(c => c.typeOfCont === 1 && c.secondSide === this.currentTheater.distId && new Date(c.toDate) > this.currentDate);
                } else if (!distributors.find(i => i._id === this.currentTheater.distId).parentId) {
                  tempContracts1 = contracts.filter(c => c.typeOfCont === 0 && c.secondSide === this.currentTheater.distId && new Date(c.toDate) > this.currentDate);
                }
                tempContracts2 = contracts.filter(c => c.typeOfCont === 2 && new Date(c.toDate) > this.currentDate && c.firstSide === this.currentTheater.distId && c.secondSide === this.currentTheater._id);
                this.contractsThree = tempContracts1.filter(c1 => !tempContracts2.some(c2 => c2.movieId === c1.movieId));
                this.movies = movies.filter(m => this.contractsThree.some(c => c.movieId === m._id));
                this.noMovie = this.movies.length === 0;
              }

            }
            if (this.id) {
              this.editMode();
            }
          });
        });
      });
    });
  }

  selectedMovie() {
    if (this.form.controls['movieId'].value) {
      let currentContract: ContractModel = new ContractModel();
      if (this.role.typeOfRole !== 2) {
        currentContract = this.findContract(this.role.typeOfRole);
      } else if (this.role.typeOfRole === 2) {
        if (this.distributors.find(d => d._id === this.currentTheater.distId).parentId) {
          currentContract = this.findContract(1);
        } else if (!this.distributors.find(d => d._id === this.currentTheater.distId).parentId) {
          currentContract = this.findContract(0);
        }
      }
      this.form.controls['fromDate'].setValue(new Date(currentContract.fromDate));
      this.form.controls['toDate'].setValue(new Date(currentContract.toDate));
      this.form.controls['fromDate'].enable();
      this.form.controls['toDate'].enable();
      // prices
      this.priceControls.forEach(i => this.form.controls[i].enable());
      this.setPrices(currentContract);
      if (this.role.typeOfRole !== 2) {
        this.form.controls['secondSide'].reset();
        this.form.controls['secondSide'].enable();
        let tempConts = this.contractsAll.filter(c => c.typeOfCont === 2
          && c.firstSide === this.currentUser.distId
          && new Date(c.toDate) > this.currentDate
          && c.movieId === this.form.controls['movieId'].value);
        this.theaters = this.theatersAll.filter(th => th.distId === this.currentUser.distId && !tempConts.some(c => th._id === c.secondSide));
        this.noTheater = this.theaters.length === 0;
      }
    }
  }

  editMode() {
    this.mainLabel = 'Редактирование данных договора';
    this.form.controls['movieId'].disable();
    let contract = this.contractsAll.find(i => i._id === this.id);
    let tempConts = this.contractsAll.filter(i => i.typeOfCont === 2 && i.secondSide === contract.secondSide);
    this.movies = [];
    this.movies = this.moviesAll.filter(m => tempConts.some(c => c.movieId === m._id));
    this.form.controls['movieId'].setValue(contract.movieId);
    this.form.controls['firstSide'].setValue(contract.firstSide);
    this.form.controls['secondSide'].setValue(contract.secondSide);
    this.form.controls['condition'].setValue(contract.condition);
    this.form.controls['contNum'].setValue(contract.contNum);
    this.form.controls['contDate'].setValue(new Date(contract.contDate));
    this.form.controls['fromDate'].setValue(new Date(contract.fromDate));
    this.form.controls['toDate'].setValue(new Date(contract.toDate));
    this.form.controls['tax'].setValue(contract.tax);
    this.contractMode = contract.condPercent;
    if (this.contractMode) {
      this.secondPercent = 100 - contract.condition
    }
    // prices
    this.priceControls.forEach(i => this.form.controls[i].enable());
    this.setPrices(contract);
  }

  createForm() {
    this.form = new FormGroup({
      movieId: new FormControl(null, Validators.required),
      firstSide: new FormControl(null, Validators.required),
      secondSide: new FormControl(null, Validators.required),
      condition: new FormControl(null, Validators.required),
      contNum: new FormControl(null, Validators.required),
      contDate: new FormControl(this.currentDate, Validators.required),
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
      tax: new FormControl(null),
      // prices
      dayChildPriceTh: new FormControl(null, Validators.required),
      dayAdultPriceTh: new FormControl(null, Validators.required),
      eveningChildPriceTh: new FormControl(null, Validators.required),
      eveningAdultPriceTh: new FormControl(null, Validators.required),
    });
    this.form.controls['firstSide'].disable();
    this.form.controls['secondSide'].disable();
    this.form.controls['fromDate'].disable();
    this.form.controls['toDate'].disable();
    // prices
    this.priceControls.forEach(i => this.form.controls[i].disable());
  }

  onSubmit() {
    let model = this.form.value;
    if (this.id) {
      model._id = this.id;
    }
    model.contNum = this.form.controls['contNum'].value;
    model.movieId = this.form.controls['movieId'].value;
    model.firstSide = this.form.controls['firstSide'].value;
    model.secondSide = this.form.controls['secondSide'].value;
    model.fromDate = this.form.controls['fromDate'].value;
    model.toDate = this.form.controls['toDate'].value;
    model.condition = this.form.controls['condition'].value;
    model.contDate = this.form.controls['contDate'].value;
    model.condPercent = this.contractMode;
    model.tax = this.form.controls['tax'].value;
    model.typeOfCont = 2;
    // prices
    model.dayChildPriceTh = this.form.controls["dayChildPriceTh"].value;
    model.dayAdultPriceTh = this.form.controls["dayAdultPriceTh"].value;
    model.eveningChildPriceTh = this.form.controls["eveningChildPriceTh"].value;
    model.eveningAdultPriceTh = this.form.controls["eveningAdultPriceTh"].value;

    if (this.role.typeOfRole !== 2) {
      model.parentId = this.findContract(this.role.typeOfRole)._id;
    } else if (this.role.typeOfRole === 2) {
      if (this.distributors.find(d => d._id === this.currentTheater.distId).parentId) {
        model.parentId = this.findContract(1)._id;
      } else if (!this.distributors.find(d => d._id === this.currentTheater.distId).parentId) {
        model.parentId = this.findContract(0)._id;
      }
    }
    this.service.save(model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/cont-t']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  findContract(n: number): ContractModel {
    return this.contractsAll.find(i =>
      i.typeOfCont === n
      && new Date(i.toDate) > this.currentDate
      && i.secondSide === this.form.controls['firstSide'].value
      && i.movieId === this.form.controls['movieId'].value);
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/cont-t']);
    }
  }

  onMovieClear() {
    if (this.role.typeOfRole !== 2) {
      this.noTheater = false;
      this.form.controls['secondSide'].reset();
      this.form.controls['secondSide'].disable();
    }
    this.form.controls['fromDate'].reset();
    this.form.controls['toDate'].reset();
    this.form.controls['fromDate'].disable();
    this.form.controls['toDate'].disable();
    // prices
    this.priceControls.forEach(i => {
      this.form.controls[i].reset();
      this.form.controls[i].disable();
    });
  }

  modelChanged(event: Event) {
    this.secondPercent = 100 - parseInt((<HTMLInputElement>event.target).value);
  }

  setPrices(contract: ContractModel) {
    // prices
    this.priceControls.forEach(i => this.form.controls[i].enable());
    this.form.controls['dayChildPriceTh'].setValue(contract.dayChildPriceTh);
    this.form.controls['dayAdultPriceTh'].setValue(contract.dayAdultPriceTh);
    this.form.controls['eveningChildPriceTh'].setValue(contract.eveningChildPriceTh);
    this.form.controls['eveningAdultPriceTh'].setValue(contract.eveningAdultPriceTh);
  }
}
