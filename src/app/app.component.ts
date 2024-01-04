import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './services/http/http.service';
import { DataRequester, SelectionChip } from './multi-object-select/interfaces/multi-object-selection.interface';
import { MultiObjectSelectionComponent } from './multi-object-select/multi-object-select.component';
import { DataTooltipSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, DataExpandableSrcFields, DataChildrenSrcFields, DataFavouriteSrcFields, DataTotalDocsSrcFields, DataPathIdsSrcFields, MultiObjectSelectionTypeId, DataDisabledSrcFields } from './multi-object-select/enums/multi-object-selection.enum';
import { Subscription } from 'rxjs';
import { IExternalDataRequest, IDropDownTreeConfig, IDropdownTree } from './shared/interfaces/custom-select.inteface';
import { TreeUtility } from './shared/utility/tree/TreeUtility';
import { TreeNode } from './shared/utility/tree/TreeNode';
import { ITreeNode } from './shared/interfaces/tree.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('myDropdown', { static: true }) myDropdown!: MultiObjectSelectionComponent;

  title = 'custom-dropdown';

  public invalidMessage = '';

  public loading: boolean = false;

  public dataToPass!: IDropdownTree[];

  public preSelectedChips: any[] = [];

  public isVisible: boolean = true;

  public isSelectionValid: boolean = true;

  projectValidationXHR: boolean = false;
  customInvalidMessageKey: string = '';


  public sectionDataToPass: IDropDownTreeConfig = {
    dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION,
    dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION,
    dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION,
    dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION,
    dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION,
    dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION,
    dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION,
    dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION,
    dataDisabledSrc: DataDisabledSrcFields.FOLDER_SELECTION,
    isSectionSelectionAllowed: true,
    isRequired: true,
    isDisabled: this.projectValidationXHR,
    minSelectCount: 1,
    maxSelectCount: -3,
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
    isHierarchySelectionModificationAllowed: true,
    invalidMessageKey: "customInvalidMessageKey",
  };

  public receivedData: TreeNode[] = [];

  constructor(
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    // this.makeAPICall();
    !!this.preSelectedChips && this.getPreselectedValues();
  }

  public getPreselectedValues() {
    this.loading = true;
    this._httpService.getPreselected().subscribe({
      next: (data: any) => {
        switch (1) {
          case MultiObjectSelectionTypeId.FOLDER_SELECTION:
            console.log(data);
            this.preSelectedChips = data.map((val: any) => TreeUtility.createExpliciteDropdownTreeNode(val, {
              dataUniqueFieldSrc: "resourceId",
              dataVisibleNameSrc: "resourceName",
            }, true));
            break;

          default:
            this.preSelectedChips = [];
            break;

        };
      },
      error: (err) => { console.log(err); },
      complete: () => {
        this.loading = false;
      }
    });
  }

  public makeAPICall() {
    if (this.dataToPass && this.dataToPass.length > 0) {
      return;
    }
    this.loading = true;

    this._httpService.getData().subscribe({
      next: (value: any) => {
        if (!value || !value.length || value.length === 0) {
          value = [];
        }

        // prepare folder sections
        let sectionHeader = {};
        TreeUtility.propertyAdd(sectionHeader, this.sectionDataToPass.dataUniqueFieldSrc, "1");
        TreeUtility.propertyAdd(sectionHeader, this.sectionDataToPass.dataVisibleNameSrc, "Folders");
        this.sectionDataToPass.dataTooltipSrc && TreeUtility.propertyAdd(sectionHeader, this.sectionDataToPass.dataTooltipSrc, "Select Folders");
        let treeSection1: IDropdownTree = TreeUtility.createExpliciteDropdownTree(sectionHeader, this.sectionDataToPass, this.preSelectedChips);
        value.forEach((element: any) => {
          treeSection1.insert("1", element);
        });

        // prepare custom options
        let customFolderOptions: any[] = [
          {

            "folder_title": "All Folders",
            "folderId": "-1"
          },
          {
            "folder_title": "Favourite Folders",
            "folderId": "-2",
          },
        ];
        let customOptionsSectionHeader = {};
        TreeUtility.propertyAdd(customOptionsSectionHeader, this.sectionDataToPass.dataUniqueFieldSrc, "0");
        this.sectionDataToPass.dataTooltipSrc && TreeUtility.propertyAdd(customOptionsSectionHeader, this.sectionDataToPass.dataVisibleNameSrc, "Custom");
        this.sectionDataToPass.dataTooltipSrc && TreeUtility.propertyAdd(customOptionsSectionHeader, this.sectionDataToPass.dataTooltipSrc, "Custom");
        let treeSection2: IDropdownTree = TreeUtility.createExpliciteDropdownTree(customOptionsSectionHeader, this.sectionDataToPass);
        customFolderOptions.forEach((element: any) => {
          treeSection2.insert("0", element);
        });

        // this.dataToPass = [treeSection2, treeSection1];
        this.dataToPass = [treeSection2, treeSection1];

      },
      error: (err) => { console.log(err); },
      complete: () => {
        this.loading = false;
      }
    });
  }

  public errorOccured(message: string) {
    console.log(message);
  }

  public async finalDataReceived(data: any[]) {
    console.log(data);
    this.receivedData = data;
    // if(data.length > 0) {
    //   this.projectValidationXHR = true;
    //   await this.validateProject();
    //   this.projectValidationXHR = false;
    //   data[0].isInvalid = true;
    //   this.customInvalidMessageKey = 'policy-already-applied'
    //   this.isSelectionValid = false;  
    // }
    // else {
    //   this.projectValidationXHR = false;
    //   this.isSelectionValid = true;
    // }
    // // for(let d in data) {
    // //   if(data[d].dataUniqueFieldValue === "112278799$$QcxN3S")
    // //     data[d].isInvalid = true;
    // //     this.invalidMessage = "should not be herer"
    // // }
    // console.log('bbb');
  }

  public async validateProject(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    })
  }

  public onChipAdd(e: ITreeNode) {
    console.log('received event for onChipAdd:', e);
  }
  public onChipRemove(e: ITreeNode) {
    // manually remove pre-selected chip
    console.log('received event for onChipRemove:', e);
  }
  public onChipClick(e: any) {
    console.log('received event for onChipClick:', e);
  }
  public onQuerySeach(e: any) {
    console.log('received event for onQuerySeach:', e);
  }
  public onReset(e: any) {
    console.log('received event for onReset:', e);
  }
  public onSelectAll(e: any) {
    console.log('received event for onSelectAll:', e);
  }

  public onChipContextMenu(e: any) {
    console.log(e);
  }

  loadChildren(requestData: IExternalDataRequest): void {

    let endPoint = `data${requestData.originalNode!.levelIndex! + 1}`
    console.log(endPoint);

    this._httpService.getData2(endPoint).subscribe({
      next: (data: any) => { requestData.onResult(data) },
      error: (err: any) => { requestData.onError && requestData.onError(err) },

    })

  }

  searchQuerySubscription!: Subscription;
  searchValue(requestData: IExternalDataRequest) {
    this.searchQuerySubscription && this.searchQuerySubscription.unsubscribe && this.searchQuerySubscription.unsubscribe();
    //cancel any ongonig search call
    this.searchQuerySubscription = this._httpService.getSearchResults().subscribe({
      next: (data) => { requestData.onResult(data) },
      error: () => { requestData.onError!() }
    });
  }

}
