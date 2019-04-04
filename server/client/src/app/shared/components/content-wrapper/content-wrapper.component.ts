import { Component, OnInit, Input, Injectable } from '@angular/core';

@Component({
  selector: 'content-wrapper',
  templateUrl: './content-wrapper.component.html',
  styleUrls: ['./content-wrapper.component.scss']
})
export class ContentWrapperComponent implements OnInit {

  constructor() { }
  @Input() loaderStore: LoaderStore;

  ngOnInit() {
    // Object.assign(this.loaderStore, new LoaderStore());
  }
}

@Injectable()
export class LoaderStore {
  items: { [key: string]: any } = {};
  start(key) {
    this.items[key] = { key: key };
  }

  stop(key) {
    delete this.items[key];
  }

  isLoading() {
    var isLoading = false;
    for (let key in this.items) {
      isLoading = true;
      break;
    }
    return isLoading;
  }
}