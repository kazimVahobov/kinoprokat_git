import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.className = "skin-black-light sidebar-mini fixed";
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100%';
  }

}
