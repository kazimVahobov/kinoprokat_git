import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistic-list',
  templateUrl: './statistic-list.component.html',
  styleUrls: ['./statistic-list.component.scss']
})
export class StatisticListComponent implements OnInit {

  currentRole = JSON.parse(localStorage.getItem('role'));

  constructor() { }

  ngOnInit() {
    
  }

}
