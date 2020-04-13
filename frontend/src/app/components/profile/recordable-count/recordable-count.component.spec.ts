import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordableCountComponent } from './recordable-count.component';

describe('RecordableCountComponent', () => {
  let component: RecordableCountComponent;
  let fixture: ComponentFixture<RecordableCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordableCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordableCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
