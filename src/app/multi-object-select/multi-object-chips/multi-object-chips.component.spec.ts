import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiObjectSelectionChipComponent } from './multi-object-chips.component';
import { DebugElement } from '@angular/core';

describe('MultiObjectChipsComponent', () => {
  let component: MultiObjectSelectionChipComponent;
  let fixture: ComponentFixture<MultiObjectSelectionChipComponent>;
  let chipsContainer: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiObjectSelectionChipComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiObjectSelectionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    chipsContainer = new DebugElement(document.createElement("ul")); // Replace with your actual selector
  });

  it('ngOnInit::should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset active chip and emit focusSearch event on ngOnDestroy', () => {
    // Arrange
    spyOn(component, 'resetActiveChip');
    spyOn(component.focusSearch, 'emit');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component.resetActiveChip).toHaveBeenCalled();
    expect(component.focusSearch.emit).toHaveBeenCalled();
  });

  it('should reset active chip using resetActiveChip method', () => {
    // Arrange
    spyOn(component, 'resetActiveChip');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component.resetActiveChip).toHaveBeenCalled();
  });

  it('should emit focusSearch event', () => {
    // Arrange
    spyOn(component.focusSearch, 'emit');

    // Act
    component.ngOnDestroy();

    // Assert
    expect(component.focusSearch.emit).toHaveBeenCalled();
  });

  it('should reset active chip and emit focusSearch event when chipsContainer is clicked', () => {
    // Arrange
    spyOn(component, 'resetActiveChip');
    spyOn(component.focusSearch, 'emit');

    // Act
    const chipsContainer = fixture.nativeElement.querySelector('ul');
    chipsContainer.click();

    // Assert
    expect(component.resetActiveChip).toHaveBeenCalled();
    expect(component.focusSearch.emit).toHaveBeenCalled();
  });

  it('should activate the chip and emit onChipClick event', () => {
    // Arrange
    const chip = {
      dataUniqueFieldValue: 'someUniqueId', // Replace with actual data
      isActive: false,
    };

    spyOn(component.onChipClick, 'emit');

    // Act
    component.activateChip(chip);

    // Assert
    expect(chip.isActive).toBe(true);
    expect(component.onChipClick.emit).toHaveBeenCalledWith({ data: chip });
  });

  it('should deactivate other chips when activating a new chip', () => {
    // Arrange
    const existingChip = {
      dataUniqueFieldValue: 'existingUniqueId',
      isActive: true,
    };
    const newChip = {
      dataUniqueFieldValue: 'newUniqueId',
      isActive: false,
    };

    component.chipData = [existingChip, newChip];
    spyOn(component.onChipClick, 'emit');

    // Act
    component.activateChip(newChip);

    // Assert
    expect(existingChip.isActive).toBe(false);
    expect(newChip.isActive).toBe(true);
    expect(component.onChipClick.emit).toHaveBeenCalledWith({ data: newChip });
  });

  it('should open context menu and emit onChipContextMenu event', () => {
    // Arrange
    const eventMock: any = { preventDefault: jasmine.createSpy('preventDefault') };
    const chip = {
      dataUniqueFieldValue: 'someUniqueId', // Replace with actual data
      isActive: false,
    };

    spyOn(component.onChipContextMenu, 'emit');

    // Act
    component.openContextMenu(eventMock, chip);

    // Assert
    expect(eventMock.preventDefault).toHaveBeenCalled();
    expect(chip.isActive).toBe(true);
    expect(component.onChipContextMenu.emit).toHaveBeenCalledWith({ data: chip });
  });

  it('should remove chip and emit onChipRemove event', () => {
    // Arrange
    const chip = {
      dataUniqueFieldValue: 'someUniqueId', // Replace with actual data
      isActive: true,
    };

    spyOn(component.onChipRemove, 'emit');
    spyOn(component, 'resetActiveChip');

    // Act
    component.removeChip(chip);

    // Assert
    expect(component.onChipRemove.emit).toHaveBeenCalledWith({ data: chip });
    expect(component.resetActiveChip).toHaveBeenCalled();
  });

  it('should remove chip without resetting active chip', () => {
    // Arrange
    const chip = {
      dataUniqueFieldValue: 'someUniqueId', // Replace with actual data
      isActive: true,
    };

    spyOn(component.onChipRemove, 'emit');
    spyOn(component, 'resetActiveChip');

    // Act
    component.removeChip(chip, false);

    // Assert
    expect(component.onChipRemove.emit).toHaveBeenCalledWith({ data: chip });
    expect(component.resetActiveChip).not.toHaveBeenCalled();
  });


  // Listens to keyboard events and updates chipData accordingly
  it('should update chipData when ArrowRight is pressed', function () {
    component.chipData = [
      { isActive: true, dataUniqueFieldValue: '1' },
      { isActive: false, dataUniqueFieldValue: '2' },
      { isActive: false, dataUniqueFieldValue: '3' }
    ];
    component['_currentChipActiveIndex'] = 0;
    component['_isAnyChipActive'] = true;

    const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
    document.dispatchEvent(event);

    expect(component.chipData[0].isActive).toBe(false);
    expect(component.chipData[1].isActive).toBe(true);
    expect(component['_currentChipActiveIndex']).toBe(1);
  });

  it('should update chipData when ArrowLeft is pressed', function () {
    component.chipData = [
      { isActive: false, dataUniqueFieldValue: '1' },
      { isActive: true, dataUniqueFieldValue: '2' },
      { isActive: false, dataUniqueFieldValue: '3' }
    ];
    component['_currentChipActiveIndex'] = 1;
    component['_isAnyChipActive'] = true;

    const event = new KeyboardEvent('keydown', { code: 'ArrowLeft' });
    document.dispatchEvent(event);

    expect(component.chipData[0].isActive).toBe(true);
    expect(component.chipData[1].isActive).toBe(false);
    expect(component['_currentChipActiveIndex']).toBe(0);
  });

  // When the 'Enter', 'NumpadEnter', or 'Space' key is pressed, the 'onChipClick' EventEmitter is emitted with the data of the currently active chip.
  it('should emit onChipClick event when Enter, NumpadEnter, or Space key is pressed', function () {
    component.chipData = [
      { isActive: false, dataUniqueFieldValue: '1' },
      { isActive: true, dataUniqueFieldValue: '2' },
      { isActive: false, dataUniqueFieldValue: '3' }
    ];
    component['_currentChipActiveIndex'] = 1;
    component['_isAnyChipActive'] = true;

    spyOn<any>(component.onChipClick, "emit")
    const event = new KeyboardEvent('keydown', { code: 'Enter' });
    document.dispatchEvent(event);
    expect(component.onChipClick.emit).toHaveBeenCalled();
  });

  it('should handle Backspace key press and update active chip index', () => {
    // Arrange
    component.chipData = [
      { isActive: false },
      { isActive: true },
      { isActive: false },
      { isActive: false },
    ];
    component['_isAnyChipActive'] = true;
    component['_currentChipActiveIndex'] = 1;

    // Act
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backspace' }));

    // Assert
    expect(component['_currentChipActiveIndex']).toBe(0);
    expect(component.chipData[0].isActive).toBe(true);
  });

  it('should handle Backspace key press and set active chip index to the last chip', () => {
    // Arrange
    component.chipData = [
      { isActive: true },
      { isActive: false },
      { isActive: false },
    ];
    component['_isAnyChipActive'] = true;
    component['_currentChipActiveIndex'] = 0;

    // Act
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Backspace' }));

    // Assert
    expect(component['_currentChipActiveIndex']).toBe(0);
    expect(component.chipData[2].isActive).toBe(false);
  });

  it('should handle Delete key press', () => {
    // Arrange
    const removeChipSpy = spyOn(component, 'removeChip');
    component.chipData = [
      { isActive: true },
      { isActive: false },
      { isActive: false },
    ];
    component['_isAnyChipActive'] = true;
    component['_currentChipActiveIndex'] = 0;

    // Act
    document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Delete' }));

    // Assert
    expect(removeChipSpy).toHaveBeenCalledWith(component.chipData[0], false);
  });
});
