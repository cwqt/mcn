import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GardenItemComponent } from './garden-item.component';

describe('GardenItemComponent', () => {
  let component: GardenItemComponent;
  let fixture: ComponentFixture<GardenItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GardenItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GardenItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
