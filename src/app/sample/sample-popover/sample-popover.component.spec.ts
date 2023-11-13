import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePopoverComponent } from './sample-popover.component';

describe('SamplePopoverComponent', () => {
  let component: SamplePopoverComponent;
  let fixture: ComponentFixture<SamplePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplePopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
