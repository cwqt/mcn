import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurementsGraphsComponent } from './measurements-graphs.component';

describe('MeasurementsGraphsComponent', () => {
  let component: MeasurementsGraphsComponent;
  let fixture: ComponentFixture<MeasurementsGraphsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurementsGraphsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurementsGraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
