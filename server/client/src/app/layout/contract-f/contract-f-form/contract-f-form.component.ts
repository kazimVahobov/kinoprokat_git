import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ContractModel,
  ContractService,
  DistributorModel,
  DistributorService,
  MovieModel,
  MovieService
} from 'src/app/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-contract-f-form',
  templateUrl: './contract-f-form.component.html',
  styleUrls: ['./contract-f-form.component.scss']
})
export class ContractFFormComponent implements OnInit {

  noMovie = false;

  model: ContractModel;

  id = null;
  mainLabel = 'Новый договор (Правообладатель и RKM)';
  form: FormGroup;

  movies: MovieModel[] = [];
  contracts: ContractModel[] = [];
  distributors: DistributorModel[] = [];
  currentDistributor: DistributorModel = new DistributorModel();

  currentDate = new Date();

  currentUser = JSON.parse(localStorage.getItem('user'));

  contractMode: boolean;
  secondPercent: number;

  constructor(private service: ContractService,
              private router: Router,
              private route: ActivatedRoute,
              private movieService: MovieService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {
    this.createForm();
    this.service.getAll().subscribe(contracts => {
      this.distributorService.getAll().subscribe(distributors => {
        this.currentDistributor = distributors.find(item => item._id === this.currentUser.distId);
        this.distributors = distributors.filter(item => item._id === this.currentDistributor._id);
        this.form.controls['secondSide'].setValue(this.distributors[0]._id);
        this.contracts = contracts.filter(item => item.typeOfCont === 0 && item.secondSide === this.currentDistributor._id)
          .filter(item => new Date(item.toDate) > this.currentDate);
        this.movieService.getAll().subscribe(movies => {
          this.movies = movies.filter(item => (this.contracts.some(i => i.movieId === item._id) !== true));
          this.noMovie = this.movies.length === 0;
        });
      });
    });
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.movieService.getAll().subscribe(movies => this.movies = movies);
        this.mainLabel = 'Редактирование данных договора';
        this.service.getById(this.id).subscribe(contract => {
          this.model = contract;
          this.model.contDate = new Date(this.model.contDate);
          this.model.fromDate = new Date(this.model.fromDate);
          this.model.toDate = new Date(this.model.toDate);
          this.form.controls['movieId'].setValue(this.model.movieId);
          this.form.controls['movieId'].disable();
          this.form.controls['firstSide'].setValue(this.model.firstSide);
          this.form.controls['contNum'].setValue(this.model.contNum);
          this.form.controls['contDate'].setValue(this.model.contDate);
          this.form.controls['fromDate'].setValue(this.model.fromDate);
          this.form.controls['toDate'].setValue(this.model.toDate);
          this.form.controls['condition'].setValue(this.model.condition);
          this.form.controls['tax'].setValue(this.model.tax);
          // prices
          this.form.controls["dayChildPriceTh"].setValue(this.model.dayChildPriceTh);
          this.form.controls["dayAdultPriceTh"].setValue(this.model.dayAdultPriceTh);
          this.form.controls["eveningChildPriceTh"].setValue(this.model.eveningChildPriceTh);
          this.form.controls["eveningAdultPriceTh"].setValue(this.model.eveningAdultPriceTh);
          this.form.controls["dayChildPriceGr"].setValue(this.model.dayChildPriceGr);
          this.form.controls["dayAdultPriceGr"].setValue(this.model.dayAdultPriceGr);
          this.form.controls["eveningChildPriceGr"].setValue(this.model.eveningChildPriceGr);
          this.form.controls["eveningAdultPriceGr"].setValue(this.model.eveningAdultPriceGr);
          this.form.controls["dayChildPriceMobile"].setValue(this.model.dayChildPriceMobile);
          this.form.controls["dayAdultPriceMobile"].setValue(this.model.dayAdultPriceMobile);
          this.form.controls["eveningChildPriceMobile"].setValue(this.model.eveningChildPriceMobile);
          this.form.controls["eveningAdultPriceMobile"].setValue(this.model.eveningAdultPriceMobile);

          this.contractMode = this.model.condPercent;
          if (this.contractMode) {
            this.secondPercent = 100 - this.model.condition
          }
        });
      } else {
        this.contractMode = true;
      }
    });
  }

  createForm() {
    this.form = new FormGroup({
      movieId: new FormControl(null, Validators.required),
      firstSide: new FormControl(null, Validators.required),
      secondSide: new FormControl(null, Validators.required),
      condition: new FormControl(null, Validators.required),
      contNum: new FormControl(null, Validators.required),
      contDate: new FormControl(new Date(), Validators.required),
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
    this.form.controls['secondSide'].disable();
  }

  onSubmit() {
    this.model = this.form.value;
    this.model.movieId = this.form.controls['movieId'].value;
    this.model.firstSide = this.form.controls['firstSide'].value;
    this.model.secondSide = this.form.controls['secondSide'].value;
    this.model.condition = this.form.controls['condition'].value;
    this.model.contNum = this.form.controls['contNum'].value;
    this.model.contDate = this.form.controls['contDate'].value;
    this.model.fromDate = this.form.controls['fromDate'].value;
    this.model.toDate = this.form.controls['toDate'].value;
    this.model.tax = this.form.controls['tax'].value;
    this.model._id = this.id;
    this.model.typeOfCont = 0;
    this.model.parentId = null;
    this.model.condPercent = this.contractMode;
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
        this.router.navigate(['/cont-f']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  modelChanged(event: Event) {
    this.secondPercent = 100 - parseInt((<HTMLInputElement>event.target).value);
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/cont-f']);
    }
  }
}
