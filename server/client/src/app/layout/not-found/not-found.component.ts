import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(private location: Location,
    private router: Router) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
  mainMenu() {
    this.router.navigate(['']);
  }
}
