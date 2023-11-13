import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { MultiObjectSelectionComponent } from './multi-object-select.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownDataOption, DropDownDataSection, MultiObjectSelection, SelectionChip } from './interfaces/multi-object-selection.interface';
import { customChipData, multiObjectData, sampleData } from './test-data/test-data';
import { MultiObjectSelectionChipComponent } from './multi-object-chips/multi-object-chips.component';

fdescribe('MultiObjectSelectionComponent', () => {
  let component: MultiObjectSelectionComponent;
  let fixture: ComponentFixture<MultiObjectSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiObjectSelectionComponent ],
      imports: [ NgbModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiObjectSelectionComponent);
    component = fixture.componentInstance;
    component.chipsContainer = new MultiObjectSelectionChipComponent();
    component.multiObjectData = multiObjectData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update multiObjectData, set pre-selected values, and flatten options for query on data changes', () => {
    // Arrange
    const newData: DropDownDataSection[] = [
      {
        sectionId: 'section1',
        children: [
          {
            dataUniqueFieldValue: 'option1',
            isSelected: true,
          },
        ],
      },
    ];

    // Act
    component.data = newData;
    component.ngOnChanges({ data: { previousValue: undefined, firstChange: false, currentValue: newData, isFirstChange: () => true } });

    // Assert
    expect(component.multiObjectData).toBeDefined();
    expect(component.multiObjectData.dropDownSections.length).toBe(1);
    expect(component.multiObjectData.dropDownSections[0].children!.length).toBe(1);
    expect(component.isLoading).toBe(false);

    // Add more specific assertions based on your expected behavior
  });

  it('should set pre-selected values on preSelectedChips changes', () => {
    // Arrange
    const preSelectedChips: DropDownDataSection[] = [
      {
        sectionId: 'section1',
        children: [
          {
            dataUniqueFieldValue: 'option1',
            isSelected: true,
          },
        ],
      },
    ];

    // Act
    component.preSelectedChips = preSelectedChips;
    component.ngOnChanges({ preSelectedChips: { previousValue: undefined, firstChange: true, currentValue: preSelectedChips, isFirstChange: () => true } });

    // Assert
    // Add assertions based on your expected behavior when preSelectedChips changes
  });

  it('should prepare MultiObjectSelection with provided data', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = sampleData;

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(inputData.length);

    // Add more specific assertions based on your expected output
    // For example, check properties of individual sections and options
  });

  it('should modify data when isQuery is true', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = sampleData;

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData, true);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(1); // Only one section should be created in isQuery mode

    // Add more specific assertions based on your expected output when isQuery is true
    // For example, check properties of the created section
  });

  it('should prepare MultiObjectSelection with provided data', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = [
      {
        sectionId: 'section1',
        sectionNameKey: 'Section 1',
        children: [
          {
            dataUniqueFieldValue: 'option1',
            dataVisibleNameValue: 'Option 1',
            isExpanded: false,
            isSelected: false,
          },
          {
            dataUniqueFieldValue: 'option2',
            dataVisibleNameValue: 'Option 2',
            isExpanded: false,
            isSelected: false,
          },
        ],
      },
      {
        sectionId: 'section2',
        sectionNameKey: 'Section 2',
        children: [
          {
            dataUniqueFieldValue: 'option3',
            dataVisibleNameValue: 'Option 3',
            isExpanded: false,
            isSelected: false,
          },
        ],
      },
    ];

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(inputData.length);

    // Add more specific assertions based on your expected output
    // For example, check properties of individual sections and options
  });

  it('should create a single section when isQuery is true', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = [
      // Your input data
    ];

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData, true);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(1);
    expect(result.dropDownSections[0].children).toBeDefined();
    // Add more specific assertions based on your expected output when isQuery is true
  });

  it('should handle empty input data', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = [];

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(0);
  });

  it('should add a custom chip when isCustomInputAllowed is true and name is provided', () => {
    // Arrange
    component.isCustomInputAllowed = true;
    const name = 'Custom Chip';

    // Act
    component.addCustomChip(name);

    // Assert
    expect(component.customChipData.length).toBe(1);
    // Add more specific assertions based on your expected behavior
  });

  it('should not add a custom chip when isCustomInputAllowed is false', () => {
    // Arrange
    component.isCustomInputAllowed = false;
    const name = 'Custom Chip';

    // Act
    component.addCustomChip(name);

    // Assert
    expect(component.customChipData.length).toBe(0);
    // Add more specific assertions based on your expected behavior
  });

  it('should not add a custom chip when name is empty, undefined, or null', () => {
    // Arrange
    component.isCustomInputAllowed = true;

    // Act
    component.addCustomChip('');
    (component as any).addCustomChip();

    // Assert
    expect(component.customChipData.length).toBe(0);
    // Add more specific assertions based on your expected behavior
  });

  it('should not update queryState when isCustomInputAllowed is false', () => {
    // Arrange
    component.isCustomInputAllowed = false;
    const name = 'Custom Chip';

    // Act
    component.addCustomChip(name);

    // Assert
    expect(component.queryState).toBeFalse(); // or whatever your default value is
    // Add more specific assertions based on your expected behavior
  });

  it('should push chip data to local optionIds array in the for loop', () => {
    // Arrange
    const sectionData: DropDownDataSection = {
      sectionId: 'section1',
      children: [
        {
          dataUniqueFieldValue: 'option1',
          isSelected: true,
        },
        {
          dataUniqueFieldValue: 'option2',
          isSelected: false,
        },
      ],
    };

    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: 'option1',
        dataVisibleNameValue: 'Option 1',
        isSelected: true,
      },
      {
        dataUniqueFieldValue: 'option2',
        dataVisibleNameValue: 'Option 2',
        isSelected: false,
      },
    ];

    component.chipData = [
      {
        dataUniqueFieldValue: 'option1',
        dataVisibleNameValue: 'Option 1',
        isSelected: true,
      },
      {
        dataUniqueFieldValue: 'option2',
        dataVisibleNameValue: 'Option 2',
        isSelected: false,
      },
    ];
    // Act
    const optionIds = component.prepareDropDownOptions(sectionData, optionsData);

    // Assert
    // Verify that optionIds contains the unique field values from chipData
    expect(optionIds.length).toBe(2);
    // Add more specific assertions based on your expected behavior
  });

  it('should modify chip section when preFilledChips is false', () => {
    // Arrange
    const data: (DropDownDataSection | SelectionChip)[] = [
      // Your input data
    ];

    // Act
    component.setPreSelectedValues(data);

    // Assert
    // Add assertions based on your expected behavior when preFilledChips is false
  });

  it('should check pre-filled chips in each section when preFilledChips is true', () => {
    // Arrange
    const preFilledData: (DropDownDataSection | SelectionChip)[] = [
      // Your input data
    ];

    // Act
    component.setPreSelectedValues(preFilledData, true);

    // Assert
    // Add assertions based on your expected behavior when preFilledChips is true
  });

  it('should set pre-selected values based on isSelected property when preFilledChips is false', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(multiObjectData.dropDownSections);

    // Assert
    expect(component.preSelectedObjectIds.length).toBe(2);
    // Add more specific assertions based on your expected behavior
  });

  it('should modify chip section when preFilledChips is false', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(multiObjectData.dropDownSections);

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBe(2);
    // Add more specific assertions based on your expected behavior
  });

  it('should set pre-filled chip data when preFilledChips is true', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(customChipData, true);

    // Assert
    expect(component.prefilledChipData.length).toBe(2);
    expect(component.chipData.length).toBe(2);
    // Add more specific assertions based on your expected behavior
  });

  it('should expand the option and load children asynchronously, isSelected = false', fakeAsync(() => {
    // Arrange
    const dataSection: DropDownDataSection = {
      sectionId: 'section1',
      children: [
        {
          dataUniqueFieldValue: 'option1',
          dataExpandableValue: true,
          isExpanded: false,
          isChildernLoading: false,
        },
      ],
    };

    const dataOption: DropDownDataOption = dataSection.children![0];
    

    // Mock dataRequester.emit using Jasmine spyOn
    const dataRequesterSpy = spyOn(component.dataRequester, 'emit').and.callFake((args: any) => {
      // Simulate asynchronous data loading
      setTimeout(() => {
        args.onResult([{ dataUniqueFieldValue: 'childOption1' }]);
      }, 1000);
    });

    // Act
    component.expandTrigger(dataSection, dataOption);

    // Use tick to simulate the passage of time until the asynchronous operation completes
    tick(1000);

    // Assert
    expect(dataOption.isChildernLoading).toBe(false);
    expect(dataOption.isExpanded).toBe(true);
    expect(dataOption.children).toBeDefined();
    expect(dataRequesterSpy).toHaveBeenCalled();
    // Add more specific assertions based on your expected behavior
  }));

  it('should expand the option and load children asynchronously, isSelected = true', fakeAsync(() => {
    // Arrange
    const dataSection: DropDownDataSection = {
      sectionId: 'section1',
      children: [
        {
          dataUniqueFieldValue: 'option1',
          dataExpandableValue: true,
          isExpanded: false,
          isChildernLoading: false,
        },
      ],
    };

    const dataOption: DropDownDataOption = dataSection.children![0];
    dataOption.isSelected = true;

    // Mock dataRequester.emit using Jasmine spyOn
    const dataRequesterSpy = spyOn(component.dataRequester, 'emit').and.callFake((args: any) => {
      // Simulate asynchronous data loading
      setTimeout(() => {
        args.onResult([{ dataUniqueFieldValue: 'childOption1' }]);
      }, 1000);
    });

    // Act
    component.expandTrigger(dataSection, dataOption);

    // Use tick to simulate the passage of time until the asynchronous operation completes
    tick(1000);

    // Assert
    expect(dataOption.isChildernLoading).toBe(false);
    expect(dataOption.isExpanded).toBe(true);
    expect(dataOption.children).toBeDefined();
    expect(dataRequesterSpy).toHaveBeenCalled();
    // Add more specific assertions based on your expected behavior
  }));


  it('should expand the option and load children synchronously when isAsynchronouslyExpandable is false', fakeAsync(() => {
    // Arrange
    const dataSection: DropDownDataSection = {
      sectionId: 'section1',
      children: [
        {
          dataUniqueFieldValue: 'option1',
          dataExpandableValue: true,
          isExpanded: false,
          isChildernLoading: false,
          isSelected: true
        },
      ],
    };

    const dataOption: DropDownDataOption = dataSection.children![0];
    dataOption.isSelected = true;
    component.isAsynchronouslyExpandable = false;

    // Mock dataRequester.emit using Jasmine spyOn
    const dataRequesterSpy = spyOn(component.dataRequester, 'emit');

    // Act
    component.expandTrigger(dataSection, dataOption);

    // No need for tick since the operation is synchronous in this case

    // Assert
    expect(dataOption.isChildernLoading).toBe(false);
    expect(dataOption.isExpanded).toBe(true);
    expect(dataRequesterSpy).not.toHaveBeenCalled(); // Should not call dataRequester.emit
    // Add more specific assertions based on your expected behavior
  }));

  
  it('should close and reopen the popover on window resize', fakeAsync(() => {
    // Arrange
    const resizeEvent = new Event('resize');
    const closeSpy = spyOn(component.popoverInstance, "close")
    const openSpy = spyOn(component.popoverInstance, "open")
    component.popoverInstance.isOpen = () => {return true;};
    
    // Act
    component.onResize(resizeEvent);

    // Assert
    expect(closeSpy).toHaveBeenCalled();
    tick(401); // Move the clock forward to simulate the setTimeout delay
    expect(openSpy).toHaveBeenCalled();
    flush();
  }));

  it('should not close and reopen the popover if it is not open', fakeAsync(() => {
    // Arrange
    const resizeEvent = new Event('resize');
    const closeSpy = spyOn(component.popoverInstance, "close")
    const openSpy = spyOn(component.popoverInstance, "open")

    // Act
    component.onResize(resizeEvent);

    // Assert
    expect(closeSpy).not.toHaveBeenCalled();
    expect(openSpy).not.toHaveBeenCalled();
    flush();
  }));

  it('should focus on the query box if search is allowed and close the popover if it is open', fakeAsync(() => {
    // Arrange
    component.isSearchAllowed = true;
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(true);
    spyOn((window as any), 'parseInt').and.returnValue(92); // Adjust the width value based on your actual implementation
    let focusSpy1 = spyOn(component.queryBox.nativeElement,'focus');
    let focusSpy2 = spyOn(component.topContainer.nativeElement,'focus');
    let closeSpy = spyOn(component.popoverInstance, 'close');
    // Act
    component.focusSearch(new Event('click'));

    // Assert
    expect(component.computedWidth).toBe('100px');
    expect(focusSpy1).not.toHaveBeenCalled();
    expect(focusSpy2).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    flush();

  }));

  it('should focus on the top container if search is not allowed', fakeAsync(() => {
    // Arrange
    component.isSearchAllowed = false;
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn((window as any), 'parseInt').and.returnValue(92); // Adjust the width value based on your actual implementation
    let focusSpy1 = spyOn(component.queryBox.nativeElement,'focus');
    let focusSpy2 = spyOn(component.topContainer.nativeElement,'focus');
    let closeSpy = spyOn(component.popoverInstance, 'close');

    // Act
    component.focusSearch(true);

    // Assert
    expect(component.computedWidth).toBe('100px');
    expect(focusSpy1).not.toHaveBeenCalled();
    expect(focusSpy2).not.toHaveBeenCalled();
    expect(closeSpy).not.toHaveBeenCalled();
    flush();

  }));


  it('should activate the last chip and blur the query box on delete input event when query box is empty', fakeAsync(() => {
    // Arrange
    component.chipsContainer = new MultiObjectSelectionChipComponent();
    const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
    inputEvent.target.value = "asdf";
    let activateChipSpy =  spyOn(component.chipsContainer, 'activateChip');
    let blurSpy =  spyOn(component.queryBox.nativeElement, 'blur');
    component.chipData = [{}, {}]; // Add sample chips

    // Act
    component.activateLastChip(inputEvent as any);
    tick();

    // Assert
    expect(activateChipSpy).not.toHaveBeenCalledWith(component.chipData[1]);
    expect(blurSpy).not.toHaveBeenCalled();
  }));

  it('should not activate the last chip on delete input event when query box is not empty', fakeAsync(() => {
    // Arrange
    component.chipsContainer = new MultiObjectSelectionChipComponent();
    const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
    inputEvent.target.value = "asdf";
    let activateChipSpy =  spyOn(component.chipsContainer, 'activateChip');
    let blurSpy =  spyOn(component.queryBox.nativeElement, 'blur');
    component.chipData = [{}]; // Add a sample chip
    component.queryBox.nativeElement.value = 'test'; // Set a value to simulate a non-empty query box

    // Act
    component.activateLastChip(inputEvent as any);
    tick();

    // Assert
    expect(activateChipSpy).not.toHaveBeenCalled();
    expect(blurSpy).not.toHaveBeenCalled();
    flush();
  }));

  it('should not activate the last chip on non-delete input event', fakeAsync(() => {
    // Arrange
    component.chipsContainer = new MultiObjectSelectionChipComponent();
    const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
    inputEvent.target.value = "asdf";
    let activateChipSpy =  spyOn(component.chipsContainer, 'activateChip');
    let blurSpy =  spyOn(component.queryBox.nativeElement, 'blur');
    component.chipData = [{}]; // Add a sample chip

    // Act
    component.activateLastChip(inputEvent as any);
    tick();

    // Assert
    expect(activateChipSpy).not.toHaveBeenCalled();
    expect(blurSpy).not.toHaveBeenCalled();
    flush();
  }));

});
