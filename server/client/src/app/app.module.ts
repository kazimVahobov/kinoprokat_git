import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {CoreModule, TokenInterceptor} from './core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgSelectModule} from '@ng-select/ng-select';
import {BsDropdownModule} from 'ngx-bootstrap';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    NgSelectModule,
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
