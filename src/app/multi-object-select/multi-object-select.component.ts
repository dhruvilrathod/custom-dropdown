import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChipChangeTrigger, DataRequester, DropDownDataOption, DropDownDataSection, MultiObjectSelection, SelectionChip } from '../multi-object-select/interfaces/multi-object-selection.interface';
import { DataChildrenSrcFields, DataExpandableSrcFields, DataFavouriteSrcFields, DataPathIdsSrcFields, DataTooltipSrcFields, DataTotalDocsSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, MultiObjectSelectionTypeId } from '../multi-object-select/enums/multi-object-selection.enum';
import { MultiObjectSelectionChipComponent } from './multi-object-chips/multi-object-chips.component';
import { AbstractControl, FormControl } from '@angular/forms';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-multi-object-select',
  templateUrl: './multi-object-select.component.html',
  styleUrls: ['./multi-object-select.component.scss'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MultiObjectSelectionComponent implements OnInit, OnChanges, OnDestroy {


  @ViewChild('queryBox') queryBox!: ElementRef<HTMLInputElement>;
  @ViewChild('topContainer') topContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chipsContainer') chipsContainer!: MultiObjectSelectionChipComponent;
  @ViewChild('popoverInstance') popoverInstance!: NgbPopover;

  @Input('data') data: any[] = [];
  @Input('sectionConfigData') sectionConfigData!: DropDownDataSection;
  @Input('globalLoading') globalLoading: boolean = false;
  @Input('preSelectedObjectIds') preSelectedObjectIds: (string | number)[] = [];
  @Input('preSelectedChips') preSelectedChips: any[] = [];
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

  @Output('selectionChange') selectionChange: EventEmitter<SelectionChip[]> = new EventEmitter<SelectionChip[]>();
  @Output('initialLoad') initialLoad: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('errorMessage') errorMessage: EventEmitter<any> = new EventEmitter<any>();
  @Output('dataRequester') dataRequester: EventEmitter<DataRequester> = new EventEmitter<DataRequester>(); // done
  @Output('onQuerySeach') onQuerySeach: EventEmitter<DataRequester> = new EventEmitter<DataRequester>(); // done
  @Output('onReset') onReset: EventEmitter<any> = new EventEmitter<any>(); // done
  @Output('onSelectAll') onSelectAll: EventEmitter<any> = new EventEmitter<any>(); //done
  @Output('onChipAdd') onChipAdd: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>(); // done
  @Output('onChipRemove') onChipRemove: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>(); // done
  @Output('onChipClick') onChipClick: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>(); // done
  @Output('onChipContextMenu') onChipContextMenu: EventEmitter<ChipChangeTrigger> = new EventEmitter<ChipChangeTrigger>(); // done

  public chipData: SelectionChip[] = [];

  public customChipData: SelectionChip[] = [];

  public prefilledChipData: SelectionChip[] = [];

  public queryAddedChipDataIds: (string | number)[] = [];

  public queryRemovededChipDataIds: (string | number)[] = [];

  public userAddedChipIds: (string | number)[] = [];

  public userRemovedChipIds: (string | number)[] = [];

  public multiObjectData!: MultiObjectSelection;

  public searchLoading: boolean = false;

  // dropdown states
  public queryState: boolean = false;
  public openState: boolean = true;
  public invalidState: boolean = false;
  public isLoading: boolean = false;
  public isAllSelected: boolean = false;
  public computedWidth: string = '';

  public multiObjectDataForQuery: MultiObjectSelection | undefined;

  public isQueryFocused: boolean = false;

  private _flattenDropdownOptions: DropDownDataOption[] = [];
  private _isDropdownCloseAllowed: boolean = true;
  private static _this: MultiObjectSelectionComponent;


  constructor(
  ) {
    MultiObjectSelectionComponent._this = this;
  }

  ngOnInit(): void {
    this._init();
  }

  ngOnChanges(changes: SimpleChanges): void {


    if (changes['data'] && changes['data'].currentValue) {
      this.multiObjectData = this.prepareDropDownData(this.data);
      this.setPreSelectedValues(this.multiObjectData.dropDownSections);
      this._setFlattenOptionsForQuery(this.multiObjectData.dropDownSections);

      this.isLoading = false;
    }

    if (changes['preSelectedChips'] && changes['preSelectedChips'].currentValue) {

      this.setPreSelectedValues(changes['preSelectedChips'].currentValue, true);
    }
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

  public focusSearch(e: Event | boolean) {
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

  public activateLastChip(event: Event) {
    if (((event as InputEvent).inputType === "deleteContentBackward" || (event as InputEvent).inputType === "deleteWordBackward") && (event.target as any).value === "") {
      this.chipData[this.chipData.length - 1] && this.chipsContainer.activateChip(this.chipData[this.chipData.length - 1]);
      this.queryBox.nativeElement.blur();
    }
  }

  public queryTrigger(searchVal: string): void {

    if (this.globalLoading) return;

    !this.popoverInstance.isOpen() && this.popoverInstance.open();
    this.multiObjectDataForQuery = undefined;

    if (searchVal === '' || searchVal === undefined || searchVal === null) {
      this.queryState = false;

      this._finalizeQuerySelectedOptions();
      return;
    }
    else {
      this.queryState = true;
    }

    searchVal = searchVal.toString().toLowerCase();

    if (this.isClientSideSearchAllowed) {

      let founded = this._flattenDropdownOptions.filter((val) => {
        return (
          val.dataVisibleNameValue?.toString().toLowerCase().includes(searchVal) ||
          val.dataTooltipValue?.toString().toLowerCase().includes(searchVal)
        )
      });

      if (founded.length > 0) {
        this.multiObjectDataForQuery = this.prepareDropDownData(founded, true);
      }
      else {
        this.multiObjectDataForQuery = this.prepareDropDownData([], true);
      }
    }

    if (this.isAsynchronousSearch) {

      this.searchLoading = true;
      this.onQuerySeach.emit({
        preparedData: {
          queryString: searchVal,
        },
        onResult: (data: any[]) => {

          if (!data || !data.length || data.length === 0) {
            data = [];
          }
          for (let i = 0, queryDataLen = this.multiObjectDataForQuery!.dropDownSections[0].children!.length; i < queryDataLen; i++) {
            let availableRecordIndex = data.findIndex((val) => this.multiObjectDataForQuery!.dropDownSections[0].children![i].dataUniqueFieldValue === MultiObjectSelectionComponent.dropdownPropertyAccess(val, this.sectionConfigData.dataUniqueFieldSrc!));

            if (availableRecordIndex > -1) {
              data.splice(availableRecordIndex, 1);
            }
          }

          this.multiObjectDataForQuery?.dropDownSections[0].children!.push(...data);
          this.multiObjectDataForQuery = this.prepareDropDownData(this.multiObjectDataForQuery?.dropDownSections[0].children!, true);
          this.searchLoading = false;
        },
        onError: () => {
          this.multiObjectDataForQuery = this.prepareDropDownData(this.multiObjectDataForQuery?.dropDownSections[0].children!, true);
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
      let newOptionData: DropDownDataOption = {
        dataVisibleNameValue: name,
        dataTooltipValue: name,
        dataUniqueFieldValue: new Date().getTime()
      }
      let chip = this._createChipData(newOptionData, true);
      this.customChipData.push(chip);
      this.chipData.push(chip);
      this.queryBox.nativeElement.value = '';
      this.onChipAdd.emit({ data: chip });
      this._sendLatestDropdownSelection();
      this.queryState = false;
    }
    else {
      this.queryState = false;
      return;
    }
  }

  public prepareDropDownData(data: (DropDownDataOption | DropDownDataSection)[], isQuery: boolean = false): MultiObjectSelection {
    if (isQuery) {
      let querySectionConfig = cloneDeep(this.sectionConfigData);
      Object.assign(querySectionConfig, {
        allowSectionSelection: false
      });
      data = [MultiObjectSelectionComponent.createSection(querySectionConfig, data)];
    }
    let multiObjectConfig: MultiObjectSelection = {
      dropDownSections: data
    }


    for (let i = 0, sectionsDataLen = multiObjectConfig.dropDownSections.length; i < sectionsDataLen; i++) {
      multiObjectConfig.dropDownSections[i].children = this.prepareDropDownOptions(multiObjectConfig.dropDownSections[i], multiObjectConfig.dropDownSections[i].children!, undefined, isQuery);
    }

    return multiObjectConfig;
  }

  public setPreSelectedValues(data: (DropDownDataSection | SelectionChip)[], preFilledChips: boolean = false): void {
    if (!data || !data.length || data.length === 0) {
      return;
    }

    else if (!preFilledChips) {
      for (let i = 0, dataLen = data.length; i < dataLen; i++) {
        for (let j = 0, dataLen = data[i].children.length; j < dataLen; j++) {
          if (data[i].children[j].isSelected) {
            this.preSelectedObjectIds.push(MultiObjectSelectionComponent.dropdownPropertyAccess(data[i].children[j], data[i].dataUniqueFieldSrc!));
          }
        }
      }
      this._modifyChipSection(this.multiObjectData.dropDownSections);
    }

    else {
      this.prefilledChipData = data;

      this.chipData.push(...this.prefilledChipData);
      if (this.multiObjectData.dropDownSections) {
        for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
          this._checkPrefilledChips(this.multiObjectData.dropDownSections[i].children!, this.multiObjectData.dropDownSections[i]);
        }
      }
    }

  }

  public prepareDropDownOptions(sectionData: DropDownDataSection, optionsData: DropDownDataOption[], currentLevel?: number, isQuery: boolean = false): DropDownDataOption[] {

    if (!sectionData || !optionsData || !optionsData.length || optionsData.length <= 0) {
      return [];
    }

    let optionIds: (string | number)[] = [];
    for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
      !this.chipData[i].isCustom && optionIds.push(this.chipData[i].dataUniqueFieldValue!);
      this.chipData[i].isCustom && optionIds.push(this.chipData[i].dataVisibleNameValue!);
    }


    for (let j = 0, dataLen = optionsData.length; j < dataLen; j++) {

      !optionsData[j].hasOwnProperty('dataUniqueFieldValue') && (optionsData[j].dataUniqueFieldValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataUniqueFieldSrc!));
      !optionsData[j].hasOwnProperty('dataVisibleNameValue') && (optionsData[j].dataVisibleNameValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataVisibleNameSrc!));
      !optionsData[j].hasOwnProperty('dataTooltipValue') && (optionsData[j].dataTooltipValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataTooltipSrc!));
      !optionsData[j].hasOwnProperty('dataExpandableValue') && (optionsData[j].dataExpandableValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataExpandableSrc!));
      !optionsData[j].hasOwnProperty('dataFavouriteValue') && (optionsData[j].dataFavouriteValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataFavouriteSrc!));
      !optionsData[j].hasOwnProperty('parentUniqueIdsValue') && (optionsData[j].parentUniqueIdsValue = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataParentUniqueIdsSrc!));
      !optionsData[j].hasOwnProperty('isDisabled') && (optionsData[j].isDisabled = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataDisabledSrc!));

      !optionsData[j].hasOwnProperty('levelIndex') && (optionsData[j].levelIndex = currentLevel ? (currentLevel + 1) : 1);
      !optionsData[j].hasOwnProperty('isSelected') && (optionsData[j].isSelected = false);
      !optionsData[j].hasOwnProperty('isPartiallySelected') && (optionsData[j].isPartiallySelected = false);
      !optionsData[j].hasOwnProperty('isDisabled') && (optionsData[j].isDisabled = false);
      !optionsData[j].hasOwnProperty('isExpanded') && (optionsData[j].isExpanded = false);
      !optionsData[j].hasOwnProperty('isExpandable') && (optionsData[j].isExpandable = false);
      !optionsData[j].hasOwnProperty('isChildernLoading') && (optionsData[j].isChildernLoading = false);
      !optionsData[j].hasOwnProperty('isVisible') && (optionsData[j].isVisible = true);

      !optionsData[j].hasOwnProperty('children') && !this.isAsynchronouslyExpandable && (optionsData[j].children = MultiObjectSelectionComponent.dropdownPropertyAccess(optionsData[j], sectionData.dataChildrenSrc!));
    }

    if (!isQuery) {
      for (let i = 0, dataLen = optionsData.length; i < dataLen; i++) {
        optionsData[i].isSelected && this.optionSelectionTrigger(true, optionsData[i], sectionData);
      }
    }

    else {
      for (let i = 0, dataLen = optionsData.length; i < dataLen; i++) {
        optionIds.includes(optionsData[i].dataUniqueFieldValue!) && (optionsData[i].isSelected = true);
      }
    }


    return optionsData;
  }

  public expandTrigger(dataSection: DropDownDataSection, dataOption: DropDownDataOption) {

    dataOption.isChildernLoading = false;

    if (dataOption.dataExpandableValue) {
      dataOption.isExpanded = !dataOption.isExpanded;
    }

    if (dataOption.isExpanded) {
      dataOption.isChildernLoading = true;

      if (dataOption.children || !this.isAsynchronouslyExpandable) {
        dataOption.isChildernLoading = false;
        return;
      }

      let paramObj = {
        sectiondData: dataSection,
        optionData: dataOption
      }


      this.dataRequester.emit({
        preparedData: paramObj,
        onResult: (data: any) => {
          dataOption.children = this.prepareDropDownOptions(dataSection, data, dataOption.levelIndex);

          if (!dataOption.isSelected) {
            for (let i = 0, dataLen = dataOption.children.length; i < dataLen; i++) {
              dataOption.children[i].isSelected && this.optionSelectionTrigger(true, dataOption.children[i], dataSection);
            }
          }
          else {
            this.optionSelectionTrigger(true, dataOption, dataSection);
          }

          this._flattenDropdownOptions = [];
          this._setFlattenOptionsForQuery(this.multiObjectData.dropDownSections);
          this._checkPrefilledChips(dataOption.children, dataSection); // works for children expanded after partial selection for asynchronous search
          dataOption.isChildernLoading = false;


        }
      });
    }
  }

  public optionSelectionTrigger(selected: boolean, optionsData: DropDownDataOption, sectionData: DropDownDataSection) {
    if (selected && (this.chipData.length === this.maxSelectCount)) {
      this.chipRemovalTrigger({ data: this.chipData.pop()!, section: sectionData });
    }
    if (this.multiObjectData) {
      if (selected) {
        !optionsData.isDisabled && (optionsData.isSelected = true);
        if (this.queryRemovededChipDataIds.includes(optionsData.dataUniqueFieldValue!)) {
          let queryIndex = this.queryRemovededChipDataIds.indexOf(optionsData.dataUniqueFieldValue!);
          queryIndex > -1 && this.queryRemovededChipDataIds.splice(queryIndex, 1);
        }
        let preSelectedChip = this.chipData.filter((val) => val.parentUniqueIdsValue?.includes(optionsData.dataUniqueFieldValue!));
        if (preSelectedChip && preSelectedChip.length === 1) {
          let deleteIndex = this.chipData.indexOf(preSelectedChip[0]);
          let deletedChipPrefilledIndex = this.prefilledChipData.indexOf(this.prefilledChipData.filter((val) => val.parentUniqueIdsValue?.includes(optionsData.dataUniqueFieldValue!))[0]);
          deleteIndex > -1 && this.chipData.splice(deleteIndex, 1);
          deletedChipPrefilledIndex > -1 && this.prefilledChipData.splice(deletedChipPrefilledIndex, 1);
        }
      }

      else {
        !optionsData.isDisabled && (optionsData.isSelected = false);
        if (this.queryAddedChipDataIds.includes(optionsData.dataUniqueFieldValue!)) {
          let queryIndex = this.queryAddedChipDataIds.indexOf(optionsData.dataUniqueFieldValue!);
          queryIndex > -1 && this.queryAddedChipDataIds.splice(queryIndex, 1);
        }
      }

      if (this.isSingularInput) {
        this._allSelectTrigger(false);
      }

      if (this.queryState) {

        if (this.chipData.findIndex(val => val.dataUniqueFieldValue === optionsData.dataUniqueFieldValue) === -1) {

          !optionsData.isDisabled && this.chipData.push(this._createChipData(optionsData));
          !optionsData.isDisabled && this.queryAddedChipDataIds.push(optionsData.dataUniqueFieldValue!);


          // this.prefilledChipData.push(optionsData);
        }
        else {

          let deleteIndex = this.chipData.findIndex(val => val.dataUniqueFieldValue === optionsData.dataUniqueFieldValue);
          let deletedChipPrefilledIndex = this.prefilledChipData.indexOf(this.prefilledChipData.filter((val) => val.parentUniqueIdsValue?.includes(optionsData.dataUniqueFieldValue!))[0]);

          deletedChipPrefilledIndex > -1 && this.prefilledChipData.splice(deletedChipPrefilledIndex, 1);
          deleteIndex > -1 && this.chipData.splice(deleteIndex, 1);
          this.queryRemovededChipDataIds.push(optionsData.dataUniqueFieldValue!);
        }
        for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
          this._checkPrefilledChips(this.multiObjectData.dropDownSections[i].children!, this.multiObjectData.dropDownSections[i]);
        }


      }
      else {
        this._valueSelectTreeTraversal(selected, sectionData.children!, optionsData);
        this._modifyChipSection(this.multiObjectData.dropDownSections);
      }

      if (!this.isSingularInput && selected) {
        let found = false;
        for (let i = 0, customChipDataLen = this.customChipData.length; i < customChipDataLen; i++) {
          found = !!this.chipData.find(val => val.dataUniqueFieldValue === this.customChipData[i].dataUniqueFieldValue);
        }
        !found && this._appendCustomChips();
      }
    }
    this._sendLatestDropdownSelection();
  }

  public sectionSelectionTrigger(selected: boolean, sectionData: DropDownDataSection) {


    if (this.multiObjectData) {
      if (selected) {
        sectionData.isSelected = true;
      }

      else {
        sectionData.isSelected = false;
      }

      if (this.isSingularInput) {
        this._allSelectTrigger(false);
      }

      this._allSelectTrigger(selected, sectionData);

      if (!this.isSingularInput && selected) {
        let found = false;
        for (let i = 0, customChipDataLen = this.customChipData.length; i < customChipDataLen; i++) {
          found = !!this.chipData.find(val => val.dataUniqueFieldValue === this.customChipData[i].dataUniqueFieldValue);
        }
        !found && this._appendCustomChips();
      }
    }
    this._sendLatestDropdownSelection();
  }

  public selectAllOptions(isReset?: boolean) {


    !isReset && this._allSelectTrigger(this.isAllSelected ? false : true);
    isReset && this._allSelectTrigger(false);
    (isReset || !this.isAllSelected) && this.onReset.emit();
    this._sendLatestDropdownSelection();
  }

  public chipRemovalTrigger(chipChange: ChipChangeTrigger) {


    if (this.popoverInstance.isOpen()) {
      this._isDropdownCloseAllowed = false;
    }
    else {
      this._isDropdownCloseAllowed = true;
    }

    if (chipChange.data.isCustom) {
      for (let i = 0, customChipDataLen = this.customChipData.length; i < customChipDataLen; i++) {

        if (this.customChipData[i].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
          let deleteIndex = this.chipData.indexOf(this.customChipData[i]);
          let removed1 = deleteIndex > -1 ? this.chipData.splice(deleteIndex, 1) : [];
          let removed2 = this.customChipData.splice(i, 1);

          this.onChipRemove.emit({ data: chipChange.data });
          return;
        }
      }
    }
    else {
      if (this.isAsynchronousSearch) {

        if (this.queryState) {
          for (let i = 0, queryDataLen = this.multiObjectDataForQuery!.dropDownSections[0].children!.length; i < queryDataLen; i++) {
            if (this.multiObjectDataForQuery?.dropDownSections[0].children![i].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
              !this.multiObjectDataForQuery!.dropDownSections[0].children![i].isDisabled && (this.multiObjectDataForQuery!.dropDownSections[0].children![i].isSelected = false);
              let deletedChipPrefilledIndex = this.prefilledChipData.indexOf(this.prefilledChipData.filter((val) => val.parentUniqueIdsValue?.includes(this.multiObjectDataForQuery!.dropDownSections[0].children![i].dataUniqueFieldValue!))[0]);
              deletedChipPrefilledIndex > -1 && this.prefilledChipData.splice(deletedChipPrefilledIndex, 1);
            }
          }
        }

        for (let i = 0, flattenObjectLen = this._flattenDropdownOptions.length; i < flattenObjectLen; i++) {
          if (chipChange.data.parentUniqueIdsValue && chipChange.data.parentUniqueIdsValue.includes(this._flattenDropdownOptions[i].dataUniqueFieldValue)) {


            !this._flattenDropdownOptions[i].isDisabled && (this._flattenDropdownOptions[i].isSelected = false);
          }
        }

        let deleteIndex = this.chipData.findIndex(val => val.dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue);
        deleteIndex > -1 && this.chipData.splice(deleteIndex, 1);
        this.queryRemovededChipDataIds.push(chipChange.data.dataUniqueFieldValue!);

        for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
          this._checkPrefilledChips(this.multiObjectData.dropDownSections[i].children!, this.multiObjectData.dropDownSections[i]);
        }
      }
      else {

        if (chipChange.data.parentUniqueIdsValue && chipChange.data.parentUniqueIdsValue.length > 0) {

          let deleteIndex = this.chipData.indexOf(chipChange.data);
          let deletedChip = deleteIndex > -1 ? this.chipData.splice(deleteIndex, 1) : [];
          let deletedChipPrefilledIndex = this.prefilledChipData.indexOf(chipChange.data);
          deletedChipPrefilledIndex > -1 && this.prefilledChipData.splice(deletedChipPrefilledIndex, 1);
          for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
            for (let j = 0, optionsDataLen = this.multiObjectData.dropDownSections[i].children!.length; j < optionsDataLen; j++) {

              let parentObj = this.multiObjectData.dropDownSections[i].children!.filter((val: DropDownDataOption) => deletedChip[0].parentUniqueIdsValue?.includes(val.dataUniqueFieldValue!));

              if (parentObj && parentObj.length === 1) {
                this._valueSelectTreeTraversal(false, this.multiObjectData.dropDownSections, parentObj[0]);

                this.onChipRemove.emit({ data: chipChange.data })
                break;
              }
            }
          }
        }

      }

      for (let i = 0, flattenObjectLen = this._flattenDropdownOptions.length; i < flattenObjectLen; i++) {

        if (this._flattenDropdownOptions[i].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
          !this._flattenDropdownOptions[i].isDisabled && (this._flattenDropdownOptions[i].isSelected = false);

          for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
            if (this.chipData[j].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {

              this.chipData.splice(j, 1);
              this.onChipRemove.emit({ data: chipChange.data });
              this._valueSelectTreeTraversal(false, this.multiObjectData.dropDownSections, this._flattenDropdownOptions[i]);
              break;
            }
          }
          break;
        }
      }
    }
    this._sendLatestDropdownSelection();
  }

  public dropdownCloseTrigger(): void {
    if (!this._isDropdownCloseAllowed) {
      this.popoverInstance.open();
      this._isDropdownCloseAllowed = true;
    }
    this.multiObjectDataForQuery = undefined;
    this.queryState = false;
    this._finalizeQuerySelectedOptions();
  }

  public openDropdown() {
    this.initialLoad.emit(true);
  }

  private _init() {
    if (this.isRequired === true && (!this.minSelectCount || this.minSelectCount < 1)) {
      this.minSelectCount = 1;
    }
    if (this.isSingularInput && (!this.maxSelectCount || this.maxSelectCount > 1)) {

      this.maxSelectCount = 1;
    }
    if (this.isSingularInput) {
      this.isCustomInputAllowed = false;
    }
    if (!this.isMultipleLevel) {
      this.isHierarchySelectionModificationAllowed = false;
    }
  }

  private _checkPrefilledChips(optionsData: DropDownDataOption[], sectionData: DropDownDataSection) {

    if (optionsData && optionsData.length > 0) {
      for (let j = 0, childrenLen = optionsData.length; j < childrenLen; j++) {
        let founded = this.prefilledChipData.filter((val: SelectionChip, index: number) => val.dataUniqueFieldValue === optionsData[j].dataUniqueFieldValue);

        if (founded && founded.length > 0) {


          !optionsData[j].isDisabled && (optionsData[j].isSelected = true);
          let deletedChipPrefilledIndex = this.preSelectedChips.indexOf(founded[0]);
          deletedChipPrefilledIndex > -1 && this.preSelectedChips.splice(deletedChipPrefilledIndex, 1);
          this._valueSelectTreeTraversal(true, sectionData.children!, optionsData[j]);
          this._modifyChipSection(this.multiObjectData.dropDownSections);
        }
        else {

          let partiallyFounded = this.prefilledChipData.filter((val: SelectionChip) => {
            return val.parentUniqueIdsValue?.includes(optionsData[j].dataUniqueFieldValue!);
          });



          if (partiallyFounded && partiallyFounded.length > 0) {
            // set partially selected true for this and check for all the children as well if expanded    
            // 

            optionsData[j].isPartiallySelected = true;
            if (optionsData[j].children && optionsData[j].children!.length > 0) {

            }
          }
          else {
            optionsData[j].isPartiallySelected = false;
          }
        }
        this._checkPrefilledChips(optionsData[j].children!, sectionData);
      }
    }
  }

  private _valueSelectTreeTraversal(triggerValue: boolean, parent: DropDownDataOption[], child?: DropDownDataOption, allData: boolean = false): boolean {
    if (child?.isDisabled) {
      return false;
    }

    child && (child.isSelected = triggerValue);

    if (parent.length > 0) {
      for (let i = 0, parentLen = parent.length; i < parentLen; i++) {
        if (parent[i] === child && !parent[i].isDisabled) {

          !parent[i].isDisabled && (parent[i].isSelected = triggerValue);
          !triggerValue && (parent[i].isPartiallySelected = false);

          if ((allData || this.isHierarchySelectionModificationAllowed) && child.children && child.children.length > 0) {
            for (let j = 0, childLen = child.children.length; j < childLen; j++) {

              !child.children[j].isDisabled && (child.children[j].isSelected = triggerValue);
              !triggerValue && (child.children[j].isPartiallySelected = false);

              if (child.children[j].children && child.children[j].children!.length > 0) {
                return this._valueSelectTreeTraversal(triggerValue, parent, child.children[j], allData);
              }
            }
            parent[i].isPartiallySelected = !parent[i].isSelected && parent[i].children!.some((val) => (val.isSelected === true || val.isPartiallySelected === true));
          }


          return true;
        }

        else if (parent[i].children && parent[i].children!.length > 0) {
          if (this._valueSelectTreeTraversal(triggerValue, parent[i].children!, child, allData)) {
            (allData || this.isHierarchySelectionModificationAllowed) && (parent[i].isSelected = (!triggerValue) ? false : parent[i].children!.reduce<boolean>((acc, current) => { return (acc && current.isSelected!) }, true));
            console.log('should noittt be trueee ', parent[i].isSelected);
            parent[i].isPartiallySelected = (allData || this.isHierarchySelectionModificationAllowed) ? !parent[i].isSelected && parent[i].children!.some((val) => (val.isSelected === true || val.isPartiallySelected === true)) : false;
            !parent[i].isSelected && (allData || this.isHierarchySelectionModificationAllowed) && (this.isAllSelected = false);

            if (this.chipData.some((val: SelectionChip) => val.dataUniqueFieldValue === this.customAllSelectOptionUniqueId)) {
              let deleteIndex = this.chipData.indexOf((val: SelectionChip) => val.dataUniqueFieldValue === this.customAllSelectOptionUniqueId);
              let removedChips = deleteIndex > -1 ? this.chipData.splice(deleteIndex, 1) : [];


              this.onChipRemove.emit({ data: removedChips[0] })
            }


            return true;
          }
        }
      }
    }

    return false;
  }

  private _modifyChipSection(data: (DropDownDataOption[] | DropDownDataSection[]), allData: boolean = false) {

    this.chipsContainer && this.chipsContainer.resetActiveChip();

    if (!data || !data.length || data.length === 0) {
      return;
    }

    else if (allData) {


      for (let i = 0; i < data.length; i++) {

        !data[i].isDisabled && (data[i].isSelected = true);

        let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i])


        if (this.isHierarchySelectionModificationAllowed && data[i].dataVisibleNameValue && (data[i].levelIndex === (0 || 1 || undefined)) && !data[i].isDisabled) {
          this.chipData.push(chipOptionData);
        }
        else if (!this.isHierarchySelectionModificationAllowed && data[i].dataVisibleNameValue && !data[i].isDisabled) {
          this.chipData.push(chipOptionData);
        }

        data[i].children && this._modifyChipSection(data[i].children!, true);

        !allData && this.onChipAdd.emit({ data: data[i] });
      }
      return;
    }

    else {

      let allOptionTrgger = true;
      for (let i = 0; i < data.length; i++) {
        allOptionTrgger = allOptionTrgger && (data[i].children) ? !data[i].children!.some(val => val.isSelected === false) : false;
      }
      if (allOptionTrgger && data[0].levelIndex === undefined) {
        this._allSelectTrigger(true);
        return;
      }

      for (let i = 0; i < data.length; i++) {

        if (data[i].children && data[i].children!.length > 0) {

          let allChildrenSelected: boolean = !data[i].children!.some(val => val.isSelected === false);

          if ((this.isHierarchySelectionModificationAllowed || allData) && allChildrenSelected && data[i].levelIndex && data[i].levelIndex > 0) {

            if (this.chipData.findIndex(val => val.dataUniqueFieldValue === data[i].dataUniqueFieldValue) === -1) {

              let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i]);
              !data[i].isDisabled && this.chipData.push(chipOptionData);


              this.onChipAdd.emit({ data: data[i] });
            }

            if (data[i].levelIndex > 0) {

              for (let c = 0, childrenLen = data[i].children!.length; c < childrenLen; c++) {
                for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
                  if (this.chipData[j].dataUniqueFieldValue === data[i].children![c].dataUniqueFieldValue) {
                    this.chipData.splice(j, 1);

                    this.onChipRemove.emit({ data: data[i].children![c] })
                    break;
                  }
                }
              }
            }
          }

          else {

            for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
              if ((this.chipData[j].dataUniqueFieldValue === data[i].dataUniqueFieldValue)) {
                if ((!this.isHierarchySelectionModificationAllowed && !data[i].isSelected)) {
                  this.chipData.splice(j, 1);
                  this.onChipRemove.emit({ data: data[i] })
                  break;
                }
                else if (this.isHierarchySelectionModificationAllowed) {
                  this.chipData.splice(j, 1);
                  this.onChipRemove.emit({ data: data[i] })
                  break;
                }
              }
            }

            for (let c = 0, childrenLen = data[i].children!.length; c < childrenLen; c++) {

              if (data[i].children && data[i].children![c] && data[i].children![c].isSelected && (this.chipData.findIndex(val => val.dataUniqueFieldValue === data[i].children![c].dataUniqueFieldValue) === -1)) {
                let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i].children![c]);

                !data[i].children![c].isDisabled && this.chipData.push(chipOptionData);


                this.onChipAdd.emit({ data: data[i].children![c] });
                if (!this.isHierarchySelectionModificationAllowed) return;
              }
            }
          }
          this._modifyChipSection(data[i].children!);

          allChildrenSelected = !data[i].children!.some(val => val.isSelected === false);

          if ((this.isHierarchySelectionModificationAllowed || allData) && allChildrenSelected && data[i].levelIndex && data[i].levelIndex > 0 && allChildrenSelected) {

            for (let c = 0, childrenLen = data[i].children!.length; c < childrenLen; c++) {
              for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
                if (this.chipData[j].dataUniqueFieldValue === data[i].children![c].dataUniqueFieldValue) {
                  this.chipData.splice(j, 1);

                  this.onChipRemove.emit({ data: data[i].children![c] })
                  break;
                }
              }
            }
          }

          else {
            for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
              if (this.chipData[j].dataUniqueFieldValue === this.customAllSelectOptionUniqueId) {
                this.chipData.splice(j, 1);

                this.onChipRemove.emit({ data: this.chipData[j] })
                break;
              }
            }
          }
        }

        else {

          if (!data[i].isSelected && !(this.chipData.findIndex(val => val.dataUniqueFieldValue === data[i].dataUniqueFieldValue) === -1)) {
            for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
              if (this.chipData[j].dataUniqueFieldValue === data[i].dataUniqueFieldValue) {
                this.chipData.splice(j, 1);

                this.onChipRemove.emit({ data: data[i] })
                break;
              }
            }
          }
        }
      }
    }
  }

  private _appendCustomChips() {
    this.chipData.push(...this.customChipData);
  }

  private _allSelectTrigger(triggerValue: boolean, sectionData?: DropDownDataSection) {

    this.isAllSelected = triggerValue;

    if (triggerValue) {
      this.onSelectAll.emit();
      this._appendCustomChips();
    }
    if (!triggerValue) {
      this.customChipData = [];
      this.prefilledChipData = [];
    }

    if (!sectionData) {


      for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
        for (let j = 0, optionsDataLen = this.multiObjectData.dropDownSections[i].children!.length; j < optionsDataLen; j++) {
          !this.multiObjectData.dropDownSections[i].children![j].isDisabled && (this.multiObjectData.dropDownSections[i].children![j].isSelected = triggerValue);
          this._valueSelectTreeTraversal(triggerValue, this.multiObjectData.dropDownSections[i].children!, this.multiObjectData.dropDownSections[i].children![j], true);
          !triggerValue && (this.multiObjectData.dropDownSections[i].children![j].isPartiallySelected = false);
        }
      }
      this.chipData = [];
      this._modifyChipSection(this.multiObjectData.dropDownSections, triggerValue);
    }
    else {

      for (let j = 0, optionsDataLen = sectionData.children!.length; j < optionsDataLen; j++) {
        !sectionData.children![j].isDisabled && (sectionData.children![j].isSelected = true);
        this._valueSelectTreeTraversal(triggerValue, sectionData.children!, sectionData.children![j], true);
        this._modifyChipSection(sectionData.children!, triggerValue);
      }
    }

    if (triggerValue && this.isCustomAllSelectOption && this.customAllSelectOptionUniqueId != undefined && !!this.customAllSelectOptionNameKey) {
      let allDataChip: SelectionChip = this._createChipData({
        dataVisibleNameValue: this.customAllSelectOptionNameKey,
        dataUniqueFieldValue: this.customAllSelectOptionUniqueId,
        isSingular: true
      })
      this.chipData = [allDataChip];
      this.onChipAdd.emit({ data: allDataChip });
    }
    else if (!triggerValue) {
      this.chipData = [];
    }
  }

  private _finalizeQuerySelectedOptions() {

    for (let i = 0, flattenObjectLen = this._flattenDropdownOptions.length; i < flattenObjectLen; i++) {

      if (this.queryAddedChipDataIds.includes(this._flattenDropdownOptions[i].dataUniqueFieldValue!)) {
        this._flattenDropdownOptions[i].isSelected = true;
        let queryIndex = this.queryAddedChipDataIds.indexOf(this._flattenDropdownOptions[i].dataUniqueFieldValue!);
        queryIndex > -1 && this.queryAddedChipDataIds.splice(queryIndex, 1);
      }
      else {
      }
      if (this.queryRemovededChipDataIds.includes(this._flattenDropdownOptions[i].dataUniqueFieldValue!)) {
        this._flattenDropdownOptions[i].isSelected = false;
        let queryIndex = this.queryRemovededChipDataIds.indexOf(this._flattenDropdownOptions[i].dataUniqueFieldValue!);
        queryIndex > -1 && this.queryRemovededChipDataIds.splice(queryIndex, 1);
      }
      else {
        // this.multiObjectDataForQuery!.dropDownSections[0].children!.forEach((val) => {
        //   
        //   if (val.parentUniqueIdsValue!.includes(this._flattenDropdownOptions[i].dataUniqueFieldValue!)) {
        //     this._flattenDropdownOptions[i].isPartiallySelected = false;
        //   }
        // });
      }
    }
    this._modifyChipSection(this.multiObjectData.dropDownSections);
  }

  private _createChipData(optionData: DropDownDataOption, isCustomChip = false): SelectionChip {

    let chip: SelectionChip = {
      isDisabled: optionData.isDisabled ? true : false,
      isFavourite: optionData.dataFavouriteValue ? true : false,
      canDelete: this.readOnlyChips ? false : optionData.isDisabled ? false : true,
      isHighlighted: false,
      isActive: false,
      isCustom: isCustomChip,
      isHidden: !optionData.isVisible ? true : false,
      isSingular: this.isSingularInput ? true : optionData.isSingular ? true : false,
      dataUniqueFieldValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["dataUniqueFieldValue"]),
      dataVisibleNameValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["dataVisibleNameValue"]),
      dataTooltipValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["dataTooltipValue"]),
      dataExpandableValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["dataExpandableValue"]),
      dataFavouriteValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["dataFavouriteValue"]),
      parentUniqueIdsValue: MultiObjectSelectionComponent.dropdownPropertyAccess(optionData, ["parentUniqueIdsValue"]),
      originalData: optionData
    };
    return chip;
  }

  private _setFlattenOptionsForQuery(data: (DropDownDataOption[] | DropDownDataSection[])) {

    for (let i = 0; i < data.length; i++) {
      this._flattenDropdownOptions.push(<DropDownDataOption>data[i]);
      if (data[i].children) {
        this._setFlattenOptionsForQuery(data[i].children!);
      }
    }
  }

  private _sendLatestDropdownSelection(): void {
    let optionIds: SelectionChip[] = [];
    for (let i = 0, chipDataLen = this.chipData.length; i < chipDataLen; i++) {
      !this.chipData[i].isCustom && optionIds.push(this.chipData[i]);
      this.chipData[i].isCustom && optionIds.push(this.chipData[i]);
    }
    this.invalidState = this._validateChipDataLength(optionIds);
    this.selectionChange.emit(optionIds);
    if (this.isSingularInput && optionIds.length === 1) {
      this.popoverInstance.close();
    }
    if (this.maxSelectCount > 0 && optionIds.length === this.maxSelectCount) {
      this.popoverInstance.close();
    }
  }

  private _validateChipDataLength(data: any[]): boolean {
    if (data.length < this.minSelectCount || (this.maxSelectCount > 0 && data.length > this.maxSelectCount)) {
      this.errorMessage.emit({ message: "Invalid length" });
      return false;
    }
    else {
      return true;
    }
  }

  public static createSection(sectionConfig: DropDownDataSection, data: any[]): DropDownDataSection {
    sectionConfig.children = data;
    sectionConfig.isVisible === undefined && (sectionConfig.isVisible = true);
    return sectionConfig;
  }

  public static preparePrefilledChipsData(sectionConfig: DropDownDataSection, data: any[]): SelectionChip[] {

    let preFilledChips: SelectionChip[] = [];

    for (let i = 0, dataLen = data.length; i < dataLen; i++) {
      let chip: SelectionChip = {
        dataFavouriteValue: MultiObjectSelectionComponent.dropdownPropertyAccess(data[i], sectionConfig.dataFavouriteSrc!),
        dataUniqueFieldValue: MultiObjectSelectionComponent.dropdownPropertyAccess(data[i], sectionConfig.dataUniqueSrc!),
        dataTooltipValue: MultiObjectSelectionComponent.dropdownPropertyAccess(data[i], sectionConfig.dataTooltipSrc!),
        dataVisibleNameValue: MultiObjectSelectionComponent.dropdownPropertyAccess(data[i], sectionConfig.dataVisibleNameSrc!),
        parentUniqueIdsValue: MultiObjectSelectionComponent.dropdownPropertyAccess(data[i], sectionConfig.dataParentUniqueIdsSrc!),
        canDelete: MultiObjectSelectionComponent._this.readOnlyChips ? false : true,
        originalData: data[i]
      }
      preFilledChips.push(chip);
    }

    return preFilledChips;
  }

  public static dropdownPropertyAccess(dataObj: any, path: string[]): any {

    if (!path || !path.length || path.length < 1) {
      return '';
    }

    let value;

    if (path.length === 1) {
      value = dataObj[path[0]];
    }
    else {

      value = cloneDeep(dataObj);

      for (let k = 0, pathLen = path.length; k < pathLen; k++) {
        value = value[path[k]];
      }
    }

    return value;
  }
}
