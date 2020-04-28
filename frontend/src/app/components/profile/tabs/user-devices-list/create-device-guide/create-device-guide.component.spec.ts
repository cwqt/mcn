import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDeviceGuideComponent } from './create-device-guide.component';

describe('CreateDeviceGuideComponent', () => {
  let component: CreateDeviceGuideComponent;
  let fixture: ComponentFixture<CreateDeviceGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDeviceGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDeviceGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
