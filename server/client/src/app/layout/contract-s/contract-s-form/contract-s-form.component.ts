import {Component, OnInit} from '@angular/core';
import {
  ContractModel,
  ContractService,
  DistributorModel,
  DistributorService,
  MovieModel,
  MovieService,
} from 'src/app/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-contract-s-form',
  templateUrl: './contract-s-form.component.html',
  styleUrls: ['./contract-s-form.component.scss']
})
export class ContractSFormComponent implements OnInit {

  noDist = false;
  noMovie = false;
  mainLabel = 'Новый договор (RKM и Дистрибьютор)';
  form: FormGroup;
  movies: MovieModel[] = [];
  moviesAll: MovieModel[] = [];
  firstSide: DistributorModel[] = [];
  secondSide: DistributorModel[] = [];
  subDists: DistributorModel[] = [];
  currentDistributor: DistributorModel = new DistributorModel();
  contractsOne: ContractModel[] = [];
  contractsAll: ContractModel[] = [];
  currentDate = new Date(Date.now());
  isRkm: boolean;
  currentUser = JSON.parse(localStorage.getItem('user'));
  model: ContractModel;
  id: string;

  contractMode: boolean;
  secondPercent: number;

  priceControls: string[] = [
    'dayChildPriceTh',
    'dayAdultPriceTh',
    'eveningChildPriceTh',
    'eveningAdultPriceTh',
    'dayChildPriceGr',
    'dayAdultPriceGr',
    'eveningChildPriceGr',
    'eveningAdultPriceGr',
    'dayChildPriceMobile',
    'dayAdultPriceMobile',
    'eveningChildPriceMobile',
    'eveningAdultPriceMobile'
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private distributorService: DistributorService,
              private service: ContractService) {
  }

