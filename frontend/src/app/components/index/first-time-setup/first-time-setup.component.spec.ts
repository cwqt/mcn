import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimeSetupComponent } from './first-time-setup.component';

describe('FirstTimeSetupComponent', () => {
  let component: FirstTimeSetupComponent;
  let fixture: ComponentFixture<FirstTimeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstTimeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTimeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
