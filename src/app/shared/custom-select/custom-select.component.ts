import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IDropDownTreeConfig, IDropdownNodeChangeDetection } from '../interfaces/custom-select.inteface';
import { TreeNode } from '../utility/tree/TreeNode';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CustomChipsComponent } from '../custom-chips/custom-chips.component';
import { IExternalDataRequest } from '../interfaces/custom-select.inteface';
import { TreeUtility } from '../utility/tree/TreeUtility';
import { Tree } from '../utility/tree/Tree';
import { DropdownTree } from '../utility/tree/DropdownTree';

@Component({
	selector: 'app-custom-select',
	templateUrl: './custom-select.component.html',
	styleUrls: ['./custom-select.component.scss'],
	host: {
		'(window:resize)': 'onResize($event)'
	}
})
export class CustomSelectComponent implements OnInit, OnDestroy {

	@ViewChild('queryBox') queryBox!: ElementRef<HTMLInputElement>;
	@ViewChild('topContainer') topContainer!: ElementRef<HTMLDivElement>;
	@ViewChild('chipsContainer') chipsContainer!: CustomChipsComponent;
	@ViewChild('popoverInstance') popoverInstance!: NgbPopover;

	@Input('primaryData') get primaryData(): any[] { return this._primaryDataHolder; };
	@Input('sectionConfigData') sectionConfigData!: IDropDownTreeConfig;
	@Input('globalLoading') globalLoading: boolean = false;
	@Input('preSelectedObjectIds') preSelectedObjectIds: (string | number)[] = [];
	@Input('preSelectedChips') get preSelectedChips(): any[] { return this._preSelectedChipsHolder; };
	@Input('dropdownFormControl') dropdownFormControl: AbstractControl = new FormControl(); // done
	@Input('isRequired') isRequired: boolean = true; // done
	@Input('isDisabled') isDisabled: boolean = false; // done
	@Input('minSelectCount') minSelectCount: number = 1; // done
	@Input('maxSelectCount') maxSelectCount!: number; // done
	@Input('isSingularInput') isSingularInput: boolean = false; // done
	@Input('readOnlyChips') readOnlyChips: boolean = false; // done
	@Input('isCustomInputAllowed') isCustomInputAllowed: boolean = false; // done
	@Input('isSearchAllowed') isSearchAllowed: boolean = true; //done
	@Input('isClientSideSearchAllowed') isClientSideSearchAllowed: boolean = true; //done
	@Input('isAsynchronousSearch') isAsynchronousSearch: boolean = false; // done
	@Input('isResetOptionVisible') isResetOptionVisible: boolean = true; // done
	@Input('isSelectAllAvailable') isSelectAllAvailable: boolean = true; // done
	@Input('placeholderKey') placeholderKey: string = ''; // done
	@Input('noDataMessageKey') noDataMessageKey: string = ''; // done
	@Input('isMultipleLevel') isMultipleLevel: boolean = true; // done
	@Input('isAsynchronouslyExpandable') isAsynchronouslyExpandable: boolean = true; // done
	@Input('isCustomAllSelectOption') isCustomAllSelectOption: boolean = false; // done
	@Input('customAllSelectOptionUniqueId') customAllSelectOptionUniqueId!: string | number; // done
	@Input('customAllSelectOptionNameKey') customAllSelectOptionNameKey: string = ''; // done
	@Input('isHierarchySelectionModificationAllowed') isHierarchySelectionModificationAllowed: boolean = true;
	@Input('invalidMessage') invalidMessage: string = '';
	@Input('externalValidation') externalValidation: boolean = true;

	@Output('selectionChange') selectionChange: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();
	@Output('initialLoad') initialLoad: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('errorMessage') errorMessage: EventEmitter<any> = new EventEmitter<any>();
	@Output('dataRequester') dataRequester: EventEmitter<IExternalDataRequest> = new EventEmitter<IExternalDataRequest>(); // done
	@Output('onQuerySeach') onQuerySeach: EventEmitter<IExternalDataRequest> = new EventEmitter<IExternalDataRequest>(); // done
	@Output('onReset') onReset: EventEmitter<void> = new EventEmitter<void>(); // done
	@Output('onSelectAll') onSelectAll: EventEmitter<void> = new EventEmitter<void>(); //done
	@Output('onChipAdd') onChipAdd: EventEmitter<TreeNode> = new EventEmitter<TreeNode>(); // done
	@Output('onChipRemove') onChipRemove: EventEmitter<TreeNode> = new EventEmitter<TreeNode>(); // done
	@Output('onChipClick') onChipClick: EventEmitter<TreeNode> = new EventEmitter<TreeNode>(); // done
	@Output('onChipContextMenu') onChipContextMenu: EventEmitter<TreeNode> = new EventEmitter<TreeNode>(); // done

	// dropdown UI states
	public queryState: boolean = false;
	public openState: boolean = true;
	public invalidState: boolean = false;
	public isLoading: boolean = false;
	public isAllSelected: boolean = false;
	public isQueryFocused: boolean = false;
	public searchLoading: boolean = false;

	// other variables
	public computedWidth: string = '';
	public chipData: TreeNode[] = [];
	public queryData: TreeNode[] = [];
	public customchipsData: TreeNode[] = [];
	public preFilledData: TreeNode[] = [];
	public queryAddedData: TreeNode[] = [];
	public multiObjectData: DropdownTree[] = [];
	public multiObjectDataForQuery: TreeNode[] = [];

