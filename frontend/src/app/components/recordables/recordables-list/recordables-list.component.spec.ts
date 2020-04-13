import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordablesListComponent } from './recordables-list.component';

describe('RecordablesListComponent', () => {
  let component: RecordablesListComponent;
  let fixture: ComponentFixture<RecordablesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordablesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordablesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
