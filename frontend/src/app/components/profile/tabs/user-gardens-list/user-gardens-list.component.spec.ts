import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGardensListComponent } from './user-gardens-list.component';

describe('UserGardensListComponent', () => {
  let component: UserGardensListComponent;
  let fixture: ComponentFixture<UserGardensListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGardensListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGardensListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
