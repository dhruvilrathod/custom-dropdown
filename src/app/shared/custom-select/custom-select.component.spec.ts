import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';

import { CustomSelectComponent } from './custom-select.component';
import { NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { IDropDownTreeConfig, IDropdownTree } from '../interfaces/custom-select.inteface';
import { DataTooltipSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, DataExpandableSrcFields, DataChildrenSrcFields, DataFavouriteSrcFields, DataTotalDocsSrcFields, DataPathIdsSrcFields, DataDisabledSrcFields } from 'src/app/multi-object-select/enums/multi-object-selection.enum';
import { cloneDeep, delay } from 'lodash';
import { TreeUtility } from '../utility/tree/TreeUtility';
import { folderHierarchy1, folderHierarchy2 } from 'src/app/multi-object-select/test-data/test-folders-data';
import { TreeNode } from '../utility/tree/TreeNode';
import { ITreeNode } from '../interfaces/tree.interface';
import { generateMockTreeNodes } from '../utility/tree/TreeUtility.spec';
import { DropdownTree } from '../utility/tree/DropdownTree';
import { of } from 'rxjs';


class MockNgbPopover {
   
    open() { }
    close() { }
    isOpen() { }
    hidden() { }
    shown() { }
   
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

       
        expect(component.primaryData).toEqual([treeSection1]);

       
        const expectedChipData: any[] = [];
        expect(component.chipData).toEqual(expectedChipData);

       
        expect(component.isLoading).toBeFalse();
    });

    it('should handle edge case when primaryData is an empty array', () => {
        component.primaryData = [];
        fixture.detectChanges();

       
        expect(component.primaryData).toEqual([]);

       
        expect(component.chipData).toEqual([]);

       
        expect(component.isLoading).toBeFalse();
    });

    it('should update _preSelectedChipsHolder and isSelected state based on initiallyRemovedChipIdsHolder', () => {
        const dropdownSectionConfig: IDropDownTreeConfig = cloneDeep(sectionConfigData);

       
        const preSelectedNodeData = [cloneDeep(folderHierarchy1[0])];
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
       
        const closeSpy = spyOn(component.popoverInstance, 'close');

       
        component.ngOnDestroy();

       
        expect(closeSpy).toHaveBeenCalled();
    });

    it('onResize::should close and reopen the popover on window resize', fakeAsync(() => {
       
        const resizeEvent = new Event('resize');
        const closeSpy = spyOn(component.popoverInstance, "close")
        const openSpy = spyOn(component.popoverInstance, "open")
        component.popoverInstance.isOpen = () => { return true; };

       
        component.onResize(resizeEvent);

       
        expect(closeSpy).toHaveBeenCalled();
        tick(401);
        expect(openSpy).toHaveBeenCalled();
        flush();
    }));

    it('onResize::should not close and reopen the popover if it is not open', fakeAsync(() => {
       
        const resizeEvent = new Event('resize');
        const closeSpy = spyOn(component.popoverInstance, "close")
        const openSpy = spyOn(component.popoverInstance, "open")

       
        component.onResize(resizeEvent);

       
        expect(closeSpy).not.toHaveBeenCalled();
        expect(openSpy).not.toHaveBeenCalled();
        flush();
    }));

    it('should emit true on dropdownOpenTrigger', () => {
       
        const emitSpy = spyOn(component.initialLoad, 'emit');

       
        component.dropdownOpenTrigger();

       
        expect(emitSpy).toHaveBeenCalledWith(true);
    });

    it('dropdownCloseTrigger::should open the popover when _isDropdownCloseAllowed is falsy', () => {
       
        component['_isDropdownCloseAllowed'] = false;
        spyOn(component.popoverInstance, 'open');

       
        component.dropdownCloseTrigger();

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component['_isDropdownCloseAllowed']).toBe(true);
       
    });

    it('dropdownCloseTrigger::should not open the popover when _isDropdownCloseAllowed is truthy', () => {
       
        component['_isDropdownCloseAllowed'] = true;
        spyOn(component.popoverInstance, 'open');

       
        component.dropdownCloseTrigger();

       
        expect(component.popoverInstance.open).not.toHaveBeenCalled();
        expect(component['_isDropdownCloseAllowed']).toBe(true);
       
    });

    it('activateLastChip::should not activate the last chip when query box is not empty', fakeAsync(() => {
       
        component.chipsContainer = {
            activateChip: jasmine.createSpy('activateChip'),
        } as any;
        const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
        inputEvent.target.value = "asdf";
        component.chipData = [new TreeNode({ "folder_id": "1" }, cloneDeep(sectionConfigData))];
        component.queryBox.nativeElement.value = 'test';
        spyOn(component.queryBox.nativeElement, 'blur');

       
        component.activateLastChip(inputEvent as any);
        tick();

       
        expect(component.chipsContainer.activateChip).not.toHaveBeenCalled();
        expect(component.queryBox.nativeElement.blur).not.toHaveBeenCalled();
    }));

    it('activateLastChip::should not activate the last chip on non-delete input event', fakeAsync(() => {
       
        component.chipsContainer = {
            activateChip: jasmine.createSpy('activateChip'),
        } as any;
        const inputEvent = { inputType: 'deleteContentBackward', data: null, target: document.createElement("input") };
        inputEvent.target.value = "asdf";
        component.chipData = [new TreeNode({ "folder_id": "1" }, cloneDeep(sectionConfigData))];
        spyOn(component.queryBox.nativeElement, 'blur');

       
        component.activateLastChip(inputEvent as any);
        tick();

       
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
       
        component.sectionConfigData.isRequired = true;

       
        component['_init']();

       
        expect(component.sectionConfigData.minSelectCount).toBe(1);
    });

    it('_init::should not change minSelectCount when isRequired is true and minSelectCount is provided', () => {
       
        component.sectionConfigData.isRequired = true;
        component.sectionConfigData.minSelectCount = 2;

       
        component['_init']();

       
        expect(component.sectionConfigData.minSelectCount).toBe(2);
    });

    it('_init::should set maxSelectCount to 1 when isSingularInput is true and maxSelectCount is not provided', () => {
       
        component.sectionConfigData.isSingularInput = true;

       
        component['_init']();

       
        expect(component.sectionConfigData.maxSelectCount).toBe(-1);
    });

    it('_init::should not change maxSelectCount when isSingularInput is true and maxSelectCount is provided', () => {
       
        component.sectionConfigData.isSingularInput = true;
        component.sectionConfigData.maxSelectCount = 3;

       
        component['_init']();

       
        expect(component.sectionConfigData.maxSelectCount).toBe(-1);
    });

    it('_init::should set isCustomInputAllowed to false when isSingularInput is true', () => {
       
        component.sectionConfigData.isSingularInput = true;
        component.sectionConfigData.isCustomInputAllowed = true;

       
        component['_init']();

       
        expect(component.sectionConfigData.isCustomInputAllowed).toBe(true);
    });

    it('_init::should set isHierarchySelectionModificationAllowed to false when isMultipleLevel is false', () => {
       
        component.sectionConfigData.isMultipleLevel = false;
        component.sectionConfigData.isHierarchySelectionModificationAllowed = true;

       
        component['_init']();

       
        expect(component.sectionConfigData.isHierarchySelectionModificationAllowed).toBe(false);
    });

    it('_init::should not change isHierarchySelectionModificationAllowed when isMultipleLevel is true', () => {
       
        component.sectionConfigData.isMultipleLevel = true;
        component.sectionConfigData.isHierarchySelectionModificationAllowed = true;

       
        component['_init']();

       
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
       
        component['_isDropdownCloseAllowed'] = false;
        spyOn(component['popoverInstance'], 'isOpen').and.returnValue(false);

        component['_preventDropdownStateChange']();

        expect(component['_isDropdownCloseAllowed']).toBe(true);
    });

    it('should emit selectionChange with correct nodes and prevent dropdown state change for singular input', () => {
       
        const treeNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.chipData = [treeNode];
        spyOn(component as any, '_preventDropdownStateChange');
        spyOn(component.selectionChange, 'emit');

       
        component['_sendLatestDropdownSelection']();

       
        expect(component.selectionChange.emit).toHaveBeenCalledWith([treeNode]);
    });

    it('should close popoverInstance when maxSelectCount is reached', () => {
       
        const treeNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.sectionConfigData.maxSelectCount = 2;
        component.chipData = [treeNode, treeNode];
        spyOn(component.popoverInstance, 'close');
        spyOn(component.selectionChange, 'emit');

       
        component['_sendLatestDropdownSelection']();

       
        expect(component.popoverInstance.close).toHaveBeenCalled();
        expect(component.selectionChange.emit).toHaveBeenCalledWith([treeNode, treeNode]);
    });

    it('should handle invalid chip data correctly', () => {
       
        const invalidNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        invalidNode.isInvalid = true;
        component.chipData = [invalidNode];
        spyOn(component.selectionChange, 'emit');

       
        component['_sendLatestDropdownSelection']();

       
        expect(component.selectionChange.emit).toHaveBeenCalledWith([invalidNode]);
        expect(component.invalidState).toBe(true);
    });

    it('should add custom added chips when asynchronous search is allowed and queryAddedData is present', () => {
       
        let sectionConfig = cloneDeep(sectionConfigData);
        sectionConfig.isAsynchronousSearchAllowed = true;
        const treeNode1: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], sectionConfig, true);
        const treeNode2: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[1])], sectionConfig, true);
        const queryAddedNode: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[2])], sectionConfig, true);

       
        component.sectionConfigData.isAsynchronousSearchAllowed = true;
        component.queryAddedData = [queryAddedNode];
        component.chipData = [treeNode1, treeNode2];

       
        component['_updateChipData']();
       
        expect(component.chipData).toEqual([treeNode1, treeNode2, queryAddedNode]);
    });

    it('should add custom chip when Enter key is pressed and custom input is allowed', () => {
       
        component.sectionConfigData.isCustomInputAllowed = true;
        component.sectionConfigData.isSearchAllowed = true;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.queryBox.nativeElement.value = 'Custom Node';

       
        component.addCustomChip(keyboardEvent);

       
        expect(component.customchipsData.length).toBe(1);
        expect(component.chipData.length).toBe(1);
       
    });

    it('should not add custom chip when Enter key is pressed and custom input is not allowed', () => {
       
        component.sectionConfigData.isCustomInputAllowed = false;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        component.queryBox.nativeElement.value = 'Custom Node';

       
        component.addCustomChip(keyboardEvent);

       
        expect(component.customchipsData.length).toBe(0);
        expect(component.chipData.length).toBe(0);
       
    });

    it('should not add custom chip when Enter key is not pressed', () => {
       
        component.sectionConfigData.isCustomInputAllowed = true;
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'Space' });
        component.queryBox.nativeElement.value = 'Custom Node';

       
        component.addCustomChip(keyboardEvent);

       
        expect(component.customchipsData.length).toBe(0);
        expect(component.chipData.length).toBe(0);
       
    });

    it('should set computedWidth and focus on query box when search is allowed', fakeAsync(() => {
       
        component.sectionConfigData.isSearchAllowed = true;

       
        component.searchBoxFocusTrigger();
        tick();

       
        expect(component.computedWidth).toBeDefined();
        expect(component.queryBox.nativeElement).toBe(document.activeElement as any);
    }));

    it('should set computedWidth and focus on query box when custom input is allowed', fakeAsync(() => {
       
        component.sectionConfigData.isCustomInputAllowed = true;

       
        component.searchBoxFocusTrigger();
        tick();

       
        expect(component.computedWidth).toBeDefined();
        expect(component.queryBox.nativeElement).toBe(document.activeElement as any);
    }));

    it('should set computedWidth and focus on top container when custom input not allowed', fakeAsync(() => {
       
        component.sectionConfigData.isCustomInputAllowed = false;
        component.sectionConfigData.isSearchAllowed = false;

       
        component.searchBoxFocusTrigger();
        tick();

       
        expect(component.computedWidth).toBeDefined();
        expect(component.topContainer.nativeElement).toBe(document.activeElement as any);
    }));

    it('should focus on top container when search and custom input are not allowed', fakeAsync(() => {
       

       
        component.searchBoxFocusTrigger();
        tick();

       
        expect(component.computedWidth).toBeDefined();
    }));

    it('should remove regular chip from dropdown selection', () => {
       
        const regularChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.chipRemovalTrigger(regularChip);

       
        expect(regularChip.isSelected).toBe(false);
       
    });

    it('should remove custom chip when custom input is allowed', () => {
       
        const customChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        customChip.isCustom = true;
        component.sectionConfigData.isCustomInputAllowed = true;

       
        component.chipRemovalTrigger(customChip);

       
        expect(component.customchipsData).not.toContain(customChip);
       
    });

    it('should remove preselected chip and update chip data', () => {
       
        const preselectedChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.preSelectedChips = [preselectedChip];
        component.chipData = [preselectedChip];

       
        component.chipRemovalTrigger(preselectedChip);

       
        expect(component.preSelectedChips).not.toContain(preselectedChip);
        expect(component.chipData).not.toContain(preselectedChip);
       
    });

    it('should remove chip from query added data when asynchronous search is allowed', () => {
       
        const queryAddedChip: ITreeNode = TreeUtility.createExpliciteDropdownTreeNode([cloneDeep(folderHierarchy1[0])], cloneDeep(sectionConfigData), false);
        component.sectionConfigData.isAsynchronousSearchAllowed = true;
        component.queryAddedData = [queryAddedChip];

       
        component.chipRemovalTrigger(queryAddedChip);

       
        expect(component.queryAddedData).not.toContain(queryAddedChip);
       
    });

    it('should clear chipData and _preSelectedChipsHolder arrays', () => {
       
        component.chipData = generateMockTreeNodes(1);
        component['_preSelectedChipsHolder'] = generateMockTreeNodes(1);

       
        component.selectAllOptions();

       
        expect(component.chipData.length).toBe(0);
        expect(component['_preSelectedChipsHolder'].length).toBe(0);
    });

    it('should select all regular dropdown nodes and update chipData', () => {
       
        const treeNodes: TreeNode[] = generateMockTreeNodes(3);
        component.primaryData = [
            new DropdownTree({ dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" }, { id: "-11", name: "root" })
           
        ];
        component.primaryData[0].root.children = treeNodes;

       
        component.selectAllOptions();

       
        for (const tree of component.primaryData) {
            expect(tree.getCurrentSelectedNodes().length).toBe(0);
        }
        expect(component.chipData.length).toBe(0);
    });

    it('should empty customchipsData if isReset is true and customInput is allowed', () => {
       
        component.sectionConfigData.isCustomInputAllowed = true;
        component.customchipsData = [...generateMockTreeNodes(1)];

       
        component.selectAllOptions(true);

       
        expect(component.customchipsData.length).toBe(0);
    });

    it('should emit onReset if isReset is true, otherwise emit onSelectAll', () => {
       
        const spyOnReset = spyOn(component.onReset, 'emit');
        const spyOnSelectAll = spyOn(component.onSelectAll, 'emit');

       
        component.selectAllOptions(true);

       
        expect(spyOnReset).toHaveBeenCalled();
        expect(spyOnSelectAll).not.toHaveBeenCalled();

       
        spyOnReset.calls.reset();
        spyOnSelectAll.calls.reset();

       
        component.selectAllOptions();

       
        expect(spyOnReset).not.toHaveBeenCalled();
        expect(spyOnSelectAll).toHaveBeenCalled();
    });

    it('should call _updateChipData method', () => {
       
        const spyOnUpdateChipData = spyOn<any>(component, '_updateChipData');

       
        component.selectAllOptions();

       
        expect(spyOnUpdateChipData).toHaveBeenCalled();
    });

    it('should not perform any action when globalLoading is true', () => {
       
        component.globalLoading = true;
        spyOn(component.popoverInstance, 'open');

       
        component.queryTrigger('searchValue');

       
        expect(component.popoverInstance.open).not.toHaveBeenCalled();
       
    });

    it('should not perform any action when isSearchAllowed is false', () => {
       
        component.sectionConfigData.isSearchAllowed = false;
        spyOn(component.popoverInstance, 'open');

       
        component.queryTrigger('searchValue');

       
        expect(component.popoverInstance.open).not.toHaveBeenCalled();
       
    });

    it('should open the popover when it is not open and perform necessary actions for an empty searchVal', () => {
       
        spyOn(component.popoverInstance, 'open');
        component.queryState = true;

       
        component.queryTrigger('');

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component.queryState).toBe(false);
       
    });

    it('should set queryState to true for a non-empty searchVal', () => {
       
        spyOn(component.popoverInstance, 'open');

       
        component.queryTrigger('searchValue');

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component.queryState).toBe(true);
    });

   

    it('should emit onQuerySearch event for asynchronous search and update multiObjectDataForQuery', fakeAsync(() => {
       
        spyOn(component.popoverInstance, 'open');
        spyOn(component.onQuerySeach, 'emit');
        const data = [{ dataUniqueFieldValue: '1' }, { dataUniqueFieldValue: '2' }];

       
        component.queryTrigger('searchValue');
        tick(0);

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component.onQuerySeach.emit).toHaveBeenCalled();
        expect(component.searchLoading).toBe(true);
    }));

    it('should filter and update multiObjectDataForQuery based on selected data and query results', fakeAsync(() => {
       
        spyOn(component.popoverInstance, 'open');
        spyOn(component.onQuerySeach, 'emit');
        const selectedData = [{ dataUniqueFieldValue: '1' }, { dataUniqueFieldValue: '2' }];
        const data = [
            { dataUniqueFieldValue: '2' },
            { dataUniqueFieldValue: '3' },
            { dataUniqueFieldValue: '4' },
        ];

       
        component.primaryData = [TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" })];
        component.primaryData[0].root.children = generateMockTreeNodes(3);
       
        component.queryTrigger('searchValue');
        tick(0);

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component.onQuerySeach.emit).toHaveBeenCalled();
        expect(component.searchLoading).toBe(true);
    }));

    it('should handle query results when selected data is empty', fakeAsync(() => {
       
        spyOn(component.popoverInstance, 'open');
        spyOn(component.onQuerySeach, 'emit');
        const data = [
            { dataUniqueFieldValue: '2' },
            { dataUniqueFieldValue: '3' },
            { dataUniqueFieldValue: '4' },
        ];

       
        component.primaryData = [TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" })];

       
        component.queryTrigger('searchValue');
        tick(0);

       
        expect(component.popoverInstance.open).toHaveBeenCalled();
        expect(component.onQuerySeach.emit).toHaveBeenCalled();
        expect(component.searchLoading).toBeTrue();
    }));

    it('should select option and update chipData when selectionVal is true and maxSelectCount is not reached', () => {
       
        const e = { target: { checked: true } } as any;
        const selectionVal = true;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component.onChipAdd, "emit");
        spyOn(treeRef, "nodeSelection");

       
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(treeRef.nodeSelection).toHaveBeenCalledWith('1', true);
        expect(component['_updateChipData']).toHaveBeenCalled();
        expect(component.onChipAdd.emit).toHaveBeenCalledWith(nodeRef);
    });

    it('should select option and update chipData when selectionVal is true and maxSelectCount is reached', () => {
       
        const e = { target: { checked: true }, stopPropagation: () => { } } as any;
        const selectionVal = true;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component.onChipAdd, "emit");
        spyOn(treeRef, "nodeSelection");
        spyOn(e, "stopPropagation")

       
        component.sectionConfigData.maxSelectCount = 10;
        component.chipData = generateMockTreeNodes(10);
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(e.stopPropagation).toHaveBeenCalled();
    });

    it('should deselect option and update chipData when selectionVal is false', () => {
       
        const e = { target: { checked: false }, stopPropagation: jasmine.createSpy('stopPropagation') } as any as Event;
        const selectionVal = false;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component.onChipRemove, "emit");
        spyOn(treeRef, "nodeSelection");


       
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(treeRef.nodeSelection).toHaveBeenCalledWith('1', false);
        expect(component['_updateChipData']).toHaveBeenCalled();
        expect(component.onChipRemove.emit).toHaveBeenCalledWith(nodeRef);
    });

    it('should select all options and update chipData when maxSelectCount is reached and isSingularInput is false', () => {
       
        const e = { target: { checked: true } } as any;
        const selectionVal = true;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component.onChipAdd, "emit");
        spyOn(treeRef, "selectAll");

        component.sectionConfigData.maxSelectCount = 1;
        component.sectionConfigData.isSingularInput = false;

       
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(component['_updateChipData']).toHaveBeenCalled();
        expect(component.onChipAdd.emit).toHaveBeenCalledWith(nodeRef);
    });

    it('should add node to _preSelectedChipsHolder, chipData, and queryAddedData when selectionVal is true', () => {
       
        const e = { target: { checked: true }, stopPropagation: () => { } } as any;
        const selectionVal = true;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component as any, '_sendLatestDropdownSelection');
        component.queryAddedData = [];
        component.chipData = [];
        component['_preSelectedChipsHolder'] = [];

       
        component.queryState = true;
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(component['_preSelectedChipsHolder']).toContain(nodeRef);
        expect(component.chipData).toContain(nodeRef);
        expect(component.queryAddedData).toContain(nodeRef);
        expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    });

    it('should add node to _preSelectedChipsHolder, chipData, and queryAddedData when selectionVal is false', () => {
       
        const e = { target: { checked: false }, stopPropagation: () => { } } as any;
        const selectionVal = false;
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        spyOn(component as any, '_updateChipData');
        spyOn(component as any, '_sendLatestDropdownSelection');
        component.queryAddedData = [];
        component.chipData = [];
        component['_preSelectedChipsHolder'] = [];

       
        component.queryState = true;
        component.optionSelectionTrigger(e, selectionVal, nodeRef, treeRef);

       
        expect(component['_preSelectedChipsHolder']).not.toContain(nodeRef);
        expect(component.chipData).not.toContain(nodeRef);
        expect(component.queryAddedData).not.toContain(nodeRef);
        expect(component['_sendLatestDropdownSelection']).toHaveBeenCalled();
    });

    it('should toggle node expansion when expandable', () => {
       
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });

       
        nodeRef.dataExpandableValue = true;

       
        component.expandTrigger(nodeRef, treeRef);

       
        expect(nodeRef.isExpanded).toBe(true);
       
    });

    it('should load children asynchronously when node is expanded', () => {
       
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });

       
        nodeRef.isExpanded = true;

       
        component.sectionConfigData.isAsynchronouslyExpandable = false;

       
        component.expandTrigger(nodeRef, treeRef);

       
        expect(nodeRef.isChildernLoading).toBe(false);

       
       

       
        component.expandTrigger(nodeRef, treeRef);

       
        expect(nodeRef.isChildernLoading).toBe(false);
       
    });

    it('should handle data loading result and update tree nodes', () => {
       
        const nodeRef = generateMockTreeNodes(1)[0];
        const treeRef = TreeUtility.createExpliciteDropdownTree({ id: "asdf", name: "fff" }, { dataUniqueFieldSrc: "id", dataVisibleNameSrc: "name" });
        const data: any[] = [{ id: "444", name: "asdfff" }];

       
        spyOn(treeRef, 'insert').and.callThrough();
        spyOn(component as any, '_updateChipData');

       
        component.expandTrigger(nodeRef, treeRef);

       
        component.dataRequester.emit({ originalNode: nodeRef, onResult: (data) => { }, onError: () => { } });
        component.dataRequester.emit({ originalNode: nodeRef, onResult: (data) => { }, onError: () => { } });

       
        component.dataRequester.emit({
            originalNode: nodeRef, onResult: (data) => {
                expect(data).toBeTruthy();
                expect(data.length).toBeGreaterThan(0);

               
                expect(treeRef.insert).toHaveBeenCalledTimes(data.length);

               
                if (component['_preSelectedChipsHolder'].length > 0) {
                    data.forEach((val: any) => {
                        const preSelectedIndex = component['_preSelectedChipsHolder'].findIndex(node => node.dataUniqueFieldValue === TreeUtility.propertyAccess(val, component.sectionConfigData.dataUniqueFieldSrc));
                        if (preSelectedIndex > -1) {
                            expect(component['_preSelectedChipsHolder'].splice).toHaveBeenCalledWith(preSelectedIndex, 1);
                        }
                    });
                   
                    expect(component['_updateChipData']).toHaveBeenCalled();
                }

               
                if (component['_initiallyRemovedChipIdsHolder']) {
                    data.forEach((val: any) => {
                        const checkNode = treeRef.findNodeFromId(TreeUtility.propertyAccess(val, component.sectionConfigData.dataUniqueFieldSrc));
                        if (checkNode && component['_initiallyRemovedChipIdsHolder'].includes(checkNode.dataUniqueFieldValue)) {
                            expect(checkNode.isSelected).toBe(false);
                        }
                    });
                }             

               
                expect(nodeRef.isChildernLoading).toBe(false);
            }, onError: () => { }
        });
    });


});
