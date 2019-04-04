import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTheaterComponent } from './profile-theater.component';

describe('ProfileTheaterComponent', () => {
  let component: ProfileTheaterComponent;
  let fixture: ComponentFixture<ProfileTheaterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileTheaterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileTheaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
