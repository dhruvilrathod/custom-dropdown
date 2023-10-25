import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiObjectSelectionComponent } from './multi-object-select.component';

describe('MultiObjectSelectionComponent', () => {
  let component: MultiObjectSelectionComponent;
  let fixture: ComponentFixture<MultiObjectSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiObjectSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiObjectSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
