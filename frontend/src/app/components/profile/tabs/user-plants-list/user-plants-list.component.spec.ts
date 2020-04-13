import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlantsListComponent } from './user-plants-list.component';

describe('UserPlantsListComponent', () => {
  let component: UserPlantsListComponent;
  let fixture: ComponentFixture<UserPlantsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPlantsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
