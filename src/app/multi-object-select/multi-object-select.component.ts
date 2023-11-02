import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ChipChangeTrigger, DataRequester, DropDownDataOption, DropDownDataSection, MultiObjectSelection, SelectionChip } from '../multi-object-select/interfaces/multi-object-selection.interface';
import { DataChildrenSrcFields, DataExpandableSrcFields, DataFavouriteSrcFields, DataPathIdsSrcFields, DataTooltipSrcFields, DataTotalDocsSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, MultiObjectSelectionTypeId } from '../multi-object-select/enums/multi-object-selection.enum';
import { UtilsService } from '../services/utils/utils.service';
import { MultiObjectSelectionChipComponent } from './multi-object-chips/multi-object-chips.component';

@Component({
  selector: 'app-multi-object-select',
  templateUrl: './multi-object-select.component.html',
  styleUrls: ['./multi-object-select.component.scss']
})
export class MultiObjectSelectionComponent implements OnInit, OnChanges {


  @ViewChild('queryBox') queryBox!: ElementRef<HTMLInputElement>;
  @ViewChild('chipsContainer') chipsContainer!: MultiObjectSelectionChipComponent;

  // public dataXHRs: any[] = [];
  @Input('data') data: any[] = [];

  @Input('dataTypeId') dataTypeId: number = -1;

  @Input('globalLoading') globalLoading: boolean = false;

  @Input('preSelectedObjectIds') preSelectedObjectIds: (string | number)[] = [];

  @Input('preSelectedChips') preSelectedChips: any[] = [];

  @Input('isRequired') isRequired: boolean = true; // done
  @Input('isDisabled') isDisabled: boolean = false; // done
  @Input('minSelectCount') minSelectCount: number = 1; // done
  @Input('maxSelectCount') maxSelectCount!: number; // done
  @Input('isSingularInput') isSingularInput: boolean = false; // done
  @Input('readOnlyChips') readOnlyChips: boolean = false; // done
  @Input('isCustomInputAllowed') isCustomInputAllowed: boolean = false; // done
  @Input('isSearchAllowed') isSearchAllowed: boolean = true; //done
  @Input('isAsynchronousSearch') isAsynchronousSearch: boolean = true; // done
  @Input('isResetOptionVisible') isResetOptionVisible: boolean = true; // done
  @Input('isSelectAllAvailable') isSelectAllAvailable: boolean = true; // done
  @Input('placeholderKey') placeholderKey: string = ''; // done
  @Input('noDataMessageKey') noDataMessageKey: string = ''; // done
  @Input('isMultipleLevel') isMultipleLevel: boolean = true; // done
  @Input('isAsynchronouslyExpandable') isAsynchronouslyExpandable: boolean = true; // done
  @Input('isLoading') isLoading: boolean = false; // done
  @Input('isCustomAllSelectOption') isCustomAllSelectOption: boolean = false; // done
  @Input('customAllSelectOptionUniqueId') customAllSelectOptionUniqueId!: string | number; // done
  @Input('customAllSelectOptionNameKey') customAllSelectOptionNameKey: string = ''; // done

  @Input('sectionConfigurationObject') sectionConfigurationObject!: DropDownDataSection; // to be setup

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

  public userAddedChipIds: (string | number)[] = [];

  public userRemovedChipIds: (string | number)[] = [];

  public multiObjectData!: MultiObjectSelection;

  public queryState: boolean = false;

  public isAllSelected: boolean = false;

  public multiObjectDataForQuery: MultiObjectSelection | undefined;

  public isQueryFocused: boolean = false;

  private _flattenDropdownOptions: DropDownDataOption[] = [];

  private _isDropdownOpened: boolean = false;


  constructor(
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
    this._init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    

    if (changes['data'] && changes['data'].currentValue && this.dataTypeId !== -1) {
      this.multiObjectData = this.prepareDropDownData(this.data, this.dataTypeId);
      this.setPreSelectedValues(this.multiObjectData.dropDownSections);
      this._setFlattenOptionsForQuery(this.multiObjectData.dropDownSections);
      this.isLoading = false;
    }

    if (changes['preSelectedChips'] && changes['preSelectedChips'].currentValue && this.dataTypeId !== -1) {
      
      
      let preFilledChips = this._preparePrefilledChipsData(this.preSelectedChips);
      this.setPreSelectedValues(preFilledChips, true);
    }
  }

