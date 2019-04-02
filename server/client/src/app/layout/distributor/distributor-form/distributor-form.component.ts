import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DistributorModel, UserModel, DistributorService, UserService, RegionModel, RegionService} from 'src/app/core';

@Component({
  selector: 'app-distributor-form',
  templateUrl: './distributor-form.component.html',
  styleUrls: ['./distributor-form.component.scss']
})
export class DistributorFormComponent implements OnInit, AfterViewInit {

  model: DistributorModel;
  distributors: DistributorModel[];
  users: UserModel[] = [];
  form: FormGroup;
  id: string;
  mainLabel = 'Новый дистрибьютор';
  currentUser = JSON.parse(localStorage.getItem('user'));

regions: RegionModel[];

  constructor(private service: DistributorService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private regionService: RegionService) {
  }

  ngAfterViewInit(): void {
    this.userService.getAll().subscribe(users => {
      this.model = new DistributorModel();
      users.forEach(i => i.lastName = `${i.lastName?i.lastName:''} ${i.firstName?i.firstName:''} ${i.middleName?i.middleName.substring(0, 1):''}.`);
      this.model.parentId = this.currentUser.distId;
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id) {
          this.service.getById(this.id).subscribe(distributor => {
            this.model = distributor;
            this.users = users.filter(u => u.distId === this.id);
            this.mainLabel = 'Редактирование данных дистрибьютора';
            this.form.controls['name'].setValue(this.model.name);
            this.form.controls['regionId'].setValue(this.model.regionId);
            this.form.controls['address'].setValue(this.model.address);
            this.form.controls['phone'].setValue(this.model.phone);
            this.form.controls['email'].setValue(this.model.email);
            this.form.controls['directorId'].setValue(this.model.directorId);
          });
        }
      });
    });
  }

  ngOnInit() {

    this.regions = [];
    this.regionService.getAll().subscribe(regions => {
      this.regions = regions
    })

    this.model = new DistributorModel();
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      regionId: new FormControl(null, Validators.required),
      address: new FormControl(null),
      phone: new FormControl(null),
      email: new FormControl(null),
      directorId: new FormControl(null)
    });
  }

  onSubmit() {
    this.model.name = this.form.controls['name'].value;
    this.model.regionId = this.form.controls['regionId'].value;
    this.model.address = this.form.controls['address'].value;
    this.model.phone = this.form.controls['phone'].value;
    this.model.email = this.form.controls['email'].value;
    this.model.directorId = this.form.controls['directorId'].value;
    this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/distributor']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
        console.log(error.error.message);
      });
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/distributor']);
    }
  }
}
