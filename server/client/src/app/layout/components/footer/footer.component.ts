import {Component, OnInit, AfterViewInit} from '@angular/core';
import {environment} from 'src/environments/environment';

declare var $;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {

  currentYear: number;
  version: string;

  constructor() {
  }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.version = environment.version;
  }

  ngAfterViewInit() {

    const Selector = {
      contentWrapper: '.content-wrapper',
      mainFooter: '.main-footer',
    };

    const ClassName = {
      fixed: 'fixed',
    };

    const footerHeight = $(Selector.mainFooter).outerHeight() || 0;
    const windowHeight = $(window).height();
    if ($('body').hasClass(ClassName.fixed)) {
      $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight);
    }
  }
}
