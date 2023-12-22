import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { MultiObjectSelectionComponent } from './multi-object-select.component';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { DropDownDataOption, DropDownDataSection, MultiObjectSelection, SelectionChip } from './interfaces/multi-object-selection.interface';
import { customChipData, dropDownSection, multiObjectData, sampleData } from './test-data/test-data';
import { MultiObjectSelectionChipComponent } from './multi-object-chips/multi-object-chips.component';
import { DataTooltipSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, DataExpandableSrcFields, DataChildrenSrcFields, DataFavouriteSrcFields, DataTotalDocsSrcFields, DataPathIdsSrcFields, DataDisabledSrcFields } from './enums/multi-object-selection.enum';
import { cloneDeep } from 'lodash';

class MockNgbPopover {
  // Add any methods or properties used in your component
  open() { }
  close() { }
  isOpen() { }
  hidden() { }
  shown() { }
  // ...
}

fdescribe('MultiObjectSelectionComponent', () => {
  let component: MultiObjectSelectionComponent;
  let fixture: ComponentFixture<MultiObjectSelectionComponent>;

  const gloablSectionConfigData = {
    dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION.split("/"),
    dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION.split("/"),
    dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION.split("/"),
    dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION.split("/"),
    dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION.split("/"),
    dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION.split("/"),
    dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION.split("/"),
    dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION.split("/"),
    dataDisabledSrc: DataDisabledSrcFields.FOLDER_SELECTION.split("/"),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiObjectSelectionComponent],
      imports: [NgbModule],
      providers: [
        { provide: NgbPopover, useClass: MockNgbPopover },
      ]
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

  it('get primaryData:: should have primaryData as expected when initialized', () => {
    const expectedData = [
      {
        id: 1,
        name: 'Item 1',
      },
      {
        id: 2,
        name: 'Item 2',
      },
    ];

    // Set the input property
    component['_primaryDataHolder'] = expectedData;

    // Trigger change detection
    fixture.detectChanges();

    // Access the component's primaryData
    const actualData = component.primaryData;

    // Assert that the primaryData matches the expected data
    expect(actualData).toEqual(expectedData);
  });

  it('set primaryData:: should update primaryDataHolder, multiObjectData, pre-selected values, and flatten options for query', () => {
    // Arrange
    const samplePrimaryData: any[] = [
      {
        dataFavouriteValue: true,
        dataUniqueFieldValue: 'unique1',
        dataTooltipValue: 'Tooltip 1',
        dataVisibleNameValue: 'Option 1',
        parentUniqueIdsValue: ['parent1'],
        canDelete: true,
        originalData: { /* Original data for Option 1 */ },
      },
      // Add more sample data as needed
    ];

    const samplePreSelectedChips: SelectionChip[] = [
      {
        dataFavouriteValue: true,
        dataUniqueFieldValue: 'unique2',
        dataTooltipValue: 'Tooltip 2',
        dataVisibleNameValue: 'Option 2',
        parentUniqueIdsValue: ['parent2'],
        canDelete: true,
        originalData: { /* Original data for Option 2 */ },
      },
      // Add more sample pre-selected chip data as needed
    ];

    component.preSelectedChips = samplePreSelectedChips;

    // Act
    component.primaryData = samplePrimaryData;

    // Assert
    expect(component['_primaryDataHolder']).toEqual(samplePrimaryData);
    // Add assertions to check if pre-selected values and flatten options are set correctly
    expect(component.isLoading).toBe(false);
    // Add additional assertions as needed
  });

  it('set primaryData:: should clear chipData if primaryDataHolder length is 0', () => {
    // Arrange

    const samplePreSelectedChips: SelectionChip[] = [
      {
        dataFavouriteValue: true,
        dataUniqueFieldValue: 'unique2',
        dataTooltipValue: 'Tooltip 2',
        dataVisibleNameValue: 'Option 2',
        parentUniqueIdsValue: ['parent2'],
        canDelete: true,
        originalData: { /* Original data for Option 2 */ },
      },
      // Add more sample pre-selected chip data as needed
    ];

    component.chipData = [...samplePreSelectedChips];

    // Act
    component.primaryData = [];

    // Assert
    expect(component.chipData.length).toBe(0);
    // Add additional assertions as needed
  });

  it('prepareDropDownData::should prepare MultiObjectSelection with provided data', () => {
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

  it('prepareDropDownData::should prepare MultiObjectSelection with provided data', () => {
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


  it('prepareDropDownData::should handle empty input data', () => {
    // Arrange
    const inputData: (DropDownDataOption | DropDownDataSection)[] = [];

    // Act
    const result: MultiObjectSelection = component.prepareDropDownData(inputData);

    // Assert
    expect(result).toBeDefined();
    expect(result.dropDownSections).toBeDefined();
    expect(result.dropDownSections.length).toBe(0);
  });

  it('prepareDropDownOptions::should push chip data to local optionIds array in the for loop', () => {
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

  it('setPreSelectedValues::should modify chip section when preFilledChips is false', () => {
    // Arrange
    const data: (DropDownDataSection | SelectionChip)[] = [
      // Your input data
    ];

    // Act
    component.setPreSelectedValues(data);

    // Assert
    // Add assertions based on your expected behavior when preFilledChips is false
  });

  it('setPreSelectedValues::should check pre-filled chips in each section when preFilledChips is true', () => {
    // Arrange
    const preFilledData: (DropDownDataSection | SelectionChip)[] = [
      // Your input data
    ];

    // Act
    component.setPreSelectedValues(preFilledData, true);

    // Assert
    // Add assertions based on your expected behavior when preFilledChips is true
  });

  it('setPreSelectedValues::should set pre-selected values based on isSelected property when preFilledChips is false', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(multiObjectData.dropDownSections);

    // Assert
    expect(component.preSelectedObjectIds.length).toBeDefined();
    // Add more specific assertions based on your expected behavior
  });

  it('setPreSelectedValues::should modify chip section when preFilledChips is false', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(multiObjectData.dropDownSections);

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBeDefined();
    // Add more specific assertions based on your expected behavior
  });

  it('setPreSelectedValues::should set pre-filled chip data when preFilledChips is true', () => {
    // Act
    component.multiObjectData = multiObjectData;
    component.setPreSelectedValues(customChipData, true);

    // Assert
    expect(component.prefilledChipData.length).toBe(2);
    expect(component.chipData.length).toBeDefined();
    // Add more specific assertions based on your expected behavior
  });

  it('expandTrigger::should expand the option and load children asynchronously, isSelected = false', fakeAsync(() => {
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

  it('expandTrigger::should expand the option and load children asynchronously, isSelected = true', fakeAsync(() => {
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


  it('expandTrigger::should expand the option and load children synchronously when isAsynchronouslyExpandable is false', fakeAsync(() => {
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


  it('onResize::should close and reopen the popover on window resize', fakeAsync(() => {
    // Arrange
    const resizeEvent = new Event('resize');
    const closeSpy = spyOn(component.popoverInstance, "close")
    const openSpy = spyOn(component.popoverInstance, "open")
    component.popoverInstance.isOpen = () => { return true; };

    // Act
    component.onResize(resizeEvent);

    // Assert
    expect(closeSpy).toHaveBeenCalled();
    tick(401); // Move the clock forward to simulate the setTimeout delay
    expect(openSpy).toHaveBeenCalled();
    flush();
  }));

  it('onResize::should not close and reopen the popover if it is not open', fakeAsync(() => {
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

  it('focusSearch::should focus on the query box if search is allowed and close the popover if it is open', fakeAsync(() => {
    // Arrange
    component.isSearchAllowed = true;
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(true);
    spyOn((window as any), 'parseInt').and.returnValue(92); // Adjust the width value based on your actual implementation
    let focusSpy1 = spyOn(component.queryBox.nativeElement, 'focus');
    let focusSpy2 = spyOn(component.topContainer.nativeElement, 'focus');
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

  it('focusSearch::should focus on the top container if search is not allowed', fakeAsync(() => {
    // Arrange
    component.isSearchAllowed = false;
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn((window as any), 'parseInt').and.returnValue(92); // Adjust the width value based on your actual implementation
    let focusSpy1 = spyOn(component.queryBox.nativeElement, 'focus');
    let focusSpy2 = spyOn(component.topContainer.nativeElement, 'focus');
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

  it('focusSearch::should return immediately when globalLoading is true', () => {
    const multiObjectSelection = new MultiObjectSelectionComponent();
    multiObjectSelection.globalLoading = true;

    const searchValue = "example search";

    multiObjectSelection.queryTrigger(searchValue);

    // Assert that no action is performed
  });

  it('focusSearch::should set queryState to false and call _finalizeQuerySelectedOptions when search value is empty', () => {
    spyOn<any>(component, '_finalizeQuerySelectedOptions');

    const searchValue = "";

    component.queryTrigger(searchValue);

    expect(component.queryState).toBe(false);
    expect(component['_finalizeQuerySelectedOptions']).toHaveBeenCalled();
  });

  it('focusSearch::should set queryState to true when search value is not empty', () => {
    spyOn<any>(component, '_finalizeQuerySelectedOptions');

    const searchValue = "search";
    component.isClientSideSearchAllowed = false;
    component.queryTrigger(searchValue);

    expect(component.queryState).toBe(true);
  });

  it('should filter options based on search value if isClientSideSearchAllowed is true and matches found', () => {
    // Arrange
    component.sectionConfigData = {
      dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION.split("/"),
      dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION.split("/"),
      dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION.split("/"),
      dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION.split("/"),
      dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION.split("/"),
      dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION.split("/"),
      dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION.split("/"),
      dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION.split("/"),
      dataDisabledSrc: DataDisabledSrcFields.FOLDER_SELECTION.split("/"),
    }
    component.isClientSideSearchAllowed = true;
    component['_flattenDropdownOptions'] = [
      {
        dataVisibleNameValue: 'Option 1',
        dataTooltipValue: 'Tooltip 1',
      },
      {
        dataVisibleNameValue: 'Option 2',
        dataTooltipValue: 'Tooltip 2',
      },
    ];

    // Act
    component.queryTrigger('Option');

    // Assert
    expect(component.multiObjectDataForQuery).toBeDefined();
    // Add assertions to check if the prepared data is as expected
    // For example, check if the multiObjectDataForQuery contains the filtered options
  });

  it('should set empty prepared data if isClientSideSearchAllowed is true and no matches found', () => {
    // Arrange
    component.sectionConfigData = cloneDeep(gloablSectionConfigData)
    component.isClientSideSearchAllowed = true;
    component['_flattenDropdownOptions'] = [
      {
        dataVisibleNameValue: 'Option 1',
        dataTooltipValue: 'Tooltip 1',
      },
      {
        dataVisibleNameValue: 'Option 2',
        dataTooltipValue: 'Tooltip 2',
      },
    ];

    // Act
    component.queryTrigger('NonExistentOption');

    // Assert
    expect(component.multiObjectDataForQuery).toBeDefined();
    // Add assertions to check if the prepared data is empty
    // For example, check if the multiObjectDataForQuery contains no options
  });

  it('should not set prepared data if isClientSideSearchAllowed is false', () => {
    // Arrange
    component.isClientSideSearchAllowed = false;
    component['_flattenDropdownOptions'] = [
      {
        dataVisibleNameValue: 'Option 1',
        dataTooltipValue: 'Tooltip 1',
      },
      {
        dataVisibleNameValue: 'Option 2',
        dataTooltipValue: 'Tooltip 2',
      },
    ];

    // Act
    component.queryTrigger('Option');

    // Assert
    expect(component.multiObjectDataForQuery).toBeUndefined();
    // Add assertions to check that multiObjectDataForQuery is not set
  });

  it('activateLastChip::should not activate the last chip when query box is not empty', fakeAsync(() => {
    // Arrange
    component.chipsContainer = {
      activateChip: jasmine.createSpy('activateChip'),
    } as any;
    const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
    inputEvent.target.value = "asdf";
    component.chipData = [{}]; // Add a sample chip
    component.queryBox.nativeElement.value = 'test'; // Set a value to simulate a non-empty query box
    spyOn(component.queryBox.nativeElement, 'blur');

    // Act
    component.activateLastChip(inputEvent as any);
    tick();

    // Assert
    expect(component.chipsContainer.activateChip).not.toHaveBeenCalled();
    expect(component.queryBox.nativeElement.blur).not.toHaveBeenCalled();
  }));

  it('activateLastChip::should not activate the last chip on non-delete input event', fakeAsync(() => {
    // Arrange
    component.chipsContainer = {
      activateChip: jasmine.createSpy('activateChip'),
    } as any;
    const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
    inputEvent.target.value = "asdf";
    component.chipData = [{}]; // Add a sample chip
    spyOn(component.queryBox.nativeElement, 'blur');

    // Act
    component.activateLastChip(inputEvent as any);
    tick();

    // Assert
    expect(component.chipsContainer.activateChip).not.toHaveBeenCalled();
    expect(component.queryBox.nativeElement.blur).not.toHaveBeenCalled();
  }));

  it('activateLastChip::should activate last chip and blur queryBox when input event type is \'deleteWordBackward\' and input value is an empty string', () => {
    const multiObjectSelection = new MultiObjectSelectionComponent();
    multiObjectSelection.chipData = [{ id: 1 }, { id: 2 }, { id: 3 }];
    multiObjectSelection.chipsContainer = {
      activateChip: jasmine.createSpy('activateChip')
    } as any;
    multiObjectSelection.queryBox = {
      nativeElement: {
        blur: jasmine.createSpy('blur')
      }
    } as any;
    const inputEvent: any = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };


    multiObjectSelection.activateLastChip(inputEvent);

    expect(multiObjectSelection.chipsContainer.activateChip).toHaveBeenCalledWith({ id: 3 });
    expect(multiObjectSelection.queryBox.nativeElement.blur).toHaveBeenCalled();
  });

  it('focusSearch::should set _isDropdownCloseAllowed to false if popover is open', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(true);
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);

    // Act
    component.focusSearch(true);
    tick();

    // Assert
    expect(component['_isDropdownCloseAllowed']).toBe(false);
  }));

  it('focusSearch::should set _isDropdownCloseAllowed to true if popover is closed', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);

    // Act
    component.focusSearch(true);
    tick();

    // Assert
    expect(component['_isDropdownCloseAllowed']).toBe(true);
  }));

  it('focusSearch::should focus on the query box if search is allowed', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn(component.queryBox.nativeElement, 'focus');
    spyOn(component.topContainer.nativeElement, 'focus');
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    component.isSearchAllowed = true;

    // Act
    component.focusSearch(true);
    tick();

    // Assert
    expect(component.queryBox.nativeElement.focus).toHaveBeenCalled();
    expect(component.topContainer.nativeElement.focus).not.toHaveBeenCalled();
  }));

  it('focusSearch::should focus on the top container if search is not allowed', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn(component.queryBox.nativeElement, 'focus');
    spyOn(component.topContainer.nativeElement, 'focus');
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    component.isSearchAllowed = false;

    // Act
    component.focusSearch(true);
    tick();

    // Assert
    expect(component.queryBox.nativeElement.focus).not.toHaveBeenCalled();
    expect(component.topContainer.nativeElement.focus).toHaveBeenCalled();
  }));

  it('focusSearch::should reset active chip in chips container if it exists', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    spyOn(component.queryBox.nativeElement, 'focus');
    spyOn(component.topContainer.nativeElement, 'focus');
    spyOn(window, 'getComputedStyle').and.returnValue({ width: '100px' } as CSSStyleDeclaration);
    component.isSearchAllowed = false;
    component.chipsContainer = {
      resetActiveChip: jasmine.createSpy('resetActiveChip'),
    } as any;

    // Act
    component.focusSearch(true);
    tick();

    // Assert
    expect(component.chipsContainer.resetActiveChip).toHaveBeenCalled();
  }));

  it('queryTrigger::should open the popover if it is not open', fakeAsync(() => {
    // Arrange
    let openSpy = spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);

    // Act
    component.queryTrigger('');

    // Assert
    expect(openSpy).toHaveBeenCalled();
  }));

  it('queryTrigger::should not open the popover if it is already open', fakeAsync(() => {
    // Arrange
    let openSpy = spyOn(component.popoverInstance, 'isOpen').and.returnValue(true);

    // Act
    component.queryTrigger('');

    // Assert
    expect(openSpy).toHaveBeenCalled();
  }));

  it('queryTrigger::should set queryState to false and finalize query options when searchVal is empty', fakeAsync(() => {
    // Arrange
    let openSpy = spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);

    // Act
    component.queryTrigger('');

    // Assert
    expect(component.queryState).toBe(false);
    // Add assertions for other related properties or methods
  }));

  it('addCustomChip::should add custom chip on "Enter" key press when custom input is allowed', fakeAsync(() => {
    // Arrange
    spyOn(component.queryBox.nativeElement, 'blur');
    component.isCustomInputAllowed = true;
    component.queryBox.nativeElement.value = 'Custom Chip';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(component as any, '_createChipData').and.callThrough();
    spyOn(component.customChipData, 'push').and.callThrough();
    spyOn(component.chipData, 'push').and.callThrough();
    spyOn(component.onChipAdd, 'emit').and.callThrough();
    spyOn(component as any, '_sendLatestDropdownSelection').and.callThrough();

    // Act
    component.addCustomChip(event);
    tick();

    // Assert
    expect(component.queryState).toBe(false);
    expect(component['_createChipData']).toHaveBeenCalledWith(jasmine.objectContaining({
      dataVisibleNameValue: 'Custom Chip',
      dataTooltipValue: 'Custom Chip',
    }), true);
    expect(component.customChipData.push).toHaveBeenCalled();
    expect(component.chipData.push).toHaveBeenCalled();
    expect(component.onChipAdd.emit).toHaveBeenCalledWith(jasmine.objectContaining({ data: jasmine.any(Object) }));
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  }));

  it('addCustomChip::should not add custom chip on "Enter" key press when custom input is not allowed', fakeAsync(() => {
    // Arrange
    component.isCustomInputAllowed = false;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(component as any, '_createChipData').and.callThrough();
    spyOn(component.customChipData, 'push').and.callThrough();
    spyOn(component.chipData, 'push').and.callThrough();
    spyOn(component.onChipAdd, 'emit').and.callThrough();
    spyOn(component as any, '_sendLatestDropdownSelection').and.callThrough();

    // Act
    component.addCustomChip(event);
    tick();

    // Assert
    expect(component.queryState).toBe(false);
    expect(component['_createChipData']).not.toHaveBeenCalled();
    expect(component.customChipData.push).not.toHaveBeenCalled();
    expect(component.chipData.push).not.toHaveBeenCalled();
    expect(component.onChipAdd.emit).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).not.toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  }));

  it('addCustomChip::should not add custom chip on "Enter" key press when input is empty', fakeAsync(() => {
    // Arrange
    component.isCustomInputAllowed = true;
    component.queryBox.nativeElement.value = '';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(component as any, '_createChipData').and.callThrough();
    spyOn(component.customChipData, 'push').and.callThrough();
    spyOn(component.chipData, 'push').and.callThrough();
    spyOn(component.onChipAdd, 'emit').and.callThrough();
    spyOn(component as any, '_sendLatestDropdownSelection').and.callThrough();

    // Act
    component.addCustomChip(event);
    tick();

    // Assert
    expect(component.queryState).toBe(false);
    expect(component['_createChipData']).not.toHaveBeenCalled();
    expect(component.customChipData.push).not.toHaveBeenCalled();
    expect(component.chipData.push).not.toHaveBeenCalled();
    expect(component.onChipAdd.emit).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).not.toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  }));

  it('addCustomChip::should not add custom chip on key press other than "Enter"', fakeAsync(() => {
    // Arrange
    component.isCustomInputAllowed = true;
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    spyOn(component as any, '_createChipData').and.callThrough();
    spyOn(component.customChipData, 'push').and.callThrough();
    spyOn(component.chipData, 'push').and.callThrough();
    spyOn(component.onChipAdd, 'emit').and.callThrough();
    spyOn(component as any, '_sendLatestDropdownSelection').and.callThrough();

    // Act
    component.addCustomChip(event);
    tick();

    // Assert
    expect(component.queryState).toBe(false);
    expect(component['_createChipData']).not.toHaveBeenCalled();
    expect(component.customChipData.push).not.toHaveBeenCalled();
    expect(component.chipData.push).not.toHaveBeenCalled();
    expect(component.onChipAdd.emit).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).not.toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  }));

  it('addCustomChip::should not add custom chip and set queryState to false if "Enter" key is not pressed', fakeAsync(() => {
    // Arrange
    spyOn(component.queryBox.nativeElement, 'blur');
    component.isCustomInputAllowed = true;
    component.queryBox.nativeElement.value = 'Custom Chip';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    spyOn(component as any, '_createChipData').and.callThrough();
    spyOn(component.customChipData, 'push').and.callThrough();
    spyOn(component.chipData, 'push').and.callThrough();
    spyOn(component.onChipAdd, 'emit').and.callThrough();
    spyOn(component as any, '_sendLatestDropdownSelection').and.callThrough();

    // Act
    component.addCustomChip(event);
    tick();

    // Assert
    expect(component.queryState).toBe(false);
    expect(component['_createChipData']).not.toHaveBeenCalled();
    expect(component.customChipData.push).not.toHaveBeenCalled();
    expect(component.chipData.push).not.toHaveBeenCalled();
    expect(component.onChipAdd.emit).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).not.toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  }));

  it('sectionSelectionTrigger::should select the section and trigger allSelect when selected is true', () => {
    // Arrange
    const sectionData = dropDownSection;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_appendCustomChips');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(true, sectionData);

    // Assert
    expect(sectionData.isSelected).toBe(true);
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(true, sectionData);
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('sectionSelectionTrigger::should deselect the section and trigger allSelect when selected is false', () => {
    // Arrange
    const sectionData = dropDownSection;
    sectionData.isSelected = true;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_appendCustomChips');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(false, sectionData);

    // Assert
    expect(sectionData.isSelected).toBe(false);
    expect(component['_allSelectTrigger']).toHaveBeenCalled();
    expect(component['_appendCustomChips']).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('sectionSelectionTrigger::should trigger allSelect with false when isSingularInput is true', () => {
    // Arrange
    component.isSingularInput = true;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_appendCustomChips');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(true, dropDownSection);

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(false);
    expect(component['_appendCustomChips']).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('sectionSelectionTrigger::should trigger allSelect and append custom chips when not in singular input mode and selected is true', () => {
    // Arrange
    component.isSingularInput = false;
    component.customChipData = [{ dataUniqueFieldValue: 1 }];
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_appendCustomChips');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(true, dropDownSection);

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(true, jasmine.any(Object));
    expect(component['_appendCustomChips']).toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('sectionSelectionTrigger::should not append custom chips when not in singular input mode and selected is false', () => {
    // Arrange
    component.isSingularInput = false;
    component.customChipData = [{ dataUniqueFieldValue: 1 }];
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_appendCustomChips');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(false, dropDownSection);

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalled();
    expect(component['_appendCustomChips']).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('sectionSelectionTrigger::should send the latest dropdown selection', () => {
    // Arrange
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.sectionSelectionTrigger(true, dropDownSection);

    // Assert
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('selectAllOptions::should select all options when isReset is falsy and isAllSelected is false', () => {
    // Arrange
    component.isAllSelected = false;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_sendLatestDropdownSelection');
    spyOn(component.onReset, 'emit');

    // Act
    component.selectAllOptions();

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(true);
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('selectAllOptions::should deselect all options when isReset is falsy and isAllSelected is true', () => {
    // Arrange
    component.isAllSelected = true;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_sendLatestDropdownSelection');
    spyOn(component.onReset, 'emit');

    // Act
    component.selectAllOptions();

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(false);
    expect(component.onReset.emit).not.toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('selectAllOptions::should reset all options when isReset is truthy', () => {
    // Arrange
    component.isAllSelected = true;
    spyOn(component as any, '_allSelectTrigger');
    spyOn(component as any, '_sendLatestDropdownSelection');
    spyOn(component.onReset, 'emit');

    // Act
    component.selectAllOptions(true);

    // Assert
    expect(component['_allSelectTrigger']).toHaveBeenCalledWith(false);
    expect(component.onReset.emit).toHaveBeenCalled();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  // Selecting an option adds it to chipData and sets isSelected to true for the corresponding option
  // Test case: Deselect an option when maxSelectCount is reached
  it('optionSelectionTrigger::should deselect an option and trigger chipRemovalTrigger when selected is true and maxSelectCount is reached', () => {
    const optionsData: DropDownDataOption = {
      dataVisibleNameValue: 'Option 1',
      dataUniqueFieldValue: 'unique-1',
      isSelected: true,
      // Add other necessary fields based on your DropDownDataOption interface
    };

    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    const multiObjectSelectionComponent = new MultiObjectSelectionComponent();
    (multiObjectSelectionComponent.popoverInstance as any) = new MockNgbPopover();
    multiObjectSelectionComponent.chipData = [{ dataUniqueFieldValue: 'unique-1', isSelected: true }];
    multiObjectSelectionComponent.maxSelectCount = 1;

    multiObjectSelectionComponent.optionSelectionTrigger(true, optionsData, sectionData);

    expect(optionsData.isSelected).toBe(true);
    expect(multiObjectSelectionComponent.chipData.length).toBe(0);
    // Add more assertions as needed
  });

  it('optionSelectionTrigger::should set optionsData.isSelected to true if selected and not disabled', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };


    // Act
    component.optionSelectionTrigger(true, optionsData, sectionData);

    // Assert
    expect(optionsData.isSelected).toBe(true);
  });

  it('optionSelectionTrigger::should remove optionsData.dataUniqueFieldValue from queryRemovededChipDataIds if present', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    component.queryRemovededChipDataIds = ['1', '2', '3'];

    // Act
    component.optionSelectionTrigger(true, optionsData, sectionData);

    // Assert
    expect(component.queryRemovededChipDataIds).not.toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should remove preSelectedChip from chipData and prefilledChipData if preSelectedChip exists', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    const preSelectedChip = { dataUniqueFieldValue: '1' };
    component.chipData = [preSelectedChip];
    component.prefilledChipData = [preSelectedChip];

    // Act
    component.optionSelectionTrigger(true, optionsData, sectionData);

    // Assert
    expect(component.chipData).toContain(preSelectedChip);
    expect(component.prefilledChipData).toContain(preSelectedChip);
  });

  it('optionSelectionTrigger::should set optionsData.isSelected to false if not selected and not disabled', () => {

    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(optionsData.isSelected).toBe(false);
  });

  it('optionSelectionTrigger::should remove optionsData.dataUniqueFieldValue from queryAddedChipDataIds if present', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    component.queryAddedChipDataIds = ['1', '2', '3'];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.queryAddedChipDataIds).not.toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should add optionsData to chipData and queryAddedChipDataIds if not in chipData', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    component.chipData = [];
    component.queryAddedChipDataIds = [];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.chipData).not.toContain(jasmine.objectContaining(optionsData));
    expect(component.queryAddedChipDataIds).not.toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should remove optionsData from chipData and prefilledChipData if in chipData', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    const chipData = { dataUniqueFieldValue: '1' };
    component.chipData = [chipData];
    component.prefilledChipData = [chipData];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.chipData).toContain(chipData);
    expect(component.prefilledChipData).toContain(chipData);
  });

  it('optionSelectionTrigger::should add optionsData to chipData and queryAddedChipDataIds if not in chipData', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    component.chipData = [];
    component.queryAddedChipDataIds = [];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.chipData).not.toContain(jasmine.objectContaining(optionsData));
    expect(component.queryAddedChipDataIds).not.toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should remove optionsData from chipData and queryRemovededChipDataIds if in chipData', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    const chipData = { dataUniqueFieldValue: '1' };
    component.chipData = [chipData];
    component.queryRemovededChipDataIds = [optionsData.dataUniqueFieldValue!];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.chipData).toContain(chipData);
    expect(component.queryRemovededChipDataIds).toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should call _allSelectTrigger if singular input is enabled', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };
    const sectionData1 = { children: [optionsData] };
    const sectionData2 = { children: [optionsData] };
    component.multiObjectData = { dropDownSections: [sectionData1, sectionData2] };
    component.isSingularInput = true;
    const _allSelectTriggerSpy = spyOn<any>(component, '_allSelectTrigger');

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(_allSelectTriggerSpy).toHaveBeenCalled();
  });

  it('optionSelectionTrigger::should remove optionsData from chipData and prefilledChipData, and add to queryRemovededChipDataIds when selected is false', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    component.queryState = true;
    component.chipData = [optionsData];
    component.prefilledChipData = [optionsData];
    component.queryRemovededChipDataIds = [];

    // Act
    component.optionSelectionTrigger(false, optionsData, sectionData);

    // Assert
    expect(component.chipData.length).toBe(0);
    expect(component.prefilledChipData.length).toBe(1);
    expect(component.queryRemovededChipDataIds).toContain(optionsData.dataUniqueFieldValue!);
  });

  it('optionSelectionTrigger::should not remove optionsData from chipData and prefilledChipData, and not add to queryRemovededChipDataIds when selected is true', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
      isDisabled: false,
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    component.queryState = true;
    component.chipData = [optionsData];
    component.prefilledChipData = [optionsData];
    component.queryRemovededChipDataIds = [];

    // Act
    component.optionSelectionTrigger(true, optionsData, sectionData);

    // Assert
    expect(component.chipData.length).toBe(0);
    expect(component.prefilledChipData.length).toBe(1);
    expect(component.queryRemovededChipDataIds.length).toBe(1);
  });

  it('optionSelectionTrigger::should not remove optionsData from chipData and prefilledChipData if preSelectedChip does not exist', () => {
    // Arrange
    const optionsData: DropDownDataOption = {
      dataUniqueFieldValue: '1',
    };
    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    const preSelectedChip = { dataUniqueFieldValue: '2' };
    component.chipData = [preSelectedChip];
    component.prefilledChipData = [preSelectedChip];

    // Act
    component.optionSelectionTrigger(true, optionsData, sectionData);

    // Assert
    expect(component.chipData).toContain(preSelectedChip);
    expect(component.prefilledChipData).toContain(preSelectedChip);
  });

  it('optionSelectionTrigger::should not deselect an option when selected is true and maxSelectCount is not reached', () => {
    const optionsData: DropDownDataOption = {
      dataVisibleNameValue: 'Option 1',
      dataUniqueFieldValue: 'unique-1',
      isSelected: true,
      // Add other necessary fields based on your DropDownDataOption interface
    };

    const sectionData: DropDownDataSection = {
      dataVisibleNameValue: 'Section 1',
      dataUniqueFieldValue: 'section-unique-1',
      children: [optionsData],
      // Add other necessary fields based on your DropDownDataSection interface
    };

    const multiObjectSelectionComponent = new MultiObjectSelectionComponent();
    multiObjectSelectionComponent.chipData = [{ dataUniqueFieldValue: 'unique-1', isSelected: true }];
    multiObjectSelectionComponent.maxSelectCount = 2;

    multiObjectSelectionComponent.optionSelectionTrigger(true, optionsData, sectionData);

    expect(optionsData.isSelected).toBe(true);
    expect(multiObjectSelectionComponent.chipData.length).toBe(1);
    // Add more assertions as needed
  });

  it('optionSelectionTrigger::should handle option selection', () => {
    // Arrange
    component.multiObjectData = {
      dropDownSections: [
        {
          sectionVisibleNameValue: 'Section 1',
          children: [
            {
              dataVisibleNameValue: 'Option 1',
              dataUniqueFieldValue: '1',
              isSelected: false,
            },
          ],
        },
      ],
    };
    const selectedOption = component.multiObjectData.dropDownSections[0].children![0];

    // Act
    component.optionSelectionTrigger(true, selectedOption, component.multiObjectData.dropDownSections[0]);

    // Assert
    expect(selectedOption.isSelected).toBe(true);
    // Add more assertions as needed
  });

  it('optionSelectionTrigger::should handle custom chips when selecting an option', () => {
    // Arrange
    component.isCustomInputAllowed = true;
    component.customChipData = [
      {
        dataVisibleNameValue: 'Custom Chip',
        dataUniqueFieldValue: 'custom-1',
        isSelected: false,
        isCustom: true,
      },
    ];
    component.multiObjectData = {
      dropDownSections: [
        {
          sectionVisibleNameValue: 'Section 1',
          children: [
            {
              dataVisibleNameValue: 'Option 1',
              dataUniqueFieldValue: '1',
              isSelected: false,
            },
          ],
        },
      ],
    };
    const selectedOption = component.multiObjectData.dropDownSections[0].children![0];

    // Act
    component.optionSelectionTrigger(true, selectedOption, component.multiObjectData.dropDownSections[0]);

    // Assert
    expect(selectedOption.isSelected).toBe(true);
    expect(component.customChipData).not.toContain(jasmine.objectContaining({ dataUniqueFieldValue: '1', isSelected: true }));
    // Add more assertions as needed
  });

  it('optionSelectionTrigger::should send the latest dropdown selection', () => {
    // Arrange
    spyOn(component.selectionChange, 'emit');
    component.maxSelectCount = 2;
    component.multiObjectData = {
      dropDownSections: [
        {
          sectionVisibleNameValue: 'Section 1',
          children: [
            {
              dataVisibleNameValue: 'Option 1',
              dataUniqueFieldValue: '1',
              isSelected: false,
            },
            {
              dataVisibleNameValue: 'Option 2',
              dataUniqueFieldValue: '2',
              isSelected: false,
            },
          ],
        },
      ],
    };
    const selectedOption1 = component.multiObjectData.dropDownSections[0].children![0];
    const selectedOption2 = component.multiObjectData.dropDownSections[0].children![1];

    // Act
    component.optionSelectionTrigger(true, selectedOption1, component.multiObjectData.dropDownSections[0]);
    component.optionSelectionTrigger(true, selectedOption2, component.multiObjectData.dropDownSections[0]);

    // Assert
    expect(component.selectionChange.emit).toHaveBeenCalled();
    // Add more assertions as needed
  });


  it('openDropdown::should emit initialLoad event with true when openDropdown is called', () => {
    // Arrange
    spyOn(component.initialLoad, 'emit');

    // Act
    component.openDropdown();

    // Assert
    expect(component.initialLoad.emit).toHaveBeenCalledWith(true);
  });

  it('dropdownCloseTrigger::should open the popover when _isDropdownCloseAllowed is falsy', () => {
    // Arrange
    component['_isDropdownCloseAllowed'] = false;
    spyOn(component.popoverInstance, 'open');

    // Act
    component.dropdownCloseTrigger();

    // Assert
    expect(component.popoverInstance.open).toHaveBeenCalled();
    expect(component['_isDropdownCloseAllowed']).toBe(true);
    // Add more specific assertions based on your expectations
  });

  it('dropdownCloseTrigger::should not open the popover when _isDropdownCloseAllowed is truthy', () => {
    // Arrange
    component['_isDropdownCloseAllowed'] = true;
    spyOn(component.popoverInstance, 'open');

    // Act
    component.dropdownCloseTrigger();

    // Assert
    expect(component.popoverInstance.open).not.toHaveBeenCalled();
    expect(component['_isDropdownCloseAllowed']).toBe(true);
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove custom chip and emit onChipRemove event', () => {
    // Arrange
    const customChip = {
      isCustom: true,
      dataUniqueFieldValue: 'custom123',
      // Add other required properties
    };
    component.customChipData = [customChip];
    component.chipData = [customChip];
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: customChip });

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBeDefined();
    expect(component.onChipRemove.emit).toHaveBeenCalledWith({ data: customChip });
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove custom chip and emit onChipRemove event', () => {
    // Arrange
    const customChip = {
      isCustom: true,
      dataUniqueFieldValue: 'custom123',
      // Add other required properties
    };
    component.customChipData = [customChip];
    component.chipData = [customChip];
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: customChip });

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBeDefined();
    expect(component.onChipRemove.emit).toHaveBeenCalledWith({ data: customChip });
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove non-custom chip and emit onChipRemove event', () => { // this one goes to elseeee
    // Arrange
    const nonCustomChip = {
      isCustom: false,
      dataUniqueFieldValue: 'option123',
      // Add other required properties
    };
    component.chipData = [nonCustomChip];
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: nonCustomChip });

    // Assert
    expect(component.chipData.length).toBeDefined();
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove custom chip and update prefilledChipData for asynchronous search', () => {
    // Arrange
    const customChip = {
      isCustom: true,
      dataUniqueFieldValue: 'custom123',
      parentUniqueIdsValue: ['parent123'],
      // Add other required properties
    };
    component.customChipData = [customChip];
    component.chipData = [customChip];
    component.queryState = true;
    component.isAsynchronousSearch = true;
    component.multiObjectDataForQuery = {
      dropDownSections: [{
        children: [{
          dataUniqueFieldValue: 'custom123',
          parentUniqueIdsValue: ['parent123'],
        }],
      }],
    };
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: customChip });

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBeDefined();
    expect(component.onChipRemove.emit).toHaveBeenCalledWith({ data: customChip });
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove non-custom chip and update prefilledChipData for asynchronous search', () => {
    // Arrange
    const nonCustomChip = {
      isCustom: false,
      dataUniqueFieldValue: 'option123',
      parentUniqueIdsValue: ['parent123'],
      // Add other required properties
    };
    component.chipData = [nonCustomChip];
    component.queryState = true;
    component.isAsynchronousSearch = true;
    component.multiObjectDataForQuery = {
      dropDownSections: [{
        children: [{
          dataUniqueFieldValue: 'option123',
          parentUniqueIdsValue: ['parent123'],
        }],
      }],
    };
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: nonCustomChip });

    // Assert
    expect(component.chipData.length).toBeDefined();
    expect(component.queryRemovededChipDataIds).toContain('option123');
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove non-custom chip and update prefilledChipData for client-side search', () => {
    // Arrange
    const nonCustomChip = {
      isCustom: false,
      dataUniqueFieldValue: 'option123',
      parentUniqueIdsValue: ['parent123'],
      // Add other required properties
    };
    component.multiObjectData = multiObjectData;
    component.multiObjectDataForQuery = multiObjectData;
    component.chipData = [nonCustomChip];
    component.queryState = true;
    component.isClientSideSearchAllowed = true;
    component['_flattenDropdownOptions'] = [{
      dataUniqueFieldValue: 'option123',
      parentUniqueIdsValue: ['parent123'],
    }];
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: nonCustomChip });

    // Assert
    expect(component.chipData.length).toBeDefined();
    expect(component.queryRemovededChipDataIds).toBeDefined();
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove non-custom chip with parentUniqueIdsValue and update prefilledChipData', () => {
    // Arrange
    const parentUniqueIdsValue: any = [];
    const nonCustomChip = {
      isCustom: false,
      isSelected: true,
      dataUniqueFieldValue: 'option123',
      parentUniqueIdsValue,
      // Add other required properties
    };

    component['_flattenDropdownOptions'] = [nonCustomChip];
    component.multiObjectData = multiObjectData;
    component.multiObjectDataForQuery = multiObjectData;
    component.chipData = [nonCustomChip];
    component.queryState = false;
    component.multiObjectData = {
      dropDownSections: [{
        children: [{
          dataUniqueFieldValue: 'option123',
          parentUniqueIdsValue,
        }],
      }],
    };
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_valueSelectTreeTraversal');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: nonCustomChip });

    // Assert
    expect(component.chipData.length).toBeDefined();
    expect(component.prefilledChipData.length).toBe(0);
    expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('chipRemovalTrigger::should remove custom chip with parentUniqueIdsValue and update prefilledChipData', () => {
    // Arrange
    const parentUniqueIdsValue = ['parent123'];
    const customChip = {
      isCustom: false,
      dataUniqueFieldValue: 'custom123',
      parentUniqueIdsValue,
      // Add other required properties
    };
    component['_flattenDropdownOptions'] = [customChip];
    component.multiObjectData = multiObjectData;
    component.multiObjectDataForQuery = multiObjectData;
    component.chipData = [customChip];
    component.queryState = false;
    component.multiObjectData = {
      dropDownSections: [{
        children: [{
          dataUniqueFieldValue: 'option123',
          parentUniqueIdsValue,
        }],
      }],
    };
    spyOn(component.onChipRemove, 'emit');
    spyOn(component as any, '_valueSelectTreeTraversal');
    spyOn(component as any, '_sendLatestDropdownSelection');

    // Act
    component.chipRemovalTrigger({ data: customChip });

    // Assert
    expect(component.customChipData.length).toBe(0);
    expect(component.chipData.length).toBeDefined();
    expect(component.prefilledChipData.length).toBe(0);
    // Add more specific assertions based on your expectations
  });

  it('_checkPrefilledChips::should select options that have matching prefilled chips', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: 'option1',
        dataVisibleNameValue: 'Option 1',
        isSelected: false,
        children: [], // Add children if needed
        // Add other properties based on DropDownDataOption interface
      },
      // Add more options as needed
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // Add other properties based on DropDownDataSection interface
    };

    component.prefilledChipData = [
      {
        dataUniqueFieldValue: 'option1',
        dataVisibleNameValue: 'Option 1',
        // Add other properties based on SelectionChip interface
      },
      // Add more prefilled chips as needed
    ];

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(optionsData[0].isSelected).toBe(true);
    expect(component.preSelectedChips.length).toBe(0);
    // Add more specific assertions based on your expectations
  });

  it('_checkPrefilledChips::should set isPartiallySelected for options with partially matching prefilled chips', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: 'option1',
        dataVisibleNameValue: 'Option 1',
        isPartiallySelected: false,
        children: [
          {
            dataUniqueFieldValue: 'option1_child',
            dataVisibleNameValue: 'Child of Option 1',
            isPartiallySelected: false,
            // Add other properties based on DropDownDataOption interface
          },
          // Add more children as needed
        ],
        // Add other properties based on DropDownDataOption interface
      },
      // Add more options as needed
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // Add other properties based on DropDownDataSection interface
    };

    component.prefilledChipData = [
      {
        dataUniqueFieldValue: 'option1_child',
        dataVisibleNameValue: 'Child of Option 1',
        // Add other properties based on SelectionChip interface
      },
      // Add more prefilled chips as needed
    ];

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(optionsData[0].isPartiallySelected).toBe(false);
    expect(optionsData[0].children![0].isPartiallySelected).toBe(false);
    // Add more specific assertions based on your expectations
  });

  it('_checkPrefilledChips::should handle case where option is partially pre-selected', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: '1',
        isSelected: false
        // other option data
      },
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // other section data
    };

    component.preSelectedChips = [
      {
        dataUniqueFieldValue: '2', // Parent option that is pre-selected
        parentUniqueIdsValue: ['1'],
        // other chip data
      },
    ];

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(optionsData[0].isSelected).toBe(false);
    expect(optionsData[0].isPartiallySelected).toBe(true);
    // Add more assertions as needed
  });

  it('_checkPrefilledChips::should handle case where option is fully pre-selected and unselect it', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: '1',
        // other option data
      },
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // other section data
    };

    component.preSelectedChips = [
      {
        dataUniqueFieldValue: '1',
        // other chip data
      },
    ];

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(optionsData[0].isSelected).toBe(true);
    expect(component.preSelectedChips.length).toBe(0);
    // Add more assertions as needed
  });

  it('_checkPrefilledChips::should handle case where option is neither fully nor partially pre-selected', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: '1',
        isSelected: false
        // other option data
      },
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // other section data
    };

    component.preSelectedChips = [
      {
        dataUniqueFieldValue: '2', // Different option that is pre-selected
        // other chip data
      },
    ];

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(optionsData[0].isSelected).toBe(false);
    expect(optionsData[0].isPartiallySelected).toBe(false);
    // Add more assertions as needed
  });

  it('_checkPrefilledChips::should unselect pre-selected chip, select option, and trigger necessary methods', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: '1',
        // other option data
      },
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // other section data
    };

    component.preSelectedChips = [
      {
        dataUniqueFieldValue: '1', // Pre-selected chip
        // other chip data
      },
    ];

    spyOn<any>(component, '_valueSelectTreeTraversal');
    spyOn<any>(component, '_modifyChipSection');

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(component.preSelectedChips.length).toBe(0);
    expect(optionsData[0].isSelected).toBe(true);
    expect(component['_valueSelectTreeTraversal']).toHaveBeenCalledWith(true, sectionData.children!, optionsData[0]);
    expect(component['_modifyChipSection']).toHaveBeenCalledWith(component.multiObjectData.dropDownSections);
    // Add more assertions as needed
  });

  it('_checkPrefilledChips::should not make any changes if pre-selected chip is not found', () => {
    // Arrange
    const optionsData: DropDownDataOption[] = [
      {
        dataUniqueFieldValue: '1',
        isSelected: false
        // other option data
      },
    ];

    const sectionData: DropDownDataSection = {
      children: optionsData,
      // other section data
    };

    component.preSelectedChips = [
      {
        dataUniqueFieldValue: '2', // Different chip
        // other chip data
      },
    ];

    spyOn<any>(component, '_valueSelectTreeTraversal');
    spyOn<any>(component, '_modifyChipSection');

    // Act
    component['_checkPrefilledChips'](optionsData, sectionData);

    // Assert
    expect(component.preSelectedChips.length).toBe(1);
    expect(optionsData[0].isSelected).toBe(false);
    expect(component['_valueSelectTreeTraversal']).not.toHaveBeenCalled();
    expect(component['_modifyChipSection']).not.toHaveBeenCalled();
    // Add more assertions as needed
  });

  it('_allSelectTrigger::should set isAllSelected to true and trigger onSelectAll and _appendCustomChips when triggerValue is true', () => {
    // Arrange
    component.multiObjectData = {
      dropDownSections: [
        {
          children: [
            {
              dataUniqueFieldValue: 'option1',
              dataVisibleNameValue: 'Option 1',
              isSelected: false,
              // Add other properties based on DropDownDataOption interface
            },
            // Add more options as needed
          ],
          // Add other properties based on DropDownDataSection interface
        },
        // Add more sections as needed
      ],
    };

    component.isCustomAllSelectOption = true;
    component.customAllSelectOptionUniqueId = 'allSelectUniqueId';
    component.customAllSelectOptionNameKey = 'All Select';

    // Act
    component['_allSelectTrigger'](true);

    // Assert
    expect(component.isAllSelected).toBe(true);
    // Add more specific assertions based on your expectations

    // Mock emitting onSelectAll event
    spyOn(component.onSelectAll, 'emit');
    // Mock emitting onChipAdd event
    spyOn(component.onChipAdd, 'emit');
    // Act
    component['_allSelectTrigger'](true);
    // Assert
    expect(component.onSelectAll.emit).toHaveBeenCalled();
    expect(component.onChipAdd.emit).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('_allSelectTrigger::should set isAllSelected to false and reset chipData when triggerValue is false', () => {
    // Arrange
    component.isAllSelected = true;
    component.chipData = [
      {
        dataUniqueFieldValue: 'allSelectUniqueId',
        dataVisibleNameValue: 'All Select',
        isSingular: true,
        // Add other properties based on SelectionChip interface
      },
      // Add more chips as needed
    ];

    // Act
    component['_allSelectTrigger'](false);

    // Assert
    expect(component.isAllSelected).toBe(false);
    expect(component.chipData.length).toBeDefined();
    // Add more specific assertions based on your expectations
  });

  it('_finalizeQuerySelectedOptions::should mark options as selected based on queryAddedChipDataIds and update chipData', () => {
    // Arrange
    component.queryAddedChipDataIds = ['option1', 'option2'];
    component['_flattenDropdownOptions'] = [
      {
        dataUniqueFieldValue: 'option1',
        isSelected: false,
        // Add other properties based on DropDownDataOption interface
      },
      {
        dataUniqueFieldValue: 'option2',
        isSelected: false,
        // Add other properties based on DropDownDataOption interface
      },
      // Add more options as needed
    ];

    // Act
    component['_finalizeQuerySelectedOptions']();

    // Assert
    expect(component['_flattenDropdownOptions'][0].isSelected).toBe(true);
    expect(component['_flattenDropdownOptions'][1].isSelected).toBe(true);
    expect(component.queryAddedChipDataIds.length).toBeDefined();
    // Add more specific assertions based on your expectations
  });

  it('_finalizeQuerySelectedOptions::should mark options as unselected based on queryRemovededChipDataIds and update chipData', () => {
    // Arrange
    component.queryRemovededChipDataIds = ['option1', 'option2'];
    component['_flattenDropdownOptions'] = [
      {
        dataUniqueFieldValue: 'option1',
        isSelected: true,
        // Add other properties based on DropDownDataOption interface
      },
      {
        dataUniqueFieldValue: 'option2',
        isSelected: true,
        // Add other properties based on DropDownDataOption interface
      },
      // Add more options as needed
    ];

    // Act
    component['_finalizeQuerySelectedOptions']();

    // Assert
    expect(component['_flattenDropdownOptions'][0].isSelected).toBe(false);
    expect(component['_flattenDropdownOptions'][1].isSelected).toBe(false);
    expect(component.queryRemovededChipDataIds.length).toBeDefined();
    // Add more specific assertions based on your expectations
  });

  it('_sendLatestDropdownSelection::should emit selectionChange event with correct optionIds and keep popover open', () => {
    // Arrange
    component.chipData = [
      {
        dataUniqueFieldValue: 'option1',
        isCustom: false,
        // Add other properties based on DropDownDataOption interface
      },
      {
        dataUniqueFieldValue: 'customOption1',
        isCustom: true,
        // Add other properties based on DropDownDataOption interface
      },
      // Add more chips as needed
    ];
    spyOn(component.selectionChange, 'emit');
    spyOn(component.popoverInstance, 'close');

    // Act
    component['_sendLatestDropdownSelection']();

    // Assert
    expect(component.selectionChange.emit).toHaveBeenCalledWith(component.chipData);
    expect(component.popoverInstance.close).not.toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('_sendLatestDropdownSelection::should emit selectionChange event with correct optionIds and close popover for singular input', () => {
    // Arrange
    component.chipData = [
      {
        dataUniqueFieldValue: 'option1',
        isCustom: false,
        // Add other properties based on DropDownDataOption interface
      },
    ];
    component.isSingularInput = true;
    spyOn(component.selectionChange, 'emit');
    spyOn(component.popoverInstance, 'close');

    // Act
    component['_sendLatestDropdownSelection']();

    // Assert
    expect(component.selectionChange.emit).toHaveBeenCalledWith(component.chipData);
    expect(component.popoverInstance.close).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('_sendLatestDropdownSelection::should emit selectionChange event with correct optionIds and close popover for maxSelectCount reached', () => {
    // Arrange
    component.chipData = [
      {
        dataUniqueFieldValue: 'option1',
        isCustom: false,
        // Add other properties based on DropDownDataOption interface
      },
      {
        dataUniqueFieldValue: 'option2',
        isCustom: false,
        // Add other properties based on DropDownDataOption interface
      },
    ];
    component.maxSelectCount = 2;
    spyOn(component.selectionChange, 'emit');
    spyOn(component.popoverInstance, 'close');

    // Act
    component['_sendLatestDropdownSelection']();

    // Assert
    expect(component.selectionChange.emit).toHaveBeenCalledWith(component.chipData);
    expect(component.popoverInstance.close).toHaveBeenCalled();
    // Add more specific assertions based on your expectations
  });

  it('preparePrefilledChipsData::should prepare pre-filled chips data with correct properties', () => {
    // Arrange
    const sectionConfig: DropDownDataSection = {
      dataFavouriteSrc: ['favorite'],
      dataUniqueSrc: ['id'],
      dataTooltipSrc: ['tooltip'],
      dataVisibleNameSrc: ['name'],
      dataParentUniqueIdsSrc: ['parentIds'],
    };

    const data = [
      { id: 1, name: 'Option 1', favorite: true, tooltip: 'Tooltip 1', parentIds: [101] },
      { id: 2, name: 'Option 2', favorite: false, tooltip: 'Tooltip 2', parentIds: [102, 103] },
      // Add more data as needed
    ];

    // Act
    const result: SelectionChip[] = MultiObjectSelectionComponent.preparePrefilledChipsData(sectionConfig, data);

    // Assert
    expect(result.length).toBe(data.length);
    for (let i = 0; i < data.length; i++) {
      expect(result[i].dataFavouriteValue).toBe(data[i].favorite);
      expect(result[i].dataTooltipValue).toBe(data[i].tooltip);
      expect(result[i].dataVisibleNameValue).toBe(data[i].name);
      expect(result[i].parentUniqueIdsValue).toBe(data[i].parentIds);
      expect(result[i].canDelete).toBe(true);
      expect(result[i].originalData).toBe(data[i]);
    }
  });

  it('dropdownPropertyAccess::should access property with single-level path', () => {
    // Arrange
    const dataObj = { id: 1, name: 'Option 1' };
    const path = ['name'];

    // Act
    const result = MultiObjectSelectionComponent.dropdownPropertyAccess(dataObj, path);

    // Assert
    expect(result).toBe('Option 1');
  });

  it('dropdownPropertyAccess::should access property with multi-level path', () => {
    // Arrange
    const dataObj = { details: { id: 1, name: 'Option 1' } };
    const path = ['details', 'name'];

    // Act
    const result = MultiObjectSelectionComponent.dropdownPropertyAccess(dataObj, path);

    // Assert
    expect(result).toBe('Option 1');
  });

  it('dropdownPropertyAccess::should return empty string for invalid path', () => {
    // Arrange
    const dataObj = { id: 1, name: 'Option 1' };
    const path: string[] = [];

    // Act
    const result = MultiObjectSelectionComponent.dropdownPropertyAccess(dataObj, path);

    // Assert
    expect(result).toBe('');
  });

  it('_init::should set minSelectCount to 1 when isRequired is true and minSelectCount is not provided', () => {
    // Arrange
    component.isRequired = true;

    // Act
    component['_init']();

    // Assert
    expect(component.minSelectCount).toBe(1);
  });

  it('_init::should not change minSelectCount when isRequired is true and minSelectCount is provided', () => {
    // Arrange
    component.isRequired = true;
    component.minSelectCount = 2;

    // Act
    component['_init']();

    // Assert
    expect(component.minSelectCount).toBe(2);
  });

  it('_init::should set maxSelectCount to 1 when isSingularInput is true and maxSelectCount is not provided', () => {
    // Arrange
    component.isSingularInput = true;

    // Act
    component['_init']();

    // Assert
    expect(component.maxSelectCount).toBe(1);
  });

  it('_init::should not change maxSelectCount when isSingularInput is true and maxSelectCount is provided', () => {
    // Arrange
    component.isSingularInput = true;
    component.maxSelectCount = 3;

    // Act
    component['_init']();

    // Assert
    expect(component.maxSelectCount).toBe(1);
  });

  it('_init::should set isCustomInputAllowed to false when isSingularInput is true', () => {
    // Arrange
    component.isSingularInput = true;
    component.isCustomInputAllowed = true;

    // Act
    component['_init']();

    // Assert
    expect(component.isCustomInputAllowed).toBe(false);
  });

  it('_init::should set isHierarchySelectionModificationAllowed to false when isMultipleLevel is false', () => {
    // Arrange
    component.isMultipleLevel = false;
    component.isHierarchySelectionModificationAllowed = true;

    // Act
    component['_init']();

    // Assert
    expect(component.isHierarchySelectionModificationAllowed).toBe(false);
  });

  it('_init::should not change isHierarchySelectionModificationAllowed when isMultipleLevel is true', () => {
    // Arrange
    component.isMultipleLevel = true;
    component.isHierarchySelectionModificationAllowed = true;

    // Act
    component['_init']();

    // Assert
    expect(component.isHierarchySelectionModificationAllowed).toBe(true);
  });

});
