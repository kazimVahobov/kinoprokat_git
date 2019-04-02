import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorReportFormComponent } from './distributor-report-form.component';

describe('DistributorReportFormComponent', () => {
  let component: DistributorReportFormComponent;
  let fixture: ComponentFixture<DistributorReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