  public focusSearch() {
    this.queryBox.nativeElement.focus();

    if (!this.isDisabled && !this.isDisabled && !this._isDropdownOpened) {
      this._isDropdownOpened = true;
    }
    this.chipsContainer && this.chipsContainer.resetActiveChip();
  }

  public activateLastChip(event: Event) {
    if (((event as InputEvent).inputType === "deleteContentBackward" || (event as InputEvent).inputType === "deleteWordBackward") && (event.target as any).value === "") {
      this.chipData[this.chipData.length - 1] && this.chipsContainer.activateChip(this.chipData[this.chipData.length - 1]);
      this.queryBox.nativeElement.blur();
    }
  }

  public queryTrigger(searchVal: string): void {
    this.multiObjectDataForQuery = undefined;

    if (searchVal === '' || searchVal === undefined || searchVal === null) {
      this.queryState = false;
      return;
    }
    else {
      this.queryState = true;
    }

    searchVal = searchVal.toString().toLowerCase();

    if (!this.isAsynchronousSearch) {

      let founded = this._flattenDropdownOptions.filter((val) => {
        return (
          val.dataVisibleNameValue?.toString().toLowerCase().includes(searchVal) ||
          val.dataTooltipValue?.toString().toLowerCase().includes(searchVal)
        )
      });

      if (founded.length > 0) {
        this.multiObjectDataForQuery = this.prepareDropDownData(founded, this.dataTypeId);
      }
    }

    else {
      
      this.isLoading = true;
      this.onQuerySeach.emit({
        preparedData: {
          queryString: searchVal,
        },
        onResult: (data: any[]) => {

          if (!data || !data.length || data.length === 0) {
            data = [];
          }
          this.multiObjectDataForQuery = this.prepareDropDownData(data, this.dataTypeId);
          this.isLoading = false;
        },
        onError: () => {
          this.multiObjectDataForQuery = this.prepareDropDownData([], this.dataTypeId);
          this.isLoading = false;
        }
      });
    }
  }

  public addCustomChip(name: string): void {

    if (this.isCustomInputAllowed === false || name === '' || name === undefined || name === null) {
      return;
    }
    else {
      this.queryState = true;
    }

    if (this.isCustomInputAllowed) {
      let newOptionData: DropDownDataOption = {
        dataVisibleNameValue: name,
        dataTooltipValue: name,
        dataUniqueFieldValue: new Date().getTime()
      }
      let chip = this._createChipData(newOptionData, true);
      this.customChipData.push(chip);
      this.chipData.push(chip);
      this.queryBox.nativeElement.value = '';
      this.queryState = false;
    }
    else {
      this.queryState = false;
      return;
    }
  }

