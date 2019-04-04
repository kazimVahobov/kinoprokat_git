import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconfirmedReportsComponent } from './unconfirmed-reports.component';

describe('UnconfirmedReportsComponent', () => {
  let component: UnconfirmedReportsComponent;
  let fixture: ComponentFixture<UnconfirmedReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnconfirmedReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnconfirmedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
