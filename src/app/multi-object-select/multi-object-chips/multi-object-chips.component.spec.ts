import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiObjectSelectionChipComponent } from './multi-object-chips.component';

describe('MultiObjectChipsComponent', () => {
  let component: MultiObjectSelectionChipComponent;
  let fixture: ComponentFixture<MultiObjectSelectionChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiObjectSelectionChipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiObjectSelectionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
