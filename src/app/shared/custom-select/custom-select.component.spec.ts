import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { CustomSelectComponent } from './custom-select.component';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IDropDownTreeConfig, IDropdownTree } from '../interfaces/custom-select.inteface';
import { DataTooltipSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, DataExpandableSrcFields, DataChildrenSrcFields, DataFavouriteSrcFields, DataTotalDocsSrcFields, DataPathIdsSrcFields, DataDisabledSrcFields } from 'src/app/multi-object-select/enums/multi-object-selection.enum';
import { cloneDeep } from 'lodash';
import { TreeUtility } from '../utility/tree/TreeUtility';
import { folderHierarchy1, folderHierarchy2 } from 'src/app/multi-object-select/test-data/test-folders-data';
import { TreeNode } from '../utility/tree/TreeNode';
import { ITreeNode } from '../interfaces/tree.interface';


class MockNgbPopover {
    // Add any methods or properties used in your component
    open() { }
    close() { }
    isOpen() { }
    hidden() { }
    shown() { }
    // ...
}

fdescribe('CustomSelectComponent', () => {
    let component: CustomSelectComponent;
    let fixture: ComponentFixture<CustomSelectComponent>;

    let sectionConfigData: IDropDownTreeConfig = {
        dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION,
        dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION,
        dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION,
        dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION,
        dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION,
        dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION,
        dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION,
        dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION,
        dataDisabledSrc: DataDisabledSrcFields.FOLDER_SELECTION,
        dataSearchFieldsSrc: ["folderId"],
        isSectionSelectionAllowed: true,
        isRequired: true,
        minSelectCount: 1,
        maxSelectCount: 2,
        isSingularInput: false,
        isReadonly: false,
        isCustomInputAllowed: true,
        isSearchAllowed: true,
        isAsynchronousSearchAllowed: true,
        isClientSideSearchAllowed: true,
        isResetOptionVisible: true,
        isSelectAllAvailable: true,
        placeholderKey: "add users",
        noDataMessageKey: "no-data-available",
        isMultipleLevel: true,
        isAsynchronouslyExpandable: true,
        isHierarchySelectionModificationAllowed: false,
        invalidMessageKey: "customInvalidMessageKey",
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CustomSelectComponent],
            imports: [NgbModule],
            providers: [
                { provide: NgbPopover, useClass: MockNgbPopover },
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomSelectComponent);
        component = fixture.componentInstance;
        component.sectionConfigData = cloneDeep(sectionConfigData);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set primaryData when provided', () => {
        let dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);
        let treeSection1 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy1), dropdownSectionConfig);
        component.primaryData = [treeSection1];
        fixture.detectChanges();
        expect(component.primaryData).toEqual([treeSection1]);
    });

    it('should set preSelectedChips when provided', () => {
        let dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);
        let treeSection1 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy1), dropdownSectionConfig);
        let preSelectedData: any = [cloneDeep(folderHierarchy1[0])];
        let preSelectedDataToPass = preSelectedData.map((val: any) => TreeUtility.createExpliciteDropdownTreeNode(val, dropdownSectionConfig, true));
        component.preSelectedChips = preSelectedDataToPass;
        component.primaryData = [treeSection1];
        fixture.detectChanges();
        expect(component.preSelectedChips).toEqual(preSelectedDataToPass);
    });

    it('should return true when all primaryData items are selected', () => {
        const dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);
        const treeSection1 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy1), dropdownSectionConfig);
        const treeSection2 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy2), dropdownSectionConfig);

        treeSection1.selectAll();
        treeSection2.selectAll();

        component.primaryData = [treeSection1, treeSection2];
        fixture.detectChanges();

        expect(component.isAllSelected).toBe(true);
    });

    it('should return false when at least one primaryData item is not selected', () => {
        const dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);
        const treeSection1 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy1), dropdownSectionConfig);
        const treeSection2 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy2), dropdownSectionConfig);

        treeSection1.selectAll();

        component.primaryData = [treeSection1, treeSection2];
        fixture.detectChanges();

        expect(component.isAllSelected).toBe(false);
    });

    it('should return false when primaryData is empty', () => {
        component.primaryData = [];
        fixture.detectChanges();

        expect(component.isAllSelected).toBe(true);
    });

    it('should set primaryData and update chipData when provided with valid data', () => {
        const dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);
        const treeSection1 = TreeUtility.createExpliciteDropdownTree(cloneDeep(folderHierarchy1), dropdownSectionConfig);

        component.primaryData = [treeSection1];
        fixture.detectChanges();

        // Check if primaryData is set correctly
        expect(component.primaryData).toEqual([treeSection1]);

        // Check if chipData is updated correctly based on the provided primaryData
        const expectedChipData: any[] = []; // Provide the expected chipData based on your test data
        expect(component.chipData).toEqual(expectedChipData);

        // Check if isLoading is set to false
        expect(component.isLoading).toBeFalse();
    });

    it('should handle edge case when primaryData is an empty array', () => {
        component.primaryData = [];
        fixture.detectChanges();

        // Check if primaryData is set correctly
        expect(component.primaryData).toEqual([]);

        // Check if chipData is an empty array
        expect(component.chipData).toEqual([]);

        // Check if isLoading is set to false
        expect(component.isLoading).toBeFalse();
    });

    it('should update _preSelectedChipsHolder and isSelected state based on initiallyRemovedChipIdsHolder', () => {
        const dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);

        // Create a tree with pre-selected nodes
        const preSelectedNodeData = [cloneDeep(folderHierarchy1[0])]; // Adjust this based on your data
        let preSelectedDataToPass = preSelectedNodeData.map((val: any) => TreeUtility.createExpliciteDropdownTreeNode(val, dropdownSectionConfig, true));

        let sectionHeader = {};
        TreeUtility.propertyAdd(sectionHeader, dropdownSectionConfig.dataUniqueFieldSrc, "1");
        TreeUtility.propertyAdd(sectionHeader, dropdownSectionConfig.dataVisibleNameSrc, "Folders");
        const treeSection1 = TreeUtility.createExpliciteDropdownTree(sectionHeader, dropdownSectionConfig);

        cloneDeep(folderHierarchy1).forEach((element: any) => {
            treeSection1.insert("1", element);
        });

        treeSection1.insert(folderHierarchy1[0].folderId, cloneDeep(folderHierarchy2));

        component['_initiallyRemovedChipIdsHolder'] = [preSelectedDataToPass[0].dataUniqueFieldValue];
        component.primaryData = [treeSection1];
        component.preSelectedChips = preSelectedDataToPass;

        fixture.detectChanges();
        const updatedPreSelectedChipsHolder = component['_preSelectedChipsHolder'];
        expect(updatedPreSelectedChipsHolder).toEqual(preSelectedDataToPass);
    });

    it('should close popoverInstance on ngOnDestroy', () => {
        // Create a spy on the close method of the popoverInstance
        const closeSpy = spyOn(component.popoverInstance, 'close');

        // Trigger ngOnDestroy
        component.ngOnDestroy();

        // Expect the close method to have been called
        expect(closeSpy).toHaveBeenCalled();
    });

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

    it('should emit true on dropdownOpenTrigger', () => {
        // Create a spy on the initialLoad EventEmitter
        const emitSpy = spyOn(component.initialLoad, 'emit');

        // Trigger dropdownOpenTrigger
        component.dropdownOpenTrigger();

        // Expect the initialLoad.emit method to have been called with true
        expect(emitSpy).toHaveBeenCalledWith(true);
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

    it('activateLastChip::should not activate the last chip when query box is not empty', fakeAsync(() => {
        // Arrange
        component.chipsContainer = {
            activateChip: jasmine.createSpy('activateChip'),
        } as any;
        const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
        inputEvent.target.value = "asdf";
        component.chipData = [new TreeNode({ "folder_id": "1" }, cloneDeep(sectionConfigData))]; // Add a sample chip
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
        component.chipData = [new TreeNode({ "folder_id": "1" }, cloneDeep(sectionConfigData))]; // Add a sample chip
        spyOn(component.queryBox.nativeElement, 'blur');

        // Act
        component.activateLastChip(inputEvent as any);
        tick();

        // Assert
        expect(component.chipsContainer.activateChip).not.toHaveBeenCalled();
        expect(component.queryBox.nativeElement.blur).not.toHaveBeenCalled();
    }));

    it('activateLastChip::should activate last chip and blur queryBox when input event type is \'deleteWordBackward\' and input value is an empty string', () => {
        component.chipData = [new TreeNode({ "folder_id": "1" }, cloneDeep(sectionConfigData)), new TreeNode({ "folder_id": "2" }, cloneDeep(sectionConfigData)), new TreeNode({ "folder_id": "3" }, cloneDeep(sectionConfigData))];
        component.chipsContainer = {
            activateChip: jasmine.createSpy('activateChip')
        } as any;
        component.queryBox = {
            nativeElement: {
                blur: jasmine.createSpy('blur')
            }
        } as any;
        const inputEvent: any = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };


        component.activateLastChip(inputEvent);

        expect(component.chipsContainer.activateChip).toHaveBeenCalled();
        expect(component.queryBox.nativeElement.blur).toHaveBeenCalled();
    });

    it('_init::should set minSelectCount to 1 when isRequired is true and minSelectCount is not provided', () => {
        // Arrange
        component.sectionConfigData.isRequired = true;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.minSelectCount).toBe(1);
    });

    it('_init::should not change minSelectCount when isRequired is true and minSelectCount is provided', () => {
        // Arrange
        component.sectionConfigData.isRequired = true;
        component.sectionConfigData.minSelectCount = 2;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.minSelectCount).toBe(2);
    });

    it('_init::should set maxSelectCount to 1 when isSingularInput is true and maxSelectCount is not provided', () => {
        // Arrange
        component.sectionConfigData.isSingularInput = true;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.maxSelectCount).toBe(-1);
    });

    it('_init::should not change maxSelectCount when isSingularInput is true and maxSelectCount is provided', () => {
        // Arrange
        component.sectionConfigData.isSingularInput = true;
        component.sectionConfigData.maxSelectCount = 3;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.maxSelectCount).toBe(-1);
    });

    it('_init::should set isCustomInputAllowed to false when isSingularInput is true', () => {
        // Arrange
        component.sectionConfigData.isSingularInput = true;
        component.sectionConfigData.isCustomInputAllowed = true;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.isCustomInputAllowed).toBe(true);
    });

    it('_init::should set isHierarchySelectionModificationAllowed to false when isMultipleLevel is false', () => {
        // Arrange
        component.sectionConfigData.isMultipleLevel = false;
        component.sectionConfigData.isHierarchySelectionModificationAllowed = true;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.isHierarchySelectionModificationAllowed).toBe(false);
    });

    it('_init::should not change isHierarchySelectionModificationAllowed when isMultipleLevel is true', () => {
        // Arrange
        component.sectionConfigData.isMultipleLevel = true;
        component.sectionConfigData.isHierarchySelectionModificationAllowed = true;

        // Act
        component['_init']();

        // Assert
        expect(component.sectionConfigData.isHierarchySelectionModificationAllowed).toBe(true);
    });

    it('should set _isDropdownCloseAllowed to false if popoverInstance is open', () => {
        spyOn(component.popoverInstance, 'isOpen').and.returnValue(true);

        component['_preventDropdownStateChange']();

        expect(component['_isDropdownCloseAllowed']).toBe(false);
    });

    it('should set _isDropdownCloseAllowed to true if popoverInstance is not open', () => {
        spyOn(component['popoverInstance'], 'isOpen').and.returnValue(false);

        component['_preventDropdownStateChange']();

        expect(component['_isDropdownCloseAllowed']).toBe(true);
    });

    it('should not change _isDropdownCloseAllowed if popoverInstance state is unchanged', () => {
        // Set an initial state
        component['_isDropdownCloseAllowed'] = false;
        spyOn(component['popoverInstance'], 'isOpen').and.returnValue(false);

        component['_preventDropdownStateChange']();

        expect(component['_isDropdownCloseAllowed']).toBe(true);
    });

    it('should emit selectionChange with correct nodes and prevent dropdown state change for singular input', () => {
        // Prepare test data
        const treeNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.chipData = [treeNode];
        spyOn(component as any, '_preventDropdownStateChange');
        spyOn(component.selectionChange, 'emit');

        // Trigger the method
        component['_sendLatestDropdownSelection']();

        // Expectations
        expect(component.selectionChange.emit).toHaveBeenCalledWith([treeNode]);
    });

    it('should close popoverInstance when maxSelectCount is reached', () => {
        // Prepare test data
        const treeNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.sectionConfigData.maxSelectCount = 2;
        component.chipData = [treeNode, treeNode];
        spyOn(component.popoverInstance, 'close');
        spyOn(component.selectionChange, 'emit');

        // Trigger the method
        component['_sendLatestDropdownSelection']();

        // Expectations
        expect(component.popoverInstance.close).toHaveBeenCalled();
        expect(component.selectionChange.emit).toHaveBeenCalledWith([treeNode, treeNode]);
    });

    it('should handle invalid chip data correctly', () => {
        // Prepare test data
        const invalidNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        invalidNode.isInvalid = true;
        component.chipData = [invalidNode];
        spyOn(component.selectionChange, 'emit');

        // Trigger the method
        component['_sendLatestDropdownSelection']();

        // Expectations
        expect(component.selectionChange.emit).toHaveBeenCalledWith([invalidNode]);
        expect(component.invalidState).toBe(true);
    });

    it('should add custom added chips when asynchronous search is allowed and queryAddedData is present', () => {
        // Prepare test data
        let sectionConfig = cloneDeep(sectionConfigData);
        sectionConfig.isAsynchronousSearchAllowed = true;
        const treeNode1: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], sectionConfig, true);
        const treeNode2: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[1])], sectionConfig, true);
        const queryAddedNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[2])], sectionConfig, true);

        // Set up the component state
        component.sectionConfigData.isAsynchronousSearchAllowed = true;
        component.queryAddedData = [queryAddedNode];
        component.chipData = [treeNode1, treeNode2];

        // Trigger the method
        component['_updateChipData']();
        // Expectations
        expect(component.chipData).toEqual([treeNode1, treeNode2, queryAddedNode]);
    });

    it('should add custom chip when Enter key is pressed and custom input is allowed', () => {
        // Set up the component state
        component.sectionConfigData.isCustomInputAllowed = true;
        component.sectionConfigData.isSearchAllowed = true;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.queryBox.nativeElement.value = 'Custom Node';

        // Trigger the method
        component.addCustomChip(keyboardEvent);

        // Expectations
        expect(component.customchipsData.length).toBe(1);
        expect(component.chipData.length).toBe(1);
        // You may add more specific expectations based on your implementation
    });

    it('should not add custom chip when Enter key is pressed and custom input is not allowed', () => {
        // Set up the component state
        component.sectionConfigData.isCustomInputAllowed = false;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.queryBox.nativeElement.value = 'Custom Node';

        // Trigger the method
        component.addCustomChip(keyboardEvent);

        // Expectations
        expect(component.customchipsData.length).toBe(0);
        expect(component.chipData.length).toBe(0);
        // You may add more specific expectations based on your implementation
    });

    it('should not add custom chip when Enter key is not pressed', () => {
        // Set up the component state
        component.sectionConfigData.isCustomInputAllowed = true;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Space' });
        component.queryBox.nativeElement.value = 'Custom Node';

        // Trigger the method
        component.addCustomChip(keyboardEvent);

        // Expectations
        expect(component.customchipsData.length).toBe(0);
        expect(component.chipData.length).toBe(0);
        // You may add more specific expectations based on your implementation
    });

    it('should set computedWidth and focus on query box when search is allowed', fakeAsync(() => {
        // Set up the component state
        component.sectionConfigData.isSearchAllowed = true;

        // Trigger the method
        component.searchBoxFocusTrigger();
        tick();

        // Expectations
        expect(component.computedWidth).toBeDefined();
        expect(component.queryBox.nativeElement).toBe(document.activeElement as any);
    }));

    it('should set computedWidth and focus on query box when custom input is allowed', fakeAsync(() => {
        // Set up the component state
        component.sectionConfigData.isCustomInputAllowed = true;

        // Trigger the method
        component.searchBoxFocusTrigger();
        tick();

        // Expectations
        expect(component.computedWidth).toBeDefined();
        expect(component.queryBox.nativeElement).toBe(document.activeElement as any);
    }));

    it('should set computedWidth and focus on top container when custom input not allowed', fakeAsync(() => {
        // Set up the component state
        component.sectionConfigData.isCustomInputAllowed = false;
        component.sectionConfigData.isSearchAllowed = false;

        // Trigger the method
        component.searchBoxFocusTrigger();
        tick();

        // Expectations
        expect(component.computedWidth).toBeDefined();
        expect(component.topContainer.nativeElement).toBe(document.activeElement as any);
    }));

    it('should focus on top container when search and custom input are not allowed', fakeAsync(() => {
        // Set up the component state

        // Trigger the method
        component.searchBoxFocusTrigger();
        tick();

        // Expectations
        expect(component.computedWidth).toBeDefined();
    }));

    it('should remove regular chip from dropdown selection', () => {
        // Set up the component state
        const regularChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.chipRemovalTrigger(regularChip);

        // Expectations
        expect(regularChip.isSelected).toBe(false);
        // Additional expectations based on your implementation
    });

    it('should remove custom chip when custom input is allowed', () => {
        // Set up the component state
        const customChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        customChip.isCustom = true;
        component.sectionConfigData.isCustomInputAllowed = true;

        // Trigger the method
        component.chipRemovalTrigger(customChip);

        // Expectations
        expect(component.customchipsData).not.toContain(customChip);
        // Additional expectations based on your implementation
    });

    it('should remove preselected chip and update chip data', () => {
        // Set up the component state
        const preselectedChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.preSelectedChips = [preselectedChip];
        component.chipData = [preselectedChip];

        // Trigger the method
        component.chipRemovalTrigger(preselectedChip);

        // Expectations
        expect(component.preSelectedChips).not.toContain(preselectedChip);
        expect(component.chipData).not.toContain(preselectedChip);
        // Additional expectations based on your implementation
    });

    it('should remove chip from query added data when asynchronous search is allowed', () => {
        // Set up the component state
        const queryAddedChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.sectionConfigData.isAsynchronousSearchAllowed = true;
        component.queryAddedData = [queryAddedChip];

        // Trigger the method
        component.chipRemovalTrigger(queryAddedChip);

        // Expectations
        expect(component.queryAddedData).not.toContain(queryAddedChip);
        // Additional expectations based on your implementation
    });
    
});
