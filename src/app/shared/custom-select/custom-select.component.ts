import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { IDropdownTree, IDropDownTreeConfig } from '../interfaces/custom-select.inteface';
import { TreeNode } from '../utility/tree/TreeNode';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CustomChipsComponent } from '../custom-chips/custom-chips.component';
import { IExternalDataRequest } from '../interfaces/custom-select.inteface';
import { TreeUtility } from '../utility/tree/TreeUtility';

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

	@Input('primaryData') get primaryData(): IDropdownTree[] { return this._primaryDataHolder; };
	@Input('sectionConfigData') sectionConfigData!: IDropDownTreeConfig;
	@Input('globalLoading') globalLoading: boolean = false;
	@Input('preSelectedObjectIds') preSelectedObjectIds: (string | number)[] = [];
	@Input('preSelectedChips') get preSelectedChips(): any[] { return this._preSelectedChipsHolder; };
	@Input('dropdownFormControl') dropdownFormControl: AbstractControl = new FormControl();
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
	public multiObjectData: IDropdownTree[] = [];
	public multiObjectDataForQuery?: IDropdownTree[] = [];

	private _primaryDataHolder: IDropdownTree[] = [];
	private _preSelectedChipsHolder: any[] = [];
	private _isDropdownCloseAllowed: boolean = true;

	constructor() { }

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		this.popoverInstance && this.popoverInstance.close();
	}


	set primaryData(value: IDropdownTree[]) {
		console.log(value);

		if (value) {
			this._primaryDataHolder = value;
			if (this._primaryDataHolder.length === 0) {
				this.chipData = [];
			}

			this.isLoading = false;
		}
	}

	set preSelectedChips(value: any[]) {
		if (value) {

		}
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
		this.multiObjectDataForQuery = undefined;
		this.queryState = false;
		// reset the needed fields
	}

	public chipRemovalTrigger(chip: TreeNode) {
		chip.isSelected = false;
		this._updateChipData();
	}

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
				if (this.sectionConfigData.isSearchAllowed) {
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
		this.multiObjectDataForQuery = [TreeUtility.createExpliciteDropdownTree({}, this.sectionConfigData, new Date().getTime().toString())];

		if (searchVal === '' || searchVal === undefined || searchVal === null) {
			this.queryState = false;
			return;
		}

		else {
			this.queryState = true;
		}

		searchVal = searchVal.toString().toLowerCase().trim();

		if (this.sectionConfigData.isClientSideSearchAllowed) {
			let searchNodes: TreeNode[] = [];

			this.primaryData.forEach((val: IDropdownTree) => {
				searchNodes.push(...val.findNodes(searchVal));
			});

			this.multiObjectDataForQuery[0].root.children.push(...searchNodes);
		}

		if (this.sectionConfigData.isAsynchronousSearchAllowed) {

			this.searchLoading = true;

			this.onQuerySeach.emit({
				searchVal: searchVal,

				onResult: (data: any[]) => {
					console.log(data);
					if (data && data.length && data.length > 0 && this.multiObjectDataForQuery && this.multiObjectDataForQuery[0]) {
						this.multiObjectDataForQuery[0].root.children.push(...data.map((val) => TreeUtility.createExpliciteDropdownTreeNode(val, this.sectionConfigData)));
					}
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
		if (this.sectionConfigData.isCustomInputAllowed === false || name === '' || name === undefined || name === null) {
			return;
		}
		else {
			this.queryState = true;
		}

		if (this.sectionConfigData.isCustomInputAllowed && event.key === "Enter") {

			let nodeOriginalData = {};
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataUniqueFieldSrc, new Date().getTime());
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataVisibleNameSrc, name);
			this.sectionConfigData.dataTooltipSrc && TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataTooltipSrc, name);

			let customChip = TreeUtility.createExpliciteDropdownTreeNode(nodeOriginalData, this.sectionConfigData, true);
			this.customchipsData.push(customChip);
			this.chipData.push(customChip);
			this.queryBox.nativeElement.value = '';
			this.onChipAdd.emit(customChip);
			this.queryState = false;
		}
	}

	public activateLastChip(event: Event) {
		if (((event as InputEvent).inputType === "deleteContentBackward" || (event as InputEvent).inputType === "deleteWordBackward") && (event.target as any).value === "") {
			this.chipData[this.chipData.length - 1] && this.chipsContainer.activateChip(this.chipData[this.chipData.length - 1]);
			this.queryBox.nativeElement.blur();
		}
	}

	public selectAllOptions(isReset?: boolean) {

		this.primaryData.forEach((val: IDropdownTree) => {
			val.selectAll(isReset);
		});

		this._updateChipData();

		(isReset || !this.isAllSelected) && this.onReset.emit();
	}

	public optionSelectionTrigger(selectionVal: boolean, nodeRef: TreeNode, treeRef: IDropdownTree): void {
		console.log(treeRef, nodeRef);
		treeRef.nodeSelection(nodeRef.dataUniqueFieldValue, selectionVal);
		this._updateChipData();
	}

	public expandTrigger(nodeRef: TreeNode, treeRef: IDropdownTree): void {

		nodeRef.isChildernLoading = false;

		if (nodeRef.dataExpandableValue) {
			nodeRef.isExpanded = !nodeRef.isExpanded;
		}

		if (nodeRef.isExpanded) {
			nodeRef.isChildernLoading = true;

			if ((nodeRef.children && nodeRef.children.length && nodeRef.children.length > 0) || !this.sectionConfigData.isAsynchronouslyExpandable) {
				nodeRef.isChildernLoading = false;
				return;
			}

			this.dataRequester.emit({
				originalNode: nodeRef,
				onResult: (data: any) => {
					console.log(data);
					if (data && data.length && data.length > 0) {
						data.forEach((val: any) => {
							treeRef.insert(nodeRef.dataUniqueFieldValue, val);
						});
					}
					console.log(nodeRef.children);
					nodeRef.isChildernLoading = false;
				},
				onError: () => {
					nodeRef.isChildernLoading = false;
				}
			});
		}
	}

	private _updateChipData(): void {
		this.chipData = [];
		this.primaryData.forEach((val: IDropdownTree) => {
			console.log(val.getCurrentSelectedNodes());
			
			this.chipData.push(...val.getCurrentSelectedNodes());
		});
	}

}