	private _primaryDataHolder: any[] = [];
	private _preSelectedChipsHolder: any[] = [];
	private _isDropdownCloseAllowed: boolean = true;

	constructor() { }

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		this.popoverInstance && this.popoverInstance.close();
	}

	public onResize(e: Event) {
		if (this.popoverInstance && this.popoverInstance.isOpen()) {
			this.popoverInstance.close();
			clearTimeout((<any>window)['resizedFinished']);
			(<any>window)['resizedFinished'] = setTimeout(() => {
				this.computedWidth = `${parseInt(window.getComputedStyle(this.topContainer.nativeElement).width) + 8}px`;
				this.popoverInstance.open();
			}, 400);
		}
	}

	public dropdownOpenTrigger() {
		this.initialLoad.emit(true);
	}

	public dropdownCloseTrigger(): void {
		if (!this._isDropdownCloseAllowed) {
			this.popoverInstance.open();
			this._isDropdownCloseAllowed = true;
		}
		// reset the needed fields
	}

	public chipRemovalTrigger(chip: TreeNode) { }

	public searchBoxFocusTrigger() {
		if (this.popoverInstance.isOpen()) {
			this._isDropdownCloseAllowed = false;
		}
		else {
			this._isDropdownCloseAllowed = true;
		}

		this.computedWidth = `${parseInt(window.getComputedStyle(this.topContainer.nativeElement).width) + 8}px`;
		setTimeout(() => {
			if (this.queryBox) {
				if (this.isSearchAllowed) {
					this.queryBox.nativeElement.focus();
				}
				else {
					this.topContainer.nativeElement.focus();
				}
			}
		});
		this.chipsContainer && this.chipsContainer.resetActiveChip();
	}

	public queryTrigger(searchVal: string): void {

		if (this.globalLoading) return;

		!this.popoverInstance.isOpen() && this.popoverInstance.open();

		if (searchVal === '' || searchVal === undefined || searchVal === null) {
			this.queryState = false;
			return;
		}

		else {
			this.queryState = true;
		}

		searchVal = searchVal.toString().toLowerCase().trim();

		if (this.isClientSideSearchAllowed) {

		}

		if (this.isAsynchronousSearch) {

			this.searchLoading = true;

			this.onQuerySeach.emit({
				searchVal: searchVal,

				onResult: (data: any[]) => {
					this.searchLoading = false;
				},
				onError: () => {
					this.searchLoading = false;
				}
			});
		}
	}

	public addCustomChip(event: KeyboardEvent): void {

		let name = this.queryBox.nativeElement.value;
		if (this.isCustomInputAllowed === false || name === '' || name === undefined || name === null) {
			return;
		}
		else {
			this.queryState = true;
		}

		if (this.isCustomInputAllowed && event.key === "Enter") {

			let nodeOriginalData = {};
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataUniqueFieldSrc, new Date().getTime());
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataVisibleNameSrc, name);
			this.sectionConfigData.dataTooltipSrc && TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataTooltipSrc, name);

			let customChip = TreeUtility.createExpliciteTreeNode(nodeOriginalData, this.sectionConfigData, true);
			this.customchipsData.push(customChip);
			this.chipData.push(customChip);
			this.queryBox.nativeElement.value = '';
			this.onChipAdd.emit(customChip);
			this.queryState = false;
		}
		else {
			this.queryState = false;
			return;
		}
	}

	public activateLastChip(event: Event) {
		if (((event as InputEvent).inputType === "deleteContentBackward" || (event as InputEvent).inputType === "deleteWordBackward") && (event.target as any).value === "") {
			this.chipData[this.chipData.length - 1] && this.chipsContainer.activateChip(this.chipData[this.chipData.length - 1]);
			this.queryBox.nativeElement.blur();
		}
	}

	public selectAllOptions(isReset?: boolean) {

		for (let i = 0, multiObjectDataLen = this.multiObjectData.length; i < multiObjectDataLen; i++) {
			this.multiObjectData[i].selectAll(isReset);
		}

		(isReset || !this.isAllSelected) && this.onReset.emit();
	}

	public optionSelectionTrigger(selectionVal: boolean, nodeRef: TreeNode, treeRef: DropdownTree): void {
		treeRef.nodeSelection(nodeRef.dataUniqueFieldValue, selectionVal);
	}

	public expandTrigger(nodeRef: TreeNode, treeRef: DropdownTree): void {

		nodeRef.isChildernLoading = false;
	
		if (nodeRef.dataExpandableValue) {
		  nodeRef.isExpanded = !nodeRef.isExpanded;
		}
	
		if (nodeRef.isExpanded) {
		  nodeRef.isChildernLoading = true;
	
		  if ((nodeRef.children && nodeRef.children.length && nodeRef.children.length > 0) || !this.isAsynchronouslyExpandable) {
			nodeRef.isChildernLoading = false;
			return;
		  }
	
		  let paramObj = {
			sectiondData: treeRef,
			optionData: nodeRef
		  }
	
	
		  this.dataRequester.emit({
			onResult: (data: any) => {
		
			}
		  });
		}
	  }
	
}