  public prepareDropDownData(data: DropDownDataOption[], selectionType: number): MultiObjectSelection {

    let multiObjectConfig: MultiObjectSelection = {
      dataTypeId: selectionType,
      dropDownSections: []
    }
    let dropDownSection: DropDownDataSection = {
      isVisible: true,
      children: data,

      /* more configuration of sections to be done from parent*/
      allowSectionSelection: this.sectionConfigurationObject?.allowSectionSelection || undefined,
      sectionId: this.sectionConfigurationObject?.sectionId || undefined,
      sectionTooltipKey: this.sectionConfigurationObject?.sectionTooltipKey || this.sectionConfigurationObject?.sectionNameKey || undefined,
      sectionNameKey: this.sectionConfigurationObject?.sectionNameKey || undefined,
    }

    // prepare sections
    switch (selectionType) {
      case MultiObjectSelectionTypeId.FOLDER_SELECTION:

        dropDownSection = Object.assign({
          dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION.split("/"),
          dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION.split("/"),
          dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION.split("/"),
          dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION.split("/"),
          dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION.split("/"),
          dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION.split("/"),
          dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION.split("/"),
        }, dropDownSection)

        // add section to dropdown configuration
        multiObjectConfig.dropDownSections.push(dropDownSection);

        break;

      default:
        break;

    };

    for (let i = 0, sectionsDataLen = multiObjectConfig.dropDownSections.length; i < sectionsDataLen; i++) {
      multiObjectConfig.dropDownSections[i].children = this.prepareDropDownOptions(multiObjectConfig.dropDownSections[i], multiObjectConfig.dropDownSections[i].children);
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
            this.preSelectedObjectIds.push(this._utils.propertyAccess(data[i].children[j], data[i].dataUniqueFieldSrc!));
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
          this._checkPrefilledChips(this.multiObjectData.dropDownSections[i].children, this.multiObjectData.dropDownSections[i]);
        }
      }
    }

  }

  public prepareDropDownOptions(sectionData: DropDownDataSection, optionsData: DropDownDataOption[], currentLevel?: number): DropDownDataOption[] {

    for (let j = 0, dataLen = optionsData.length; j < dataLen; j++) {

      !optionsData[j].hasOwnProperty('dataUniqueFieldValue') && (optionsData[j].dataUniqueFieldValue = this._utils.propertyAccess(optionsData[j], sectionData.dataUniqueFieldSrc!));
      !optionsData[j].hasOwnProperty('dataVisibleNameValue') && (optionsData[j].dataVisibleNameValue = this._utils.propertyAccess(optionsData[j], sectionData.dataVisibleNameSrc!));
      !optionsData[j].hasOwnProperty('dataTooltipValue') && (optionsData[j].dataTooltipValue = this._utils.propertyAccess(optionsData[j], sectionData.dataTooltipSrc!));
      !optionsData[j].hasOwnProperty('dataExpandableValue') && (optionsData[j].dataExpandableValue = this._utils.propertyAccess(optionsData[j], sectionData.dataExpandableSrc!));
      !optionsData[j].hasOwnProperty('dataFavouriteValue') && (optionsData[j].dataFavouriteValue = this._utils.propertyAccess(optionsData[j], sectionData.dataFavouriteSrc!));

      !optionsData[j].hasOwnProperty('levelIndex') && (optionsData[j].levelIndex = currentLevel ? (currentLevel + 1) : 1);
      !optionsData[j].hasOwnProperty('isSelected') && (optionsData[j].isSelected = false);
      !optionsData[j].hasOwnProperty('isPartiallySelected') && (optionsData[j].isPartiallySelected = false);
      !optionsData[j].hasOwnProperty('isDisabled') && (optionsData[j].isDisabled = false);
      !optionsData[j].hasOwnProperty('isExpanded') && (optionsData[j].isExpanded = false);
      !optionsData[j].hasOwnProperty('isExpandable') && (optionsData[j].isExpandable = false);
      !optionsData[j].hasOwnProperty('isChildernLoading') && (optionsData[j].isChildernLoading = false);
      !optionsData[j].hasOwnProperty('isVisible') && (optionsData[j].isVisible = true);

      !optionsData[j].hasOwnProperty('children') && !this.isAsynchronouslyExpandable && (optionsData[j].children = this._utils.propertyAccess(optionsData[j], sectionData.dataChildrenSrc!));
    }

    for (let i = 0, dataLen = optionsData.length; i < dataLen; i++) {
      optionsData[i].isSelected && this.optionSelectionTrigger(true, optionsData[i], sectionData);
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
          this._checkPrefilledChips(dataOption.children, dataSection);
          dataOption.isChildernLoading = false;
        }
      });
    }
  }

  public optionSelectionTrigger(selected: boolean, optionsData: DropDownDataOption, sectionData: DropDownDataSection) {

    if (this.multiObjectData) {
      if (selected) {
        optionsData.isSelected = true;
        let preSelectedChip = this.chipData.filter((val) => val.parentUniqueIdsValue?.includes(optionsData.dataUniqueFieldValue!));
        if(preSelectedChip && preSelectedChip.length === 1) {
          this.chipData.splice(this.chipData.indexOf(preSelectedChip[0]));
          this.prefilledChipData.splice(this.prefilledChipData.indexOf(this.prefilledChipData.filter((val) => val.parentUniqueIdsValue?.includes(optionsData.dataUniqueFieldValue!))[0]));
        }
      }

      else {
        optionsData.isSelected = false;
      }

      if (this.isSingularInput) {
        this._allSelectTrigger(false);
      }

      this._valueSelectTreeTraversal(selected, sectionData.children, optionsData);
      this._modifyChipSection(this.multiObjectData.dropDownSections);

      if (!this.isSingularInput && selected) {
        let found = false;
        for (let i = 0, customChipDataLen = this.customChipData.length; i < customChipDataLen; i++) {
          found = !!this.chipData.find(val => val.dataUniqueFieldValue === this.customChipData[i].dataUniqueFieldValue);
        }
        !found && this._appendCustomChips();
      }
    }
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
    }
  }

  public selectAllOptions(isReset?: boolean) {
    !isReset && this._allSelectTrigger(this.isAllSelected ? false : true);
    isReset && this._allSelectTrigger(false);
    (isReset || !this.isAllSelected) && this.onReset.emit();
  }

  public chipRemovalTrigger(chipChange: ChipChangeTrigger) {

    if (chipChange.data.isCustom) {
      for (let i = 0, customChipDataLen = this.customChipData.length; i < customChipDataLen; i++) {
        
        if (this.customChipData[i].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
          this.chipData.splice(this.chipData.indexOf(this.customChipData[i]), 1);
          this.customChipData.splice(i, 1);
          this.onChipRemove.emit({ data: chipChange.data });
          return;
        }
      }
    }
    else if (chipChange.data.parentUniqueIdsValue && chipChange.data.parentUniqueIdsValue.length > 0) {

      let deletedChip = this.chipData.splice(this.chipData.indexOf(chipChange.data), 1);
      this.prefilledChipData.splice(this.prefilledChipData.indexOf(chipChange.data), 1);
      for (let i = 0, sectionsDataLen = this.multiObjectData.dropDownSections.length; i < sectionsDataLen; i++) {
        for (let j = 0, optionsDataLen = this.multiObjectData.dropDownSections[i].children.length; j < optionsDataLen; j++) {

          let parentObj = this.multiObjectData.dropDownSections[i].children.filter((val: DropDownDataOption) => deletedChip[0].parentUniqueIdsValue?.includes(val.dataUniqueFieldValue!));
          
          if (parentObj && parentObj.length === 1) {
            this._valueSelectTreeTraversal(false, this.multiObjectData.dropDownSections, parentObj[0]);
            this.onChipRemove.emit({ data: chipChange.data })
            break;
          }
        }
      }
    }

    else {
      for (let i = 0, flattenObjectLen = this._flattenDropdownOptions.length; i < flattenObjectLen; i++) {
        if (this._flattenDropdownOptions[i].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
          this._flattenDropdownOptions[i].isSelected = false;
          for (let j = 0, chipDataLen = this.chipData.length; j < chipDataLen; j++) {
            if (this.chipData[j].dataUniqueFieldValue === chipChange.data.dataUniqueFieldValue) {
              this.chipData.splice(j, 1);
              this.onChipRemove.emit({ data: chipChange.data })
              break;
            }
          }
          this._valueSelectTreeTraversal(false, this.multiObjectData.dropDownSections, this._flattenDropdownOptions[i]);
          break;
        }
      }
    }
  }

  private _init() {
    if (this.isRequired === true && !this.minSelectCount || this.minSelectCount < 1) {
      this.minSelectCount = 1;
    }
    if (this.isSingularInput && !this.maxSelectCount || this.maxSelectCount > 1) {
      this.maxSelectCount = 1;
    }
    if (this.isSingularInput) {
      this.isCustomInputAllowed = false;
    }
  }

  private _preparePrefilledChipsData(data: any[]): SelectionChip[] {
    let preFilledChips: SelectionChip[] = [];

    switch (this.dataTypeId) {
      case MultiObjectSelectionTypeId.FOLDER_SELECTION:
        for (let i = 0, dataLen = data.length; i < dataLen; i++) {
          let chip: SelectionChip = {
            dataFavouriteValue: this._utils.propertyAccess(data[i], DataFavouriteSrcFields.FOLDER_SELECTION.split("/")),
            dataUniqueFieldValue: this._utils.propertyAccess(data[i], DataUniqueSrcFields.FOLDER_SELECTION.split("/")),
            dataTooltipValue: this._utils.propertyAccess(data[i], DataTooltipSrcFields.FOLDER_SELECTION.split("/")),
            dataVisibleNameValue: this._utils.propertyAccess(data[i], DataVisibleNameSrcFields.FOLDER_SELECTION.split("/")),
            parentUniqueIdsValue: this._utils.propertyAccess(data[i], DataPathIdsSrcFields.FOLDER_SELECTION.split("/")),
            canDelete: this.readOnlyChips ? false : true,
          }
          preFilledChips.push(chip);
        }

        break;

      default:
        break;

    };
    return preFilledChips;
  }

  private _checkPrefilledChips(optionsData: DropDownDataOption[], sectionData: DropDownDataSection) {

    if (optionsData && optionsData.length > 0) {
      for (let j = 0, childrenLen = optionsData.length; j < childrenLen; j++) {
        let founded = this.prefilledChipData.filter((val: SelectionChip, index: number) => val.dataUniqueFieldValue === optionsData[j].dataUniqueFieldValue);

        if (founded && founded.length > 0) {
          optionsData[j].isSelected = true;
          this.preSelectedChips.splice(this.preSelectedChips.indexOf(founded[0]), 1);
          this._valueSelectTreeTraversal(true, sectionData.children, optionsData[j]);
          this._modifyChipSection(this.multiObjectData.dropDownSections);
        }
        else {
          let partiallyFounded = this.prefilledChipData.filter((val: SelectionChip) => {
            return val.parentUniqueIdsValue?.includes(optionsData[j].dataUniqueFieldValue!);
          });

          if (partiallyFounded && partiallyFounded.length > 0) {
            optionsData[j].isPartiallySelected = true;
          }
        }
      }
    }
  }

  private _valueSelectTreeTraversal(triggerValue: boolean, parent: DropDownDataOption[], child?: DropDownDataOption): boolean {

    child && (child.isSelected = triggerValue);

    if (parent.length > 0) {
      for (let i = 0, parentLen = parent.length; i < parentLen; i++) {
        if (parent[i] === child) {
          parent[i].isSelected = triggerValue;
          !triggerValue && (parent[i].isPartiallySelected = false);

          if (child.children && child.children.length > 0) {
            for (let j = 0, childLen = child.children.length; j < childLen; j++) {

              child.children[j].isSelected = triggerValue;
              !triggerValue && (child.children[j].isPartiallySelected = false);

              if (child.children[j].children && child.children[j].children!.length > 0) {
                return this._valueSelectTreeTraversal(triggerValue, parent, child.children[j]);
              }
            }
            parent[i].isPartiallySelected = !parent[i].isSelected && parent[i].children!.some((val) => (val.isSelected === true || val.isPartiallySelected === true));
          }


          return true;
        }

        else if (parent[i].children && parent[i].children!.length > 0) {
          if (this._valueSelectTreeTraversal(triggerValue, parent[i].children!, child)) {
            parent[i].isSelected = (!triggerValue) ? false : parent[i].children!.reduce<boolean>((acc, current) => { return (acc && current.isSelected!) }, true);
            parent[i].isPartiallySelected = !parent[i].isSelected && parent[i].children!.some((val) => (val.isSelected === true || val.isPartiallySelected === true));
            !parent[i].isSelected && (this.isAllSelected = false);

            if (this.chipData.some((val: SelectionChip) => val.dataUniqueFieldValue === this.customAllSelectOptionUniqueId)) {
              let removedChips = this.chipData.splice(this.chipData.indexOf((val: SelectionChip) => val.dataUniqueFieldValue === this.customAllSelectOptionUniqueId), 1);
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
      this.chipData = [];

      for (let i = 0; i < data.length; i++) {

        data[i].isSelected = true;

        let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i])

        this.chipData.push(chipOptionData);
        
        
        !allData && this.onChipAdd.emit({ data: data[i] });
      }
      return;
    }

    else {

      for (let i = 0; i < data.length; i++) {

        if (data[i].children && data[i].children!.length > 0) {

          let allChildrenSelected: boolean = !data[i].children!.some(val => val.isSelected === false);

          if (allChildrenSelected) {

            if (data[i].levelIndex === undefined) {
              this._allSelectTrigger(true);
              return;
            }

            if (data[i].levelIndex === 1 && (this.chipData.findIndex(val => val.dataUniqueFieldValue === data[i].dataUniqueFieldValue) === -1)) {

              let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i]);

              this.chipData.push(chipOptionData);
              
              
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
              if (this.chipData[j].dataUniqueFieldValue === data[i].dataUniqueFieldValue) {
                this.chipData.splice(j, 1);
                
                
                this.onChipRemove.emit({ data: data[i] })
                break;
              }
            }

            for (let c = 0, childrenLen = data[i].children!.length; c < childrenLen; c++) {

              if (data[i].children && data[i].children![c] && data[i].children![c].isSelected && (this.chipData.findIndex(val => val.dataUniqueFieldValue === data[i].children![c].dataUniqueFieldValue) === -1)) {
                let chipOptionData: SelectionChip = this._createChipData(<DropDownDataOption>data[i].children![c]);

                this.chipData.push(chipOptionData);
                
                
                this.onChipAdd.emit({ data: data[i].children![c] });
              }
            }
          }
          this._modifyChipSection(data[i].children!);
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
        for (let j = 0, optionsDataLen = this.multiObjectData.dropDownSections[i].children.length; j < optionsDataLen; j++) {
          this.multiObjectData.dropDownSections[i].children[j].isSelected = triggerValue;
          this._valueSelectTreeTraversal(triggerValue, this.multiObjectData.dropDownSections[i].children, this.multiObjectData.dropDownSections[i].children[j]);
          this._modifyChipSection(this.multiObjectData.dropDownSections[i].children, triggerValue);
          !triggerValue && (this.multiObjectData.dropDownSections[i].children[j].isPartiallySelected = false);
        }
      }
    }
    else {

      for (let j = 0, optionsDataLen = sectionData.children.length; j < optionsDataLen; j++) {
        sectionData.children[j].isSelected = true;
        this._valueSelectTreeTraversal(triggerValue, sectionData.children, sectionData.children[j]);
        this._modifyChipSection(sectionData.children, triggerValue);
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

  private _createChipData(optionData: DropDownDataOption, isCustomChip = false): SelectionChip {

    return {
      isDisabled: optionData.isDisabled ? true : false,
      isFavourite: optionData.dataFavouriteValue ? true : false,
      canDelete: this.readOnlyChips ? false : optionData.isDisabled ? false : true,
      isHighlighted: false,
      isActive: false,
      isCustom: isCustomChip,
      isHidden: !optionData.isVisible ? true : false,
      isSingular: this.isSingularInput ? true : optionData.isSingular ? true : false,
      dataUniqueFieldValue: this._utils.propertyAccess(optionData, ["dataUniqueFieldValue"]),
      dataVisibleNameValue: this._utils.propertyAccess(optionData, ["dataVisibleNameValue"]),
      dataTooltipValue: this._utils.propertyAccess(optionData, ["dataTooltipValue"]),
      dataExpandableValue: this._utils.propertyAccess(optionData, ["dataExpandableValue"]),
      dataFavouriteValue: this._utils.propertyAccess(optionData, ["dataFavouriteValue"]),
    }
  }

  private _setFlattenOptionsForQuery(data: (DropDownDataOption[] | DropDownDataSection[])) {

    for (let i = 0; i < data.length; i++) {
      this._flattenDropdownOptions.push(<DropDownDataOption>data[i]);
      if (data[i].children) {
        this._setFlattenOptionsForQuery(data[i].children!);
      }
    }
  }
}
