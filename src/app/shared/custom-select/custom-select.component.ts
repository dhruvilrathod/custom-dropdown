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
	@Input('preSelectedChips') get preSelectedChips(): TreeNode[] { return this._preSelectedChipsHolder; };
	@Input('dropdownFormControl') dropdownFormControl: AbstractControl = new FormControl();
	@Input('externalValidation') externalValidation: boolean = true;
	@Input('isDropdownDisabled') isDropdownDisabled: boolean = false;

	@Output('selectionChange') selectionChange: EventEmitter<TreeNode[]> = new EventEmitter<TreeNode[]>();
	@Output('initialLoad') initialLoad: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output('errorMessage') errorMessage: EventEmitter<string> = new EventEmitter<string>();
	@Output('dataRequester') dataRequester: EventEmitter<IExternalDataRequest> = new EventEmitter<IExternalDataRequest>();
	@Output('onQuerySeach') onQuerySeach: EventEmitter<IExternalDataRequest> = new EventEmitter<IExternalDataRequest>();
	@Output('onReset') onReset: EventEmitter<void> = new EventEmitter<void>();
	@Output('onSelectAll') onSelectAll: EventEmitter<void> = new EventEmitter<void>();
	@Output('onChipAdd') onChipAdd: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
	@Output('onChipRemove') onChipRemove: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
	@Output('onChipClick') onChipClick: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();
	@Output('onChipContextMenu') onChipContextMenu: EventEmitter<TreeNode> = new EventEmitter<TreeNode>();

	// dropdown UI states
	public queryState: boolean = false;
	public openState: boolean = true;
	public invalidState: boolean = false;
	public isLoading: boolean = false;
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
	private _preSelectedChipsHolder: TreeNode[] = [];
	private _initiallyRemovedChipIdsHolder: (string | number)[] = [];
	private _isDropdownCloseAllowed: boolean = true;

	constructor() { }

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		this.popoverInstance && this.popoverInstance.close();
	}

	get isAllSelected(): boolean {
		return this.primaryData.reduce<boolean>((acc: boolean, val: IDropdownTree) => val.isAllSelected && acc, true);
	}

	set primaryData(value: IDropdownTree[]) {

		if (value) {
			this._primaryDataHolder = value;
			if (this._primaryDataHolder.length === 0) {
				this.chipData = [];
			}
			else {
				let treeLen = value.length;
				for (let t = 0; t < treeLen; t++) {
					let childrenLen = value[t].root.children.length;
					for (let c = 0; c < childrenLen; c++) {

						let preSelectedIndex = this._preSelectedChipsHolder.findIndex((node: TreeNode) => (node.dataUniqueFieldValue === value[t].root.children[c].dataUniqueFieldValue) || this._initiallyRemovedChipIdsHolder.includes(node.dataUniqueFieldValue));
						preSelectedIndex > -1 && this._preSelectedChipsHolder.splice(preSelectedIndex, 1);

						if (this._initiallyRemovedChipIdsHolder.includes(value[t].root.children[c].dataUniqueFieldValue)) {
							value[t].root.children[c].isSelected = false;
							this._initiallyRemovedChipIdsHolder.splice(this._initiallyRemovedChipIdsHolder.indexOf(value[t].root.children[c].dataUniqueFieldValue), 1);
						}

					}
				}
			}

			this.isLoading = false;
		}
	}

	set preSelectedChips(value: TreeNode[]) {
		if (value && value.length && value.length > 0) {
			this._preSelectedChipsHolder = value;
			this.chipData.push(...value);
			this._updateChipData();
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

		this._preventDropdownStateChange();

		// for regular chips added from the dropdown
		chip.isSelected = false;

		// if custom input is allowed
		if (this.sectionConfigData.isCustomInputAllowed && chip.isCustom) {
			let deleteIndex = this.customchipsData.indexOf(chip);
			deleteIndex > -1 && this.customchipsData.splice(deleteIndex, 1);
		}

		let isPreselectedChipRemoved: boolean = false;

		let preSelectedIndex: number = this.preSelectedChips.findIndex((data: TreeNode) => data.dataUniqueFieldValue === chip.dataUniqueFieldValue);

		if (preSelectedIndex > -1 && this.chipData.includes(chip)) {

			this.preSelectedChips.splice(preSelectedIndex, 1);

			let chipDataIndex: number = this.chipData.indexOf(chip);
			chipDataIndex > -1 && this.chipData.splice(chipDataIndex, 1);

			isPreselectedChipRemoved = true;

			let treeLen = this.primaryData.length;

			if (treeLen === 0) {
				!this._initiallyRemovedChipIdsHolder.includes(chip.dataUniqueFieldValue) && this._initiallyRemovedChipIdsHolder.push(chip.dataUniqueFieldValue);
			}
			else {
				for (let t = 0; t < treeLen; t++) {
					let treePreselectedDeleteIndex: number = this.primaryData[t].preSelectedFieldValues.findIndex((val: TreeNode) => val.dataUniqueFieldValue === chip.dataUniqueFieldValue);
					treePreselectedDeleteIndex > -1 && this.primaryData[t].preSelectedFieldValues.splice(treePreselectedDeleteIndex, 1);
				}
			}
		}

		if (this.sectionConfigData.isAsynchronousSearchAllowed && this.queryAddedData.length > 0) {
			let queryAddedDataIndex = this.queryAddedData.findIndex((val) => val.dataUniqueFieldValue === chip.dataUniqueFieldValue);
			queryAddedDataIndex > -1 && this.queryAddedData.splice(queryAddedDataIndex, 1);
		}

		this.onChipRemove.emit(chip);

		this._updateChipData(!isPreselectedChipRemoved);
	}

	public searchBoxFocusTrigger() {

		this._preventDropdownStateChange();

		this.computedWidth = `${parseInt(window.getComputedStyle(this.topContainer.nativeElement).width) + 8}px`;
		setTimeout(() => {
			if (this.queryBox) {
				if (this.sectionConfigData.isSearchAllowed || this.sectionConfigData.isCustomInputAllowed) {
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

		if (this.globalLoading || !this.sectionConfigData.isSearchAllowed) return;

		!this.popoverInstance.isOpen() && this.popoverInstance.open();
		this.multiObjectDataForQuery = [TreeUtility.createExpliciteDropdownTree({}, this.sectionConfigData)];

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
					let allCurrentSelectedIds: (string | number)[] = [];

					this.primaryData.forEach((tree: IDropdownTree) => allCurrentSelectedIds.push(...tree.currentSelectedDataUniqueFieldValues));

					if (data && data.length && data.length > 0 && this.multiObjectDataForQuery && this.multiObjectDataForQuery[0]) {
						this.multiObjectDataForQuery[0].root.children.push(...data
							.filter((val) => !allCurrentSelectedIds.includes(TreeUtility.propertyAccess(val, this.sectionConfigData.dataUniqueFieldSrc)))
							.map((val) => {
								let uniqueId = TreeUtility.propertyAccess(val, this.sectionConfigData.dataUniqueFieldSrc);
								let preSelectedIndex = this._preSelectedChipsHolder.findIndex((node: TreeNode) => node.dataUniqueFieldValue === uniqueId);
								let queryAddedDataIndex = this.queryAddedData.findIndex((node: TreeNode) => node.dataUniqueFieldValue === uniqueId);
								return TreeUtility.createExpliciteDropdownTreeNode(val, this.sectionConfigData, preSelectedIndex > -1 || queryAddedDataIndex > -1);
							}));
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
		if (this.sectionConfigData.isCustomInputAllowed === false || this.chipData.length === this.sectionConfigData.maxSelectCount) {
			return;
		}

		let name = this.queryBox.nativeElement.value;
		if (name === '' || name === undefined || name === null) {
			return;
		}
		else if(this.sectionConfigData.isSearchAllowed) {
			this.queryState = true;
		}

		if (this.sectionConfigData.isCustomInputAllowed && event.key === "Enter") {

			let nodeOriginalData = {};
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataUniqueFieldSrc, new Date().getTime());
			TreeUtility.propertyAdd(nodeOriginalData, this.sectionConfigData.dataVisibleNameSrc, name);
			TreeUtility.propertyAdd(nodeOriginalData, "isCustom", true);
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

	public selectAllOptions(isReset: boolean = false) {
		this.chipData = [];
		this._preSelectedChipsHolder = [];

		// select all regular dropdown nodes
		this.primaryData.forEach((val: IDropdownTree) => {
			val.selectAll(isReset);
		});

		// empty custom chips if configuration available
		if (isReset && this.sectionConfigData.isCustomInputAllowed) {
			this.customchipsData = [];
		}

		isReset ? this.onReset.emit() : this.onSelectAll.emit();
		this._updateChipData();

	}

	public optionSelectionTrigger(e: Event, selectionVal: boolean, nodeRef: TreeNode, treeRef: IDropdownTree): void {

		if (selectionVal && this.chipData.length === this.sectionConfigData.maxSelectCount) {
			if (this.sectionConfigData.isSingularInput) {
				this.selectAllOptions(true);
			}
			else {
				(e.target as HTMLInputElement).checked = false;
				e.stopPropagation();
				return;
			}
		}

		!this.queryState && treeRef.nodeSelection(nodeRef.dataUniqueFieldValue, selectionVal);
		!this.queryState && this._updateChipData();

		if (this.queryState) {

			let foundLocaly: boolean = !this.primaryData.every((tree: IDropdownTree) => {
				if (tree.findNodeFromId(nodeRef.dataUniqueFieldValue)) return false;
				else return true;
			});

			if (!foundLocaly) {

				if (selectionVal) {
					this._preSelectedChipsHolder.push(nodeRef);
					this.chipData.push(nodeRef);
					this.queryAddedData.push(nodeRef);
				}
				else {
					let chipDataIndex = this.chipData.findIndex((val) => val.dataUniqueFieldValue === nodeRef.dataUniqueFieldValue);
					chipDataIndex > -1 && this.chipData.splice(chipDataIndex, 1);

					let queryAddedDataIndex = this.queryAddedData.findIndex((val) => val.dataUniqueFieldValue === nodeRef.dataUniqueFieldValue);
					queryAddedDataIndex > -1 && this.queryAddedData.splice(queryAddedDataIndex, 1);

					let preSelectedIndex = this._preSelectedChipsHolder.findIndex((val) => val.dataUniqueFieldValue === nodeRef.dataUniqueFieldValue);
					preSelectedIndex > -1 && this._preSelectedChipsHolder.splice(preSelectedIndex, 1);
				}
			}
			else {
				treeRef.nodeSelection(nodeRef.dataUniqueFieldValue, selectionVal)
			}

		}

		selectionVal ? this.onChipAdd.emit(nodeRef) : this.onChipRemove.emit(nodeRef);
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
					if (data && data.length && data.length > 0) {
						data.forEach((val: any) => {
							treeRef.insert(nodeRef.dataUniqueFieldValue, val);
							if (this._preSelectedChipsHolder.length > 0) {
								let preSelectedIndex = this._preSelectedChipsHolder.findIndex((node: TreeNode) => node.dataUniqueFieldValue === TreeUtility.propertyAccess(val, this.sectionConfigData.dataUniqueFieldSrc));
								preSelectedIndex > -1 && this._preSelectedChipsHolder.splice(preSelectedIndex, 1);

								this._updateChipData();
							}

							let checkNode = treeRef.findNodeFromId(TreeUtility.propertyAccess(val, this.sectionConfigData.dataUniqueFieldSrc));
							if (this._initiallyRemovedChipIdsHolder) {
								if (checkNode && this._initiallyRemovedChipIdsHolder.includes(checkNode.dataUniqueFieldValue)) {
									checkNode.isSelected = false;
								}
							}

							if (checkNode && this.sectionConfigData.isAsynchronousSearchAllowed && this.queryAddedData.length > 0) {
								let queryAddedDataIndex = this.queryAddedData.findIndex((n) => n.dataUniqueFieldValue === checkNode!.dataUniqueFieldValue);
								if(queryAddedDataIndex > -1) {
									this.queryAddedData.splice(queryAddedDataIndex, 1);
									checkNode.isSelected = true;
								}
							}

						});
					}
					nodeRef.isChildernLoading = false;
				},
				onError: () => {
					nodeRef.isChildernLoading = false;
				}
			});
		}
	}

	private _updateChipData(rearrangeChipData: boolean = true): void {

		// adding regular selected chips from dropdown
		if (rearrangeChipData) {
			if (this.primaryData.length > 0) {
				this.chipData = [];
				this.primaryData.forEach((val: IDropdownTree) => {

					this.chipData.push(...val.getCurrentSelectedNodes());
				});
			}

			if (this._preSelectedChipsHolder.length > 0) {
				this._preSelectedChipsHolder = this._preSelectedChipsHolder.filter((val: TreeNode) => val.isSelected === true);

			}
		}

		// adding custom added chips if custom input is allowed
		if (this.sectionConfigData.isCustomInputAllowed) {
			this.chipData.push(...this.customchipsData);
		}

		// adding custom added chips if asynchronous search is allowed
		if (this.sectionConfigData.isAsynchronousSearchAllowed && this.queryAddedData.length > 0) {
			this.chipData.push(...this.queryAddedData);
		}

		this._sendLatestDropdownSelection();
	}

	private _sendLatestDropdownSelection(): void {
		let selectionNodes: TreeNode[] = [];
		for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
			!this.chipData[i].isCustom && selectionNodes.push(this.chipData[i]);
			this.chipData[i].isCustom && selectionNodes.push(this.chipData[i]);
		}
		this.invalidState = this._validateChipDataLength(selectionNodes);
		this.selectionChange.emit(selectionNodes);
		if (this.sectionConfigData.isSingularInput && selectionNodes.length === 1) {
			this.popoverInstance.close();
		}
		if (this.sectionConfigData.maxSelectCount !== undefined && this.sectionConfigData.maxSelectCount > 0 && selectionNodes.length === this.sectionConfigData.maxSelectCount) {
			this.popoverInstance.close();
		}
		if (this.chipData && this.chipData.length && this.chipData.length > 0) {
			let invalidChipFound = this.chipData.reduce<boolean>((acc, current) => { return (acc || (current.isInvalid ? current.isInvalid : false)) }, false);

			if (invalidChipFound) {
				this.invalidState = true;
			}
			else {
				this.invalidState = false;
			}
		}
	}

	private _validateChipDataLength(data: any[]): boolean {
		if (this.sectionConfigData.maxSelectCount !== undefined && this.sectionConfigData.minSelectCount !== undefined && (data.length < this.sectionConfigData.minSelectCount || (this.sectionConfigData.maxSelectCount > 0 && data.length > this.sectionConfigData.maxSelectCount))) {
			this.errorMessage.emit("Invalid length");
			return false;
		}
		else {
			return true;
		}
	}

	private _preventDropdownStateChange(): void {
		if (this.popoverInstance.isOpen()) {
			this._isDropdownCloseAllowed = false;
		}
		else {
			this._isDropdownCloseAllowed = true;
		}
	}
}
