import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRkmComponent } from './profile-rkm.component';

describe('ProfileRkmComponent', () => {
  let component: ProfileRkmComponent;
  let fixture: ComponentFixture<ProfileRkmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRkmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRkmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
