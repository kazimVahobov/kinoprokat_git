import {Component, OnInit, ViewChild} from '@angular/core';
import {
  RegionModel,
  RegionService,
  PermissionService,
  TheaterService,
  DistributorService,
  DistributorModel,
  TheaterModel
} from 'src/app/core';
import {ModalDirective} from 'ngx-bootstrap';
import {FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-region-list',
  templateUrl: './region-list.component.html',
  styleUrls: ['./region-list.component.scss']
})
export class RegionListComponent implements OnInit {

  @ViewChild('editModal') editModal: ModalDirective;
  @ViewChild('canNotDeleteModal') canNotDeleteModal: ModalDirective;
  regionList: RegionModel[] = [];
  mainLabel = 'Создание нового региона';
  secondLabel = 'Введите название нового региона';
  model: RegionModel;
  form = new FormGroup({
    name: new FormControl(null, Validators.required)
  });

  isEdit = false;
  isDelete = false;
  isCreate = false;
  regionForDelete: RegionModel = new RegionModel();

  distributors: DistributorModel[];
  theaters: TheaterModel[];

  constructor(private service: RegionService,
              private permissionService: PermissionService,
              private theaterService: TheaterService,
              private distributorService: DistributorService) {
  }

  ngOnInit() {
    this.model = new RegionModel();
    this.getAllRegion();

    if (this.permissionService.regions) {
      for (let i = 0; i < this.permissionService.regions.length; i++) {
        if (this.permissionService.regions[i].value === 2) {
          this.isEdit = true;
        }
        if (this.permissionService.regions[i].value === 3) {
          this.isDelete = true;
        }
        if (this.permissionService.regions[i].value === 0) {
          this.isCreate = true;
        }
      }
    }

  }

  getAllRegion() {
    this.service.getAll().subscribe(region => {
      this.regionList = region
    });
  }

  deleteRegion(region: RegionModel) {
    if (confirm(`Вы уверен, что хотите удалиить региона ${region.name}?`)) {
      this.service.delete(region._id).subscribe(res =>
          this.getAllRegion(),
        error => {
        })
    }
  }

  openDeleteModal(region: RegionModel) {
    this.distributors = [];
    this.theaters = [];
    this.distributorService.getAll().subscribe(distributors => {
      this.theaterService.getAll().subscribe(theaters => {
        this.theaters = theaters.filter(th => th.regionId === region._id);
        this.distributors = distributors.filter(d => d.regionId === region._id);

        if (this.theaters.length || this.distributors.length) {
          this.canNotDeleteModal.show()
        } else {
          this.deleteRegion(region);
        }
      })
    })
  }

  openModal(region?: RegionModel) {
    this.model = new RegionModel();
    if (region != null) {
      this.model = region;
      this.mainLabel = 'Редактирование данных региона';
      this.secondLabel = 'Введите новое название региона ' + this.model.name;
    } else {
      this.mainLabel = 'Создание нового региона';
      this.secondLabel = 'Введите название нового региона';
    }
    this.editModal.show();
  }

  updateRegion() {
    this.model.name = this.form.controls['name'].value;
    this.service.save(this.model).subscribe(() =>
        this.getAllRegion(),
      error => {
      });
    this.closeModal();
  }

  closeModal() {
    this.form.controls['name'].reset();
    this.editModal.hide();
    this.canNotDeleteModal.hide();
  }
}
