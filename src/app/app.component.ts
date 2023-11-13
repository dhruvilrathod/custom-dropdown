import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpService } from './services/http/http.service';
import { DataRequester, SelectionChip } from './multi-object-select/interfaces/multi-object-selection.interface';
import { MultiObjectSelectionComponent } from './multi-object-select/multi-object-select.component';
import { DataTooltipSrcFields, DataUniqueSrcFields, DataVisibleNameSrcFields, DataExpandableSrcFields, DataChildrenSrcFields, DataFavouriteSrcFields, DataTotalDocsSrcFields, DataPathIdsSrcFields, MultiObjectSelectionTypeId } from './multi-object-select/enums/multi-object-selection.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('myDropdown', { static: true }) myDropdown!: MultiObjectSelectionComponent;

  title = 'custom-dropdown';

  public loading: boolean = false;

  public dataToPass!: any;

  public preSelectedChips: any[] = [];

  public sectionDataToPass: any;

  constructor(
    private _httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.makeAPICall();
  }

  public makeAPICall() {
    this.loading = true;

    this._httpService.getData().subscribe({
      next: (value) => {
        // this.sectionDataToPass = {
        //   allowSectionSelection: true,
        //   sectionId: 11,
        //   sectionTooltipKey: 'tooool',
        //   sectionNameKey: 'section 1211',
        // }

        let section1 = MultiObjectSelectionComponent.createSection({
          dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION.split("/"),
          dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION.split("/"),
          dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION.split("/"),
          dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION.split("/"),
          dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION.split("/"),
          dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION.split("/"),
          dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION.split("/"),
          dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION.split("/"),
          allowSectionSelection: false,
          sectionTooltipKey: "my section eeee",
          sectionNameKey: "sectionnn name"
        }, value as any[]);
        
        let section2 = MultiObjectSelectionComponent.createSection({
          dataUniqueFieldSrc: ["id"],
          dataVisibleNameSrc: ["name"],
          allowSectionSelection: false,
          sectionTooltipKey: "my section 333",
          sectionNameKey: ""
        }, [
          {
            id: "-2",
            name: "template folders"
          },
          {
            id: "-3",
            name: "favorite folders"
          },
          {
            id: "-4",
            name: "favorite folders"
          }
        ]);
        console.log(section1);
        this.dataToPass = [section2, section1];
      },
      error: (err) => { console.log(err); },
      complete: () => {
        this.loading = false;

        // this._httpService.getPreselected().subscribe({
        //   next: (data: any) => {
        //     switch (1) {
        //       case MultiObjectSelectionTypeId.FOLDER_SELECTION:
        //         this.preSelectedChips = MultiObjectSelectionComponent.preparePrefilledChipsData({
        //           dataTooltipSrc: DataTooltipSrcFields.FOLDER_SELECTION.split("/"),
        //           dataUniqueFieldSrc: DataUniqueSrcFields.FOLDER_SELECTION.split("/"),
        //           dataVisibleNameSrc: DataVisibleNameSrcFields.FOLDER_SELECTION.split("/"),
        //           dataExpandableSrc: DataExpandableSrcFields.FOLDER_SELECTION.split("/"),
        //           dataChildrenSrc: DataChildrenSrcFields.FOLDER_SELECTION.split("/"),
        //           dataFavouriteSrc: DataFavouriteSrcFields.FOLDER_SELECTION.split("/"),
        //           dataTotalDocsSrc: DataTotalDocsSrcFields.FOLDER_SELECTION.split("/"),
        //           dataParentUniqueIdsSrc: DataPathIdsSrcFields.FOLDER_SELECTION.split("/"),
        //         }, data);
        //         console.log(this.preSelectedChips);
                
        //         break;
        
        //       default:
        //         this.preSelectedChips = [];
        //         break;
        
        //     };
        //   },
        //   error: (err) => { console.log(err); },
        //   complete: () => {
        //     this.loading = false;
        //   }
        // });

      }
    });
  }

  public errorOccured(message: string) {
    console.log(message);
  }

  public finalDataReceived(data: any[]) {
    console.log(data);
  }

  public onChipAdd(e: any) {
    console.log('received event for onChipAdd:', e);
  }
  public onChipRemove(e: any) {
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

  loadChildren(requestData: DataRequester): void {

    let endPoint = `data${requestData.preparedData.optionData!.levelIndex! + 1}`

    this._httpService.getData2(endPoint).subscribe({
      next: (data: any) => { requestData.onResult(data) },
      error: (err: any) => { requestData.onError && requestData.onError(err) },

    })

  }

  searchQuerySubscription!: Subscription;
  searchValue(requestData: DataRequester) {
    this.searchQuerySubscription && this.searchQuerySubscription.unsubscribe && this.searchQuerySubscription.unsubscribe();
    //cancel any ongonig search call
    this.searchQuerySubscription = this._httpService.getSearchResults().subscribe({
      next: (data) => { requestData.onResult(data) },
      error: () => { requestData.onError!() }
    });
  }

}
