import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiObjectDropdownComponent } from './multi-object-dropdown.component';

describe('MultiObjectDropdownComponent', () => {
  let component: MultiObjectDropdownComponent;
  let fixture: ComponentFixture<MultiObjectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiObjectDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiObjectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