  ngOnInit() {
    this.model = new ContractModel();
    this.createForm();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.load();
    });
    this.contractMode = true;
  }

  load() {
    this.distributorService.getAll().subscribe(distributors => {
      this.firstSide = distributors.filter(i => !i.parentId);
      this.currentDistributor = distributors.find(i => i._id === this.currentUser.distId);
      this.isRkm = !distributors.find(i => i._id === this.currentUser.distId).parentId;
      this.movieService.getAll().subscribe(movies => {
        this.service.getAll().subscribe(contracts => {
          this.moviesAll = [];
          this.moviesAll = movies;
          this.contractsAll = [];
          this.contractsAll = contracts;
          this.contractsOne = [];
          this.contractsOne = contracts.filter(i => i.typeOfCont === 0 && new Date(i.toDate) > this.currentDate);
          this.movies = movies.filter(m => this.contractsOne.some(c => c.movieId === m._id));
          this.secondSide = distributors.filter(i => i.parentId);
          if (this.isRkm) {
            this.form.controls['firstSide'].setValue(this.firstSide.find(i => i._id === this.currentDistributor._id)._id);
            this.subDists = distributors.filter(i => i.parentId === this.currentUser.distId);
            this.noMovie = this.movies.length === 0;
          } else if (!this.isRkm) {
            this.form.controls['firstSide'].setValue(this.firstSide.find(i => i._id === this.currentDistributor.parentId)._id);
            this.form.controls['secondSide'].setValue(this.secondSide.find(i => i._id === this.currentUser.distId)._id);
            if (!this.id) {
              let tempContracts1: ContractModel[] = [];
              tempContracts1 = contracts.filter(c => c.typeOfCont === 1 && new Date(c.toDate) > this.currentDate && c.secondSide === this.currentDistributor._id);
              this.movies = this.movies.filter(m => !tempContracts1.some(c => c.movieId === m._id));
              this.noMovie = this.movies.length === 0;
            }
          }
          if (this.id) {
            this.editMode();
          }
        })
      });
    });
  }

  editMode() {
    this.mainLabel = 'Редактирование данных договора';
    this.form.controls['movieId'].disable();
    let contract = this.contractsAll.find(i => i._id === this.id);
    let tempConts = this.contractsAll.filter(i => i.typeOfCont === 1 && i.secondSide === contract.secondSide);
    this.movies = [];
    this.movies = this.moviesAll.filter(m => tempConts.some(c => c.movieId === m._id));
    this.form.controls['movieId'].setValue(contract.movieId);
    this.form.controls['firstSide'].setValue(contract.firstSide);
    this.form.controls['secondSide'].setValue(contract.secondSide);
    this.form.controls['contNum'].setValue(contract.contNum);
    this.form.controls['contDate'].setValue(new Date(contract.contDate));
    this.form.controls['fromDate'].setValue(new Date(contract.fromDate));
    this.form.controls['toDate'].setValue(new Date(contract.toDate));
    this.form.controls['condition'].setValue(contract.condition);
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
      dayChildPriceGr: new FormControl(null, Validators.required),
      dayAdultPriceGr: new FormControl(null, Validators.required),
      eveningChildPriceGr: new FormControl(null, Validators.required),
      eveningAdultPriceGr: new FormControl(null, Validators.required),
      dayChildPriceMobile: new FormControl(null, Validators.required),
      dayAdultPriceMobile: new FormControl(null, Validators.required),
      eveningChildPriceMobile: new FormControl(null, Validators.required),
      eveningAdultPriceMobile: new FormControl(null, Validators.required)
    });
    this.form.controls['firstSide'].disable();
    this.form.controls['secondSide'].disable();
    this.form.controls['fromDate'].disable();
    this.form.controls['toDate'].disable();
    // prices
    this.priceControls.forEach(i => this.form.controls[i].disable());
  }

  modelChanged(event: Event) {
    this.secondPercent = 100 - parseInt((<HTMLInputElement>event.target).value);
  }

  changeMovie() {
    if (this.form.controls['movieId'].value) {
      let currentContract = this.contractsOne.find(i => new Date(i.toDate) > this.currentDate && i.movieId === this.form.controls['movieId'].value);
      this.form.controls['fromDate'].setValue(new Date(currentContract.fromDate));
      this.form.controls['toDate'].setValue(new Date(currentContract.toDate));
      this.form.controls['fromDate'].enable();
      this.form.controls['toDate'].enable();
      // prices
      this.priceControls.forEach(i => this.form.controls[i].enable());
      this.setPrices(currentContract);

      if (this.isRkm) {
        this.form.controls['secondSide'].reset();
        this.form.controls['secondSide'].enable();
        let tempConts = this.contractsAll.filter(c => c.typeOfCont === 1 && new Date(c.toDate) > this.currentDate && c.movieId === this.form.controls['movieId'].value);
        this.secondSide = this.subDists.filter(d => !tempConts.some(c => d._id === c.secondSide));
        this.noDist = this.secondSide.length === 0;
      }
    }
  }

  onSubmit() {
    this.model = new ContractModel();
    this.model = this.form.value;
    if (this.id) {
      this.model._id = this.id;
    }
    this.model.movieId = this.form.controls['movieId'].value;
    this.model.firstSide = this.form.controls['firstSide'].value;
    this.model.secondSide = this.form.controls['secondSide'].value;
    this.model.condition = this.form.controls['condition'].value;
    this.model.contNum = this.form.controls['contNum'].value;
    this.model.contDate = this.form.controls['contDate'].value;
    this.model.fromDate = this.form.controls['fromDate'].value;
    this.model.toDate = this.form.controls['toDate'].value;
    this.model.tax = this.form.controls['tax'].value;
    this.model.condPercent = this.contractMode;
    this.model.typeOfCont = 1;
    this.model.parentId = this.contractsAll.find((i => i.typeOfCont === 0 && new Date(i.toDate) > this.currentDate
      && i.movieId === this.form.controls['movieId'].value))._id;
    // prices
    this.model.dayChildPriceTh = this.form.controls["dayChildPriceTh"].value;
    this.model.dayAdultPriceTh = this.form.controls["dayAdultPriceTh"].value;
    this.model.eveningChildPriceTh = this.form.controls["eveningChildPriceTh"].value;
    this.model.eveningAdultPriceTh = this.form.controls["eveningAdultPriceTh"].value;
    this.model.dayChildPriceGr = this.form.controls["dayChildPriceGr"].value;
    this.model.dayAdultPriceGr = this.form.controls["dayAdultPriceGr"].value;
    this.model.eveningChildPriceGr = this.form.controls["eveningChildPriceGr"].value;
    this.model.eveningAdultPriceGr = this.form.controls["eveningAdultPriceGr"].value;
    this.model.dayChildPriceMobile = this.form.controls["dayChildPriceMobile"].value;
    this.model.dayAdultPriceMobile = this.form.controls["dayAdultPriceMobile"].value;
    this.model.eveningChildPriceMobile = this.form.controls["eveningChildPriceMobile"].value;
    this.model.eveningAdultPriceMobile = this.form.controls["eveningAdultPriceMobile"].value;
    this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/cont-s']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        console.log(error.error.message)
      });
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/cont-s']);
    }
  }

  onMovieClear() {
    if (this.isRkm) {
      this.noDist = false;
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

  setPrices(contract: ContractModel) {
    // prices
    this.priceControls.forEach(i => this.form.controls[i].enable());
    this.form.controls['dayChildPriceTh'].setValue(contract.dayChildPriceTh);
    this.form.controls['dayAdultPriceTh'].setValue(contract.dayAdultPriceTh);
    this.form.controls['eveningChildPriceTh'].setValue(contract.eveningChildPriceTh);
    this.form.controls['eveningAdultPriceTh'].setValue(contract.eveningAdultPriceTh);
    this.form.controls['dayChildPriceGr'].setValue(contract.dayChildPriceGr);
    this.form.controls['dayAdultPriceGr'].setValue(contract.dayAdultPriceGr);
    this.form.controls['eveningChildPriceGr'].setValue(contract.eveningChildPriceGr);
    this.form.controls['eveningAdultPriceGr'].setValue(contract.eveningAdultPriceGr);
    this.form.controls['dayChildPriceMobile'].setValue(contract.dayChildPriceMobile);
    this.form.controls['dayAdultPriceMobile'].setValue(contract.dayAdultPriceMobile);
    this.form.controls['eveningChildPriceMobile'].setValue(contract.eveningChildPriceMobile);
    this.form.controls['eveningAdultPriceMobile'].setValue(contract.eveningAdultPriceMobile);
  }
}
