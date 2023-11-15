import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { MultiObjectSelectionComponent } from './multi-object-select.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropDownDataOption, DropDownDataSection, MultiObjectSelection, SelectionChip } from './interfaces/multi-object-selection.interface';
import { customChipData, dropDownSection, multiObjectData, sampleData } from './test-data/test-data';
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

  it('ngOnChanges::should update multiObjectData, set pre-selected values, and flatten options for query on data changes', () => {
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

  it('ngOnChanges::should set pre-selected values on preSelectedChips changes', () => {
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

  it('prepareDropDownData::should modify data when isQuery is true', () => {
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

  it('prepareDropDownData::should create a single section when isQuery is true', () => {
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
    component.popoverInstance.isOpen = () => {return true;};
    
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

  it('focusSearch::should focus on the top container if search is not allowed', fakeAsync(() => {
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

  it('queryTrigger::should set queryState to true when searchVal is not empty', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);

    // Act
    component.queryTrigger('searchTerm');

    // Assert
    expect(component.queryState).toBe(true);
    // Add assertions for other related properties or methods
  }));

  it('queryTrigger::should perform client-side search and update multiObjectDataForQuery with matching data', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    component.isClientSideSearchAllowed = true;
    component['_flattenDropdownOptions'] = [
      { dataVisibleNameValue: 'Test 1', dataTooltipValue: 'Tooltip 1' },
      { dataVisibleNameValue: 'Test 2', dataTooltipValue: 'Tooltip 2' },
    ];

    // Act
    component.queryTrigger('test');

    // Assert
    expect(component.multiObjectDataForQuery?.dropDownSections[0].children?.length).toBe(2);
    // Add more specific assertions based on your data and expectations
  }));

  it('queryTrigger::should perform client-side search and update multiObjectDataForQuery with empty data if no match', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    component.isClientSideSearchAllowed = true;
    component['_flattenDropdownOptions'] = [
      { dataVisibleNameValue: 'Test 1', dataTooltipValue: 'Tooltip 1' },
      { dataVisibleNameValue: 'Test 2', dataTooltipValue: 'Tooltip 2' },
    ];

    // Act
    component.queryTrigger('notfound');

    // Assert
    expect(component.multiObjectDataForQuery?.dropDownSections[0].children?.length).toBe(0);
    // Add more specific assertions based on your data and expectations
  }));

  it('queryTrigger::should perform asynchronous search and update multiObjectDataForQuery with data', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    component.isAsynchronousSearch = true;
    const mockSearchData:any = [];
    spyOn(component.onQuerySeach, 'emit').and.callThrough();
    spyOn(component, 'prepareDropDownData').and.callThrough();

    // Act
    component.queryTrigger('asyncSearchTerm');
    tick();

    // Assert
    expect(component.searchLoading).toBe(true);
    expect(component.onQuerySeach.emit).toHaveBeenCalled();
    expect(component.prepareDropDownData).toHaveBeenCalledWith(mockSearchData, true);
    // Add more specific assertions based on your data and expectations
  }));

  it('queryTrigger::should handle errors during asynchronous search and update multiObjectDataForQuery with empty data', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    component.isAsynchronousSearch = true;
    spyOn(component.onQuerySeach, 'emit').and.callFake((params: any) => {
      params.onError && params.onError();
    });
    spyOn(component, 'prepareDropDownData').and.callThrough();

    // Act
    component.queryTrigger('asyncSearchTerm');
    tick();

    // Assert
    expect(component.searchLoading).toBe(false);
    expect(component.prepareDropDownData).toHaveBeenCalledWith([], true);
    // Add more specific assertions based on your expectations
  }));

  it('queryTrigger::should perform asynchronous search and update multiObjectDataForQuery with data', fakeAsync(() => {
    // Arrange
    spyOn(component.popoverInstance, 'isOpen').and.returnValue(false);
    component.isAsynchronousSearch = true;
    const mockSearchData:any = [];
    spyOn(component.onQuerySeach, 'emit').and.callFake((params: any) => {
      params.onResult && params.onResult(mockSearchData);
    });
    spyOn(component, 'prepareDropDownData').and.callThrough();
  
    // Act
    component.queryTrigger('asyncSearchTerm');
    tick();
  
    // Assert
    expect(component.searchLoading).toBe(false);
    expect(component.onQuerySeach.emit).toHaveBeenCalled();
    expect(component.prepareDropDownData).toHaveBeenCalled();
    // expect(onResultSpy).toHaveBeenCalled(); // Add this line to check onResultSpy
    // Add more specific assertions based on your data and expectations
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







  it('should handle option selection', () => {
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

  it('should handle custom chips when selecting an option', () => {
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

  it('should send the latest dropdown selection', () => {
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
    spyOn(component as any,'_sendLatestDropdownSelection');

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
    expect(component.queryRemovededChipDataIds).toContain('option123');
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
      expect(result[i].dataUniqueFieldValue).toBe(data[i].id);
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

});
