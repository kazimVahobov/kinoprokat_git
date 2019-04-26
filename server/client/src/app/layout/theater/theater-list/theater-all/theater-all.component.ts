import { Component, OnInit } from '@angular/core';
import {PagerService, TheaterModel, TheaterService, UserModel, UserService, RegionService, RegionModel} from 'src/app/core/index';

@Component({
  selector: 'app-theater-all',
  templateUrl: './theater-all.component.html',
  styleUrls: ['./theater-all.component.scss']
})
export class TheaterAllComponent implements OnInit {

  users: UserModel[] = [];
  theaterList: TheaterModel[] = [];
  pager: any = {};
  pagedItems: any[] = [];

regions: RegionModel[];

  constructor(private service: TheaterService,
              private userService: UserService,
              private pagerService: PagerService,
              private regionService: RegionService) { }

  ngOnInit() {
    this.getAllTheater();
    this.regions = [];
    this.regionService.getAll().subscribe(regions => {
      this.regions = regions;
    })
  }

  getAllTheater() {
    this.service.getAll().subscribe(theaters => {
      this.userService.getAll().subscribe(data => {
        this.users = data;
        this.users.forEach(item => item.lastName += ` ${item.firstName?item.firstName:''} ${item.middleName?item.middleName.substring(0, 1):''}. (${item.phone?item.phone:''})`);
        this.theaterList = theaters.reverse();
        this.setPage(1);
      });
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.theaterList.length, page);
    this.pagedItems = this.theaterList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  placeCount(theater: TheaterModel): number {
    let summ = 0;
    theater.holes.forEach(i => summ += i.placeCount);
    return summ;
  }
}
