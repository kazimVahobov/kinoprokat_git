import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {
  TheaterModel,
  TheaterService,
  UserModel,
  DistributorService,
  UserService,
  DistributorModel,
  RegionService,
  RegionModel
} from 'src/app/core';

@Component({
  selector: 'app-theater-form',
  templateUrl: './theater-form.component.html',
  styleUrls: ['./theater-form.component.scss']
})
export class TheaterFormComponent implements OnInit {

  id: string;
  mainLabel = 'Новый кинотеатр';
  model: TheaterModel;
  days = [
    {
      start: '',
      end: '',
      checked: true,
      name: 'Пн.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Вт.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Ср.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Чт.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Пт.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Сб.',
    },
    {
      start: '',
      end: '',
      checked: true,
      name: 'Вс.',
    },
  ];
  holes = [
    {
      name: null,
      placeCount: null,
    }
  ];
  directors: UserModel[];
  distributors: DistributorModel[];
  everyDay = true;
  dayDetailMode = false;
  dayDetailPanel = false;
  applyDayDetailMode = false;
  commonTimeStart = '';
  commonTimeEnd = '';
  currentUser = JSON.parse(localStorage.getItem('user'));

  regions: RegionModel[];

  constructor(private service: TheaterService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private distributorService: DistributorService,
              private regionService: RegionService) {
  }

  ngOnInit() {
    this.model = new TheaterModel();
    this.regions = [];
    this.regionService.getAll().subscribe(regions => {
      this.regions = regions
    });

    this.userService.getAll().subscribe(users => {
      this.model.distId = this.currentUser.distId;
      this.route.params.subscribe(params => {
        this.id = params['id'];
        if (this.id) {
          this.directors = users.filter(u => u.theaterId == this.id);
          for (let i = 0; i < this.directors.length; i++) {
            this.directors[i].lastName += ' ' + (this.directors[i].firstName ? this.directors[i].firstName + ' ' : '') + (this.directors[i].middleName ? this.directors[i].middleName.substring(0, 1) + '.' : '');
          }
          this.service.getById(this.id).subscribe(theater => {
            this.mainLabel = 'Редактирование данных';
            this.model = theater;
            for (let i = 0; i < this.days.length; i++) {
              this.days[i].checked = theater.workTime[i].weekDay;
              this.days[i].start = theater.workTime[i].start;
              this.days[i].end = theater.workTime[i].end;
            }
            const start = this.days.find(i => i.checked).start;
            const end = this.days.find(i => i.checked).end;
            if (this.days.some(i => i.start !== start && i.end !== end)) {
              this.dayDetailPanel = true;
              this.dayDetailMode = true;
              this.applyDayDetailMode = true;
            } else {
              this.commonTimeStart = start;
              this.commonTimeEnd = end;
            }
            this.holes = [];
            theater.holes.forEach(item => this.holes.push(item));
          });
        } else {
        }
      });
    });
    this.distributorService.getAll().subscribe(data => this.distributors = data);
  }

  backToList() {
    if (confirm('Внимание! Все несохранённые данные будут утеряны! Вы действительно хотите вернуться к списку без сохранения?')) {
      this.router.navigate(['/theater']);
    }
  }

  everyDayClick() {
    for (let i = 0; i < this.days.length; i++) {
      this.days[i].checked = this.everyDay;
    }
  }

  isIndeterminated(): boolean {
    return this.days.some(a => a.checked) && this.days.some(a => !a.checked);
  }

  daysClick() {
    this.everyDay = this.days.some(a => a.checked);
  }

  addHole() {
    this.holes.push({name: null, placeCount: null});
    this.validation();
  }

  deleteHole(inx: number) {
    if (this.holes.length !== 1) {
      if (confirm(`Вы уверен, что хотите удалить кинозал ${this.holes[inx].name}?`)) {
        this.holes.splice(inx, 1);
      }
    } else if (this.holes.length === 1) {
      alert('В кинотеатре должен быть, как минимум, один кинозал');
    }
  }

  submit() {
    if (!this.applyDayDetailMode) {
      for (let i = 0; i < this.days.length; i++) {
        this.days[i].start = this.commonTimeStart;
        this.days[i].end = this.commonTimeEnd;
      }
    }
    if (this.model._id) {
      for (let i = 0; i < this.days.length; i++) {
        this.model.workTime[i].weekDay = this.days[i].checked;
        this.model.workTime[i].start = this.days[i].start;
        this.model.workTime[i].end = this.days[i].end;
      }
    } else {
      this.model.workTime = [];
      for (let i = 0; i < this.days.length; i++) {
        this.model.workTime.push({start: this.days[i].start, end: this.days[i].end, weekDay: this.days[i].checked});
      }
    }
    this.model.holes = [];
    for (let i = 0; i < this.holes.length; i++) {
      this.model.holes.push(this.holes[i]);
    }
    this.service.save(this.model).subscribe(() => {
        alert('Все данные успешно сохранены!');
        this.router.navigate(['/theater']);
      },
      error => {
        alert('Произошла неизвестная ошибка, пожалуйста попробуйте снова');
      });
  }

  validation(): boolean {
    if (this.model.name && this.model.regionId) {
      return !this.holes.some(a => a.name === null) && !this.holes.some(a => a.placeCount === null);
    } else {
      return false;
    }
  }
}
